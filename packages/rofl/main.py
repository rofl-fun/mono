from fastapi import FastAPI
from v1.processors.user import User
from utils.rofl_status import RoflStatus

app = FastAPI()

@app.get("/")
def idle():
    return {"status": "i'm alive"}

@app.post("/v1/user/new")
async def new_user(uuid="aa", display_name=id):
    res  = await User.create(display_name=display_name, uuid=uuid)
    return res

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

