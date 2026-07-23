import logging
import threading

from langchain_community.document_loaders import PyPDFDirectoryLoader
from langchain_community.retrievers import BM25Retriever
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_chroma import Chroma
from langchain.retrievers import EnsembleRetriever

from backend.config import settings

logger = logging.getLogger(__name__)


# ---------------------------------------------------
# Thread-safe Singleton Cache
# ---------------------------------------------------

_retriever = None
_retriever_lock = threading.Lock()


# ---------------------------------------------------
# Vector Retriever
# ---------------------------------------------------

def get_vector_retriever():
    """Initialise and return a ChromaDB vector retriever."""
    embedding_model = GoogleGenerativeAIEmbeddings(
        model=settings.EMBEDDING_MODEL,
        google_api_key=settings.GOOGLE_API_KEY,
    )

    vector_store = Chroma(
        persist_directory=settings.CHROMA_PATH,
        embedding_function=embedding_model,
    )

    return vector_store.as_retriever(
        search_kwargs={"k": settings.TOP_K},
    )


# ---------------------------------------------------
# BM25 Retriever
# ---------------------------------------------------

def get_bm25_retriever():
    """Load PDFs, chunk them, and return a BM25 retriever."""
    loader = PyPDFDirectoryLoader(settings.PDF_DIRECTORY)
    documents = loader.load()

    if not documents:
        raise ValueError(
            f"No PDF documents found in '{settings.PDF_DIRECTORY}'. "
            "Please add PDFs and re-run the ingestion pipeline."
        )

    splitter = RecursiveCharacterTextSplitter(
        chunk_size=settings.CHUNK_SIZE,
        chunk_overlap=settings.CHUNK_OVERLAP,
    )
    chunks = splitter.split_documents(documents)

    bm25 = BM25Retriever.from_documents(chunks)
    bm25.k = settings.TOP_K

    return bm25


# ---------------------------------------------------
# Hybrid Retriever Builder
# ---------------------------------------------------

def build_retriever() -> EnsembleRetriever:
    """Build the hybrid BM25 + semantic retriever."""
    logger.info("Building hybrid retriever...")

    try:
        vector_retriever = get_vector_retriever()
        bm25_retriever = get_bm25_retriever()
    except Exception:
        logger.exception("Failed to build retriever components")
        raise

    retriever = EnsembleRetriever(
        retrievers=[bm25_retriever, vector_retriever],
        weights=[0.5, 0.5],
    )

    logger.info("Hybrid retriever built successfully.")
    return retriever


# ---------------------------------------------------
# Thread-safe Cached Retriever
# ---------------------------------------------------

def get_retriever() -> EnsembleRetriever:
    """
    Returns the shared retriever singleton.
    Uses a double-checked lock to ensure thread-safe lazy initialisation.
    """
    global _retriever

    if _retriever is None:
        with _retriever_lock:
            if _retriever is None:  # second check inside lock
                _retriever = build_retriever()
                logger.info("Retriever singleton initialised.")

    return _retriever


# ---------------------------------------------------
# Retrieve Documents
# ---------------------------------------------------

def retrieve_documents(question: str):
    """
    Retrieve the top-K most relevant document chunks for a given question.

    Args:
        question: Natural-language query string.

    Returns:
        List of LangChain Document objects.
    """
    logger.info("Retrieving documents | question_length=%d", len(question))

    retriever = get_retriever()

    try:
        documents = retriever.invoke(question)
    except Exception:
        logger.exception("Error retrieving documents")
        raise

    logger.info(
        "Retrieved %d document(s) | query_preview=%.60r",
        len(documents),
        question,
    )

    return documents


# ---------------------------------------------------
# Local Testing
# ---------------------------------------------------

if __name__ == "__main__":
    while True:
        question = input("\nAsk a question (type 'exit' to quit): ")
        if question.lower() == "exit":
            break

        docs = retrieve_documents(question)
        print(f"\nRetrieved {len(docs)} documents\n")

        for index, doc in enumerate(docs, start=1):
            print(f"========== Document {index} ==========")
            print(doc.metadata)
            print("-" * 50)
            print(doc.page_content[:400])
            print()