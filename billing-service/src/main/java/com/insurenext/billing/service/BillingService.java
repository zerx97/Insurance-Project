package com.insurenext.billing.service;

import com.insurenext.billing.entity.Invoice;
import com.insurenext.billing.exception.BillingException;
import com.insurenext.billing.repository.InvoiceRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BillingService {

    private final InvoiceRepository invoiceRepository;

    public BillingService(InvoiceRepository invoiceRepository) {
        this.invoiceRepository = invoiceRepository;
    }

    public List<Invoice> getInvoicesForOwner(String ownerEmail) {
        return invoiceRepository.findByOwnerEmail(ownerEmail);
    }

    public Invoice markAsPaid(Long invoiceId, String ownerEmail) {
        Invoice invoice = invoiceRepository.findById(invoiceId)
                .orElseThrow(() -> new BillingException("Invoice not found: " + invoiceId));
        if (!invoice.getOwnerEmail().equals(ownerEmail)) {
            throw new BillingException("This invoice does not belong to you");
        }
        invoice.setStatus("PAID");
        return invoiceRepository.save(invoice);
    }
}
