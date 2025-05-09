FROM python:alpine3.17

WORKDIR /
COPY ./main.py ./requirements.txt /
RUN pip install -r requirements.txt

ENTRYPOINT ["python", "main.py"]