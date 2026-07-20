from pathlib import Path
from time import perf_counter
import pandas as pd

from backend.rag_chain import rag
from backend.retriever import retrieve_documents

# ---------------------------------------------------
# Configuration
# ---------------------------------------------------

DATASET_PATH = Path("data/evaluation_dataset.csv")

OUTPUT_DIR = Path("evaluation_results")
OUTPUT_DIR.mkdir(exist_ok=True)

OUTPUT_FILE = OUTPUT_DIR / "results.csv"

TOP_K = 5


# ---------------------------------------------------
# Load Dataset
# ---------------------------------------------------

def load_dataset():

    if not DATASET_PATH.exists():
        raise FileNotFoundError(DATASET_PATH)

    return pd.read_csv(DATASET_PATH)


# ---------------------------------------------------
# Evaluate One Question
# ---------------------------------------------------

def evaluate_question(question, ground_truth):

    retrieval_start = perf_counter()

    documents = retrieve_documents(question)

    retrieval_time = perf_counter() - retrieval_start

    generation_start = perf_counter()

    answer = rag(question)

    generation_time = perf_counter() - generation_start

    contexts = [
        doc.page_content
        for doc in documents
    ]

    metadata = [
        doc.metadata
        for doc in documents
    ]

    retrieved_pages = []

    for meta in metadata:

        page = meta.get("page")

        if page is not None:
            retrieved_pages.append(page + 1)

    return {

        "question": question,

        "ground_truth": ground_truth,

        "answer": answer,

        "retrieved_documents": len(documents),

        "retrieval_time_sec": round(retrieval_time, 3),

        "generation_time_sec": round(generation_time, 3),

        "total_context_characters": sum(
            len(c)
            for c in contexts
        ),

        "answer_characters": len(answer),

        "pages": retrieved_pages,

        "contexts": contexts,
    }


# ---------------------------------------------------
# Evaluate Dataset
# ---------------------------------------------------

def evaluate_dataset(df):

    results = []

    for index, row in df.iterrows():

        print(f"Evaluating {index+1}/{len(df)}")

        result = evaluate_question(

            row["question"],

            row["ground_truth"]

        )

        results.append(result)

    return pd.DataFrame(results)


# ---------------------------------------------------
# Summary
# ---------------------------------------------------

def print_summary(df):

    print("\n========== SUMMARY ==========\n")

    print(f"Questions : {len(df)}")

    print(
        f"Average Retrieval Time : "
        f"{df['retrieval_time_sec'].mean():.3f}s"
    )

    print(
        f"Average Generation Time : "
        f"{df['generation_time_sec'].mean():.3f}s"
    )

    print(
        f"Average Retrieved Docs : "
        f"{df['retrieved_documents'].mean():.2f}"
    )

    print(
        f"Average Answer Length : "
        f"{df['answer_characters'].mean():.0f} chars"
    )

    print("\n=============================\n")


# ---------------------------------------------------
# Save
# ---------------------------------------------------

def save_results(df):

    df.to_csv(

        OUTPUT_FILE,

        index=False

    )

    print(f"Results saved to:\n{OUTPUT_FILE}")


# ---------------------------------------------------
# Main
# ---------------------------------------------------

def main():

    dataset = load_dataset()

    results = evaluate_dataset(dataset)

    print_summary(results)

    save_results(results)


if __name__ == "__main__":

    main()