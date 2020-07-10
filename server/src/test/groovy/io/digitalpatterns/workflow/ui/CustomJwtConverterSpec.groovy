package io.digitalpatterns.workflow.ui

import io.digitalpatterns.workflow.ui.CustomJwtConverter
import org.springframework.security.oauth2.jwt.Jwt
import spock.lang.Specification

import static org.springframework.security.oauth2.jwt.JwtClaimNames.SUB

class CustomJwtConverterSpec extends Specification {

    CustomJwtConverter converter = new CustomJwtConverter()
    def 'can convert to authentication'() {
        given: 'jwt'
        Jwt jwt = Jwt.withTokenValue('token')
                .header("alg", "none")
                .claim(SUB, "user")
                .claim("email", "email")
                .claim("realm_access", [
                        'roles' : ['test']
                ])
                .claim("scope", "read").build()

        when:'converter is invoked'
        def result = converter.convert(jwt)

        then:
        result.authorities.size() != 0

    }
}
