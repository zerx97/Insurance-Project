"""
Rule-based fraud scoring engine.

This is deliberately a transparent, explainable rule engine — not a trained ML model —
so you can see exactly why a claim got the score it did. In a real insurer, this file
would eventually be replaced (or augmented) by a trained model (e.g. a gradient-boosted
tree via scikit-learn/XGBoost) served from here. Python is the industry-standard language
for this exact reason: this is where the data science team's work plugs in.

The score is 0-100. 70+ means "flag for human review" (see claims-service's consumer).
"""

from datetime import datetime


def score_claim(claim_type: str, amount_claimed: float, policy_age_days: int) -> dict:
    score = 0.0
    reasons: list[str] = []

    # Rule 1: a very large claim relative to typical amounts is inherently higher risk
    high_value_thresholds = {
        "AUTO": 20000,
        "HOME": 50000,
        "LIFE": 100000,
        "HEALTH": 30000,
    }
    threshold = high_value_thresholds.get(claim_type.upper(), 25000)
    if amount_claimed > threshold:
        score += 35
        reasons.append(f"Claim amount (${amount_claimed:,.2f}) exceeds typical threshold for {claim_type}")

    # Rule 2: claims filed very soon after a policy starts are statistically more likely
    # to be fraudulent (the "new policy, immediate claim" pattern insurers watch closely)
    if policy_age_days < 30:
        score += 40
        reasons.append(f"Policy is only {policy_age_days} days old")
    elif policy_age_days < 90:
        score += 15
        reasons.append(f"Policy is relatively new ({policy_age_days} days old)")

    # Rule 3: round-number claims are a classic (weak, but real) fraud signal
    if amount_claimed % 1000 == 0 and amount_claimed > 0:
        score += 10
        reasons.append("Claimed amount is a suspiciously round number")

    score = min(score, 100.0)

    return {
        "fraud_score": round(score, 2),
        "reasons": reasons,
        "scored_at": datetime.utcnow().isoformat() + "Z",
    }
