package com.insurenext.policy.controller;

import com.insurenext.policy.dto.CreatePolicyRequest;
import com.insurenext.policy.entity.Policy;
import com.insurenext.policy.service.PolicyService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/policies")
public class PolicyController {

    private final PolicyService policyService;

    public PolicyController(PolicyService policyService) {
        this.policyService = policyService;
    }

    @PostMapping
    public ResponseEntity<Policy> create(@Valid @RequestBody CreatePolicyRequest request, Authentication auth) {
        String ownerEmail = auth.getName();
        return ResponseEntity.ok(policyService.createPolicy(ownerEmail, request));
    }

    @GetMapping("/mine")
    public ResponseEntity<List<Policy>> myPolicies(Authentication auth) {
        return ResponseEntity.ok(policyService.getPoliciesForOwner(auth.getName()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Policy> getById(@PathVariable Long id) {
        return ResponseEntity.ok(policyService.getPolicyById(id));
    }
}
