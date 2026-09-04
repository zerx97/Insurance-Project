package com.insurenext.billing.repository;

import com.insurenext.billing.entity.Invoice;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface InvoiceRepository extends JpaRepository<Invoice, Long> {
    List<Invoice> findByOwnerEmail(String ownerEmail);
}
