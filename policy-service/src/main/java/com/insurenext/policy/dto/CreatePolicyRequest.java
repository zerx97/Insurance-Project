package com.insurenext.policy.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;
import java.time.LocalDate;

public record CreatePolicyRequest(
    @NotBlank String policyType,
    @NotNull @Positive BigDecimal coverageAmount,
    @NotNull LocalDate startDate,
    @NotNull LocalDate endDate
) {}
