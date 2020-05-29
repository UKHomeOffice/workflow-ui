package io.digitalpatterns.workflow.ui;

import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang.StringUtils;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.netflix.zuul.filters.ZuulProperties;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import static java.lang.String.format;

@RestController
@Slf4j
@RequestMapping("/ui/tasks")
public class TaskController {

    private final RestTemplate restTemplate;
    private ZuulProperties zuulProperties;

    @Autowired
    public TaskController(RestTemplate restTemplate, ZuulProperties zuulProperties) {
        this.restTemplate = restTemplate;
        this.zuulProperties = zuulProperties;
    }


    @GetMapping(path = "{taskId}")
    public ResponseEntity<?> task(@PathVariable String taskId) {
        JwtAuthenticationToken token = (JwtAuthenticationToken) SecurityContextHolder.getContext().getAuthentication();
        HttpHeaders httpHeaders = new HttpHeaders();
        httpHeaders.setBearerAuth(token.getToken().getTokenValue());

        ZuulProperties.ZuulRoute zuulRoute = zuulProperties.getRoutes().get("workflow-service");


        JSONObject taskDto = new JSONObject(restTemplate.exchange(
               format("%s/camunda/engine-rest/task/%s", zuulRoute.getUrl(), taskId),
               HttpMethod.GET,
               new HttpEntity<>(httpHeaders),
                String.class
        ).getBody());


        JSONObject processInstanceDto = new JSONObject(restTemplate.exchange(
                format("%s/camunda/engine-rest/process-instance/%s", zuulRoute.getUrl(),
                        taskDto.getString("processInstanceId")),
                HttpMethod.GET,
                new HttpEntity<>(httpHeaders),
                String.class
        ).getBody());

        JSONObject processDefinitionDto = new JSONObject(restTemplate.exchange(
                format("%s/camunda/engine-rest/process-definition/%s", zuulRoute.getUrl(),
                        taskDto.getString("processDefinitionId")),
                HttpMethod.GET,
                new HttpEntity<>(httpHeaders),
                String.class
        ).getBody());

        JSONObject variablesDto = new JSONObject(restTemplate.exchange(
                format("%s/camunda/engine-rest/process-instance/%s/variables?deserializeValues=false", zuulRoute.getUrl(),
                        taskDto.getString("processInstanceId")),
                HttpMethod.GET,
                new HttpEntity<>(httpHeaders),
                String.class
        ).getBody());

        JSONObject response = new JSONObject();
        String formKey = !taskDto.isNull("formKey") ? taskDto.getString("formKey") : null;
        if (StringUtils.isNotBlank(formKey)) {
            ZuulProperties.ZuulRoute formRoute = zuulProperties.getRoutes().get("form-service");
            JSONObject form = new JSONObject(restTemplate.exchange(
                    format("%s/form/name/%s", formRoute.getUrl(),
                            formKey),
                    HttpMethod.GET,
                    new HttpEntity<>(httpHeaders),
                    String.class).getBody());

            response.put("form", form);

        }
        response.put("task", taskDto);
        response.put("processDefinition", processDefinitionDto);
        response.put("processInstance", processInstanceDto);
        response.put("variables", variablesDto);

        return ResponseEntity.ok(response.toString());
    }


}
