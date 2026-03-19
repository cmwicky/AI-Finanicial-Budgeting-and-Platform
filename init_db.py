#!/usr/bin/env python3
"""
Database initialization script for FinAI.
Creates all database tables and populates with initial data.
"""

import asyncio
from app.core.database import engine, Base
from app.services.category_service import CategoryService
from sqlalchemy.ext.asyncio import AsyncSession


async def init_db():
    """Initialize the database with tables and initial data."""
    print("🔄 Creating database tables...")

    # Create all tables
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    print("✅ Database tables created successfully!")

    # Populate with initial data
    print("🔄 Populating initial data...")

    async with AsyncSession(engine) as db:
        category_service = CategoryService()
        await category_service.get_or_create_predefined(db)
        await db.commit()

    print("✅ Initial data populated successfully!")
    print("🎉 Database initialization complete!")


if __name__ == "__main__":
    asyncio.run(init_db())