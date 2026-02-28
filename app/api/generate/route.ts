import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

// 環境変数からAPIキーを読み込み
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
    try {
        // フロントエンドから送られてくるデータを受け取る
        // prompt: AIへの命令文
        // image: 画像データ（Base64形式、オプション）
        const { prompt, image } = await req.json();

        // モデル選択（高速な Flash モデルを使用）
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        let result;
        if (image) {
            // 画像がある場合（Base64ヘッダーを除去して渡す）
            const cleanBase64 = image.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, "");
            const imagePart = {
                inlineData: {
                    data: cleanBase64,
                    mimeType: "image/png", // 送信元でpngとして処理推奨
                },
            };
            // テキスト + 画像 で生成
            result = await model.generateContent([prompt, imagePart]);
        } else {
            // テキストのみで生成
            result = await model.generateContent(prompt);
        }

        const response = await result.response;
        const text = response.text();

        return NextResponse.json({ result: text });

    } catch (error) {
        console.error("AI API Error:", error);
        return NextResponse.json({ error: "Failed to generate content" }, { status: 500 });
    }
}