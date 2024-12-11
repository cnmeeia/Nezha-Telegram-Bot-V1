FROM python:3.9-slim

WORKDIR /app

COPY . /app

RUN python3 -m venv /venv && \
    /venv/bin/pip install --no-cache-dir -r requirements.txt

ARG TELEGRAM_TOKEN
ENV TELEGRAM_TOKEN=$TELEGRAM_TOKEN

CMD ["/venv/bin/python", "/app/bot.py"]