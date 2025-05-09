import uuid
import time
from v1.processors.user import User
from utils.rofl_status import RoflStatus

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
    def __init__(self, creator: str, name: str, description: str):
        self.creator = creator
        self.name = name
        self.description = description
        self.messages = []
        self.uuid = str(uuid.uuid4())
        self.last_msg_at = time.time()
        self.amount_of_members = 0
        self.amount_of_messages = 0
        self.members = []

    def new_message(self, user: "User", message: str) -> RoflStatus:
        new_user_message = Message(user.uuid, message, self.uuid)
        self.messages.append(new_user_message)
        self.amount_of_messages += 1
        return RoflStatus.SUCCESS.create(f"Managed to send the new message from {user.uuid}", new_user_message)

    def join_chat(self, user: "User") -> RoflStatus:
        self.members.append(user.uuid)
        self.amount_of_members += 1
        return RoflStatus.SUCCESS.create(f"User {user.uuid} joined the chat {self.uuid}")

    def leave_chat(self, user: "User"):
        self.members.remove(user.uuid)
        self.amount_of_members -= 1
        return RoflStatus.SUCCESS.create(f"User {user.uuid} left the chat {self.uuid}")

    def get_messages(self) -> RoflStatus:
        if self.amount_of_messages == 0:
            return RoflStatus.ERROR.create(f"{self.uuid} don't have any messages yet")
        else:
            return RoflStatus.SUCCESS.create(f"Got the messages from {self.uuid}", self.messages)

    def get_last_message(self) -> "Message" | None:
        if self.amount_of_messages == 0:
            return None
        else:
            return self.message[self.amount_of_messages - 1]

class MasterChatVault:
    def add_chat(self, id: str):
        self.chats.append(id)

    def get_chats(self):
        return self.chats