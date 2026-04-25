from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from app.schemas import BlogInput
from langchain_core.prompts import PromptTemplate
from app.services.groq_service import llm

router = APIRouter(prefix="/improve")  # ← add prefix to keep it consistent

template = PromptTemplate.from_template("""
You are an expert writing assistant.

Improve grammar, clarity, readability and structure.
Keep the original meaning.

Draft:
{text}
""")

@router.post("")
async def improve(data: BlogInput):
    chain = template | llm

    async def generate():
        async for chunk in chain.astream({"text": data.content}):
            content = chunk.content
            # Handle both str and list content types
            if isinstance(content, str) and content:
                yield content
            elif isinstance(content, list):
                for block in content:
                    if isinstance(block, dict) and block.get("text"):
                        yield block["text"]

    return StreamingResponse(generate(), media_type="text/plain")


