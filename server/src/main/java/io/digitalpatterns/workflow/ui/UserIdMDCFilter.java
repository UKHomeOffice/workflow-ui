package io.digitalpatterns.workflow.ui;

import lombok.extern.slf4j.Slf4j;
import org.slf4j.MDC;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@Component
@Slf4j
public class UserIdMDCFilter extends OncePerRequestFilter {
    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        try {
            final Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication != null) {
                MDC.put("userId", authentication.getName());
                log.debug("Executing {}", request.getRequestURI());
            }
            filterChain.doFilter(request, response);
        } finally {
            log.debug("Executed {}", request.getRequestURI());
            MDC.remove("userId");
        }

    }
}
