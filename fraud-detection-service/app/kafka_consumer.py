"""
Consumes claim.submitted, scores it, publishes claim.scored.

SIMPLIFICATION (called out honestly, not hidden): a real fraud-detection-service would call
policy-service (or read from a shared read-replica/event-sourced view) to get the policy's
actual start date. Here we derive a stand-in "policy age" from the policy number itself just
so the whole pipeline is runnable end-to-end without you having to wire up that extra
cross-service call for a learning project. The comment in scoring.py explains the real rule;
this is just how we get a number to feed it in this demo.
"""

import json
import logging
from kafka import KafkaConsumer, KafkaProducer

from app.scoring import score_claim

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("fraud-detection-service")


def fake_policy_age_days(policy_number: str) -> int:
    # Deterministic stand-in so the same policy number always scores the same way
    return (sum(ord(c) for c in policy_number) * 7) % 400


def run_consumer(bootstrap_servers: str):
    consumer = KafkaConsumer(
        "claim.submitted",
        bootstrap_servers=bootstrap_servers,
        group_id="fraud-detection-service",
        value_deserializer=lambda v: json.loads(v.decode("utf-8")),
        auto_offset_reset="earliest",
    )
    producer = KafkaProducer(
        bootstrap_servers=bootstrap_servers,
        value_serializer=lambda v: json.dumps(v).encode("utf-8"),
    )

    logger.info("fraud-detection-service: listening on claim.submitted")

    for message in consumer:
        event = message.value
        try:
            policy_age_days = fake_policy_age_days(event["policyNumber"])
            result = score_claim(
                claim_type=event["claimType"],
                amount_claimed=float(event["amountClaimed"]),
                policy_age_days=policy_age_days,
            )
            output = {
                "claimNumber": event["claimNumber"],
                "policyNumber": event["policyNumber"],
                "ownerEmail": event["ownerEmail"],
                "fraudScore": result["fraud_score"],
                "reasons": result["reasons"],
            }
            producer.send("claim.scored", value=output)
            producer.flush()
            logger.info("Scored claim %s -> %s", event["claimNumber"], result["fraud_score"])
        except Exception:
            logger.exception("Failed to score claim event: %s", event)
