# billing-service

Java 21 / Spring Boot 3 service handling invoices and payments.
Listens to the `policy.created` Kafka topic (published by policy-service) and
automatically generates the first invoice for a new policy.

## Run locally
```bash
mvn spring-boot:run
```

## Endpoints
- `GET /api/billing/invoices` — list the logged-in user's invoices
- `POST /api/billing/invoices/{id}/pay` — mark an invoice as paid
