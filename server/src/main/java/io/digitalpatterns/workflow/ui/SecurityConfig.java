package io.digitalpatterns.workflow.ui;

import org.springframework.boot.autoconfigure.security.servlet.PathRequest;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.context.SecurityContextHolder;

@Configuration
@EnableWebSecurity
@EnableGlobalMethodSecurity(prePostEnabled = true)
public class SecurityConfig extends WebSecurityConfigurerAdapter {

    private Environment environment;

    public SecurityConfig(Environment environment) {
        this.environment = environment;
        SecurityContextHolder
                .setStrategyName(SecurityContextHolder.MODE_INHERITABLETHREADLOCAL);
    }

    public void configure(WebSecurity web) throws Exception {
        web.ignoring().antMatchers("/static/**");
    }


    protected void configure(HttpSecurity http) throws Exception {
        final Boolean isSSLEnabled = this.environment.getProperty("server.ssl.enabled", Boolean.class, false);
        if (isSSLEnabled) {
            http.requiresChannel().anyRequest().requiresSecure();
        }
        http
                .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS).and()
                .authorizeRequests()
                .antMatchers("/api/**").authenticated()
                .antMatchers("/ui/**").authenticated()
                .antMatchers("/actuator/**").permitAll()
                .antMatchers("/**").permitAll()
                .anyRequest().authenticated().and()
                .oauth2ResourceServer().jwt()
                .jwtAuthenticationConverter(new CustomJwtConverter());
    }
}
