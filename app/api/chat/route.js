import { NextResponse } from "next/server";
import { Pinecone } from "@pinecone-database/pinecone";
import OpenAI from "openai";

const systemPrompt = `
You are a highly knowledgeable and efficient virtual assistant designed to help students navigate the "Rate My Professor" platform. Your primary role is to assist students in finding the most suitable professors based on their specific queries, which may involve course subjects, departments, professor ratings, teaching styles, and other relevant criteria. Your responses should always aim to provide the most relevant and useful information to help students make informed decisions about their course selections and professors.

Core Functionality:
Query Interpretation: Accurately interpret and understand the student's query, identifying the key elements such as the subject, department, rating preferences, teaching style, or other specific attributes the student is seeking in a professor.
Information Retrieval: Utilize a Retrieval-Augmented Generation (RAG) approach to gather up-to-date and relevant information about professors from a comprehensive database. Ensure the information retrieved is highly relevant to the student's query.
Rank and Present: Analyze and rank the results based on their relevance to the student's needs. Present the top 3 professors who best match the student's query, providing detailed information for each.

When providing responses, please use Markdown to format your output.

Use the layout below to exactly format each response with data from JSON:

   **{nameOfProfessor}** is a {description}.
    

    His students label his top qualities as *{tags.topTags}*.
    

    Over the course of his career, Professor {nameOfProfessor} has received an average rating of **{ratingValue}** out of **5**, based on **{numOfRatings}** reviews.
    Students have described his level of difficulty as **{difficultyValue}** out of **5** and **{wouldTakeAgain}%** would take his class again.
   
    
    # **Courses taught by Professor {nameOfProfessor}:**
    // Insert here the different courses that are within each student review and give a little description of each course, formatted like a list with list items:
    
    - CourseName: {courseDescription}
    - CourseName: {courseDescription}
    - CourseName: {courseDescription}
    
    # **Student Reviews:**

    // Input 5 of their student reviews here, each starting with a bullet point and add more if the user requests so.
    - **{reviews.date}**, **{reviews.course}**: "{reviews.review}" *(Rating: {reviews.rating}, Difficulty: {reviews.difficulty})*
    

Use your capabilities to adjust each response, based on the professor's ratings and data, For example, if a professor has a high rating, you can mention that they are highly regarded and respected etc. However, If a professor has a low rating, you can mention that in a subtle way aswell.
`
export async function POST(request) {
    const data = await request.json();
    const pc = new Pinecone({
        apiKey: process.env.PINECONE_API_KEY,
    });
    const index = pc.index("rag").namespace("ns1");
    const openai = new OpenAI(process.env.OPENAI_API_KEY);

    const text = data[data.length - 1].content;
    const embedding = await openai.embeddings.create({
        model: "text-embedding-3-small",
        input: text,
        encoding_format: "float",
    });

    const results = await index.query({
        topK: 3,
        includeMetadata: true,
        vector: embedding.data[0].embedding,
    });

    let resultString = ''
    results.matches.forEach((match) => {
        const metadata = match.metadata;
        resultString += `
        ${metadata.professorName},
        ${metadata.description},
        ${metadata.professorName}, 
        ${metadata.subject},
        ${metadata.tags},
        ${metadata.professorName},
        ${metadata.ratingValue},
        ${metadata.numOfRatings},
        ${metadata.difficultyValue},
        ${metadata.wouldTakeAgain},
        ${metadata.reviews}
        `;
    });

    const lastMessage = data[data.length - 1];
    const lastMessageContent = lastMessage.content + resultString;
    const lastDataWithoutLastMessage = data.slice(0, data.length - 1);
    const completion = await openai.chat.completions.create({
        messages: [
            {
                role: "system",
                content: systemPrompt,
            }, ...lastDataWithoutLastMessage,
            {
                role: "user",
                content: lastMessageContent,
            },
        ],
        model: "gpt-4o-mini",
        stream: true,
    });

    const stream = new ReadableStream({
        async start(controller) {
            const encoder = new TextEncoder();
            try {
                for await (const chunk of completion) {
                    const content = chunk.choices[0]?.delta?.content;
                    if (content) {
                        const text = encoder.encode(content);
                        controller.enqueue(text);
                    }
                }
            } catch (error) {
                controller.error(error);
            } finally {
                controller.close();
            }
        }
    })

    return new NextResponse(stream);
}