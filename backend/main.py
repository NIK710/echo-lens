from fastapi import FastAPI, Query
from reddit_utils import fetch_reddit_thread
from gemini_utils import analyze_comments_with_gemini


app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "Echo Lens backend is live!"}

@app.get("/analyze")
def analyze(url: str = Query(..., description="Reddit thread URL")):
    try:
        comments = fetch_reddit_thread(url)
        analysis = analyze_comments_with_gemini(comments)
        return {
            "comment_count": len(comments),
            "sample": comments[:5],
            "gemini_analysis": analysis
        }
    except Exception as e:
        return {"error": str(e)}
