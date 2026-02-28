"use client";
import { useState } from "react";

export default function Home() {
    const [input, setInput] = useState("");
    const [result, setResult] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (!input) return;
        setLoading(true);
        setResult("");

        try {
            const res = await fetch("/api/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt: input }),
            });
            const data = await res.json();
            setResult(data.result || "エラーが発生しました");
        } catch (e) {
            console.error(e);
            setResult("通信エラー");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gray-100">
            <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex-col">
                <h1 className="text-4xl font-bold mb-8 text-center text-blue-600">
                    KOSENJIN AI Test
                </h1>

                <div className="flex flex-col gap-4 w-full max-w-md mx-auto">
                    <textarea
                        className="p-4 rounded-lg border border-gray-300 text-black"
                        rows={4}
                        placeholder="ここにAIへの指令を入力（例：高専生あるあるを1つ教えて）"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                    />

                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
                    >
                        {loading ? "AIが思考中..." : "送信する"}
                    </button>

                    {result && (
                        <div className="mt-8 p-6 bg-white rounded-xl shadow-lg border-l-4 border-blue-500">
                            <h2 className="font-bold text-lg mb-2 text-gray-700">AIの回答:</h2>
                            <p className="whitespace-pre-wrap text-gray-800">{result}</p>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}