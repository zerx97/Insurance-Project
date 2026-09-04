package com.insurenext.billing.messaging;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.insurenext.billing.dto.PolicyCreatedEvent;
import com.insurenext.billing.entity.Invoice;
import com.insurenext.billing.repository.InvoiceRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Component
public class PolicyEventListener {

    private static final Logger log = LoggerFactory.getLogger(PolicyEventListener.class);

    private final InvoiceRepository invoiceRepository;
    private final ObjectMapper objectMapper;

    public PolicyEventListener(InvoiceRepository invoiceRepository, ObjectMapper objectMapper) {
        this.invoiceRepository = invoiceRepository;
        this.objectMapper = objectMapper;
    }

    // Event-driven decoupling: billing-service never calls policy-service directly to ask
    // "was a policy just created?" — it just reacts whenever that event shows up. If billing-service
    // is down for 10 minutes, no policy creation fails; the messages simply wait in the topic.
    @KafkaListener(topics = "policy.created", groupId = "billing-service")
    public void onPolicyCreated(String message) {
        try {
            PolicyCreatedEvent event = objectMapper.readValue(message, PolicyCreatedEvent.class);
            Invoice invoice = new Invoice();
            invoice.setPolicyNumber(event.policyNumber());
            invoice.setOwnerEmail(event.ownerEmail());
            invoice.setAmountDue(event.monthlyPremium());
            invoice.setDueDate(LocalDate.now().plusDays(30));
            invoice.setStatus("PENDING");
            invoiceRepository.save(invoice);
            log.info("Created first invoice for policy {}", event.policyNumber());
        } catch (Exception e) {
            log.error("Failed to process policy.created event: {}", message, e);
        }
    }
}
