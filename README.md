# PolicySearch

> A production-grade RAG application for querying policy documents using Gemini 2.5 Flash, ChromaDB, and hybrid retrieval.

---

## Features

- **Hybrid Retrieval** — BM25 keyword search fused with Gemini semantic embeddings via EnsembleRetriever
- **Grounded Answers** — Gemini 2.5 Flash generates answers strictly from retrieved document context
- **Production Backend** — FastAPI with async routes, typed models, structured logging, and global exception handling
- **Premium UI** — React 19 + TypeScript dark-mode SaaS interface with animations and skeleton loaders
- **Docker Ready** — Single-command startup via `docker-compose up`

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| LLM | Gemini 2.5 Flash |
| Embeddings | Google text-embedding-004 |
| Vector Store | ChromaDB |
| Retrieval | LangChain EnsembleRetriever (BM25 + Semantic) |
| Backend | FastAPI + Python 3.11 |
| Frontend | React 19 + TypeScript + Vite |
| Styling | Tailwind CSS v4 |

---

## Getting Started

### Prerequisites

- Python 3.11+
- Node.js 20+
- A [Google AI Studio](https://aistudio.google.com/) API key

### 1. Clone & Setup

```bash
git clone https://github.com/your-username/policysearch.git
cd policysearch
```

### 2. Configure Environment

```bash
# Backend
cp .env.example .env
# Edit .env and add your GOOGLE_API_KEY

# Frontend
cp frontend/.env.example frontend/.env
```

### 3. Install Dependencies & Ingest Documents

```bash
# Create virtual environment
python -m venv .venv
source .venv/bin/activate    # Windows: .venv\Scripts\activate

# Install backend dependencies
pip install -r backend/requirements.txt

# Add your PDF policy documents to data/pdfs/
mkdir -p data/pdfs
# Copy your PDFs here

# Run the ingestion pipeline
python -m backend.ingest
```

### 4. Start the Backend

```bash
uvicorn backend.main:app --reload
```

API available at [http://localhost:8000](http://localhost:8000)  
API docs at [http://localhost:8000/docs](http://localhost:8000/docs)

### 5. Start the Frontend

```bash
cd frontend
npm install
npm run dev
```

App available at [http://localhost:5173](http://localhost:5173)

---

## Docker (Full Stack)

```bash
# Build and start everything
docker-compose up --build

# Run in background
docker-compose up -d --build
```

---

## API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/` | Service info |
| `GET` | `/health` | Health check with uptime |
| `POST` | `/chat` | Submit a question, receive a grounded answer |
| `GET` | `/docs` | OpenAPI interactive documentation |

### POST /chat

**Request:**
```json
{
  "question": "What is the claims process?"
}
```

**Response:**
```json
{
  "question": "What is the claims process?",
  "answer": "Based on the policy documents..."
}
```

---

## Project Structure

```
policysearch/
├── backend/
│   ├── main.py          # FastAPI app, routes, lifespan
│   ├── rag_chain.py     # RAG pipeline (retrieve → format → generate)
│   ├── retriever.py     # Hybrid BM25 + semantic retriever
│   ├── ingest.py        # PDF ingestion pipeline
│   ├── config.py        # Pydantic settings
│   ├── exception.py     # Custom exception handlers
│   ├── middleware.py    # Request logging middleware
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── api/         # Axios client + API functions
│   │   ├── components/  # UI + chat + layout components
│   │   ├── hooks/       # React Query hooks
│   │   ├── pages/       # Landing, Chat, Settings, NotFound
│   │   ├── types/       # TypeScript interfaces
│   │   └── utils/       # cn() utility
│   └── index.html
├── data/pdfs/           # Place your PDF documents here
├── chroma_store/        # Vector store (auto-created by ingest.py)
├── docker-compose.yml
├── .env.example
└── README.md
```

---

## Deployment on Render

### Backend (Web Service)
- **Environment**: Python 3.11
- **Build Command**: `pip install -r backend/requirements.txt`
- **Start Command**: `uvicorn backend.main:app --host 0.0.0.0 --port $PORT`
- **Disk**: Mount a persistent disk at `/app/chroma_store`
- **Environment Variables**: Add all variables from `.env.example`

### Frontend (Static Site)
- **Build Command**: `cd frontend && npm install && npm run build`
- **Publish Directory**: `frontend/dist`
- **Environment Variables**: Set `VITE_API_URL` to your backend Render URL

---

## Security Notes

> ⚠️ **Never commit your `.env` file.** It is listed in `.gitignore`.  
> If you accidentally committed secrets, rotate all API keys immediately.

---

## License

MIT
