# auth-service

Java 21 / Spring Boot 3 service handling registration, login, and JWT issuing for InsureNext.

## Run locally
```bash
mvn spring-boot:run
```

## Run tests
```bash
mvn test
```

## Endpoints
- `POST /api/auth/register` — create an account
- `POST /api/auth/login` — get a JWT
- `GET /api/auth/health` — liveness check
- `GET /actuator/health` — Kubernetes-style health probe
- `GET /actuator/prometheus` — Prometheus metrics scrape endpoint
