package com.insurenext.policy.service;

import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.math.RoundingMode;

// A deliberately simple, transparent rating engine — real insurers use far more sophisticated
// actuarial models (often a whole separate "rating service"), but the shape is the same:
// base rate per policy type, adjusted by a risk factor, divided into a monthly premium.
@Component
public class PremiumCalculator {

    public BigDecimal calculateMonthlyPremium(String policyType, BigDecimal coverageAmount) {
        BigDecimal baseRatePercent = switch (policyType.toUpperCase()) {
            case "AUTO" -> new BigDecimal("0.04");
            case "HOME" -> new BigDecimal("0.02");
            case "LIFE" -> new BigDecimal("0.015");
            case "HEALTH" -> new BigDecimal("0.06");
            default -> new BigDecimal("0.05");
        };
        BigDecimal annualPremium = coverageAmount.multiply(baseRatePercent);
        return annualPremium.divide(BigDecimal.valueOf(12), 2, RoundingMode.HALF_UP);
    }
}
