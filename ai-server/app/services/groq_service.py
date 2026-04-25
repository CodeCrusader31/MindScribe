# import os
# from dotenv import load_dotenv
# from langchain_groq import ChatGroq

# load_dotenv()

# llm = ChatGroq(
#     groq_api_key=os.getenv("GROQ_API_KEY"),
#     model_name="llama3-8b-8192",
#     streaming=True
# )

# async def stream_groq(prompt):
#     async for chunk in llm.astream(prompt):
#         if chunk.content:
#             yield chunk.content

import os
from dotenv import load_dotenv
from langchain_groq import ChatGroq

load_dotenv()

llm = ChatGroq(
    groq_api_key=os.getenv("GROQ_API_KEY"),
    model_name="llama-3.1-8b-instant",
    streaming=True
)

async def stream_groq(prompt):
    async for chunk in llm.astream(prompt):
        content = chunk.content
        if isinstance(content, str) and content:
            yield content
        elif isinstance(content, list):
            for block in content:
                if isinstance(block, dict) and block.get("text"):
                    yield block["text"]