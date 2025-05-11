from pydantic import BaseModel
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from v1.processors.user import get_user, User
from v1.processors.chat import get_chat, Chat, get_all_chats

class NewUser(BaseModel):
    uuid: str
    display_name: str

class ChatAction(BaseModel):
    chat_id: str
    user_id: str

class NewMessage(BaseModel):
    chat_id: str
    user_id: str
    message: str

class NewChat(BaseModel):
    user_id: str
    name: str
    description: str
    image_url: str

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def idle():
    return {"status": "i'm alive"}

@app.post("/v1/user/new")
async def new_user(user: NewUser):
    res = await User.create(display_name=user.display_name, uuid=user.uuid)
    return res

@app.post("/v1/join")
async def join_chat(params: ChatAction):
    user: "User" = await get_user(params.user_id)
    res = await user.join_chat(params.chat_id)
    return res

@app.post("/v1/leave")
async def leave_group(params: ChatAction):
    user: "User" = await get_user(params.user_id)
    res = await user.leave_chat(params.chat_id)
    return res

@app.post("/v1/message")
async def message(params: NewMessage):
    user: "User" = await get_user(params.user_id)
    if not user:
        return {"error": "User not found"}

    chat: "Chat" = await get_chat(params.chat_id)
    if not chat:
        return {"error": "Chat not found"}

    res = await chat.new_message(user, params.message)
    return res

@app.post("/v1/create/")
async def create_chat(params: NewChat):
    user: "User" = await get_user(params.user_id)
    res = await user.create_chat(params.name, params.description, params.image_url)
    return res

@app.get("/v1/chatfeedOf/{user}")
async def get_chat_feed_of(user: str):
    user_inst: "User" = await get_user(user)
    res = await user_inst.get_chat_feed()
    return res

@app.get("/v1/historyOf/{chat}")
async def get_history_of(chat: str):
    chat_inst: "Chat" = await get_chat(chat)
    return chat_inst

@app.get("/v1/chats")
async def get_chats():
    """Returns a list of all chat IDs that have been created."""
    chat_ids = await get_all_chats()
    return {"chats": chat_ids}

