from dotenv import load_dotenv

from langchain_google_genai import ChatGoogleGenerativeAI

from backend.retriever import retrieve_documents

load_dotenv()

# ---------------------------------------------------
# Configuration
# ---------------------------------------------------

MODEL_NAME = "gemini-2.5-flash"

TEMPERATURE = 0.3

SYSTEM_PROMPT = """
You are a helpful AI assistant.

Answer ONLY using the provided context.

If the answer is not available in the context, reply:

"I couldn't find that information in the uploaded documents."

Be concise, accurate, and avoid making assumptions.
"""


# ---------------------------------------------------
# Load LLM
# ---------------------------------------------------

def get_llm():

    return ChatGoogleGenerativeAI(
        model=MODEL_NAME,
        temperature=TEMPERATURE,
    )


# ---------------------------------------------------
# Build Context
# ---------------------------------------------------

def build_context(documents):

    return "\n\n".join(
        doc.page_content
        for doc in documents
    )


# ---------------------------------------------------
# Build Prompt
# ---------------------------------------------------

def build_prompt(question: str, context: str):

    return f"""
{SYSTEM_PROMPT}

Context:
{context}

Question:
{question}
"""


# ---------------------------------------------------
# Generate Answer
# ---------------------------------------------------

def rag(question: str):

    documents = retrieve_documents(question)

    if not documents:
        return "No relevant information found."

    context = build_context(documents)

    prompt = build_prompt(
        question=question,
        context=context,
    )

    llm = get_llm()

    response = llm.invoke(prompt)

    return response.content


# ---------------------------------------------------
# Testing
# ---------------------------------------------------

if __name__ == "__main__":

    question = "What are the highest-value AI opportunities?"

    answer = rag(question)

    print("\nQuestion:")
    print(question)

    print("\nAnswer:")
    print(answer)