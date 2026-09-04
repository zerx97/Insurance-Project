package com.insurenext.policy.messaging;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.insurenext.policy.dto.PolicyCreatedEvent;
import com.insurenext.policy.entity.Policy;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

@Component
public class PolicyEventPublisher {

    private static final Logger log = LoggerFactory.getLogger(PolicyEventPublisher.class);
    private static final String TOPIC = "policy.created";

    private final KafkaTemplate<String, String> kafkaTemplate;
    private final ObjectMapper objectMapper;

    public PolicyEventPublisher(KafkaTemplate<String, String> kafkaTemplate, ObjectMapper objectMapper) {
        this.kafkaTemplate = kafkaTemplate;
        this.objectMapper = objectMapper;
    }

    // Fire-and-forget publish: policy-service does not wait for billing-service or
    // notification-service to do anything. This is the whole point of using Kafka here —
    // the services that create the record and the services that react to it are decoupled.
    public void publishPolicyCreated(Policy policy) {
        try {
            PolicyCreatedEvent event = new PolicyCreatedEvent(
                    policy.getPolicyNumber(),
                    policy.getOwnerEmail(),
                    policy.getPolicyType(),
                    policy.getMonthlyPremium()
            );
            String payload = objectMapper.writeValueAsString(event);
            kafkaTemplate.send(TOPIC, policy.getPolicyNumber(), payload);
            log.info("Published policy.created for {}", policy.getPolicyNumber());
        } catch (Exception e) {
            log.error("Failed to publish policy.created event for {}", policy.getPolicyNumber(), e);
        }
    }
}
