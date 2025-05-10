from __future__ import annotations 
from typing import Optional
from v1.models.user_db import UserDB
from monstr.encrypt import Keys
from v1.config.database import get_database
from typing import TYPE_CHECKING
if TYPE_CHECKING:
    from v1.processors.user import User

async def create_user(display_name: str, uuid: str) -> "User":
    """Creates a new user and stores it in MongoDB."""
    # Create nostr keys for the user
    nostr_keys = Keys()

    # Create the database entry
    user_db = UserDB(
        display_name=display_name,
        uuid=uuid,
        nostr_public_key=nostr_keys.public_key_hex(),
        nostr_private_key=nostr_keys.private_key_hex(),
        joined_chats=[]
    )

    # Store in MongoDB
    db = await get_database()
    await db.users.insert_one(user_db.dict())

    # Return a full User instance
    return _user_db_to_user(user_db)

async def get_user(uuid: str) -> Optional["User"]:
    """Retrieves a user from MongoDB and returns a full User instance."""
    db = await get_database()
    user_data = await db.users.find_one({"uuid": uuid})
    if not user_data:
        return None

    user_db = UserDB(**user_data)
    return _user_db_to_user(user_db)

def _user_db_to_user(user_db: UserDB) -> "User":
    """Converts a UserDB instance to a full User instance."""
    # Create a new User instance
    user = User(user_db.display_name, user_db.uuid)

    # Set up the nostr keys
    user.nostr_key = Keys()
    user.nostr_key.private_key = user_db.nostr_private_key
    user.nostr_key.public_key = user_db.nostr_public_key

    # Set the joined chats
    user.joined_chats = user_db.joined_chats.copy()

    return user

async def save_user(user: "User") -> None:
    """Saves the current state of a User instance back to MongoDB."""
    user_db = UserDB(
        display_name=user.display_name,
        uuid=user.uuid,
        nostr_public_key=user.nostr_key.public_key_hex(),
        nostr_private_key=user.nostr_key.private_key_hex(),
        joined_chats=user.joined_chats.copy()
    )

    db = await get_database()
    await db.users.update_one(
        {"uuid": user.uuid},
        {"$set": user_db.dict()},
        upsert=True
    )