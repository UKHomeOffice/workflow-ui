package io.digitalpatterns.workflow.ui;

import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.zuul.EnableZuulProxy;

@Slf4j
@SpringBootApplication
@EnableZuulProxy
public class UIApplication {
    public static void main (String[] args) {
        log.info("Starting workflow ui...");
        SpringApplication.run(UIApplication.class, args);
    }
}
