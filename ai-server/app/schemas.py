from pydantic import BaseModel
from typing import Optional

class BlogInput(BaseModel):
    content: str
    title: Optional[str] = None
    category: Optional[str] = None
    author: Optional[str] = None