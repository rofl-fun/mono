from pydantic import BaseModel
from typing import List

class ChatDB(BaseModel):
    """Database model for storing chat information.
    Only contains essential information needed to recreate a Chat instance.
    """
    uuid: str
    creator: str  # UUID of the creator
    name: str
    description: str
    messages: List[dict]  # List of message dictionaries
    last_msg_at: float
    amount_of_members: int
    amount_of_messages: int
    members: List[str]  # List of member UUIDs