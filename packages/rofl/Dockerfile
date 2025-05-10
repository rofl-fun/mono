FROM python:3.10-alpine3.17

# Install system dependencies
RUN apk add --no-cache \
    pkgconf \
    gcc \
    musl-dev \
    libffi-dev \
    openssl-dev

WORKDIR /app
COPY . .
RUN pip install -r requirements.txt

# Expose the port
EXPOSE 8080

# Set environment variable to bind to all interfaces
ENV HOST=0.0.0.0

# Use uvicorn to run the FastAPI application
CMD ["uvicorn", "monstr_relay:app", "--host", "0.0.0.0", "--port", "8080"]
#CMD ["python", "monstr_relay.py"]