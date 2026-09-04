package com.insurenext.policy.dto;

import java.math.BigDecimal;

public record PolicyCreatedEvent(
    String policyNumber,
    String ownerEmail,
    String policyType,
    BigDecimal monthlyPremium
) {}
