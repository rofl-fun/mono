from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def idle():
    return {"status": "i'm alive"}

