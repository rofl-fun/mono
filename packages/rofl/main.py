#from uuid import UUID
from pydantic import BaseModel
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from v1.processors.user import User
from utils.rofl_status import RoflStatus, Error as RoflError

class NewUser(BaseModel):
    uuid: str
    display_name: str

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

#@app.post("/v1/user/new")
#async def new_user(uuid: str, display_name: str):
    #return {"uuid": uuid, "display_name": display_name}
    #res = await User.create(display_name=display_name, uuid=uuid)
    #return res

# @app.post("/v1/join")
# def join_group():
    # pass

# @app.post("/v1/leave")
# def leave_group():
    # pass

# @app.post("/v1/message")
# def message():
    # pass

# @app.get("/v1/chatfeedOf/{user}")
# def get_chat_feed_of(user: str):
    # pass

# @app.get("/v1/historyOf/{chat}")
# def get_history_of(chat: str):
    # pass

