from fastapi import APIRouter
from .models import ResumeResponse
import json, os

router = APIRouter()

@router.get("/resume", response_model=ResumeResponse)
def get_resume():
    here = os.path.dirname(__file__)
    path = os.path.join(here, "..", "resume", "resume.json")
    with open(path, "r", encoding="utf-8") as f:
        data = json.load(f)
    # FastAPI will coerce to ResumeResponse shape
    return data
