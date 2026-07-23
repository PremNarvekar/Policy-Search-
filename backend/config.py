from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):

    # ---------------------------------------------------
    # Application
    # ---------------------------------------------------

    APP_NAME: str = "PolicySearch API"
    APP_VERSION: str = "1.0.0"
    APP_ENV: str = "development"

    # ---------------------------------------------------
    # Security / CORS
    # ---------------------------------------------------

    # Comma-separated list of allowed origins, e.g.:
    #   CORS_ORIGINS=http://localhost:5173,https://your-app.onrender.com
    CORS_ORIGINS: str = "http://localhost:5173"

    # ---------------------------------------------------
    # Google / Gemini
    # ---------------------------------------------------

    GOOGLE_API_KEY: str

    # ---------------------------------------------------
    # Models
    # ---------------------------------------------------

    GEMINI_MODEL: str = "gemini-2.5-flash"
    EMBEDDING_MODEL: str = "models/text-embedding-004"
    TEMPERATURE: float = 0.0

    # ---------------------------------------------------
    # Directories
    # ---------------------------------------------------

    PDF_DIRECTORY: str = "data/pdfs"
    CHROMA_PATH: str = "chroma_store"

    # ---------------------------------------------------
    # Retrieval
    # ---------------------------------------------------

    TOP_K: int = 5

    # ---------------------------------------------------
    # Chunking
    # ---------------------------------------------------

    CHUNK_SIZE: int = 1000
    CHUNK_OVERLAP: int = 150

    # ---------------------------------------------------
    # Validation
    # ---------------------------------------------------

    MAX_QUESTION_LENGTH: int = Field(default=4000, gt=0)

    # ---------------------------------------------------
    # Logging
    # ---------------------------------------------------

    LOG_LEVEL: str = "INFO"

    # ---------------------------------------------------
    # Settings Configuration
    # ---------------------------------------------------

    model_config = SettingsConfigDict(
        env_file=".env",
        extra="ignore",
    )

    @property
    def cors_origins_list(self) -> list[str]:
        """Parse CORS_ORIGINS string into a list of origins."""
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",") if origin.strip()]


settings = Settings()