package io.digitalpatterns.workflow.ui

import com.github.tomakehurst.wiremock.junit.WireMockRule
import org.junit.ClassRule
import org.spockframework.spring.SpringBean
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.http.MediaType
import org.springframework.security.oauth2.jwt.Jwt
import org.springframework.security.oauth2.jwt.JwtDecoder
import org.springframework.security.test.context.support.WithMockUser
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders
import org.springframework.test.web.servlet.result.MockMvcResultMatchers
import org.springframework.test.web.servlet.setup.MockMvcBuilders
import org.springframework.web.client.RestTemplate
import org.springframework.web.context.WebApplicationContext
import spock.lang.Shared
import spock.lang.Specification

import static com.github.tomakehurst.wiremock.client.WireMock.*
import static org.springframework.security.oauth2.jwt.JwtClaimNames.SUB
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.jwt
import static org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity

@SpringBootTest
class TaskControllerSpec extends Specification {

    @Autowired
    private WebApplicationContext context

    private MockMvc mvc

    @SpringBean
    RestTemplate restTemplate = new RestTemplate()



    @ClassRule
    @Shared
    WireMockRule fileUploadService = new WireMockRule(9003)

    @ClassRule
    @Shared
    WireMockRule refDataService = new WireMockRule(9002)

    @ClassRule
    @Shared
    WireMockRule formService = new WireMockRule(4000)

    @ClassRule
    @Shared
    WireMockRule workflowService = new WireMockRule(8000)


    @SpringBean
    private JwtDecoder jwtDecoder = Mock()

    def setup() {
        mvc = MockMvcBuilders
                .webAppContextSetup(context)
                .apply(springSecurity())
                .build()
    }

    @WithMockUser("user@user.com")
    def 'can get task lite'() {
        given: 'a task is requested'
        workflowService.stubFor(
                get(urlEqualTo("/camunda/engine-rest/task/taskId"))
                .willReturn(aResponse().withStatus(200)
                .withBody('''{
                                     "id": "taskId",
                                     "processDefinitionId": "processDefinitionId"
                                    }'''))
        )

        workflowService.stubFor(
                get(urlEqualTo("/camunda/engine-rest/process-definition/processDefinitionId"))
                        .willReturn(aResponse().withStatus(200)
                                .withBody('''{
                                     "id": "processDefinitionId",
                                     "category": "test"
                                    }'''))
        )

        workflowService.stubFor(
                post(urlEqualTo("/camunda/engine-rest/task/count"))
                        .willReturn(aResponse()
                                .withHeader("Content-Type", "application/json")
                                .withStatus(200)
                                .withBody('''{
                                     "count" : 19
                                    }'''))
        )

        and: 'jwt'
        Jwt token = Jwt.withTokenValue('token')
                .header("alg", "none")
                .claim(SUB, "user")
                .claim("email", "email")
                .claim("groups", ['test'])
                .claim("scope", "read").build()

        when: 'a request to get task lite is made'
        def result = mvc.perform(MockMvcRequestBuilders.get('/ui/tasks/lite/taskId')
                .with(jwt().jwt(token))
                .contentType(MediaType.APPLICATION_JSON))


        then: 'result should be successful'
        result.andExpect(MockMvcResultMatchers.status().is2xxSuccessful())

    }

    @WithMockUser("user@user.com")
    def 'can get full task'() {
        given: 'a task is requested'
        workflowService.stubFor(
                get(urlEqualTo("/camunda/engine-rest/task/taskId"))
                        .willReturn(aResponse().withStatus(200)
                                .withBody('''{
                                     "id": "taskId",
                                     "processDefinitionId": "processDefinitionId",
                                     "formKey": "formKey",
                                     "processInstanceId": "processInstanceId"
                                    }'''))
        )

        workflowService.stubFor(
                get(urlEqualTo("/camunda/engine-rest/task/taskId/variables?deserializeValues=false"))
                        .willReturn(aResponse().withStatus(200)
                                .withBody('''{
                                                     "taskVariable":{ 
                                                       "value" : "test",
                                                       "type" : "string"
                                                     } 
                                                    }'''))
        )

        workflowService.stubFor(
                get(urlEqualTo("/camunda/engine-rest/process-definition/processDefinitionId"))
                        .willReturn(aResponse().withStatus(200)
                                .withBody('''{
                                     "id": "processDefinitionId",
                                     "category": "test"
                                    }'''))
        )

        workflowService.stubFor(
                get(urlEqualTo("/camunda/engine-rest/process-instance/processInstanceId"))
                        .willReturn(aResponse().withStatus(200)
                                .withBody('''{
                                     "id": "processInstanceId",
                                     "processDefinitionId": "processDefinitionId"
                                    }'''))
        )

        workflowService.stubFor(
                get(urlEqualTo("/camunda/engine-rest/process-instance/processInstanceId/variables?deserializeValues=false"))
                        .willReturn(aResponse().withStatus(200)
                                .withBody('''{
                                                     "variable":{ 
                                                       "value" : "test",
                                                       "type" : "string"
                                                     } 
                                                    }'''))
        )

        formService.stubFor(
                get(urlEqualTo("/form/name/formKey"))
                        .willReturn(aResponse().withStatus(200)
                                .withBody('''{
                                                    "display": "form",
                                                    "components": []
                                                    }'''))
        )


        and: 'jwt'
        Jwt token = Jwt.withTokenValue('token')
                .header("alg", "none")
                .claim(SUB, "user")
                .claim("email", "email")
                .claim("groups", ['test'])
                .claim("scope", "read").build()

        when: 'a request to get task lite is made'
        def result = mvc.perform(MockMvcRequestBuilders.get('/ui/tasks/taskId')
                .with(jwt().jwt(token))
                .contentType(MediaType.APPLICATION_JSON))


        then: 'result should be successful'
        result.andExpect(MockMvcResultMatchers.status().is2xxSuccessful())
    }
}
