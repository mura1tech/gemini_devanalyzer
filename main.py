import os
from typing import List
from typing_extensions import TypedDict
from fastapi import FastAPI, HTTPException
import google.generativeai as genai
from dotenv import load_dotenv
import time
from google.api_core import exceptions
from starlette.middleware.cors import CORSMiddleware

# 環境変数の読み込み
load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    raise ValueError("GEMINI_API_KEY が設定されていません。.envファイルを確認してください。")

genai.configure(api_key=api_key)

# 応答の型定義
class AnalysisResult(TypedDict):
    summary: str
    key_points: List[str]
    confidence_score: int

app = FastAPI(title="Gemini 2.5 Flash Starter Kit")

# CORS設定を追加
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"], # Next.jsのデフォルト
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

#　モデルの設定 
MODEL_NAME = "gemini-2.5-flash"

model = genai.GenerativeModel(
    model_name=MODEL_NAME,
    system_instruction="""
    あなたは極めて優秀なソフトウェアエンジニア兼システムアーキテクトです。
    提供されたテキストを、技術的な視点から「要約」「重要な技術スタック/ポイント」「確信度」に構造化して分析してください。
    回答は必ず指定されたJSONフォーマットに従ってください。
    """
)

@app.get("/")
async def root():
    return {"message": "Gemini API Server is running"}

@app.get("/generate")
async def generate_text(prompt: str):
    """シンプルなテキスト生成エンドポイント"""
    try:
        response = model.generate_content(prompt)
        return {"response": response.text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/analyze")
async def analyze_text(prompt: str):
    try:
        response = model.generate_content(
            f"以下の内容を分析してJSONで返してください: {prompt}",
            generation_config={
                "response_mime_type": "application/json",
                "response_schema": AnalysisResult
            }
        )
        import json
        return json.loads(response.text)
        
    except exceptions.ResourceExhausted as e:
        # 429エラー（レート制限）を具体的にキャッチ
        raise HTTPException(
            status_code=429, 
            detail="Gemini APIの無料枠制限に達しました。1分ほど待ってから再試行してください。"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"予期せぬエラー: {str(e)}")