import { NextResponse } from "next/server";
import { Pinecone } from "@pinecone-database/pinecone";
import axios from "axios";
import cheerio from "cheerio";
import OpenAI from "openai";

export async function POST(request) {
    const { url } = await request.json();
    try {
        const response = await axios.get(url);
        const html = response.data;
        const $ = cheerio.load(html);

        const professorName = $(".NameTitle__Name-dowf0z-0").text().trim();
        const professorRating = $(".RatingValue__Numerator-qw8sqy-2").text().trim();
        const professorSubject = $(".RatingValue__Subject-qw8sqy-3").text().trim();
        const professorSummary = $(".RatingValue__Summary-qw8sqy-4").text().trim();

        const data = {
            professorName,
            professorRating,
            professorSubject,
            professorSummary,
        };

        const pc = new Pinecone({
            apiKey: process.env.PINECONE_API_KEY,
        });
        const index = pc.index("rag").namespace("ns1");

        const openai = new OpenAI(process.env.OPENAI_API_KEY);
        const embedding = await openai.embeddings.create({
            model: "text-embedding-3-small",
            input: `${professorName} ${professorRating} ${professorSubject} ${professorSummary}`,
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