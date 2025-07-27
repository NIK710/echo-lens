from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from reddit_utils import fetch_reddit_thread

app = FastAPI()

# Allow requests from the extension
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # During dev, loosened CORS
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class AnalyzeRequest(BaseModel):
    url: str

@app.post("/analyze_reddit")
async def analyze_reddit(req: AnalyzeRequest):
    url = req.url
    content = fetch_reddit_thread(url)

    # Placeholder for Gemini call
    summary = f"Fetched {len(content)} comments from Reddit thread."

    return {"summary": summary}
