# fraud-detection-service

Python / FastAPI service that scores insurance claims for fraud risk.
Consumes `claim.submitted` from Kafka, publishes `claim.scored`.

Uses a transparent rule-based engine (see `app/scoring.py`) rather than a trained model —
this is the natural place a real data science team would later plug in scikit-learn/XGBoost,
which is exactly why this service is Python and not Java or Node.

## Run locally
```bash
python -m venv venv
source venv/bin/activate
pip install -r requirements-dev.txt
uvicorn app.main:app --reload --port 8086
```

## Run tests
```bash
pytest
```

## Endpoints
- `POST /score` — synchronous scoring (manual testing)
- `GET /health` — liveness probe
- `GET /metrics` — Prometheus metrics
