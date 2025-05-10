from v1.processors.chat import get_chat, Chat, Message
from utils.rofl_status import RoflStatus
from monstr.encrypt import Keys
from v1.processors.users import save_user

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
            return RoflStatus.ERROR.create(f"User {self.uuid} is already in chat {chat_id}")
        chat = await get_chat(chat_id)
        if not chat:
            return RoflStatus.ERROR.create(f"Chat {chat_id} not found")
        self.joined_chats.append(chat.uuid)
        # Save the updated state
        await save_user(self)
        return await chat.join_chat(self)

    async def leave_chat(self, chat_id: str) -> "RoflStatus":
        if chat_id not in self.joined_chats:
            return RoflStatus.ERROR.create(f"User {self.uuid} isn't in chat {chat_id}")
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
        chat: Chat = Chat.create(self, name=name, description=description, image_url=image_url)
        self.join_chat(chat.uuid)
        return RoflStatus.SUCCESS.create(f"Created new chat {chat.uuid} successfully!!!")
