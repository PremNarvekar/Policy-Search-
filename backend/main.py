from fastapi import FastAPI

app = FastAPI(title="Policy Search API")

@app.get("/")
def read_root():
    return {"message": "Policy search backend is running"}
