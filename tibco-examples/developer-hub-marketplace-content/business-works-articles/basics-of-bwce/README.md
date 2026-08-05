> ## ⚠️ This content has moved
>
> The TIBCO Developer Hub marketplace content now lives in its own repository:
> **[TIBCOSoftware/tibco-developer-hub-marketplace](https://github.com/TIBCOSoftware/tibco-developer-hub-marketplace)**
>
> **New location of this content:** [`businessworks/articles/basics-of-bwce/`](https://github.com/TIBCOSoftware/tibco-developer-hub-marketplace/tree/main/businessworks/articles/basics-of-bwce)
>
> The files in this folder are kept **unchanged** so that installs made before the
> migration keep working. Do not use this folder for new work — all updates, fixes and
> new entries happen in the repository above.

---

# BWCE Basics Learning Template# BWCE Basics Learning Template



This is a Backstage scaffolder template that creates comprehensive BWCE (TIBCO BusinessWorks Container Edition) learning guides and sample applications.This is a Backstage scaffolder template that creates comprehensive BWCE (TIBCO BusinessWorks Container Edition) learning guides and sample applications.



## Template Overview## Template Overview



This template generates a complete learning environment for BWCE development including:This template generates a complete learning environment for BWCE development including:

- Comprehensive learning documentation- Comprehensive learning documentation

- Sample applications with best practices- Sample applications with best practices

- Hands-on exercises and tutorials- Hands-on exercises and tutorials

- Docker and Kubernetes deployment examples- Docker and Kubernetes deployment examples



## What Gets Created## Table of Contents



When users scaffold this template, they get:1. [Introduction to BWCE](#1-introduction-to-bwce)

2. [Architecture Overview](#2-architecture-overview)

### 📚 Documentation3. [Development Environment Setup](#3-development-environment-setup)

- **Comprehensive Learning Guide**: 10 chapters covering BWCE fundamentals4. [Creating Your First BWCE Application](#4-creating-your-first-bwce-application)

- **Architecture Overview**: Understanding BWCE runtime and components5. [Process Design Fundamentals](#5-process-design-fundamentals)

- **Development Setup**: Step-by-step environment configuration6. [Configuration and Properties](#6-configuration-and-properties)

- **Best Practices**: Industry-standard development patterns7. [Building and Packaging](#7-building-and-packaging)

8. [Deployment Strategies](#8-deployment-strategies)

### 🏗️ Sample Applications9. [Monitoring and Logging](#9-monitoring-and-logging)

- **Scheduler Demo**: Timer-based integration example10. [Best Practices](#10-best-practices)

- **HTTP Client Integration**: External API interaction patterns

- **Error Handling**: Comprehensive exception management---

- **Configuration Management**: Environment-specific properties

## 1. Introduction to BWCE

### 🐳 Deployment Ready

- **Docker Support**: Container-ready applications### What is BusinessWorks Container Edition?

- **Kubernetes Manifests**: Cloud-native deployment

- **CI/CD Integration**: Jenkins pipeline examplesTIBCO BusinessWorks Container Edition is a cloud-native integration platform that combines the power of TIBCO BusinessWorks with modern containerization technologies. It enables developers to:

- **Monitoring Setup**: Health checks and observability

- **Create Lightweight Integrations**: Build microservices-based integration applications

## Template Parameters- **Deploy Anywhere**: Run on Docker, Kubernetes, and cloud platforms

- **Scale Dynamically**: Leverage container orchestration for automatic scaling

| Parameter | Type | Description | Default |- **Integrate Seamlessly**: Connect various systems, APIs, and data sources

|-----------|------|-------------|---------|

| `name` | string | Project name | - |### Key Benefits

| `description` | string | Project description | - |

| `owner` | string | Project owner/team | - |- **Cloud-Native Design**: Built for modern cloud architectures

| `learning_level` | choice | Beginner/Intermediate/Advanced | beginner |- **Container-First Approach**: Native Docker support with optimized runtime

| `guide_type` | choice | Tutorial/Reference/Workshop | tutorial |- **Microservices Ready**: Perfect for distributed integration patterns

| `include_sample_app` | boolean | Include sample applications | true |- **DevOps Friendly**: Supports CI/CD pipelines and automated deployments

| `include_exercises` | boolean | Include hands-on exercises | true |- **Resource Efficient**: Minimal memory footprint and fast startup times

| `include_docker_setup` | boolean | Include Docker configuration | true |

| `include_kubernetes_deploy` | boolean | Include Kubernetes manifests | false |---



## File Structure## 2. Architecture Overview



```### BWCE Runtime Architecture

generated-project/

├── README.md                    # Project overview and setup```

├── catalog-info.yaml           # Backstage entity configuration┌─────────────────────────────────────────┐

├── mkdocs.yml                  # Documentation site configuration│               BWCE Application          │

├── docs/├─────────────────────────────────────────┤

│   └── index.md               # Main learning content (490+ lines)│  ┌─────────────┐  ┌─────────────────┐   │

├── presentation/│  │  Processes  │  │   Resources     │   │

│   └── slide-*.png            # Supporting slide materials│  │             │  │                 │   │

└── src/│  │ • REST APIs │  │ • HTTP Clients  │   │

    └── sample-scheduler-app/  # Sample application code│  │ • Schedulers│  │ • Database Conn │   │

```│  │ • Listeners │  │ • Message Queues│   │

│  └─────────────┘  └─────────────────┘   │

## Usage├─────────────────────────────────────────┤

│            BWCE Runtime Engine          │

1. **In Backstage UI**: Navigate to Create → Choose Templates → BWCE Basics Learning Guide├─────────────────────────────────────────┤

2. **Fill Parameters**: Configure the learning guide options│              Docker Container           │

3. **Generate**: Template creates the complete learning environment└─────────────────────────────────────────┘

4. **Learn**: Follow the comprehensive documentation and examples```



## Template Development### Core Components



### Prerequisites1. **Application Module**: Contains business logic and process definitions

- Backstage with Scaffolder plugin2. **Shared Modules**: Reusable components across multiple applications

- TIBCO Developer Hub marketplace access3. **Application Archive (EAR)**: Deployable unit containing all components

- Understanding of BWCE fundamentals4. **Runtime Engine**: Executes processes and manages resources



### Modifying Content---

- **Learning Content**: Edit `skeleton/docs/index.md`

- **Sample Apps**: Modify files in `skeleton/src/`## 3. Development Environment Setup

- **Template Config**: Update `template-bwce-basics.yaml`

- **Marketplace Entry**: Edit `mp-entry-bwce-basics.yaml`### Prerequisites



### Testing Locally- **TIBCO BusinessWorks Studio**: IDE for BWCE development

```bash- **Java Development Kit (JDK)**: Version 8 or higher

# Validate template syntax- **Maven**: For build automation

backstage-cli repo build- **Docker**: For containerization and deployment



# Test scaffolding### Installation Steps

yarn start

# Navigate to /create and test the template1. **Install TIBCO BusinessWorks Studio**

```   ```bash

   # Download from TIBCO eDelivery

## Integration   # Follow installation wizard

   ```

This template integrates with:

- **TIBCO Developer Hub**: Marketplace registration2. **Configure Maven Repository**

- **Backstage TechDocs**: Automatic documentation publishing     ```xml

- **Jenkins**: CI/CD pipeline templates   <repository>

- **Kubernetes**: Cloud-native deployment patterns     <id>tibco-repo</id>

     <name>TIBCO Maven Repository</name>

## Support     <url>https://repo.tibco.com/maven2</url>

   </repository>

- **Template Issues**: Report in tib-devhub-hackathon repository   ```

- **BWCE Questions**: Use TIBCO Community Forums

- **Learning Content**: Feedback welcome for improvements3. **Verify Installation**

   ```bash

---   # Check Java version

   java -version

*Template Version: 2.0.0 | Last Updated: September 2025*   
   # Check Maven installation
   mvn -version
   
   # Verify Docker
   docker --version
   ```

---

## 4. Creating Your First BWCE Application

### Project Structure

```
sample-scheduler-app/
├── src/
│   ├── sample-scheduler-app/           # Main Application Module
│   │   ├── META-INF/
│   │   │   ├── MANIFEST.MF
│   │   │   ├── module.bwm
│   │   │   └── default.substvar
│   │   ├── Processes/
│   │   │   └── sample-scheduler-app/
│   │   │       └── Process.bwp
│   │   ├── Resources/
│   │   │   └── sample-scheduler-app/
│   │   │       └── HttpClientResource.httpClientResource
│   │   └── Schemas/
│   └── sample-scheduler-app.application/  # Application Archive
│       ├── META-INF/
│       │   ├── MANIFEST.MF
│       │   └── TIBCO.xml
│       └── default.substvar
```

### Step-by-Step Creation

1. **Create New BWCE Project**
   - File → New → TIBCO BusinessWorks Project
   - Select "BusinessWorks Container Edition"
   - Enter project name: `sample-scheduler-app`

2. **Add Application Module**
   - Right-click project → New → Module
   - Select "Application Module"
   - Configure module properties

3. **Create Process Definition**
   - Right-click Processes → New → Process
   - Design process flow using palette activities

---

## 5. Process Design Fundamentals

### Basic Process Elements

#### 1. Start Activities
- **Timer**: Schedule-based process initiation
- **HTTP Receiver**: REST/HTTP endpoint listeners
- **Message Subscriber**: Queue/topic message consumers

#### 2. Service Activities
- **HTTP Client**: External REST API calls
- **Database Query**: Data access operations
- **File Operations**: Read/write file system operations

#### 3. Control Flow Activities
- **Choice**: Conditional branching logic
- **For Each**: Iterative processing
- **Error Handling**: Exception management

### Sample Scheduler Process

```xml
<!-- Timer-based process example -->
<process name="SchedulerProcess">
  <starter>
    <timer interval="60000" /> <!-- Every 60 seconds -->
  </starter>
  
  <activities>
    <log message="Scheduler executed at ${current-dateTime()}" />
    <invoke-http-client resource="external-api" />
  </activities>
</process>
```

---

## 6. Configuration and Properties

### Property Management

#### 1. Module Properties (module.msv)
```properties
# Application-level configuration
app.name=scheduler-sample
app.version=1.0.0
```

#### 2. Substitution Variables (default.substvar)
```properties
# Environment-specific values
BW.HOST.NAME=localhost
BW.HOST.PORT=8080
HTTP.CLIENT.TIMEOUT=30000
```

#### 3. Application Properties (TIBCO.xml)
```xml
<application>
  <global-variables>
    <global-variable>
      <name>LogLevel</name>
      <value>INFO</value>
    </global-variable>
  </global-variables>
</application>
```

### Environment-Specific Configuration

```bash
# Development
export BW_PROFILE=dev
export LOG_LEVEL=DEBUG

# Production
export BW_PROFILE=prod
export LOG_LEVEL=ERROR
```

---

## 7. Building and Packaging

### Maven Build Configuration

#### Parent POM Structure
```xml
<project>
  <groupId>com.company</groupId>
  <artifactId>sample-scheduler-app.parent</artifactId>
  <packaging>pom</packaging>
  
  <modules>
    <module>sample-scheduler-app</module>
    <module>sample-scheduler-app.application</module>
  </modules>
  
  <properties>
    <bwce.version>2.9.0</bwce.version>
    <maven.compiler.source>1.8</maven.compiler.source>
  </properties>
</project>
```

#### Build Process
```bash
# Clean and compile
mvn clean compile

# Package application
mvn package

# Build Docker image
mvn clean package -Pdocker

# Generated artifacts
target/
├── sample-scheduler-app_1.0.0.ear
└── docker/
    └── Dockerfile
```

---

## 8. Deployment Strategies

### Docker Deployment

#### 1. Build Docker Image
```dockerfile
FROM tibco/bwce:latest
COPY sample-scheduler-app_1.0.0.ear /
EXPOSE 8080
```

#### 2. Run Container
```bash
# Basic deployment
docker run -d \
  --name scheduler-app \
  -p 8080:8080 \
  -e BW_PROFILE=docker \
  sample-scheduler-app:1.0.0

# With environment variables
docker run -d \
  --name scheduler-app \
  -p 8080:8080 \
  -e LOG_LEVEL=INFO \
  -e HTTP_PORT=8080 \
  sample-scheduler-app:1.0.0
```

### Kubernetes Deployment

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: scheduler-app
spec:
  replicas: 3
  selector:
    matchLabels:
      app: scheduler-app
  template:
    metadata:
      labels:
        app: scheduler-app
    spec:
      containers:
      - name: scheduler-app
        image: sample-scheduler-app:1.0.0
        ports:
        - containerPort: 8080
        env:
        - name: BW_PROFILE
          value: "k8s"
        - name: LOG_LEVEL
          value: "INFO"
```

---

## 9. Monitoring and Logging

### Application Monitoring

#### 1. Health Check Endpoints
```bash
# Application health
curl http://localhost:8080/health

# Metrics endpoint
curl http://localhost:8080/metrics

# Application info
curl http://localhost:8080/info
```

#### 2. JMX Monitoring
```properties
# Enable JMX
BW_JMX_ENABLE=true
BW_JMX_PORT=9999
```

### Logging Configuration

#### 1. Log Levels
```properties
# Application logging
bw.logger.level=INFO
```

#### 2. Structured Logging
```xml
<log-activity>
  <message>
    {
      "timestamp": "${current-dateTime()}",
      "level": "INFO",
      "process": "${process-name}",
      "message": "Process completed successfully"
    }
  </message>
</log-activity>
```

---

## 10. Best Practices

### Development Guidelines

#### 1. Project Organization
- **Modular Design**: Separate business logic into reusable modules
- **Clear Naming**: Use descriptive names for processes and activities
- **Documentation**: Comment complex logic and business rules
- **Version Control**: Use Git for source code management

#### 2. Configuration Management
- **Environment Variables**: Use substitution variables for environment-specific values
- **Externalized Config**: Keep configuration outside the application code
- **Secrets Management**: Use secure methods for sensitive data

#### 3. Error Handling
```xml
<error-handler>
  <log message="Error occurred: ${error-message}" level="ERROR" />
  <throw-exception message="Processing failed" />
</error-handler>
```

### Performance Optimization

#### 1. Resource Management
- **Connection Pooling**: Configure appropriate pool sizes
- **Memory Settings**: Optimize JVM heap settings
- **Thread Management**: Monitor and tune thread pools

#### 2. Monitoring and Alerting
- **Health Checks**: Implement comprehensive health monitoring
- **Performance Metrics**: Track key performance indicators
- **Log Analysis**: Use centralized logging for troubleshooting

### Security Considerations

#### 1. Authentication and Authorization
- **API Security**: Implement proper authentication for REST endpoints
- **Certificate Management**: Use proper SSL/TLS certificates
- **Access Control**: Apply principle of least privilege

#### 2. Data Protection
- **Encryption**: Encrypt sensitive data in transit and at rest
- **Input Validation**: Validate all external inputs
- **Audit Logging**: Log security-relevant events

---

## Sample Application: Scheduler Demo

The included sample application demonstrates:

### Features Implemented
- **Timer-based Scheduler**: Executes every 60 seconds
- **HTTP Client Integration**: Makes external API calls
- **Logging**: Structured application logging
- **Configuration**: Environment-specific properties
- **Error Handling**: Comprehensive error management

### Running the Sample
```bash
# Build the application
cd sample-scheduler-app.application.parent
mvn clean package

# Run with Docker
docker build -t scheduler-demo .
docker run -p 8080:8080 scheduler-demo

# Check logs
docker logs scheduler-demo -f
```

### Customization Points
1. **Timer Interval**: Modify schedule in Process.bwp
2. **API Endpoint**: Update HTTP client resource configuration
3. **Log Format**: Customize logging output structure
4. **Environment Config**: Adjust substitution variables

---
