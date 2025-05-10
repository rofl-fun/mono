import asyncio
import logging
from monstr.relay.relay import Relay

async def run_relay():
    r = Relay()
    await r.start(host="0.0.0.0", port=8082)

if __name__ == '__main__':
    logging.getLogger().setLevel(logging.DEBUG)
    asyncio.run(run_relay())
