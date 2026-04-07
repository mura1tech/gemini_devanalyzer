# Gemini 2.5 Flash Analyzer

Gemini 2.5 Flash APIを活用し、入力されたテキストを構造化データ（JSON）として分析・可視化するフルスタックWebアプリケーションです。

## 🚀 システム概要

本プロジェクトは、最新のAIモデルを用いたバックエンド（FastAPI）とフロントエンド（Next.js）の連携を学習・実践することを目的としています。AIの回答を型定義されたJSON形式で取得し、モダンなUIで表示します。

### 技術スタック
- **Language:** Python 3.12+, TypeScript
- **Backend:** [FastAPI](https://fastapi.tiangolo.com/)
- **Frontend:** [Next.js](https://nextjs.org/) (App Router), [Tailwind CSS](https://tailwindcss.com/)
- **AI Model:** [Gemini 2.5 Flash](https://ai.google.dev/gemini-api/docs/models/gemini#gemini-2.5-flash)
- **Package Manager:** [uv](https://github.com/astral-sh/uv) (Python), [npm](https://www.npmjs.com/) (Node.js)

---

## 🛠️ 環境構築手順

### 1. 共通準備
[Google AI Studio](https://aistudio.google.com/) から API キーを取得してください。

### 2. バックエンド (FastAPI)
```bash
# ディレクトリ移動
cd gemini-app

# 依存関係のインストール
uv sync

# 環境変数ファイルの作成（YOUR_API_KEYを自分のキーに書き換えて実行）UTF-8 BOMなしの必要あり
[System.IO.File]::WriteAllLines("$(Get-Location)\.env", "GEMINI_API_KEY=YOUR_API_KEY")

# サーバー起動
uv run uvicorn main:app --reload
```

### 3. フロントエンド (Next.js)
```bash
# ディレクトリ移動
cd gemini-frontend

# 依存関係のインストール
npm install

# 開発サーバー起動
npm run dev
```

### 4. 実装ポイント

# 1. 構造化出力 (Structured Output)
Gemini 2.5 Flash の response_schema 機能を活用し、AIの出力を以下のJSON形式に固定しています。これにより、フロントエンドでの安定したデータ表示を可能にしています。

class AnalysisResult(TypedDict):
    summary: str
    key_points: List[str]
    confidence_score: int

# 2. 非同期通信とCORS設定
FastAPI側で CORSMiddleware を適切に設定し、Next.jsからのクロスドメインリクエストを許可しています。また、AIの推論待ち時間を考慮し、フロントエンド側でローディング状態の管理を実装しています。

### 動作確認
# 1.バックエンド（ポート8000）とフロントエンド（ポート3000）を共に起動します。
# 2.ブラウザで http://localhost:3000 にアクセスします。
# 3.テキストエリアに分析したい内容を入力し、「分析を実行する」をクリックします。
# 4.Gemini 2.5 Flash による「要約」「重要ポイント」「確信度（プログレスバー表示）」が出力されることを確認します。