package com.insurenext.auth;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest
@ActiveProfiles("test")
class AuthServiceApplicationTests {

    @Test
    void contextLoads() {
        // Verifies the Spring application context wires up correctly end-to-end
        // (security config, JPA, Flyway against H2) — this is the cheapest, highest-value
        // test in any Spring Boot service: if this fails, nothing else matters yet.
    }
}
