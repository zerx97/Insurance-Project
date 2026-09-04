# policy-service

Java 21 / Spring Boot 3 service for creating and managing insurance policies.
Validates JWTs issued by auth-service (shared secret for this learning setup —
see the comment in `JwtAuthFilter.java` for the production upgrade path).

## Run locally
```bash
mvn spring-boot:run
```

## Endpoints
- `POST /api/policies` — create a policy (requires `Authorization: Bearer <token>`)
- `GET /api/policies/mine` — list the logged-in user's policies (Redis-cached)
- `GET /api/policies/{id}` — get one policy by ID
