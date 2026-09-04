package com.insurenext.policy;

import com.insurenext.policy.service.PremiumCalculator;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.assertEquals;

class PremiumCalculatorTest {

    private final PremiumCalculator calculator = new PremiumCalculator();

    @Test
    void autoPolicyUsesFourPercentAnnualRate() {
        BigDecimal premium = calculator.calculateMonthlyPremium("AUTO", new BigDecimal("12000"));
        // 12000 * 0.04 = 480/year -> 40.00/month
        assertEquals(new BigDecimal("40.00"), premium);
    }

    @Test
    void homePolicyUsesTwoPercentAnnualRate() {
        BigDecimal premium = calculator.calculateMonthlyPremium("HOME", new BigDecimal("300000"));
        // 300000 * 0.02 = 6000/year -> 500.00/month
        assertEquals(new BigDecimal("500.00"), premium);
    }
}
