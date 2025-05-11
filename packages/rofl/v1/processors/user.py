from v1.processors.chat import get_chat, Chat, Message
from utils.rofl_status import RoflStatus
from monstr.encrypt import Keys
from typing import Optional
from v1.models.user_db import UserDB
from v1.config.database import get_database

class User:
    def __init__(self, display_name: str, uuid: str):
        self.display_name = display_name
        self.uuid = uuid
        self.joined_chats: list[str] = []
        self.nostr_key = Keys()

    def to_dict(self):
        return {
            "display_name": self.display_name,
            "uuid": self.uuid,
            "joined_chats": self.joined_chats
        }

    @classmethod
    async def create(cls, display_name: str, uuid: str) -> "RoflStatus":
        new_user = cls(display_name=display_name, uuid=uuid)
        await save_user(new_user)
        return RoflStatus.SUCCESS.create(f"Created User {new_user.uuid}", new_user.to_dict())

    async def join_chat(self, chat_id: str) -> "RoflStatus":
        if chat_id in self.joined_chats:
            return RoflStatus.ERROR.create(f"User {self.uuid} is already in chat {chat_id}", self.joined_chats)
        chat = await get_chat(chat_id)
        if not chat:
            return RoflStatus.ERROR.create(f"Chat {chat_id} not found")
        self.joined_chats.append(chat.uuid)
        # Save the updated state
        await save_user(self)
        return await chat.join_chat(self)

    async def leave_chat(self, chat_id: str) -> "RoflStatus":
        if chat_id not in self.joined_chats:
            return RoflStatus.ERROR.create(f"User {self.uuid} isn't in chat {chat_id}", self.joined_chats)
        chat = await get_chat(chat_id)
        if not chat:
            return RoflStatus.ERROR.create(f"Chat {chat_id} not found")
        self.joined_chats.remove(chat.uuid)
        # Save the updated state
        await save_user(self)
        return await chat.leave_chat(self)

    async def get_chat_feed(self) -> "RoflStatus":
        feed: list["Message"] = []
        for chat_id in self.joined_chats:
            chat = await get_chat(chat_id)
            if not chat:
                continue
            # Create a list of the chats that this user is in, but only get the last messages
            match chat.get_last_message():
                # If nothing is returned from current index, just skip :)
                case None:
                    continue
                # Else we're appending it to our result
                case entry:
                    feed.append(entry)

        # Sort it so that we get the recently active chats first
        feed.sort(key=lambda m: m.sent_at, reverse=True)

        # Return the result
        return RoflStatus.SUCCESS.create(f"Chatfeed of {self.uuid}:", feed)

    async def create_chat(self, name: str, description: str, image_url: str) -> "RoflStatus":
        chat: "Chat" = await Chat.create(self, name=name, description=description, image_url=image_url)
        await self.join_chat(chat.uuid)
        return RoflStatus.SUCCESS.create(f"Created new chat {chat.uuid} successfully!!!")

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
    user.nostr_key = Keys(user_db.nostr_private_key)

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