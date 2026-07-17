import os
from dotenv import load_dotenv
from langchain_community.document_loaders import PyPDFDirectoryLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_chroma import Chroma

load_dotenv()
api_key=os.getenv("GOOGLE_API_KEY")

def ingest_loader():
    loader = PyPDFDirectoryLoader("data/pdfs")
    documents = loader.load()
   
    chunk_size=1000
    chunk_overlap=150
    
    spillter = RecursiveCharacterTextSplitter(
        
        chunk_size=chunk_size,
        chunk_overlap=chunk_overlap,
        length_function=len,
        separators=["\n\n", "\n", " ", ""]
    )

    chunks = spillter.split_documents(documents)

    # print(chunks)

    # print(f"Total pages: {len(documents)}")
    # print(f"Total chunks: {len(chunks)}")
    # print(chunks[0].page_content)
    # print(chunks[0].metadata)

    embedding = GoogleGenerativeAIEmbeddings(model="gemini-embedding-2-preview")
    # vector = embedding.embed_documents(["chunks"])
    # google_api_key=api_key

    chunks = chunks[:10]
    

    Chroma.from_documents(
        documents=chunks,
        embedding=embedding,
        persist_directory="chroma_store"
    )


    print(f"strored{len(chunks)} chunks in vector DB")

   

if __name__ == "__main__":
    ingest_loader()




