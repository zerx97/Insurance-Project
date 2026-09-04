FROM python:3.12-slim AS base
WORKDIR /app

# Non-root user, same principle as the Java/Node Dockerfiles in this repo
RUN useradd --create-home appuser
COPY requirements.txt .
RUN pip install --no-cache-dir --break-system-packages -r requirements.txt

COPY app ./app
USER appuser
EXPOSE 8086
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8086"]
