package io.digitalpatterns.workflow.ui;

import lombok.Data;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang.StringUtils;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.netflix.zuul.filters.ZuulProperties;
import org.springframework.http.*;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
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

    @GetMapping(path="/lite/{taskId}")
    public ResponseEntity<?> taskLite(@PathVariable String taskId) {

        JwtAuthenticationToken token = (JwtAuthenticationToken) SecurityContextHolder.getContext().getAuthentication();
        HttpHeaders httpHeaders = new HttpHeaders();
        httpHeaders.setContentType(MediaType.APPLICATION_JSON);
        httpHeaders.setBearerAuth(token.getToken().getTokenValue());

        ZuulProperties.ZuulRoute zuulRoute = zuulProperties.getRoutes().get("workflow-service");

        JSONObject taskDto = new JSONObject(restTemplate.exchange(
                format("%s/camunda/engine-rest/task/%s", zuulRoute.getUrl(), taskId),
                HttpMethod.GET,
                new HttpEntity<>(httpHeaders),
                String.class
        ).getBody());
        String processDefinitionId = taskDto.getString("processDefinitionId");

        JSONObject processDefinitionDto = new JSONObject(restTemplate.exchange(
                format("%s/camunda/engine-rest/process-definition/%s", zuulRoute.getUrl(),
                        processDefinitionId),
                HttpMethod.GET,
                new HttpEntity<>(httpHeaders),
                String.class
        ).getBody());


        Object groups = token.getTokenAttributes().get("groups");

        JSONObject body = new JSONObject();
        JSONArray orQueries = new JSONArray();
        JSONObject data = new JSONObject();
        data.put("assignee", token.getName());
        data.put("candidateGroups", groups);
        orQueries.put(data);
        body.put("orQueries", orQueries);
        TaskCount taskCount = restTemplate.exchange(format("%s/camunda/engine-rest/task/count", zuulRoute.getUrl()),
                HttpMethod.POST,
                new HttpEntity<>(
                        body.toString(), httpHeaders
                ),
                TaskCount.class).getBody();


        JSONObject response = new JSONObject();
        response.put("task", taskDto);
        response.put("processDefinition", processDefinitionDto);
        response.put("taskCount", taskCount.count);
        return ResponseEntity.ok(response.toString());
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

        JSONObject taskVariableDto = new JSONObject(restTemplate.exchange(
                format("%s/camunda/engine-rest/task/%s/variables?deserializeValues=false", zuulRoute.getUrl(), taskId),
                HttpMethod.GET,
                new HttpEntity<>(httpHeaders),
                String.class
        ).getBody());

        taskDto.put("variables", taskVariableDto);

        String processInstanceId = taskDto.getString("processInstanceId");
        String processDefinitionId = taskDto.getString("processDefinitionId");

        JSONObject processInstanceDto = new JSONObject(restTemplate.exchange(
                format("%s/camunda/engine-rest/process-instance/%s", zuulRoute.getUrl(),
                        processInstanceId),
                HttpMethod.GET,
                new HttpEntity<>(httpHeaders),
                String.class
        ).getBody());

        JSONObject processDefinitionDto = new JSONObject(restTemplate.exchange(
                format("%s/camunda/engine-rest/process-definition/%s", zuulRoute.getUrl(),
                        processDefinitionId),
                HttpMethod.GET,
                new HttpEntity<>(httpHeaders),
                String.class
        ).getBody());

        JSONObject variablesDto = new JSONObject(restTemplate.exchange(
                format("%s/camunda/engine-rest/process-instance/%s/variables?deserializeValues=false", zuulRoute.getUrl(),
                        processInstanceId),
                HttpMethod.GET,
                new HttpEntity<>(httpHeaders),
                String.class
        ).getBody());

        JSONObject response = new JSONObject();
        String formKey = !taskDto.isNull("formKey") ? taskDto.getString("formKey") : null;
        if (StringUtils.isNotBlank(formKey)) {
            try {
                ZuulProperties.ZuulRoute formRoute = zuulProperties.getRoutes().get("form-service");
                JSONObject form = new JSONObject(restTemplate.exchange(
                        format("%s/form/name/%s", formRoute.getUrl(),
                                formKey),
                        HttpMethod.GET,
                        new HttpEntity<>(httpHeaders),
                        String.class).getBody());

                response.put("form", form);
            } catch (Exception e) {
                log.error("Failed to load form '{}'", e.getMessage());
            }

        }
        response.put("task", taskDto);

        response.put("processDefinition", processDefinitionDto);
        response.put("processInstance", processInstanceDto);
        response.put("variables", variablesDto);

        return ResponseEntity.ok(response.toString());
    }

    @Data
    public static class TaskCount {
        private Long count;
    }
}
