import os 
from dotenv import load_dotenv
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_chroma import Chroma


dotenv = load_dotenv()
api_key= os.getenv("GOOGLE_API_KEY")

def retrieve_documents(query):
    embedding = GoogleGenerativeAIEmbeddings(model="gemini-embedding-2-preview")

    vectorstore = Chroma(
        persist_directory="chroma_store",
        embedding_function=embedding
    )

    retriever = vectorstore.as_retriever(search_type="similarity_score_threshold", search_kwargs={'k':2, "score_threshold": 0.5})

    result = retriever.invoke(query)

    if not result:
        print("No relevant inforation found in the uploaded documents")
        return 

    

    print(f"\n Query:{query}")
    print(f"Retrieved {len(result)}  documents\n")


    for i, doc in enumerate(result, 1):
        print(f"========== Result {i} ==========")
        print("content:")
        print(doc.page_content)
        print("\nMetadata:")
        print(doc.metadata)
        print("=" * 40)

# if __name__ == "__main__":
    # retrieve_documents("What is an AI shovel?")   



