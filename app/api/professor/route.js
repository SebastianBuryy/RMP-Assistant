import { NextResponse } from "next/server";
import { Pinecone } from "@pinecone-database/pinecone";
import axios from "axios";
import * as cheerio from 'cheerio';
import OpenAI from "openai";

export async function POST(request) {
    const { url } = await request.json();

    if (!url || !url.startsWith("https://www.ratemyprofessors.com/")) {
        return NextResponse.json({ success: false, error: "Invalid URL" });
    }

    try {
        const response = await axios.get(url);
        const html = response.data;
        const $ = cheerio.load(html);

        // Scraping professor's name, rating, subject/department, and top tags
        const professorName = $(".NameTitle__Name-dowf0z-0").text().trim();
        const ratingValue = $(".RatingValue__Numerator-qw8sqy-2").text().trim();
        const difficultyValues = $(".FeedbackItem__FeedbackNumber-uof32n-1").text().trim();
        const numRatings = $(".TeacherRatingTabs__StyledTab-pnmswv-2").text().trim();
        let subject = $(".TeacherDepartment__StyledDepartmentLink-fl79e8-0").text().trim();
        subject = subject.replace("department", "").trim();
        const description = $(".NameTitle__Title-dowf0z-1").text().trim();

        // Scraping student reviews
        const reviews = [];
        $(".Rating__RatingBody-sc-1rhvpxz-0").each((i, el) => {
            const reviewDate = $(el).children(".Rating__RatingInfo-sc-1rhvpxz-3").find(".RatingHeader__RatingTimeStamp-sc-1dlkqw1-4").text().trim();
            const courseName = $(el).children(".Rating__RatingInfo-sc-1rhvpxz-3").find(".RatingHeader__StyledClass-sc-1dlkqw1-3").text().trim();
            const reviewText = $(el).children(".Rating__RatingInfo-sc-1rhvpxz-3").find(".Comments__StyledComments-dzzyvm-0").text().trim();
            const reviewStats = $(el).find(".RatingValues__StyledRatingValues-sc-6dc747-0").text().trim();
            const individualDifficulty = reviewStats.match(/Difficulty(\d+\.\d+)/)?.[1];
            const individualRating = reviewStats.match(/Quality(\d+\.\d+)/)?.[1];
            reviews.push({
                date: reviewDate,
                course: courseName,
                review: reviewText,
                rating: individualRating,
                difficulty: individualDifficulty
            });
        });

        // Scraping teaching style tags
        let topTags = $(".TeacherTags__TagsContainer-sc-16vmh1y-0").text().trim();
        topTags = topTags.split(/(?=[A-Z])/).join(", ");
        console.log("Top tags: ", topTags);

        // Formatting difficulty and would take again values
        const difficultyValue = difficultyValues.split("%")[1];
        const wouldTakeAgain = difficultyValues.split("%")[0];

        // Formatting the number of ratings
        const numOfRatings = numRatings.split(" ")[0];

        // Flatten the reviews for Pinecone compatbiility
        const flattenedReviews = reviews.map(r => `${r.date} - ${r.course}: ${r.review} (Rating: ${r.rating}, Difficulty: ${r.difficulty})`);

        // Formatting the scraped data
        const data = {
            professorName,
            description,
            ratingValue,
            numOfRatings,
            difficultyValue,
            wouldTakeAgain,
            tags: topTags,
            subject,
            reviews: flattenedReviews,
        };

        console.log("Scraped data: ", data);

        // Initializing Pinecone and OpenAI
        const pc = new Pinecone({
            apiKey: process.env.PINECONE_API_KEY,
        });
        const index = pc.index("rag").namespace("ns1");

        const openai = new OpenAI(process.env.OPENAI_API_KEY);

        const textToEmbed = `${professorName} teaches ${subject}. Reviews: ${reviews.map(r => `${r.course}: ${r.review}`).join(" ")}`;

        const embedding = await openai.embeddings.create({
            model: "text-embedding-3-small",
            input: textToEmbed,
            encoding_format: "float",
        });

        await index.upsert([
            {
                id: professorName,
                values: embedding.data[0].embedding,
                metadata: data,
            }
        ]);

        return NextResponse.json({ success: true, data });
    } catch (error) {
        console.error("Error fetching professor info: ", error);
        return NextResponse.json({ success: false, error: error.message });
    }
}