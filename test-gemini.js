const { GoogleGenerativeAI } = require("@google/generative-ai");

// ここにAPIキーを直接入れてください
const genAI = new GoogleGenerativeAI("AIzaSyD-XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX");

async function run() {
    // モデル名を指定
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = "高専生あるあるを1つ教えてください。";

    try {
        console.log("Testing API connection...");
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        console.log("----------------------------------------");
        console.log("✅ Success! Response:");
        console.log(text);
        console.log("----------------------------------------");
    } catch (error) {
        console.error("❌ Error Details:");
        console.error(error);
    }
}

run();