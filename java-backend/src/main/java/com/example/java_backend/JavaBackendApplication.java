/* package com.example.java_backend;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import com.example.java_backend.service.AuthService;

@SpringBootApplication
public class JavaBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(JavaBackendApplication.class, args);
    }

    // ✅ Spring will run this automatically at startup
    @Bean
    public CommandLineRunner initAdmin(AuthService authService) {
        return (args) -> {
            System.out.println("🔑 Checking for default admin...");
            authService.createDefaultAdmin();
            System.out.println("✅ Default admin ensured.");
        };
    }
}
*/
package com.example.java_backend;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import com.example.java_backend.service.AuthService;

@SpringBootApplication
public class JavaBackendApplication {

    public static void main(String[] args) {

        // ✅ Load .env file and inject values into System properties
        Dotenv dotenv = Dotenv.configure()
                .ignoreIfMissing() // won't crash if .env is missing
                .load();

        dotenv.entries().forEach(entry ->
                System.setProperty(entry.getKey(), entry.getValue())
        );

        SpringApplication.run(JavaBackendApplication.class, args);
    }

    // ✅ Spring will run this automatically at startup
    @Bean
    public CommandLineRunner initAdmin(AuthService authService) {
        return (args) -> {
            System.out.println("🔑 Checking for default admin...");
            authService.createDefaultAdmin();
            System.out.println("✅ Default admin ensured.");
        };
    }
}
