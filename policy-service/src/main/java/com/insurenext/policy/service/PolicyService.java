package com.insurenext.policy.service;

import com.insurenext.policy.dto.CreatePolicyRequest;
import com.insurenext.policy.entity.Policy;
import com.insurenext.policy.messaging.PolicyEventPublisher;
import com.insurenext.policy.repository.PolicyRepository;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class PolicyService {

    private final PolicyRepository policyRepository;
    private final PremiumCalculator premiumCalculator;
    private final PolicyEventPublisher eventPublisher;

    public PolicyService(PolicyRepository policyRepository, PremiumCalculator premiumCalculator,
                          PolicyEventPublisher eventPublisher) {
        this.policyRepository = policyRepository;
        this.premiumCalculator = premiumCalculator;
        this.eventPublisher = eventPublisher;
    }

    @CacheEvict(value = "policiesByOwner", key = "#ownerEmail")
    public Policy createPolicy(String ownerEmail, CreatePolicyRequest request) {
        Policy policy = new Policy();
        policy.setPolicyNumber("POL-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        policy.setOwnerEmail(ownerEmail);
        policy.setPolicyType(request.policyType().toUpperCase());
        policy.setCoverageAmount(request.coverageAmount());
        policy.setMonthlyPremium(premiumCalculator.calculateMonthlyPremium(request.policyType(), request.coverageAmount()));
        policy.setStartDate(request.startDate());
        policy.setEndDate(request.endDate());
        policy.setStatus("ACTIVE");
        Policy saved = policyRepository.save(policy);
        eventPublisher.publishPolicyCreated(saved);
        return saved;
    }

    // Cached in Redis: policy lookups happen far more often than policy creation
    // (dashboards, claims-service checking coverage, billing-service checking premium)
    // so this is exactly the kind of read that benefits most from a cache.
    @Cacheable(value = "policiesByOwner", key = "#ownerEmail")
    public List<Policy> getPoliciesForOwner(String ownerEmail) {
        return policyRepository.findByOwnerEmail(ownerEmail);
    }

    public Policy getPolicyById(Long id) {
        return policyRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Policy not found: " + id));
    }
}
