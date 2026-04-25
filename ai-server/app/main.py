# import os
# from fastapi import FastAPI, HTTPException
# from pydantic import BaseModel
# from typing import Optional
# from dotenv import load_dotenv
# from fastapi.middleware.cors import CORSMiddleware
# import google.generativeai as genai

# load_dotenv()

# api_key = os.getenv("GEMINI_API_KEY")
# if not api_key:
#     raise ValueError("GEMINI_API_KEY not found in .env file")

# genai.configure(api_key=api_key)
# model = genai.GenerativeModel("gemini-2.5-flash")

# app = FastAPI(title="MindScribe AI Server")

# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )


# # =====================================================
# # Request Models
# # =====================================================
# class BlogInput(BaseModel):
#     content: str
#     # Optional blog metadata to give AI more context
#     title: Optional[str] = None
#     category: Optional[str] = None
#     author: Optional[str] = None


# def build_context(data: BlogInput) -> str:
#     """Build a context string from optional blog metadata."""
#     context = ""
#     if data.title:
#         context += f"Title: {data.title}\n"
#     if data.category:
#         context += f"Category: {data.category}\n"
#     if data.author:
#         context += f"Author: {data.author}\n"
#     return context


# # =====================================================
# # 1. Generate Titles
# # =====================================================
# @app.post("/generate-title")
# def generate_title(data: BlogInput):
#     try:
#         context = build_context(data)
#         prompt = f"""
# You are an expert blog title generator.

# {context}
# Blog Content:
# {data.content}

# Generate exactly 5 blog titles in this JSON format:
# {{
#   "titles": [
#     {{ "title": "...", "type": "catchy" }},
#     {{ "title": "...", "type": "seo-friendly" }},
#     {{ "title": "...", "type": "question-based" }},
#     {{ "title": "...", "type": "listicle" }},
#     {{ "title": "...", "type": "emotional" }}
#   ]
# }}

# Return ONLY the JSON. No explanation.
# """
#         response = model.generate_content(prompt)  # ✅ Fixed
#         return {"success": True, "response": response.text}

#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))


# # =====================================================
# # 2. Summarizer
# # =====================================================
# @app.post("/summarize")
# def summarize_blog(data: BlogInput):
#     try:
#         context = build_context(data)
#         prompt = f"""
# You are an expert blog summarizer.

# {context}
# Blog Content:
# {data.content}

# Summarize this blog in the following JSON format:
# {{
#   "short_summary": "2-3 sentence summary",
#   "bullet_points": ["point 1", "point 2", "point 3", "point 4", "point 5"],
#   "social_media_post": "An engaging 280-character summary for social media with relevant hashtags"
# }}

# Return ONLY the JSON. No explanation.
# """
#         response = model.generate_content(prompt)  # ✅ Fixed
#         return {"success": True, "response": response.text}

#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))


# # =====================================================
# # 3. Blog Analyzer
# # =====================================================
# @app.post("/analyze")
# def analyze_blog(data: BlogInput):
#     try:
#         context = build_context(data)
#         prompt = f"""
# You are an expert blog analyst and SEO specialist.

# {context}
# Blog Content:
# {data.content}

# Analyze this blog and return the result in this JSON format:
# {{
#   "readability_score": <number out of 10>,
#   "readability_feedback": "brief explanation",
#   "grammar_suggestions": ["suggestion 1", "suggestion 2"],
#   "tone": "e.g. Professional, Casual, Informative, Persuasive",
#   "seo_suggestions": ["suggestion 1", "suggestion 2", "suggestion 3"],
#   "keyword_suggestions": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"]
# }}

# Return ONLY the JSON. No explanation.
# """
#         response = model.generate_content(prompt)  # ✅ Fixed
#         return {"success": True, "response": response.text}

#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))


# # =====================================================
# # 4. Generate Tags
# # =====================================================
# @app.post("/generate-tags")
# def generate_tags(data: BlogInput):
#     try:
#         context = build_context(data)
#         prompt = f"""
# You are an expert blog content strategist.

# {context}
# Blog Content:
# {data.content}

# Generate tags for this blog in this JSON format:
# {{
#   "tags": ["tag1", "tag2", "tag3", "tag4", "tag5"],
#   "categories": ["category1", "category2"],
#   "hashtags": ["#hashtag1", "#hashtag2", "#hashtag3", "#hashtag4", "#hashtag5"]
# }}

# Return ONLY the JSON. No explanation.
# """
#         response = model.generate_content(prompt)  # ✅ Fixed
#         return {"success": True, "response": response.text}

#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))


# # =====================================================
# # 5. Improve / Rewrite Blog (Bonus)
# # =====================================================
# @app.post("/improve")
# def improve_blog(data: BlogInput):
#     try:
#         context = build_context(data)
#         prompt = f"""
# You are an expert blog editor and content writer.

# {context}
# Blog Content:
# {data.content}

# Improve this blog by:
# 1. Fixing grammar and sentence flow
# 2. Making it more engaging
# 3. Improving structure (intro, body, conclusion)

# Return result in this JSON format:
# {{
#   "improved_content": "the full improved blog text",
#   "changes_made": ["change 1", "change 2", "change 3"]
# }}

# Return ONLY the JSON. No explanation.
# """
#         response = model.generate_content(prompt)
#         return {"success": True, "response": response.text}

#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))


# # =====================================================
# # Root Route
# # =====================================================
# @app.get("/")
# def home():
#     return {"message": "MindScribe AI Server Running 🚀"}



from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes import title, improve, summarize

app = FastAPI(title="MindScribe AI Server")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(title.router)
app.include_router(summarize.router)
app.include_router(improve.router)

@app.get("/")
def home():
    return {"message": "MindScribe AI Server Running"}