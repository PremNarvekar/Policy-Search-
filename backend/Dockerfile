FROM python:3.11-slim AS base

# Security: run as non-root user
RUN addgroup --system app && adduser --system --ingroup app app

WORKDIR /app

# Install dependencies first (layer caching)
COPY requirements.txt ./
RUN pip install --no-cache-dir --upgrade pip \
    && pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . ./

# Switch to non-root user
USER app

# Expose API port
EXPOSE 8000

# Start FastAPI with uvicorn
CMD ["uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "1"]
