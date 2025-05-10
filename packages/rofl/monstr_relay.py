import asyncio
import logging
#from monstr.relay.relay import Relay
#import httpx
#import socket

#async def run_relay():
    #r = Relay()
    #await r.start(host="0.0.0.0", port=8080)

#if __name__ == '__main__':
    #logging.getLogger().setLevel(logging.DEBUG)
    #asyncio.run(run_relay())



from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def idle():
    return {"status": "i'm alive"}

