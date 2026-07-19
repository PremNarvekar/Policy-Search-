from dotenv import load_dotenv

from langchain_community.document_loaders import PyPDFDirectoryLoader
from langchain_community.retrievers import BM25Retriever

from langchain_text_splitters import RecursiveCharacterTextSplitter

from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_chroma import Chroma

from langchain_classic.retrievers import EnsembleRetriever

load_dotenv()

# ---------------------------------------------------
# Configuration
# ---------------------------------------------------

PDF_DIRECTORY = "data/pdfs"
CHROMA_DIRECTORY = "chroma_store"

CHUNK_SIZE = 1000
CHUNK_OVERLAP = 150

TOP_K = 5

EMBEDDING_MODEL = "gemini-embedding-2-preview"

# ---------------------------------------------------
# Cache
# ---------------------------------------------------

_retriever = None


# ---------------------------------------------------
# Vector Retriever
# ---------------------------------------------------

def get_vector_retriever():

    embedding_model = GoogleGenerativeAIEmbeddings(
        model=EMBEDDING_MODEL
    )

    vector_store = Chroma(
        persist_directory=CHROMA_DIRECTORY,
        embedding_function=embedding_model,
    )

    return vector_store.as_retriever(
        search_kwargs={"k": TOP_K}
    )


# ---------------------------------------------------
# BM25 Retriever
# ---------------------------------------------------

def get_bm25_retriever():

    loader = PyPDFDirectoryLoader(PDF_DIRECTORY)

    documents = loader.load()

    splitter = RecursiveCharacterTextSplitter(
        chunk_size=CHUNK_SIZE,
        chunk_overlap=CHUNK_OVERLAP,
    )

    chunks = splitter.split_documents(documents)

    bm25 = BM25Retriever.from_documents(chunks)

    bm25.k = TOP_K

    return bm25


# ---------------------------------------------------
# Build Hybrid Retriever
# ---------------------------------------------------

def build_retriever():

    print("Building Hybrid Retriever...")

    vector_retriever = get_vector_retriever()

    bm25_retriever = get_bm25_retriever()

    return EnsembleRetriever(
        retrievers=[
            bm25_retriever,
            vector_retriever,
        ],
        weights=[0.5, 0.5],
    )


# ---------------------------------------------------
# Cached Retriever
# ---------------------------------------------------

def get_retriever():

    global _retriever

    if _retriever is None:

        _retriever = build_retriever()

        print("Retriever ready.")

    return _retriever


# ---------------------------------------------------
# Retrieve Documents
# ---------------------------------------------------

def retrieve_documents(question: str):

    retriever = get_retriever()

    return retriever.invoke(question)


# ---------------------------------------------------
# Test
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