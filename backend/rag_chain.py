from dotenv import load_dotenv
from retriever import retrieve_documents
from langchain_google_genai import ChatGoogleGenerativeAI

load_dotenv()


model = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash",
    temperature=0.3,
)


def rag(question: str):

    documents = retrieve_documents(question)

    if not documents:
        return "No relevant information found in the uploaded documents."

    # for i, doc in enumerate(documents, 1):
    #     print(f"\n========== Result {i} ==========")
    #     print(f"PDF Name : {doc.metadata['source']}")
    #     print(f"Page     : {doc.metadata['page'] + 1}")
    #     print(f"Title    : {doc.metadata.get('title')}")
    #     print("-" * 50)
    #     print(doc.page_content)
    #     print("=" * 70)

    context = "\n\n".join(
        doc.page_content for doc in documents
    )

    prompt = f"""
You are a helpful AI assistant.

Answer ONLY using the context below.

If the answer is not present in the context, say:
"I couldn't find that information in the uploaded documents."

Context:
{context}

Question:
{question}
"""

    response = model.invoke(prompt)
    print(prompt)

    return response.content


   


if __name__ == "__main__":

    answer = rag("What are the highest-value AI opportunities?")
    print(answer)
    
    