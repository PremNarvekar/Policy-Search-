import logging

from langchain_core.prompts import ChatPromptTemplate
from langchain_google_genai import ChatGoogleGenerativeAI

from backend.config import settings
from backend.retriever import retrieve_documents

logger = logging.getLogger(__name__)


# ---------------------------------------------------
# Prompt Template
# ---------------------------------------------------

_SYSTEM_PROMPT = """You are PolicySearch, an expert AI assistant that answers questions \
strictly based on the provided policy documents.

Rules:
- Answer ONLY using the provided context below.
- If the context does not contain enough information, say: \
  "I could not find a definitive answer in the provided policy documents. \
  Please consult the relevant policy document directly."
- Be concise, accurate, and professional.
- Do not speculate or make up information.
- Use markdown formatting for clarity when appropriate (bullet points, bold for key terms).
"""

_HUMAN_PROMPT = """Context from policy documents:

{context}

---

Question: {question}

Answer:"""

_prompt = ChatPromptTemplate.from_messages(
    [
        ("system", _SYSTEM_PROMPT),
        ("human", _HUMAN_PROMPT),
    ]
)


# ---------------------------------------------------
# LLM
# ---------------------------------------------------

def _get_llm() -> ChatGoogleGenerativeAI:
    return ChatGoogleGenerativeAI(
        model=settings.GEMINI_MODEL,
        google_api_key=settings.GOOGLE_API_KEY,
        temperature=settings.TEMPERATURE,
    )


# ---------------------------------------------------
# RAG Chain
# ---------------------------------------------------

def rag(question: str) -> str:
    """
    Runs the full RAG pipeline:
      1. Retrieve relevant documents from the hybrid retriever.
      2. Format the context.
      3. Invoke Gemini to generate a grounded answer.

    Args:
        question: The user's natural-language question.

    Returns:
        A string answer grounded in the retrieved documents.

    Raises:
        Exception: Propagates any retrieval or LLM error to the caller.
    """
    logger.info("RAG chain invoked | question_length=%d", len(question))

    # Step 1: Retrieve
    documents = retrieve_documents(question)

    if not documents:
        logger.warning("No documents retrieved for question: %s", question)
        return (
            "I could not find any relevant information in the policy documents "
            "for your question. Please try rephrasing or consult the documents directly."
        )

    # Step 2: Build context string
    context_parts = []
    for i, doc in enumerate(documents, start=1):
        source = doc.metadata.get("source", "Unknown")
        page = doc.metadata.get("page", "?")
        context_parts.append(
            f"[Document {i} | Source: {source} | Page: {page}]\n{doc.page_content}"
        )

    context = "\n\n".join(context_parts)

    logger.debug(
        "Context built | documents=%d | context_chars=%d",
        len(documents),
        len(context),
    )

    # Step 3: Invoke LLM
    llm = _get_llm()
    chain = _prompt | llm

    try:
        response = chain.invoke(
            {
                "context": context,
                "question": question,
            }
        )
    except Exception:
        logger.exception("LLM invocation failed")
        raise

    answer: str = response.content  # type: ignore[union-attr]

    logger.info(
        "RAG chain complete | answer_length=%d | docs_used=%d",
        len(answer),
        len(documents),
    )

    return answer