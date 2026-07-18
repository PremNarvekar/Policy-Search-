import os
from dotenv import load_dotenv
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_chroma import Chroma

load_dotenv()


embedding = GoogleGenerativeAIEmbeddings(
    model="gemini-embedding-2-preview"
)

vectorstore = Chroma(
    persist_directory="chroma_store",
    embedding_function=embedding
)


def retrieve_documents(query: str):

    retriever = vectorstore.as_retriever(
        search_type="similarity_score_threshold",
        search_kwargs={
            "k": 2,
            "score_threshold": 0.5
        }
    )

    results = retriever.invoke(query)

    if not results:
        return None

    return results


# if __name__ == "__main__":

#     # docs = retrieve_documents("What is AI infrastructure?")

#     # if docs:
#     #     for i, doc in enumerate(docs, 1):
#     #         print(f"\n========== Result {i} ==========")
#     #         print(doc.page_content)
#     #         print(doc.metadata)