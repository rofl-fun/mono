from chat import get_chat, Chat, Message

class User:
    def __init__(self, display_name: str, uid: str):
        self.display_name = display_name
        self.uuid = uid
        self.joined_chats = []

    def join_chat(self, chat_id: str):
        chat: "Chat" = get_chat(chat_id)
        chat.join_chat(self.uuid)
        self.joined_chats.append(chat.uuid)

    def leave_chat(self, chat_id: str):
        chat: "Chat" = get_chat(chat_id)
        chat.leave_chat(self.uuid)
        self.joined_chats.remove(chat.uuid)

    def get_chat_feed(self) -> list["Chat"]:
        feed: list["Message"]  = []
        for i in len(self.joined_chats):
            feed.append(get_chat(self.joined_chats[i]).get_last_message())
        feed.sort(key=lambda m: m.sent_at, reverse=True)
