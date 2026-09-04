"""
FastAPI app for fraud-detection-service.

Exposes:
  - POST /score        -> synchronous scoring (useful for manual testing / an admin tool)
  - GET  /health        -> liveness probe
  - GET  /metrics        -> Prometheus metrics
  - a background thread running the Kafka consumer loop (async event-driven path,
    the one actually used by claims-service in the real pipeline)
"""

import os
import threading

from fastapi import FastAPI
from prometheus_client import Counter, generate_latest, CONTENT_TYPE_LATEST
from starlette.responses import Response
from pydantic import BaseModel, Field

from app.scoring import score_claim
from app.kafka_consumer import run_consumer

app = FastAPI(title="InsureNext Fraud Detection Service", version="1.0.0")

claims_scored_total = Counter("claims_scored_total", "Total number of claims scored")


class ScoreRequest(BaseModel):
    claim_type: str = Field(..., examples=["AUTO"])
    amount_claimed: float = Field(..., gt=0)
    policy_age_days: int = Field(..., ge=0)


@app.post("/score")
def score(request: ScoreRequest):
    result = score_claim(request.claim_type, request.amount_claimed, request.policy_age_days)
    claims_scored_total.inc()
    return result


@app.get("/health")
def health():
    return {"status": "fraud-detection-service is running"}


@app.get("/metrics")
def metrics():
    return Response(generate_latest(), media_type=CONTENT_TYPE_LATEST)


def start_kafka_consumer_in_background():
    bootstrap_servers = os.getenv("KAFKA_BROKERS", "localhost:9092")
    thread = threading.Thread(target=run_consumer, args=(bootstrap_servers,), daemon=True)
    thread.start()


@app.on_event("startup")
def on_startup():
    try:
        start_kafka_consumer_in_background()
    except Exception as e:
        print(f"Kafka consumer failed to start (continuing without it): {e}")
