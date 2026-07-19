from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

from backend.rag_chain import rag

# ---------------------------------------------------
# FastAPI App
# ---------------------------------------------------

app = FastAPI(
    title="PolicySearch API",
    description="RAG-powered document question answering using Gemini and ChromaDB.",
    version="1.0.0",
)


# ---------------------------------------------------
# Request & Response Models
# ---------------------------------------------------

class ChatRequest(BaseModel):
    question: str


class ChatResponse(BaseModel):
    question: str
    answer: str


# ---------------------------------------------------
# Routes
# ---------------------------------------------------

@app.get("/")
def root():
    return {
        "message": "PolicySearch API is running."
    }


@app.get("/health")
def health():
    return {
        "status": "healthy"
    }


@app.post(
    "/chat",
    response_model=ChatResponse,
)
def chat(request: ChatRequest):

    try:

        answer = rag(request.question)

        return ChatResponse(
            question=request.question,
            answer=answer,
        )

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=str(e),
        )