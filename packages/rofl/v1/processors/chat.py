from __future__ import annotations
import uuid
import time
import json
from utils.rofl_status import RoflStatus
from monstr.client.client import Client
from monstr.event.event import Event
from typing import TYPE_CHECKING
from v1.config.database import get_database
from v1.models.chat_db import ChatDB

if TYPE_CHECKING:
    from v1.processors.user import User

nostr_url = "http://localhost:8082"

class Message:
    def __init__(self, sender: str, message: str, chat_id: str):
        self.sender = sender
        self.message = message
        self.uuid = str(uuid.uuid4())
        self.sent_at = time.time()
        self.chat_id = chat_id

def get_chat(id: str) -> "Chat":
    pass

class Chat:
    def __init__(self, creator: "User", name: str, description: str, id: str):
        self.creator = creator.uuid
        self.name = name
        self.description = description
        self.messages = []
        self.last_msg_at = time.time()
        self.amount_of_members = 0
        self.amount_of_messages = 0
        self.members = []
        self.uuid = id

    @classmethod
    async def create(cls, creator: "User", name: str, description: str = "", image_url: str = "") -> "Chat":
        async with Client(nostr_url) as client:
            event = Event(kind=Event.KIND_CHANNEL_CREATE,
                content=json.dumps({
                    "name": name,
                    "about": description,
                    "picture": image_url,
                }),
                pub_key=creator.nostr_key.public_key_hex())
            event.sign(creator.nostr_key.private_key_hex())
            client.publish(event)

        chat = cls(creator=creator, name=name, description=description, id=event.id)
        await chat.save()
        return chat

    async def save(self) -> None:
        """Saves the current state of the Chat instance to MongoDB."""
        chat_db = ChatDB(
            uuid=self.uuid,
            creator=self.creator,
            name=self.name,
            description=self.description,
            messages=[{
                "sender": msg.sender,
                "message": msg.message,
                "uuid": msg.uuid,
                "sent_at": msg.sent_at,
                "chat_id": msg.chat_id
            } for msg in self.messages],
            last_msg_at=self.last_msg_at,
            amount_of_members=self.amount_of_members,
            amount_of_messages=self.amount_of_messages,
            members=self.members.copy()
        )

        db = await get_database()
        await db.chats.update_one(
            {"uuid": self.uuid},
            {"$set": chat_db.dict()},
            upsert=True
        )

    async def new_message(self, user: "User", message: str) -> "RoflStatus":
        if self.uuid not in user.joined_chats:
            return RoflStatus.ERROR.create(f"User {user.uuid} is not in this group {self.uuid}")
        new_user_message = Message(user.uuid, message, self.uuid)
        self.messages.append(new_user_message)
        self.amount_of_messages += 1
        self.last_msg_at = time.time()

        # Async nostr operation
        async with Client(nostr_url) as client:
            # Create a nostr message
            event = Event(kind=Event.KIND_CHANNEL_MESSAGE,
                content=message,
                tags=[["e", self.uuid, "", "root"]],
                pub_key=user.nostr_key.public_key_hex())
            event.sign(user.nostr_key.private_key_hex())
            client.publish(event)

        await self.save()
        return RoflStatus.SUCCESS.create(f"Managed to send the new message from {user.uuid}", new_user_message)

    async def join_chat(self, user: "User") -> "RoflStatus":
        self.members.append(user.uuid)
        self.amount_of_members += 1
        await self.save()
        return RoflStatus.SUCCESS.create(f"User {user.uuid} joined the chat {self.uuid}")

    async def leave_chat(self, user: "User") -> "RoflStatus":
        self.members.remove(user.uuid)
        self.amount_of_members -= 1
        await self.save()
        return RoflStatus.SUCCESS.create(f"User {user.uuid} left the chat {self.uuid}")

    def get_messages(self) -> "RoflStatus":
        if self.amount_of_messages == 0:
            return RoflStatus.ERROR.create(f"{self.uuid} don't have any messages yet")
        else:
            return RoflStatus.SUCCESS.create(f"Got the messages from {self.uuid}", self.messages)

    def get_last_message(self) -> "Message" | None:
        if self.amount_of_messages == 0:
            return None
        else:
            return self.message[self.amount_of_messages - 1]
