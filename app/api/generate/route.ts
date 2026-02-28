import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        // 1. デバッグ：APIキーが読めているかサーバーのコンソールに出す
        const apiKey = process.env.GEMINI_API_KEY;
        console.log("---------------------------------------------------");
        console.log("🔑 API Key Check:", apiKey ? `Loaded (Starts with ${apiKey.substring(0, 4)}...)` : "❌ NOT FOUND");
        console.log("---------------------------------------------------");

        if (!apiKey) {
            return NextResponse.json({ error: "API Key is missing in server env" }, { status: 500 });
        }

        const genAI = new GoogleGenerativeAI(apiKey);

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const { prompt, image } = await req.json();

        let result;
        if (image) {
            const cleanBase64 = image.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, "");
            const imagePart = {
                inlineData: {
                    data: cleanBase64,
                    mimeType: "image/png",
                },
            };
            result = await model.generateContent([prompt, imagePart]);
        } else {
            result = await model.generateContent(prompt);
        }

        const response = await result.response;
        const text = response.text();

        return NextResponse.json({ result: text });

    } catch (error: any) {
        console.error("❌ AI Error Details:", error);
        return NextResponse.json({
            error: error.message || "AI processing failed",
            details: error.toString()
        }, { status: 500 });
    }
}