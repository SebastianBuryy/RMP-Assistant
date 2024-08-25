import { NextResponse } from "next/server";
import { Pinecone } from "@pinecone-database/pinecone";
import axios from "axios";
import * as cheerio from 'cheerio';
import OpenAI from "openai";

export async function POST(request) {
    const { url } = await request.json();
    try {
        const response = await axios.get(url);
        const html = response.data;
        console.log("Fetched HTML: ", html);
        const $ = cheerio.load(html);

        const professorName = $(".NameTitle__Name-dowf0z-0").text().trim();
        const ratingValue = $(".RatingValue__Numerator-qw8sqy-2").text().trim();
        const subject = $(".TeacherDepartment__StyledDepartmentLink-fl79e8-0").text().trim();
        const reviewSummary = $(".Comments__StyledComments-dzzyvm-0").text().trim();
        const topTags = $(".TeacherTags__TagsContainer-sc-16vmh1y-0").map((i, el) => $(el).text().trim()).get().join(", ");

        const review = `${reviewSummary} Top tags: ${topTags}`;

        // Map to your existing structure
        const data = {
            professor: professorName,
            subject: subject,
            stars: ratingValue,
            review: review,
        };

        console.log("Scraped data: ", data);

        // const pc = new Pinecone({
        //     apiKey: process.env.PINECONE_API_KEY,
        // });
        // const index = pc.index("rag").namespace("ns1");

        // const openai = new OpenAI(process.env.OPENAI_API_KEY);
        // const embedding = await openai.embeddings.create({
        //     model: "text-embedding-3-small",
        //     input: `${professorName} ${subject} ${review}`,
        //     encoding_format: "float",
        // });

        // await index.upsert([
        //     {
        //         id: professorName,
        //         values: embedding.data[0].embedding,
        //         metadata: data,
        //     }
        // ]);

        return NextResponse.json({ success: true, data });
    } catch (error) {
        console.error("Error fetching professor info: ", error);
        return NextResponse.json({ success: false, error: error.message });
    }
}
