from fastapi import FastAPI, HTTPException
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel
from typing import Optional, List
import os
from dotenv import load_dotenv
from bson import ObjectId
from datetime import datetime

load_dotenv()

app = FastAPI(title="User Management API")

# MongoDB connection
MONGODB_URL = os.getenv("MONGODB_URL", "mongodb://mongodb:27017")
client = AsyncIOMotorClient(MONGODB_URL)
db = client.user_db
users_collection = db.users
chats_collection = db.chats

class Message(BaseModel):
    content: str
    sent_at: datetime = datetime.now()
    sender_id: str

class Chat(BaseModel):
    uuid: str
    name: str
    messages: List[Message] = []
    participants: List[str] = []

class User(BaseModel):
    display_name: str
    uuid: Optional[str] = None
    joined_chats: List[str] = []
    nostr_key: Optional[str] = None

    @classmethod
    def from_legacy(cls, name: str, age: Optional[int] = None):
        return cls(
            display_name=name,
            uuid=str(ObjectId()),
            age=age
        )

class UserInDB(User):
    id: str

@app.post("/v2/users/", response_model=UserInDB)
async def create_user(user: User):
    # If uuid is not provided, generate one
    if user.uuid is None:
        user.uuid = str(ObjectId())

    # Insert user
    user_dict = user.dict()
    result = await users_collection.insert_one(user_dict)
    created_user = await users_collection.find_one({"_id": result.inserted_id})
    return UserInDB(**created_user, id=str(created_user["_id"]))

# Add a legacy endpoint for backward compatibility
@app.post("/v2/users/legacy/", response_model=UserInDB)
async def create_legacy_user(name: str, age: Optional[int] = None):
    user = User.from_legacy(name=name, age=age)
    return await create_user(user)

@app.get("/v2/users/", response_model=List[UserInDB])
async def get_users():
    users = []
    cursor = users_collection.find()
    async for document in cursor:
        document["id"] = str(document.pop("_id"))
        users.append(UserInDB(**document))
    return users

@app.get("/v2/users/{user_id}", response_model=UserInDB)
async def get_user(user_id: str):
    user = await users_collection.find_one({"uuid": user_id})
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    user["id"] = str(user.pop("_id"))
    return UserInDB(**user)

@app.get("/v2/users/last/", response_model=UserInDB)
async def get_last_user():
    # Find the last created user by _id (which is automatically ordered by creation time)
    user = await users_collection.find_one(sort=[("_id", -1)])
    if user is None:
        raise HTTPException(status_code=404, detail="No users found in database")
    user["id"] = str(user.pop("_id"))
    return UserInDB(**user)

@app.get("/v2/users/search/{display_name}", response_model=List[UserInDB])
async def search_users(display_name: str):
    # Case-insensitive search for users by display name
    users = []
    cursor = users_collection.find(
        {"display_name": {"$regex": display_name, "$options": "i"}}
    )
    async for document in cursor:
        document["id"] = str(document.pop("_id"))
        users.append(UserInDB(**document))
    return users

@app.post("/v2/users/{user_id}/join-chat/{chat_id}")
async def join_chat(user_id: str, chat_id: str):
    user = await users_collection.find_one({"uuid": user_id})
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")

    chat = await chats_collection.find_one({"uuid": chat_id})
    if chat is None:
        raise HTTPException(status_code=404, detail="Chat not found")

    if chat_id in user.get("joined_chats", []):
        raise HTTPException(status_code=400, detail=f"User {user_id} is already in chat {chat_id}")

    # Update user's joined chats
    await users_collection.update_one(
        {"uuid": user_id},
        {"$push": {"joined_chats": chat_id}}
    )

    # Update chat's participants
    await chats_collection.update_one(
        {"uuid": chat_id},
        {"$push": {"participants": user_id}}
    )

    return {"message": f"User {user_id} joined chat {chat_id}"}

@app.post("/v2/users/{user_id}/leave-chat/{chat_id}")
async def leave_chat(user_id: str, chat_id: str):
    user = await users_collection.find_one({"uuid": user_id})
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")

    chat = await chats_collection.find_one({"uuid": chat_id})
    if chat is None:
        raise HTTPException(status_code=404, detail="Chat not found")

    if chat_id not in user.get("joined_chats", []):
        raise HTTPException(status_code=400, detail=f"User {user_id} isn't in chat {chat_id}")

    # Update user's joined chats
    await users_collection.update_one(
        {"uuid": user_id},
        {"$pull": {"joined_chats": chat_id}}
    )

    # Update chat's participants
    await chats_collection.update_one(
        {"uuid": chat_id},
        {"$pull": {"participants": user_id}}
    )

    return {"message": f"User {user_id} left chat {chat_id}"}

@app.get("/v2/users/{user_id}/chat-feed")
async def get_chat_feed(user_id: str):
    user = await users_collection.find_one({"uuid": user_id})
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")

    feed = []
    for chat_id in user.get("joined_chats", []):
        chat = await chats_collection.find_one({"uuid": chat_id})
        if chat and chat.get("messages"):
            last_message = chat["messages"][-1]
            feed.append({
                "chat_id": chat_id,
                "message": last_message
            })

    # Sort by message timestamp
    feed.sort(key=lambda x: x["message"]["sent_at"], reverse=True)
    return feed

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)