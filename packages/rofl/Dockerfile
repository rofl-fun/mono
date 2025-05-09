FROM python:3.10-alpine3.17

# Install system dependencies
RUN apk add --no-cache \
    pkgconf \
    gcc \
    musl-dev \
    libffi-dev \
    openssl-dev

WORKDIR /
COPY ./main.py ./requirements.txt /
RUN pip install -r requirements.txt

ENTRYPOINT ["python", "main.py"]