from __future__ import annotations
import uuid
import time
import json
from utils.rofl_status import RoflStatus
from monstr.client.client import Client
from monstr.event.event import Event
from typing import TYPE_CHECKING, Optional
import asyncio

if TYPE_CHECKING:
    from v1.processors.user import User

nostr_url = "ws://monstr:8082"

class Message:
    def __init__(self, sender: str, message: str, chat_id: str):
        self.sender = sender
        self.message = message
        self.uuid = str(uuid.uuid4())
        self.sent_at = time.time()
        self.chat_id = chat_id

class Chat:
    def __init__(self, creator: str, name: str, description: str, channel_id: str):
        self.creator = creator
        self.name = name
        self.description = description
        self.messages = []
        self.last_msg_at = time.time()
        self.amount_of_members = 0
        self.amount_of_messages = 0
        self.members = []
        self.uuid = channel_id
        
    #async def save(self):
        #"""This method is kept for compatibility with existing code.
        #All data is already stored in Nostr, so no additional saving is needed."""
        ## No database operations needed - all data is stored in Nostr
        #pass

    @classmethod
    async def create(cls, creator: "User", name: str, description: str = "", image_url: str = "") -> "Chat":
        async with Client(nostr_url) as client:
            await client.wait_connect()

            channel_evt = Event(
                kind=Event.KIND_CHANNEL_CREATE,   # 40
                content=json.dumps({
                    "name": name,
                    "about": description,
                    "picture": image_url
                }),
                pub_key=creator.nostr_key.public_key_hex()
            )
            channel_evt.sign(creator.nostr_key.private_key_hex())
            client.publish(channel_evt)

        # the real channel ID is the *event hash*
        chat = cls(
            creator=creator.uuid,
            name=name,
            description=description,
            channel_id=channel_evt.id     # <-- store it here
        )
        return chat

    async def new_message(self, user: "User", message: str) -> "RoflStatus":
        if self.uuid not in user.joined_chats:
            return RoflStatus.ERROR.create(f"User {user.uuid} is not in this group {self.uuid}")
        new_user_message = Message(user.uuid, message, self.uuid)
        self.messages.append(new_user_message)
        self.amount_of_messages += 1
        self.last_msg_at = time.time()
        async with Client(nostr_url) as client:
            await client.wait_connect()
            msg_evt = Event(
                kind=Event.KIND_CHANNEL_MESSAGE,   # 42
                content=message,
                pub_key=user.nostr_key.public_key_hex(),
                tags=[["e", self.uuid, "", "root"]]   # self.uuid is now the hash
            )
            msg_evt.sign(user.nostr_key.private_key_hex())
            client.publish(msg_evt)
        return RoflStatus.SUCCESS.create(f"Managed to send the new message from {user.uuid}", new_user_message)

    async def join_chat(self, user: "User") -> "RoflStatus":
        self.members.append(user.uuid)
        self.amount_of_members += 1
        return RoflStatus.SUCCESS.create(f"User {user.uuid} joined the chat {self.uuid}")

    async def leave_chat(self, user: "User") -> "RoflStatus":
        # Use the user's Nostr pubkey instead of UUID for member list
        user_pubkey = user.nostr_key.public_key_hex()
        if user_pubkey not in self.members:
            return RoflStatus.ERROR.create(f"User {user.uuid} is not in chat {self.uuid}")
        self.members.remove(user_pubkey)
        self.amount_of_members -= 1
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
            return self.messages[self.amount_of_messages - 1]

async def get_chat(channel_id: str):
    async with Client(nostr_url) as client:
        await client.wait_connect()

        # 1. fetch the channel-create event
        chan = await client.query([{
            "kinds": [Event.KIND_CHANNEL_CREATE],
            "ids":   [channel_id]
        }])

        print(f"Chan: {chan}")

        if not chan:
            return None
        chan_evt = chan[0]
        meta = json.loads(chan_evt.content)

        print(f"Event {chan_evt}")

        chat = Chat(
            creator=chan_evt.pub_key,
            name=meta.get("name", ""),
            description=meta.get("about", ""),
            channel_id=channel_id
        )

        # 2. fetch messages
        notes = await client.query([{
            "kinds": [Event.KIND_CHANNEL_MESSAGE],
            "#e":   [channel_id]
        }])
        chat.messages = [Message(m.pub_key, m.content, channel_id) for m in notes]
        chat.amount_of_messages = len(chat.messages)

        # 3. fetch channel metadata to get members
        metadata = await client.query([{
            "kinds": [Event.KIND_CHANNEL_META],
            "#e": [channel_id]
        }])

        # Add all unique pubkeys from messages and metadata as members
        members = set()
        for msg in notes:
            members.add(msg.pub_key)
        for meta in metadata:
            members.add(meta.pub_key)

        # For now, we'll just use the pubkeys as member IDs since we don't have a UUID mapping
        chat.members = list(members)
        chat.amount_of_members = len(chat.members)

        return chat