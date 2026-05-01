# Basics of TIBCO BusinessWorks Container Edition (BWCE)

A comprehensive guide to understanding and working with TIBCO BusinessWorks Container Edition, featuring practical examples and sample applications.

## Overview

TIBCO BusinessWorks Container Edition (BWCE) is a lightweight, Docker-native integration platform that enables developers to create, deploy, and manage integration applications in containerized environments. This guide covers the fundamentals of working with BWCE, from basic concepts to advanced development patterns.

## Table of Contents

1. [Introduction to BWCE](#1-introduction-to-bwce)
2. [Architecture Overview](#2-architecture-overview)
3. [Development Environment Setup](#3-development-environment-setup)
4. [Creating Your First BWCE Application](#4-creating-your-first-bwce-application)
5. [Process Design Fundamentals](#5-process-design-fundamentals)
6. [Configuration and Properties](#6-configuration-and-properties)
7. [Building and Packaging](#7-building-and-packaging)
8. [Deployment Strategies](#8-deployment-strategies)
9. [Monitoring and Logging](#9-monitoring-and-logging)
10. [Best Practices](#10-best-practices)

---

## 1. Introduction to BWCE

### What is BusinessWorks Container Edition?

TIBCO BusinessWorks Container Edition is a cloud-native integration platform that combines the power of TIBCO BusinessWorks with modern containerization technologies. It enables developers to:

- **Create Lightweight Integrations**: Build microservices-based integration applications
- **Deploy Anywhere**: Run on Docker, Kubernetes, and cloud platforms
- **Scale Dynamically**: Leverage container orchestration for automatic scaling
- **Integrate Seamlessly**: Connect various systems, APIs, and data sources

### Key Benefits

- **Cloud-Native Design**: Built for modern cloud architectures
- **Container-First Approach**: Native Docker support with optimized runtime
- **Microservices Ready**: Perfect for distributed integration patterns
- **DevOps Friendly**: Supports CI/CD pipelines and automated deployments
- **Resource Efficient**: Minimal memory footprint and fast startup times

---

## 2. Architecture Overview

### BWCE Runtime Architecture

```
┌─────────────────────────────────────────┐
│               BWCE Application          │
├─────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────────┐   │
│  │  Processes  │  │   Resources     │   │
│  │             │  │                 │   │
│  │ • REST APIs │  │ • HTTP Clients  │   │
│  │ • Schedulers│  │ • Database Conn │   │
│  │ • Listeners │  │ • Message Queues│   │
│  └─────────────┘  └─────────────────┘   │
├─────────────────────────────────────────┤
│            BWCE Runtime Engine          │
├─────────────────────────────────────────┤
│              Docker Container           │
└─────────────────────────────────────────┘
```

### Core Components

1. **Application Module**: Contains business logic and process definitions
2. **Shared Modules**: Reusable components across multiple applications
3. **Application Archive (EAR)**: Deployable unit containing all components
4. **Runtime Engine**: Executes processes and manages resources

---

## 3. Development Environment Setup

### Prerequisites

- **TIBCO BusinessWorks Studio**: IDE for BWCE development
- **Java Development Kit (JDK)**: Version 8 or higher
- **Maven**: For build automation
- **Docker**: For containerization and deployment

### Installation Steps

1. **Install TIBCO BusinessWorks Studio**
   ```bash
   # Download from TIBCO eDelivery
   # Follow installation wizard
   ```

2. **Configure Maven Repository**
   ```xml
   <repository>
     <id>tibco-repo</id>
     <name>TIBCO Maven Repository</name>
     <url>https://repo.tibco.com/maven2</url>
   </repository>
   ```

3. **Verify Installation**
   ```bash
   # Check Java version
   java -version
   
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

## Next Steps

### Advanced Topics
- **Message Queuing**: JMS and Apache Kafka integration
- **Database Integration**: JDBC and connection pooling
- **Microservices Patterns**: Service discovery and circuit breakers
- **Cloud Deployment**: AWS, Azure, and GCP integration

### Resources
- [TIBCO BusinessWorks Documentation](https://docs.tibco.com/products/tibco-businessworks-container-edition)
- [TIBCO Community Forums](https://community.tibco.com/)

### Support
- **Documentation**: Comprehensive guides and API references
- **Community**: Active developer community and forums
- **Training**: Official TIBCO training courses and certifications
