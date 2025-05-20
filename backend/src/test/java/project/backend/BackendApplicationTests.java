package project.backend;

import org.junit.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import project.backend.config.TestSecurityConfig;

@SpringBootTest(classes = { BackendApplication.class })
@Import(TestSecurityConfig.class)
public class BackendApplicationTests {

    @Test
    void contextLoads() {
    }
}