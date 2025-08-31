# backend/app/main.py
import os, json
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import httpx

GROQ_API_KEY = os.getenv("GROQ_API_KEY")  # <-- set this on Render
GROQ_BASE_URL = "https://api.groq.com/openai/v1"
GROQ_MODEL = os.getenv("GROQ_MODEL", "llama-3.1-8b-instant")

RESUME_PATH = os.getenv("RESUME_JSON", "/app/backend/data/resume.json")

app = FastAPI(title="Lokesh Portfolio API", docs_url="/docs", openapi_url="/openapi.json")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # tighten later to your frontend domain
    allow_methods=["*"],
    allow_headers=["*"],
)

def load_resume():
    if os.path.exists(RESUME_PATH):
        with open(RESUME_PATH, "r", encoding="utf-8") as f:
            return json.load(f)
    # fallback structure so frontend doesn't crash
    return {
        "basics": {"name": "Lokesh Eedara", "summary": ""},
        "skills": [],
        "work": [],
        "projects": [],
        "awards": [],
        "education": [],
    }

@app.get("/resume")
async def get_resume():
    return load_resume()

class ChatRequest(BaseModel):
    message: str

@app.post("/chat")
async def chat(req: ChatRequest):
    """
    Simple Groq-backed chat endpoint.
    Add your RAG retrieval (BM25 or vector) BEFORE calling Groq if needed.
    """
    if not GROQ_API_KEY:
        raise HTTPException(status_code=500, detail="GROQ_API_KEY not set")

    system_prompt = (
        "You are Lokesh’s portfolio assistant. Answer using information from his resume. "
        "Be concise and friendly."
    )

    payload = {
        "model": GROQ_MODEL,
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": req.message},
        ],
        "temperature": 0.2,
        "max_tokens": 700,
    }

    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "Content-Type": "application/json",
    }

    async with httpx.AsyncClient(timeout=60.0) as client:
        r = await client.post(f"{GROQ_BASE_URL}/chat/completions", headers=headers, json=payload)
        if r.status_code >= 400:
            raise HTTPException(status_code=r.status_code, detail=r.text)
        data = r.json()

    # OpenAI-compatible shape:
    try:
        answer = data["choices"][0]["message"]["content"]
    except Exception:
        answer = str(data)

    return {"reply": answer}
