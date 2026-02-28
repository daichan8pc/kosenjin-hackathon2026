// app/types/quiz.ts
export type Question = {
    id: number;
    question: string;
    options: string[]; // 選択肢
    answer: string;    // 正解の文字列
    explanation: string; // 解説・煽り
};

export type GameState = "start" | "playing" | "result";