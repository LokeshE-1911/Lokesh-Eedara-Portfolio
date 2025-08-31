from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from .router_chat import router as chat_router
from .router_resume import router as resume_router

app = FastAPI(title="Lokesh Portfolio API (Groq + RAG)")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], allow_credentials=True,
    allow_methods=["*"], allow_headers=["*"],
)

# API routes (both /chat and /api/chat)
app.include_router(chat_router, prefix="/api")
app.include_router(chat_router)
# Resume for frontend
app.include_router(resume_router, prefix="/api")

@app.get("/healthz")
def health(): return {"ok": True}

@app.get("/chat", include_in_schema=False)
def chat_get_info():
    return JSONResponse({"use":"POST /chat (or /api/chat)",
                         "body":{"message":"Summarize your backend skills"}})
