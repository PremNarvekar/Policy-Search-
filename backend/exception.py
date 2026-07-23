from fastapi import Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse

import logging

logger = logging.getLogger(__name__)


# ---------------------------------------------------
# Custom Application Exception
# ---------------------------------------------------

class AppException(Exception):
    """Raised for expected application-level errors with a specific HTTP status."""

    def __init__(self, message: str, status_code: int = 500) -> None:
        self.message = message
        self.status_code = status_code
        super().__init__(message)


# ---------------------------------------------------
# App Exception Handler
# ---------------------------------------------------

async def app_exception_handler(request: Request, exc: AppException) -> JSONResponse:
    logger.error(
        "AppException | status=%d | path=%s | message=%s",
        exc.status_code,
        request.url.path,
        exc.message,
    )
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "success": False,
            "error": {
                "message": exc.message,
                "status_code": exc.status_code,
            },
        },
    )


# ---------------------------------------------------
# Validation Error Handler
# ---------------------------------------------------

async def validation_exception_handler(
    request: Request,
    exc: RequestValidationError,
) -> JSONResponse:
    errors = exc.errors()
    logger.warning(
        "Validation error | path=%s | errors=%s",
        request.url.path,
        errors,
    )
    # Produce a readable summary of each validation failure
    readable_errors = [
        {
            "field": " → ".join(str(loc) for loc in e.get("loc", [])),
            "message": e.get("msg", "Invalid value"),
        }
        for e in errors
    ]
    return JSONResponse(
        status_code=422,
        content={
            "success": False,
            "error": {
                "message": "Request validation failed.",
                "details": readable_errors,
            },
        },
    )


# ---------------------------------------------------
# Global / Catch-all Exception Handler
# ---------------------------------------------------

async def global_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    logger.exception(
        "Unhandled exception | path=%s | exc_type=%s",
        request.url.path,
        type(exc).__name__,
    )
    return JSONResponse(
        status_code=500,
        content={
            "success": False,
            "error": {
                "message": "An unexpected error occurred. Please try again later.",
                "status_code": 500,
            },
        },
    )