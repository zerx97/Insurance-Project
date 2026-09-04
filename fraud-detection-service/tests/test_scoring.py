from app.scoring import score_claim


def test_new_policy_large_claim_scores_high():
    result = score_claim(claim_type="AUTO", amount_claimed=25000, policy_age_days=5)
    assert result["fraud_score"] >= 70
    assert any("days old" in r for r in result["reasons"])


def test_established_policy_small_claim_scores_low():
    result = score_claim(claim_type="AUTO", amount_claimed=1500, policy_age_days=500)
    assert result["fraud_score"] < 30


def test_round_number_adds_a_small_penalty():
    round_result = score_claim(claim_type="HOME", amount_claimed=5000, policy_age_days=500)
    non_round_result = score_claim(claim_type="HOME", amount_claimed=5123, policy_age_days=500)
    assert round_result["fraud_score"] > non_round_result["fraud_score"]
