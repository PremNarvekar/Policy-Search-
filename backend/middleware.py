import logging
import time
from typing import Callable

from fastapi import Request, Response

logger = logging.getLogger(__name__)


# ---------------------------------------------------
# Request Logging Middleware
# ---------------------------------------------------

async def logging_middleware(request: Request, call_next: Callable) -> Response:
    """
    Logs every incoming HTTP request and outgoing response.
    Attaches X-Process-Time header to each response.
    """
    start_time = time.perf_counter()
    client_host = request.client.host if request.client else "unknown"

    try:
        response: Response = await call_next(request)

    except Exception:
        logger.exception(
            "Unhandled exception | method=%s | path=%s | client=%s",
            request.method,
            request.url.path,
            client_host,
        )
        raise

    process_time = time.perf_counter() - start_time
    response.headers["X-Process-Time"] = f"{process_time:.4f}s"

    logger.info(
        "method=%s | path=%s | status=%d | duration=%.4fs | client=%s",
        request.method,
        request.url.path,
        response.status_code,
        process_time,
        client_host,
    )

    return response