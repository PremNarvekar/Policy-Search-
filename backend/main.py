import logging
import logging.config
import time

from contextlib import asynccontextmanager
from typing import Annotated

from fastapi import FastAPI, HTTPException
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from backend.config import settings
from backend.exception import (
    AppException,
    app_exception_handler,
    global_exception_handler,
    validation_exception_handler,
)
from backend.middleware import logging_middleware
from backend.rag_chain import rag


# ---------------------------------------------------
# Logging — configured once at startup
# ---------------------------------------------------

logging.basicConfig(
    level=settings.LOG_LEVEL.upper(),
    format="%(asctime)s | %(levelname)-8s | %(name)s | %(message)s",
    datefmt="%Y-%m-%dT%H:%M:%S",
)

logger = logging.getLogger(__name__)


# ---------------------------------------------------
# Application Lifespan
# ---------------------------------------------------

_start_time: float = 0.0


@asynccontextmanager
async def lifespan(app: FastAPI):
    global _start_time
    _start_time = time.monotonic()
    logger.info("PolicySearch API starting up | env=%s | version=%s", settings.APP_ENV, settings.APP_VERSION)
    yield
    logger.info("PolicySearch API shutting down.")


# ---------------------------------------------------
# FastAPI App
# ---------------------------------------------------

app = FastAPI(
    title=settings.APP_NAME,
    description="RAG-powered policy document question answering using Gemini and ChromaDB.",
    version=settings.APP_VERSION,
    lifespan=lifespan,
    docs_url="/docs" if settings.APP_ENV != "production" else None,
    redoc_url="/redoc" if settings.APP_ENV != "production" else None,
)

# Middleware — must be added before routes
app.middleware("http")(logging_middleware)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization"],
)

# Exception handlers
app.add_exception_handler(AppException, app_exception_handler)  # type: ignore[arg-type]
app.add_exception_handler(RequestValidationError, validation_exception_handler)  # type: ignore[arg-type]
app.add_exception_handler(Exception, global_exception_handler)


# ---------------------------------------------------
# Request & Response Models
# ---------------------------------------------------

class ChatRequest(BaseModel):
    question: Annotated[
        str,
        Field(
            min_length=1,
            max_length=4000,
            description="The question to ask about the policy documents.",
        ),
    ]

    model_config = {"json_schema_extra": {"example": {"question": "What is the claims process?"}}}


class ChatResponse(BaseModel):
    question: str
    answer: str


class HealthResponse(BaseModel):
    status: str
    version: str
    uptime_seconds: float
    environment: str


# ---------------------------------------------------
# Routes
# ---------------------------------------------------

@app.get("/", tags=["Meta"])
async def root():
    """API root — confirms the service is reachable."""
    return {
        "service": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "docs": "/docs",
    }


@app.get("/health", response_model=HealthResponse, tags=["Meta"])
async def health():
    """Health check endpoint — returns status, version and uptime."""
    uptime = time.monotonic() - _start_time if _start_time else 0.0
    return HealthResponse(
        status="healthy",
        version=settings.APP_VERSION,
        uptime_seconds=round(uptime, 2),
        environment=settings.APP_ENV,
    )


@app.post("/chat", response_model=ChatResponse, tags=["Chat"])
async def chat(request: ChatRequest):
    """
    Submit a question and receive a grounded answer from the RAG pipeline.

    - Retrieves relevant policy document chunks via hybrid search.
    - Synthesises a grounded answer using Gemini.
    - Returns 500 on LLM or retrieval failure.
    """
    logger.info("POST /chat | question_length=%d", len(request.question))

    try:
        answer = await rag_async(request.question)
    except Exception as exc:
        logger.exception("RAG pipeline failed")
        raise HTTPException(
            status_code=500,
            detail="An error occurred while processing your question. Please try again.",
        ) from exc

    return ChatResponse(
        question=request.question,
        answer=answer,
    )


# ---------------------------------------------------
# Async wrapper for the synchronous RAG chain
# ---------------------------------------------------

import asyncio


async def rag_async(question: str) -> str:
    """Run the synchronous RAG chain in a thread pool to avoid blocking the event loop."""
    loop = asyncio.get_event_loop()
    return await loop.run_in_executor(None, rag, question)