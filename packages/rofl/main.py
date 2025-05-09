#from typing import Union

from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def idle():
    # Health check, easily test that api is live
    return {"status": "i'm alive"}

