from motor.motor_asyncio import AsyncIOMotorClient
from typing import Optional

# MongoDB connection settings
MONGODB_URL = "mongodb://admin:password123@rofl_mongodb:27017"
DATABASE_NAME = "rofl_db"

# Global client instance
_client: Optional[AsyncIOMotorClient] = None

async def get_database():
    """Get the database instance. Creates connection if not exists."""
    global _client
    if _client is None:
        _client = AsyncIOMotorClient(MONGODB_URL)
    return _client[DATABASE_NAME]

async def close_database():
    """Close the database connection."""
    global _client
    if _client is not None:
        _client.close()
        _client = None