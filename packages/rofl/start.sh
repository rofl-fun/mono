#!/bin/sh

# Start the FastAPI app in the background
uvicorn main:app --host 0.0.0.0 --port 8080 &

# Start the Monstr relay
python monstr_relay.py

# Keep the container running
wait 