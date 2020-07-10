package io.digitalpatterns.workflow.ui

import io.digitalpatterns.workflow.ui.LogController
import org.spockframework.spring.SpringBean
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest
import org.springframework.http.MediaType
import org.springframework.security.oauth2.jwt.Jwt
import org.springframework.security.oauth2.jwt.JwtDecoder
import org.springframework.security.test.context.support.WithMockUser
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders
import org.springframework.test.web.servlet.result.MockMvcResultMatchers
import org.springframework.test.web.servlet.setup.MockMvcBuilders
import org.springframework.web.context.WebApplicationContext
import spock.lang.Specification

import static org.springframework.security.oauth2.jwt.JwtClaimNames.SUB
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.jwt
import static org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity

@WebMvcTest(controllers = [LogController])
class LogControllerSpec extends Specification{

    @Autowired
    private WebApplicationContext context

    private MockMvc mvc

    @SpringBean
    private JwtDecoder jwtDecoder = Mock()


    def setup() {
        mvc = MockMvcBuilders
                .webAppContextSetup(context)
                .apply(springSecurity())
                .build()
    }

    @WithMockUser("user@user.com")
    def 'log debug'() {
        given: 'a jwt'
        Jwt token = Jwt.withTokenValue('token')
                .header("alg", "none")
                .claim(SUB, "user")
                .claim("email", "user@user.com")
                .claim("groups", ['test'])
                .claim("scope", "read").build()

        when: 'a request to log is made'
        def result = mvc.perform(MockMvcRequestBuilders.post('/api/log')
                .contentType(MediaType.APPLICATION_JSON)
                .content('''{
                                    "level" : "DEBUG",
                                    "message" : "Hello",
                                    "userId" : "user",
                                    "path" : "path"
                                    }''')
                .with(jwt().jwt(token))
                .contentType(MediaType.APPLICATION_JSON))

        then: 'result should be successful'
        result.andExpect(MockMvcResultMatchers.status().is2xxSuccessful())

    }

    @WithMockUser("user@user.com")
    def 'log info'() {
        given: 'a jwt'
        Jwt token = Jwt.withTokenValue('token')
                .header("alg", "none")
                .claim(SUB, "user")
                .claim("email", "user@user.com")
                .claim("groups", ['test'])
                .claim("scope", "read").build()

        when: 'a request to log is made'
        def result = mvc.perform(MockMvcRequestBuilders.post('/api/log')
                .contentType(MediaType.APPLICATION_JSON)
                .content('''{
                                    "level" : "INFO",
                                    "message" : "Hello",
                                    "userId" : "user",
                                    "path" : "path"
                                    }''')
                .with(jwt().jwt(token))
                .contentType(MediaType.APPLICATION_JSON))

        then: 'result should be successful'
        result.andExpect(MockMvcResultMatchers.status().is2xxSuccessful())

    }


    @WithMockUser("user@user.com")
    def 'log error'() {
        given: 'a jwt'
        Jwt token = Jwt.withTokenValue('token')
                .header("alg", "none")
                .claim(SUB, "user")
                .claim("email", "user@user.com")
                .claim("groups", ['test'])
                .claim("scope", "read").build()

        when: 'a request to log is made'
        def result = mvc.perform(MockMvcRequestBuilders.post('/api/log')
                .contentType(MediaType.APPLICATION_JSON)
                .content('''{
                                    "level" : "ERROR",
                                    "message" : "Hello",
                                    "userId" : "user",
                                    "path" : "path"
                                    }''')
                .with(jwt().jwt(token))
                .contentType(MediaType.APPLICATION_JSON))

        then: 'result should be successful'
        result.andExpect(MockMvcResultMatchers.status().is2xxSuccessful())

    }

}
