import asyncio
import logging
from monstr.relay.relay import Relay

async def run_relay():
    r = Relay()
    await r.start()

if __name__ == '__main__':
    logging.getLogger().setLevel(logging.DEBUG)
    asyncio.run(run_relay())

from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def idle():
    return {"status": "i'm alive"}

