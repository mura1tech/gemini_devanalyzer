"use client"; // ブラウザ側で動作させるための宣言

import { useState } from "react";
import { Loader2, Send, CheckCircle2, AlertCircle } from "lucide-react";

// 型定義：バックエンドのAnalysisResultと一致させる
interface AnalysisResult {
  summary: string;
  key_points: string[];
  confidence_score: number;
}

export default function Home() {
  const SAMPLE_PROMPTS = [
    { label: "コードレビュー", text: "以下のコードの潜在的なバグと改善点をエンジニア視点で分析して：\n" },
    { label: "技術比較", text: "Next.jsとRemixの主な違いを3つのポイントで要約して。" },
    { label: "アーキテクチャ設計", text: "AWS Lambdaを使ったイベント駆動設計のメリット・デメリットを分析して。" },
  ];

  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      // バックエンドのFastAPIサーバーにリクエスト
      const response = await fetch(
        `http://127.0.0.1:8000/analyze?prompt=${encodeURIComponent(prompt)}`
      );

      if (!response.ok) {
        throw new Error(`エラーが発生しました: ${response.status}`);
      }

      const data: AnalysisResult = await response.json();
      setResult(data);
    } catch (err) {
      setError("サーバーとの通信に失敗しました。バックエンドが起動しているか確認してください。");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
  <main className="min-h-screen bg-slate-50 py-12 px-4 font-sans">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* ヘッダー */}
        <div className="text-center">
          <div className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full mb-4">
            ENGINEER AI ASSISTANT
          </div>
          <h1 className="text-4xl font-extrabold text-slate-900">
            Gemini <span className="text-blue-600">DevAnalyzer</span>
          </h1>
          <p className="mt-2 text-slate-600">技術文書の構造化分析とエンジニアリング・リサーチ</p>
        </div>

        {/* サンプルチップ */}
        <div className="flex flex-wrap gap-2 justify-center">
          {SAMPLE_PROMPTS.map((sample) => (
            <button
              key={sample.label}
              onClick={() => setPrompt(sample.text)}
              className="text-xs bg-white border border-slate-200 hover:border-blue-400 px-3 py-1.5 rounded-full text-slate-600 transition shadow-sm"
            >
              + {sample.label}
            </button>
          ))}
        </div>

        {/* 入力セクション */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <textarea
            className="w-full p-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition text-slate-800 font-mono text-sm"
            rows={6}
            placeholder="コード、技術ドキュメント、または設計に関する質問を入力..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
          <button
            onClick={handleAnalyze}
            disabled={loading || !prompt}
            className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" /> : <Send size={20} />}
            {loading ? "分析中..." : "分析を実行する"}
          </button>
        </div>

        {/* エラー表示 */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center gap-2">
            <AlertCircle size={20} />
            <p>{error}</p>
          </div>
        )}

        {/* 分析結果セクション */}
        {result && (
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-blue-100 animate-in fade-in slide-in-from-bottom-4 duration-500 text-slate-800">
            <div className="flex items-center gap-2 mb-6">
              <CheckCircle2 className="text-green-500" />
              <h2 className="text-2xl font-bold">分析完了</h2>
            </div>

            <div className="space-y-6">
              <section>
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-2">要約</h3>
                <p className="text-lg leading-relaxed">{result.summary}</p>
              </section>

              <section>
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-2">重要ポイント</h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {result.key_points.map((point, index) => (
                    <li key={index} className="bg-slate-50 p-3 rounded-lg border border-slate-100 italic">
                      ・ {point}
                    </li>
                  ))}
                </ul>
              </section>

              <section className="pt-4 border-t border-slate-100">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-bold text-slate-500">確信度スコア</span>
                  <span className="text-sm font-mono font-bold text-blue-600">{result.confidence_score}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-3">
                  <div 
                    className="bg-blue-600 h-3 rounded-full transition-all duration-1000"
                    style={{ width: `${result.confidence_score}%` }}
                  />
                </div>
              </section>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}