from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
import time

app = FastAPI(title="In The Rough API")

# Configure CORS for the frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class JobMatch(BaseModel):
    id: str
    title: str
    company: str
    location: str
    match_score: int
    reasoning: str

@app.post("/api/upload")
async def upload_resume(file: UploadFile = File(...)):
    # Simulate processing delay
    time.sleep(2)
    return {"message": f"Successfully processed {file.filename}", "status": "success"}

@app.get("/api/jobs", response_model=List[JobMatch])
async def get_jobs():
    # Mock data representing the "shortlist" concept
    return [
        {
            "id": "1",
            "title": "Senior Frontend Engineer",
            "company": "Vercel",
            "location": "Remote",
            "match_score": 98,
            "reasoning": "Your recent heavy use of React, TypeScript, and Vite aligns perfectly with their core stack. While you don't have explicit Next.js experience listed, your architecture decisions in past roles suggest you can easily adapt to their meta-framework."
        },
        {
            "id": "2",
            "title": "Full Stack Developer",
            "company": "Stripe",
            "location": "San Francisco, CA (Hybrid)",
            "match_score": 92,
            "reasoning": "Stripe values developers who understand both API design and frontend aesthetics. Your background shows a strong trajectory from backend (Python) to highly polished frontends, matching this role's unique requirements."
        },
        {
            "id": "3",
            "title": "Product Engineer",
            "company": "Linear",
            "location": "Remote",
            "match_score": 88,
            "reasoning": "This role requires a deep understanding of user experience and performance. Your resume highlights several projects where you took ownership of the product lifecycle and delivered fast, responsive UIs."
        }
    ]
