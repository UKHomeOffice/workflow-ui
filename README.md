# Workflow Service UI

![Workflow UI CI](https://github.com/DigitalPatterns/workflow-ui/workflows/Workflow%20UI%20CI/badge.svg)

Provides a UI for completing forms and actioning tasks.

# Server

The spring boot application provides a server to serve the client code but also 
acts as a reverse proxy removing the need to provide any additional configuration set up in the UI.

## Bootstrap configuration

The following environment variables are required to load properties from AWS secrets manager

* AWS_SECRETS_MANAGER_ENABLED
* AWS_REGION
* AWS_ACCESS_KEY
* AWS_SECRET_KEY
* SPRING_PROFILES_ACTIVE


### Application configuration

The following properties need to be configured in AWS secrets manager (example format provided)
```json
{
  "auth.url": "http://localhost:8080/auth",
  "auth.realm": "elf",
  "auth.clientId": "eforms",
  "formApi.url": "http://localhost:4000",
  "serviceDesk.url": "service desk url",
  "uiEnvironment": "LOCAL",
  "uiVersion": "ALPHA",
  "workflowService.url": "http://localhost:8000",
  "ui.oauth2.jwt.issuer-uri": "http://localhost:8080/auth/realms/elf",
  "server-port": 8004
}
```

Start the server and it should start on port 8004

# Client

The client code is developed using the create-react-app module. Additional scripts added:

```json
"test-coverage" : "react-scripts test \"--coverage\" \"--watchAll=false\"",
"test-coverage-watch": "react-scripts test \"--coverage\" \"--watchAll=true\"",
"lint": "eslint --ignore-pattern node_modules/ --ext .js --ext .jsx --fix src"
```

To run the UI locally in hot deploy mode you will need to run

```bash
npm run start
```

This will use the reverse proxy defined in the package.json.  


# Assemble

To produce the final artefact, run the following from the root of the project

```bash
./gradlew clean assemble
```

This will first clean and build the client code and then copy the build directory into the static directory of the server. Giving you a final output of
workflow-ui.jar which is a spring boot app.

You can then run the final output with

```bash
 AWS_ACCESS_KEY=XXXXX AWS_SECRET_KEY=XXXXXX AWS_REGION=eu-west-2 AWS_SECRETS_MANAGER_ENABLED=true SPRING_PROFILES_ACTIVE=local java -jar server/build/libs/workflow-ui.jar
```