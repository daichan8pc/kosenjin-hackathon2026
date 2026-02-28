"use client";
import { useState, useEffect } from "react";
import { mockQuestions } from "./data/mockQuestions";
import { Question, GameState } from "./types/quiz";

export default function Home() {
    const [gameState, setGameState] = useState<GameState>("start");
    const [currentQIndex, setCurrentQIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [shuffledOptions, setShuffledOptions] = useState<string[]>([]);
    const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(null);

    // 問題が変わるたびに選択肢をシャッフルする
    useEffect(() => {
        if (gameState === "playing") {
            const q = mockQuestions[currentQIndex];
            const opts = [...q.options].sort(() => Math.random() - 0.5);
            setShuffledOptions(opts);
            setFeedback(null);
        }
    }, [currentQIndex, gameState]);

    // 回答ボタンを押した時の処理
    const handleAnswer = (selectedOption: string) => {
        const q = mockQuestions[currentQIndex];
        const isCorrect = selectedOption === q.answer;

        if (isCorrect) {
            setScore(score + 1);
            setFeedback("correct");
        } else {
            setFeedback("incorrect");
        }
        // ここにあった自動遷移(setTimeout)を削除
    };

    // 「次へ」ボタンを押した時の処理
    const handleNext = () => {
        if (currentQIndex < mockQuestions.length - 1) {
            setCurrentQIndex(currentQIndex + 1);
            setFeedback(null); // フィードバックを閉じる
        } else {
            setGameState("result");
        }
    };

    // --- 画面レンダリング ---

    // 1. スタート画面
    if (gameState === "start") {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-4 font-mono">
                <h1 className="text-4xl md:text-6xl font-bold mb-8 text-green-400 tracking-tighter">
                    Team 404 (Love Not Found)
                </h1>
                <p className="mb-12 text-gray-400">高専恋愛技術者試験</p>
                <button
                    onClick={() => setGameState("playing")}
                    className="bg-green-600 hover:bg-green-500 text-white px-10 py-4 rounded-sm text-xl font-bold transition-all border-b-4 border-green-800 active:border-b-0 active:translate-y-1"
                >
                    試験開始
                </button>
            </div>
        );
    }

    // 2. 結果画面
    if (gameState === "result") {
        const pass = score === mockQuestions.length; // 全問正解で合格
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-4 font-mono">
                <h2 className="text-4xl font-bold mb-6">{pass ? "🌸合格🌸" : "☠️不合格☠️"}</h2>
                <p className="text-2xl mb-8">スコア: {score} / {mockQuestions.length}</p>

                {pass ? (
                    <div className="bg-yellow-100 text-black p-8 rounded border-4 border-yellow-500 mb-8 max-w-md w-full shadow-[0_0_20px_rgba(234,179,8,0.5)]">
                        <div className="border-b-2 border-black pb-2 mb-4 flex justify-between items-end">
                            <h3 className="font-serif text-2xl font-bold">恋愛技術者 免許証</h3>
                        </div>
                        <div className="flex gap-4">
                            <div className="w-24 h-24 bg-gray-300 border border-black flex items-center justify-center text-xs text-center">
                                NO IMAGE
                            </div>
                            <div className="text-sm space-y-1 flex-1">
                                <p>氏名：高専 太郎</p>
                                <p>交付：令和8年2月28日</p>
                                <p>番号：第111111号</p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="bg-red-900/30 border border-red-500 p-8 rounded mb-8 text-center max-w-md w-full">
                        <p className="text-red-400 text-xl font-bold mb-2">CRITICAL ERROR</p>
                        <p className="text-gray-300">補習が必要です。デバッグを行ってください。</p>
                    </div>
                )}

                <button
                    onClick={() => window.location.reload()}
                    className="text-green-400 underline hover:text-green-300"
                >
                    再受験する
                </button>
            </div>
        );
    }

    // 3. クイズプレイ画面
    const q = mockQuestions[currentQIndex];
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-800 text-white p-4">
            <div className="w-full max-w-2xl">
                <div className="flex justify-between text-gray-400 mb-4">
                    <span>第 {currentQIndex + 1} 問</span>
                    <span>あと {mockQuestions.length - currentQIndex} 問</span>
                </div>

                {/* 問題文 */}
                <div className="bg-slate-700 p-8 rounded-xl border border-slate-600 mb-8 min-h-[160px] flex items-center justify-center shadow-lg relative overflow-hidden">
                    <div className="absolute top-0 left-0 bg-slate-600 px-3 py-1 text-xs text-slate-300 rounded-br">QUESTION</div>
                    <h2 className="text-xl md:text-2xl font-bold text-center leading-relaxed">{q.question}</h2>
                </div>

                {/* 選択肢 */}
                <div className="grid gap-4">
                    {shuffledOptions.map((opt, i) => (
                        <button
                            key={i}
                            onClick={() => !feedback && handleAnswer(opt)}
                            disabled={!!feedback}
                            className="bg-slate-600 hover:bg-blue-600 p-5 rounded-lg text-left transition-all border border-slate-500 hover:border-blue-400 hover:translate-x-1 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <span className="inline-block w-6 h-6 bg-slate-800 rounded-full text-center text-sm mr-3 leading-6 text-slate-400">{i + 1}</span>
                            {opt}
                        </button>
                    ))}
                </div>

                {/* フィードバック＆次へボタン（モーダル） */}
                {feedback && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black/80 z-50 animate-in fade-in duration-200 p-4">
                        <div className={`bg-white text-black p-8 rounded-xl max-w-lg w-full shadow-2xl relative ${feedback === "correct" ? "border-t-8 border-green-500" : "border-t-8 border-red-500"}`}>

                            {/* 判定 */}
                            <h2 className={`text-4xl font-black mb-4 flex items-center gap-2 ${feedback === "correct" ? "text-green-600" : "text-red-600"}`}>
                                {feedback === "correct" ? "✅ 正解" : "❌ 不正解"}
                            </h2>

                            {/* 解説文 */}
                            <div className="bg-gray-100 p-4 rounded-lg mb-8 text-left">
                                <p className="text-lg font-medium text-gray-800 leading-relaxed">
                                    {q.explanation}
                                </p>
                            </div>

                            {/* 次へボタン */}
                            <button
                                onClick={handleNext}
                                className="w-full bg-blue-600 hover:bg-blue-500 text-white py-4 rounded-lg font-bold text-xl shadow-lg transition-transform active:scale-95"
                            >
                                {currentQIndex < mockQuestions.length - 1 ? "次の問題へ ▶" : "結果を見る ▶"}
                            </button>

                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}