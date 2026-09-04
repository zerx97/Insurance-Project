package com.insurenext.billing.dto;

import java.math.BigDecimal;

// Mirrors the event payload that policy-service publishes to the "policy.created" Kafka topic.
// Deliberately a plain DTO, not a shared library between services — in a polyglot microservice
// system, each service owns its own copy of the event shape. A shared "common" library that every
// language has to depend on quietly turns into a distributed monolith.
public record PolicyCreatedEvent(
    String policyNumber,
    String ownerEmail,
    String policyType,
    BigDecimal monthlyPremium
) {}
