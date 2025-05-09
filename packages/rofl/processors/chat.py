import uuid
import time
from user import User

class Message:
    def __init__(self, sender: str, message: str):
        self.sender = sender
        self.message = message
        self.uuid = str(uuid.uuid4())
        self.sent_at = time.time()

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

    def new_message(self, user: "User", message: str):
        new_user_message = Message(user.uuid, message)
        self.messages.append(new_user_message)
        self.amount_of_messages += 1

    def join_chat(self, user: "User"):
        self.members.append(user.uuid)
        self.amount_of_members += 1

    def leave_chat(self, user: "User"):
        self.members.remove(user.uuid)
        self.amount_of_members -= 1

