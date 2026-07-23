import logging

from dotenv import load_dotenv

from langchain_community.document_loaders import PyPDFDirectoryLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_chroma import Chroma

from backend.config import settings

load_dotenv()

logger = logging.getLogger(__name__)


# ---------------------------------------------------
# Load PDF Documents
# ---------------------------------------------------

def load_documents():

    logger.info("Loading PDF documents...")

    loader = PyPDFDirectoryLoader(
        settings.PDF_DIRECTORY
    )

    documents = loader.load()

    if not documents:
        raise ValueError("No PDF documents found.")

    logger.info(
        "Loaded %d page(s).",
        len(documents),
    )

    return documents


# ---------------------------------------------------
# Split Documents
# ---------------------------------------------------

def split_documents(documents):

    logger.info("Splitting documents into chunks...")

    splitter = RecursiveCharacterTextSplitter(
        chunk_size=settings.CHUNK_SIZE,
        chunk_overlap=settings.CHUNK_OVERLAP,
    )

    chunks = splitter.split_documents(documents)

    logger.info(
        "Created %d chunk(s).",
        len(chunks),
    )

    return chunks


# ---------------------------------------------------
# Embedding Model
# ---------------------------------------------------

def get_embedding_model():

    logger.info(
        "Loading embedding model: %s",
        settings.EMBEDDING_MODEL,
    )

    return GoogleGenerativeAIEmbeddings(
        model=settings.EMBEDDING_MODEL,
    )


# ---------------------------------------------------
# Build Vector Store
# ---------------------------------------------------

def build_vector_store(chunks):

    logger.info("Creating Chroma vector database...")

    embedding_model = get_embedding_model()

    Chroma.from_documents(
        documents=chunks,
        embedding=embedding_model,
        persist_directory=settings.CHROMA_PATH,
    )

    logger.info("Vector database created successfully.")


# ---------------------------------------------------
# Ingestion Pipeline
# ---------------------------------------------------

def ingest():

    logger.info("Starting ingestion pipeline...")

    try:

        documents = load_documents()

        chunks = split_documents(documents)

        build_vector_store(chunks)

        logger.info("Ingestion completed successfully.")

    except Exception:

        logger.exception("Ingestion failed.")

        raise


# ---------------------------------------------------
# Local Testing
# ---------------------------------------------------

if __name__ == "__main__":

    ingest()