package io.digitalpatterns.workflow.ui;

import lombok.Data;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@Slf4j
@RequestMapping(path = "/api/log")
public class LogController {

    @PostMapping
    @ResponseStatus(HttpStatus.OK)
    public void log(@RequestBody LogStatement statement) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        statement.setUserId(authentication.getName());
        switch (statement.level) {
            case "INFO":
                log.info("{} - userId: '{}' - path: '{}'", statement.message, statement.userId, statement.path);
                break;
            case "ERROR":
                log.error("{} - userId: '{}' - path: '{}' - componentStack: '{}'", statement.message, statement.userId,
                        statement.path, statement.componentStack);
                break;
            default:
                log.debug("{} - userId: '{}' - path: '{}' ", statement.message, statement.userId, statement.path);
        }

    }

    @Data
    public static class LogStatement {
        private String level;
        private Object message;
        private String userId;
        private String path;
        private Object componentStack;
    }
}
