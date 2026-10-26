package com.example.visitor;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Main entry point for the Smart Visitor Verification System Backend.
 *
 * @SpringBootApplication is a convenience annotation that combines:
 * 1. @Configuration: Tags the class as a source of bean definitions for the application context.
 * 2. @EnableAutoConfiguration: Tells Spring Boot to start adding beans based on classpath settings.
 * 3. @ComponentScan: Tells Spring to look for other components, configurations, and services in the com.example.visitor package.
 */
@SpringBootApplication
public class SmartVisitorApplication {

    public static void main(String[] args) {
        SpringApplication.run(SmartVisitorApplication.class, args);
        System.out.println("=================================================");
        System.out.println(" Smart Visitor Verification Backend Started! ");
        System.out.println(" Server URL: http://localhost:8080               ");
        System.out.println(" API Base:   http://localhost:8080/api           ");
        System.out.println("=================================================");
    }
}
