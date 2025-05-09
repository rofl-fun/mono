import uuid
import time

class Message:
    def __init__(self, sender: str, message: str):
        self.sender = sender
        self.message = message
        self.message_uuid = str(uuid.uuid4())
        self.sent_at = time.time()

class Chat:
    def __init__(self, creator: str, name: str, description: str):
        self.creator = creator
        self.name = name
        self.description = description
        self.messages = []
        self.chat_uuid = str(uuid.uuid4())
        self.last_msg_at = time.time()
        self.amount_of_members = 0
        self.members = []
