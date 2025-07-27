from google import genai
import os
from dotenv import load_dotenv


load_dotenv()

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

def analyze_comments_with_gemini(comments: list[str]) -> str:
    if not comments:
        return "No comments to analyze."

    prompt = (
        "Give me a brief summary of the following Reddit comments:\n\n"
        + "\n\n".join(comments[:20])  # Limit to 20 comments
    )

    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt,
        )
        return response.text
    except Exception as e:
        return f"Gemini error: {str(e)}"
