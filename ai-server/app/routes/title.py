

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

@router.post("/title")                          
def generate_title(data: BlogInput):
    try:
        context = build_context(data)
        prompt = f"""
You are an expert blog title generator.

{context}

Blog Content:
{data.content}

Generate exactly 5 blog titles in this JSON format:

{{
  "titles": [
    {{ "title": "...", "type": "catchy" }},
    {{ "title": "...", "type": "seo-friendly" }},
    {{ "title": "...", "type": "question-based" }},
    {{ "title": "...", "type": "listicle" }},
    {{ "title": "...", "type": "emotional" }}
  ]
}}

Return ONLY valid JSON. No explanation. No markdown fences.
"""
        raw = ask_gemini(prompt)

        # Gemini sometimes wraps in ```json ... ``` — strip it
        cleaned = re.sub(r"```json|```", "", raw).strip()
        parsed = json.loads(cleaned)

        return {
            "success": True,
            "titles": parsed["titles"]   
        }

    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail="AI returned invalid JSON")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))