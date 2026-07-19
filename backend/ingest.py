import os
from dotenv import load_dotenv

from langchain_community.document_loaders import PyPDFDirectoryLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_chroma import Chroma

load_dotenv()

# -----------------------------
# Configuration
# -----------------------------

PDF_DIRECTORY = "data/pdfs"
CHROMA_DIRECTORY = "chroma_store"

CHUNK_SIZE = 1000
CHUNK_OVERLAP = 150

EMBEDDING_MODEL = "gemini-embedding-2-preview"


# -----------------------------
# Load PDF Documents
# -----------------------------

def load_documents():

    loader = PyPDFDirectoryLoader(PDF_DIRECTORY)
    documents = loader.load()

    if not documents:
        raise ValueError("No PDF documents found.")

    print(f"Loaded {len(documents)} pages.")

    return documents


# -----------------------------
# Split Documents
# -----------------------------

def split_documents(documents):

    splitter = RecursiveCharacterTextSplitter(
        chunk_size=CHUNK_SIZE,
        chunk_overlap=CHUNK_OVERLAP,
    )

    chunks = splitter.split_documents(documents)

    print(f"Created {len(chunks)} chunks.")

    return chunks


# -----------------------------
# Create Embedding Model
# -----------------------------

def get_embedding_model():

    return GoogleGenerativeAIEmbeddings(
        model=EMBEDDING_MODEL
    )


# -----------------------------
# Build Chroma Vector Store
# -----------------------------

def build_vector_store(chunks):

    embedding_model = get_embedding_model()

    Chroma.from_documents(
        documents=chunks,
        embedding=embedding_model,
        persist_directory=CHROMA_DIRECTORY,
    )

    print("Vector database created successfully.")


# -----------------------------
# Ingestion Pipeline
# -----------------------------

def ingest():

    try:

        documents = load_documents()

        chunks = split_documents(documents)

        build_vector_store(chunks)

        print("\nIngestion completed successfully.")

    except Exception as e:

        print(f"\nIngestion failed: {e}")


if __name__ == "__main__":

    ingest()