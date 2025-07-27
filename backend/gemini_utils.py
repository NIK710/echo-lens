from google import genai
import os
from dotenv import load_dotenv


load_dotenv()

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

def analyze_comments_with_gemini(comments: list[str]) -> str:
    if not comments:
        return "No comments to analyze."

    prompt = f"""
            You're an assistant trained to help people critically examine online discussions.

            Analyze the following Reddit thread comments. Structure your response under the following 4 sections. Be brief as possible.

            1. **Tone and Bias**: What is the overall tone of the discussion? Is it emotional, dismissive, sarcastic, respectful, etc.? Do you detect any particular bias?

            2. **Dominant Narrative**: Summarize the main narrative — what do most people in this thread seem to believe or say?

            3. **Thoughtful Counterpoints**: Are there any thoughtful, well-argued alternative perspectives? Briefly summarize them.

            4. **Framing and Language**: Describe any framing, loaded language, or rhetorical techniques being used that may influence how readers perceive the topic.

            Here are the Reddit comments:
            {chr(10).join(comments[:20])}
            """

    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt,
        )
        return response.text
    except Exception as e:
        return f"Gemini error: {str(e)}"
