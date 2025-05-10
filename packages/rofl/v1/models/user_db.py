from uuid import UUID
from pydantic import BaseModel

class UserDB(BaseModel):
    """Database model for storing user information.
    Only contains essential information needed to recreate a User instance.
    """
    display_name: str
    uuid: str  # Using str for UUID for simplicity in JSON serialization
    nostr_public_key: str  # Store only the public key
    nostr_private_key: str  # Store encrypted private key
    joined_chats: list[str]  # List of chat UUIDs