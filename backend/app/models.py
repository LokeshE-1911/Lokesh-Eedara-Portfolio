from pydantic import BaseModel
from typing import List, Optional, Any, Dict

class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    message: str
    history: Optional[List[ChatMessage]] = []
    top_k: int = 5

class ChatResponse(BaseModel):
    reply: str

class ResumeResponse(BaseModel):
    basics: Dict[str, Any] = {}
    skills: List[Dict[str, Any]] = []
    projects: List[Dict[str, Any]] = []
    work: List[Dict[str, Any]] = []
    education: List[Dict[str, Any]] = []
    awards: List[Dict[str, Any]] = []
