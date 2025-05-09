FROM python:alpine3.17

WORKDIR /main
COPY ./main.py ./requirements.txt /main
RUN pip install -r requirements.txt

ENTRYPOINT ["python", "main.py"]