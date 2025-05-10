FROM python:3.10-alpine3.17

# Install system dependencies
RUN apk add --no-cache \
    pkgconf \
    gcc \
    musl-dev \
    libffi-dev \
    openssl-dev \
    make

WORKDIR /app
COPY . .
RUN pip install -r requirements.txt

# Make the start script executable
RUN chmod +x start.sh

# # Set environment variable to bind to all interfaces
# ENV HOST=0.0.0.0

# # Expose the ports
# EXPOSE 8080 8081 8082

# Use the start script to run both applications
# CMD ["./start.sh"]
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]