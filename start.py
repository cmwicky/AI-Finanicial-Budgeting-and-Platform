#!/usr/bin/env python3
"""
Production startup script for FinAI application.
Use this instead of uvicorn directly in production.
"""

import os
import uvicorn
from app.core.config import get_settings

def main():
    """Start the FastAPI application with production settings."""
    settings = get_settings()

    # Ensure we're using production settings
    if settings.SECRET_KEY == "change-me-in-production":
        print("ERROR: Please set SECRET_KEY environment variable for production!")
        return 1

    if "sqlite" in settings.DATABASE_URL:
        print("WARNING: Using SQLite in production is not recommended!")
        print("Consider switching to PostgreSQL for production use.")

    # Start the server
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=int(os.getenv("PORT", "8000")),
        workers=int(os.getenv("WEB_CONCURRENCY", "1")),
        loop="uvloop" if os.getenv("USE_UVLOOP", "false").lower() == "true" else "asyncio",
        http="httptools" if os.getenv("USE_HTTPTOOLS", "false").lower() == "true" else "auto",
    )

if __name__ == "__main__":
    exit(main())