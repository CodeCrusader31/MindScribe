import json
import re
from fastapi import APIRouter, HTTPException
from app.schemas import BlogInput
from app.services.gemini_service import ask_gemini

router = APIRouter()

def build_context(data):
    context = ""
    if data.title:
        context += f"Title: {data.title}\n"
    if data.category:
        context += f"Category: {data.category}\n"
    if data.author:
        context += f"Author: {data.author}\n"
    return context

@router.post("/summarize")
def summarize_blog(data: BlogInput):
    try:
        context = build_context(data)
        prompt = f"""
You are an expert blog summarizer.

{context}
Blog Content:
{data.content}

Summarize this blog in the following JSON format:
{{
  "short_summary": "2-3 sentence summary",
  "bullet_points": ["point 1", "point 2", "point 3", "point 4", "point 5"],
  "social_media_post": "An engaging 280-character summary for social media with relevant hashtags"
}}

Return ONLY valid JSON. No explanation. No markdown fences.
"""
        raw = ask_gemini(prompt)

        # Gemini sometimes wraps in ```json ... ``` — strip it
        cleaned = re.sub(r"```json|```", "", raw).strip()
        parsed = json.loads(cleaned)

        return {
            "success": True,
            "summary": parsed
        }

    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail="AI returned invalid JSON")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
