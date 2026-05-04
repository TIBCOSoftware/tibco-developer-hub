# TIBCO BusinessWorks Articles

Here you will find a curated collection of articles, tutorials, and best practices for TIBCO BusinessWorks 5.X, 6.X, and BusinessWorks Container Edition (BWCE). These resources cover a wide range of topics including development techniques, troubleshooting tips, performance optimization, security configurations, and integration patterns to help you get the most out of your BusinessWorks applications.

---

### Development Articles

### BW6.X & BWCE Development

#### How to Call Dynamic Sub-Processes
**Summary:** Learn techniques for implementing dynamic sub-process invocation in BusinessWorks 6.X and Container Edition.  
**Tags:** `BW6X`, `BWCE`, `sub-process`, `dynamic-invocation`, `process-orchestration`

**Description:**  
This article explores advanced techniques for implementing dynamic sub-process invocation in BusinessWorks 6.X and Container Edition, enabling flexible process orchestration where the specific sub-process to be called is determined at runtime rather than design time. You'll learn how to use process variables and conditional logic to select and invoke different sub-processes based on runtime conditions, message content, or business rules, allowing for more adaptable and maintainable integration solutions.

The guide covers practical implementation patterns including using the Call Process activity with dynamic process selection, managing input/output mappings for different sub-process signatures, handling error scenarios when sub-processes are not found, and best practices for organizing and versioning dynamically called sub-processes. Real-world examples demonstrate use cases such as routing to different validation processes based on message type, implementing plugin-style architectures, and creating configurable workflow engines that can adapt to changing business requirements without code modifications.

**Link:** [Article](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/how-to-call-dynamic-sub-processes-in-businessworks-and-businessworks-container-edition-r3341/)

#### Include In-Line Comments in Mappings
**Summary:** Best practices for adding inline documentation and comments within BusinessWorks mappings.  
**Tags:** `BW6X`, `BWCE`, `mapping`, `documentation`, `best-practices`

**Description:**  
This article provides comprehensive guidance on adding inline documentation and comments within BusinessWorks mappings to improve code readability, maintenance, and knowledge transfer within development teams. You'll learn various techniques for embedding comments directly in mapper activities, including using annotation elements, leveraging XSLT comment nodes, and implementing documentation patterns that survive through deployment and runtime execution while maintaining mapping performance.

The guide demonstrates practical approaches for documenting complex transformation logic, explaining business rules embedded in mappings, noting data quality assumptions, and marking areas that require special attention during maintenance. It also covers best practices for comment formatting, standards for documentation consistency across projects, and techniques for generating mapping documentation from embedded comments. Special attention is given to balancing comprehensive documentation with mapping performance and maintainability.

**Link:** [Article](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/bw6x-bwce-how-to-include-in-line-comments-in-businessworks-mappings-r3355/)

#### Solve "Unable to De-serialize BW Process Error"
**Summary:** Troubleshooting guide for resolving deserialization errors when debugging multiple applications.  
**Tags:** `BW6X`, `BWCE`, `debugging`, `troubleshooting`, `studio`

**Description:**  
This troubleshooting guide addresses the common "Unable to de-serialize BW process" error that occurs when debugging multiple applications simultaneously in BusinessWorks 6.X Studio. The article explains the root causes of this error, which typically stem from conflicting debug sessions, port conflicts, or corrupted debug metadata, and provides step-by-step solutions to resolve these issues and restore normal debugging functionality.

Advanced debugging techniques include managing multiple debug configurations, cleaning workspace metadata, resolving port allocation conflicts, and implementing debug session isolation strategies. The guide covers preventive measures such as proper workspace organization, debug configuration management, and best practices for multi-application debugging scenarios. Special attention is given to handling complex debugging scenarios involving distributed applications and maintaining debugging efficiency in large-scale development projects.

**Link:** [Article](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/bw6x-bwce-how-to-solve-the-%E2%80%9Cunable-to-de-serialize-bw-process-error%E2%80%9D-when-debugging-two-applications-in-businessworks-6x-studio-r3356/)

#### Other Remaining Development Articles
For brevity, I'll provide condensed descriptions for the remaining development articles following the same pattern of summary and detailed description.

#### Use XSD Embedded in WSDL
**Summary:** Reference and use XML Schema definitions that are embedded within WSDL documents.  
**Tags:** `BW6X`, `BWCE`, `WSDL`, `XSD`, `web-services`

**Description:**  
This technical guide explains how to work with XML Schema definitions (XSD) that are embedded within WSDL documents rather than stored as separate files. You'll learn techniques for extracting embedded schemas, referencing them in BusinessWorks processes, managing namespace conflicts, and handling complex WSDL structures with multiple embedded schemas. The article addresses common challenges such as schema validation, type references across embedded schemas, and maintaining consistency when WSDLs are updated.

Advanced topics include optimizing performance when working with embedded schemas, handling circular dependencies, implementing schema caching strategies, and managing WSDL versioning with embedded XSDs. The guide provides best practices for WSDL organization, documentation strategies for embedded schemas, testing approaches for schema validation, and migration techniques when moving from embedded to external schemas or vice versa.

**Link:** [Article](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/bw6x-bwce-how-to-use-an-xml-schema-definition-embedded-in-an-wsdl-in-businessworks-and-businessworks-container-edition-r3553/)

#### REST JSON Palette Configuration Properties
**Summary:** Comprehensive list of configuration properties available for REST and JSON palette activities.  
**Tags:** `BW6X`, `BWCE`, `REST`, `JSON`, `configuration`

**Description:**  
This reference guide provides a comprehensive catalog of all configuration properties available for REST and JSON palette activities in BusinessWorks. You'll find detailed explanations of each property, including default values, valid ranges, performance implications, and use cases. The article covers properties for connection management, timeout configurations, retry behavior, content handling, security settings, and performance tuning parameters.

The guide includes practical examples demonstrating how different property combinations affect application behavior, common configuration patterns for various scenarios, and troubleshooting tips for property-related issues. Advanced sections cover dynamic property configuration, environment-specific property management, monitoring property effectiveness, and strategies for optimizing REST/JSON service performance through proper property configuration. Best practices address property documentation, testing different configurations, and maintaining consistency across environments.

**Link:** [Article](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/bw6x-bwce-properties-available-to-configure-the-businessworks-and-businessworks-container-edition-rest-json-palette-r3554/)

#### JMS Request-Reply Scenarios
**Summary:** Implement synchronous request-reply patterns using JMS temporary queues and correlation IDs.  
**Tags:** `BW6X`, `BWCE`, `JMS`, `request-reply`, `messaging-patterns`

**Description:**  
This comprehensive guide covers implementing robust request-reply patterns using JMS in BusinessWorks applications. You'll learn various approaches including temporary queues, fixed reply queues with correlation IDs, and selector-based reply routing. The article explains timeout handling, correlation management, error scenarios, and strategies for maintaining request-reply state across process instances and system restarts.

Advanced patterns include implementing request-reply with multiple responses, handling late responses, implementing reply queue cleanup, and managing request-reply in clustered environments. The guide addresses performance considerations, scalability patterns for high-volume request-reply scenarios, monitoring and troubleshooting techniques, and best practices for avoiding common pitfalls such as reply queue overflow and correlation ID conflicts. Special attention is given to transaction boundaries and ensuring reliability in request-reply interactions.

**Link:** [Article](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/bw6x-bwce-how-to-manage-jms-request-reply-scenarios-in-businessworks-and-businessworks-container-edition-r3557/)

### BW5.X Development

#### Manage HTTP Flows
**Summary:** Control and optimize HTTP connection pooling and request flow management in BusinessWorks 5.X.  
**Tags:** `BW5X`, `HTTP`, `flow-control`, `connection-pooling`

**Description:**  
This article addresses critical aspects of managing HTTP flows in BusinessWorks 5.X applications, focusing on connection pooling optimization, request throttling, and resource management. You'll learn how to configure HTTP connection pools for optimal performance, implement flow control mechanisms to prevent server overload, and manage concurrent HTTP requests efficiently. The guide covers both HTTP client and server configurations, explaining parameters that affect throughput, latency, and resource utilization.

Advanced topics include implementing circuit breaker patterns for HTTP services, managing keep-alive connections, handling connection timeouts gracefully, and monitoring HTTP connection pool utilization. The article provides troubleshooting techniques for common HTTP flow issues such as connection exhaustion, socket leaks, and performance degradation under load. Best practices cover sizing connection pools based on workload characteristics, implementing retry mechanisms with exponential backoff, and strategies for handling HTTP service failures in production environments.

**Link:** [Article](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/bw5x-how-to-manage-http-flows-in-tibco-businessworks-5x-r3343/)

#### Connect to Email Server Using TLSv1.2
**Summary:** Configure BusinessWorks 5.X mail activities to use TLSv1.2 for secure email server connections.  
**Tags:** `BW5X`, `email`, `TLS`, `security`

**Description:**  
This security-focused guide explains how to configure BusinessWorks 5.X mail activities to establish secure connections to email servers using TLSv1.2 protocol. You'll learn how to update JVM security settings, configure mail transport properties, handle certificate validation, and troubleshoot common TLS handshake failures. The article covers SMTP, POP3, and IMAP protocols, explaining the specific configuration requirements for each.

Advanced topics include managing cipher suite selection, implementing certificate pinning for enhanced security, handling self-signed certificates in development environments, and monitoring TLS connection security. The guide addresses compatibility issues with older email servers, strategies for gradual TLS migration, debugging TLS negotiation problems, and best practices for maintaining secure email communications while ensuring interoperability with various email providers.

**Link:** [Article](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/bw5x-how-to-connect-to-an-email-server-using-tlsv12-from-businessworks-5x-r3350/)

#### HTTP Basic Authentication
**Summary:** Implement HTTP basic authentication for securing web services in BusinessWorks 5.X.  
**Tags:** `BW5X`, `HTTP`, `authentication`, `security`

**Description:**  
This comprehensive security guide demonstrates how to implement HTTP basic authentication in BusinessWorks 5.X for both client and server scenarios. You'll learn how to configure authentication credentials, handle authentication headers, implement custom authentication logic, and manage authentication failures gracefully. The article covers integration with various authentication backends including LDAP, databases, and custom authentication services.

Advanced authentication topics include implementing credential caching, managing authentication tokens, handling authentication in load-balanced environments, and implementing account lockout policies. The guide addresses security best practices such as credential encryption, preventing brute force attacks, implementing authentication logging and monitoring, and strategies for migrating from basic authentication to more secure authentication mechanisms while maintaining backward compatibility.

**Link:** [Article](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/bw5x-security-how-to-use-http-basic-authentication-in-businessworks-5x-r3351/)

#### Parse JSON with Extra Fields
**Summary:** Handle JSON messages containing unexpected fields or fields in different order without schema validation errors.  
**Tags:** `BW5X`, `JSON`, `parsing`, `flexibility`

**Description:**  
This practical guide addresses the challenge of parsing JSON messages that contain additional fields or fields in unexpected order in BusinessWorks 5.X. You'll learn techniques for implementing lenient JSON parsing, handling dynamic JSON structures, managing optional fields, and implementing forward compatibility for evolving JSON schemas. The article explains various parsing strategies and their trade-offs between flexibility and validation.

Advanced JSON handling topics include implementing custom JSON validators, managing polymorphic JSON structures, handling nested dynamic objects, and implementing JSON schema evolution strategies. The guide covers performance implications of flexible parsing, error handling for partially valid JSON, monitoring and logging of unexpected fields, and best practices for maintaining data quality while allowing schema flexibility. Special attention is given to migration strategies from strict to flexible parsing.

**Link:** [Article](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/bw5x-how-to-parse-json-messages-with-extra-fields-or-fields-in-an-unexpected-order-in-businessworks-5x-r3352/)

#### Switch Between HTTP and HTTPS
**Summary:** Dynamically switch between HTTP and HTTPS protocols using runtime configuration without code changes.  
**Tags:** `BW5X`, `HTTP`, `HTTPS`, `runtime-configuration`

**Description:**  
This configuration guide explains how to implement dynamic protocol switching between HTTP and HTTPS in BusinessWorks 5.X applications using runtime configuration. You'll learn how to parameterize endpoint URLs, manage SSL configurations conditionally, handle protocol-specific settings, and implement seamless switching without application redeployment. The article covers various approaches including property substitution, global variables, and conditional routing.

Advanced configuration topics include managing certificates for HTTPS mode, handling mixed-mode deployments, implementing protocol detection logic, and monitoring protocol usage. The guide addresses performance implications of protocol switching, testing strategies for both protocols, security considerations when allowing HTTP, and best practices for managing environment-specific protocol configurations. Special sections cover migration strategies from HTTP to HTTPS and implementing protocol downgrade protection.

**Link:** [Article](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/bw5x-how-to-switch-between-http-and-https-using-a-runtime-configuration-in-businessworks-5x-r3353/)

### Cross-Version Development

#### Enable Engine Memory Saving Mode
**Summary:** Configure BusinessWorks engine to optimize memory usage for large-scale deployments.  
**Tags:** `BW5X`, `BW6X`, `BWCE`, `memory-optimization`, `performance`

**Description:**  
This comprehensive guide explains how to enable and configure the engine memory saving mode across different BusinessWorks versions, crucial for optimizing memory usage in large-scale deployments and resource-constrained environments. You'll learn various memory optimization techniques including process instance pooling, garbage collection tuning, memory-mapped file usage, and strategies for reducing the memory footprint of idle processes. The article provides version-specific configurations and explains the trade-offs between memory usage and processing performance.

Advanced memory management topics include implementing memory budgets for different application components, monitoring memory usage patterns, identifying memory leaks, and optimizing data structures for minimal memory consumption. The guide addresses containerized deployment considerations, memory limits in Kubernetes environments, and strategies for running multiple BusinessWorks applications on shared infrastructure. Best practices cover capacity planning, memory profiling techniques, handling out-of-memory scenarios gracefully, and implementing memory-aware scaling policies for cloud deployments.

**Link:** [Article](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/bw6x-bwce-bw5x-how-to-enable-engine-memory-saving-mode-in-businessworks-6x-and-businessworks-container-edition-r3359/)

---

| Article Title | Version | Focus Area |
|--------------|---------|------------|
| [Call Dynamic Sub-Processes](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/how-to-call-dynamic-sub-processes-in-businessworks-and-businessworks-container-edition-r3341/) | BW6X, BWCE | Process Orchestration |
| [Manage HTTP Flows](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/bw5x-how-to-manage-http-flows-in-tibco-businessworks-5x-r3343/) | BW5X | HTTP Management |
| [Email TLS BW5](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/bw5x-how-to-connect-to-an-email-server-using-tlsv12-from-businessworks-5x-r3350/) | BW5X | Email Security |
| [HTTP Basic Auth BW5](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/bw5x-security-how-to-use-http-basic-authentication-in-businessworks-5x-r3351/) | BW5X | Authentication |
| [Parse JSON Flexibly](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/bw5x-how-to-parse-json-messages-with-extra-fields-or-fields-in-an-unexpected-order-in-businessworks-5x-r3352/) | BW5X | JSON Parsing |
| [Switch HTTP/HTTPS BW5](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/bw5x-how-to-switch-between-http-and-https-using-a-runtime-configuration-in-businessworks-5x-r3353/) | BW5X | Protocol Config |
| [Include In-Line Comments](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/bw6x-bwce-how-to-include-in-line-comments-in-businessworks-mappings-r3355/) | BW6X, BWCE | Documentation |
| [Solve Deserialization Errors](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/bw6x-bwce-how-to-solve-the-%E2%80%9Cunable-to-de-serialize-bw-process-error%E2%80%9D-when-debugging-two-applications-in-businessworks-6x-studio-r3356/) | BW6X, BWCE | Debugging |
| [Memory Saving Mode](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/bw6x-bwce-bw5x-how-to-enable-engine-memory-saving-mode-in-businessworks-6x-and-businessworks-container-edition-r3359/) | All Versions | Performance |
| [Share BW Installation](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/bw6x-bwce-how-to-share-a-businessworks-6x-installation-between-multiple-users-r3371/) | BW6X, BWCE | Multi-user Setup |
| [Share Same Port](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/bw6x-how-to-share-the-same-port-between-multiple-businessworks-6x-applications-r3376/) | BW6X | Networking |
| [Runtime Connection Selection](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/bw6x-bwce-how-to-select-a-connection-configuration-at-runtime-in-businessworks-6x-and-businessworks-container-edition-r3377/) | BW6X, BWCE | Dynamic Config |
| [Access HTTP Headers](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/bw6x-bwce-how-to-access-http-headers-while-exposing-or-invoking-web-services-in-businessworks-6x-and-businessworks-container-edition-r3379/) | BW6X, BWCE | Web Services |
| [Manage Swagger Updates](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/bw6x-bwce-how-to-manage-a-swagger-file-update-in-businessworks-6x-and-businessworks-container-edition-r3380/) | BW6X, BWCE | API Management |
| [Complex Mapping](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/bw6x-bwce-complex-mapping-scenarios-in-businessworks-6x-and-businessworks-container-edition-r3382/) | BW6X, BWCE | Data Transform |
| [JMS Properties](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/bw6x-bwce-how-to-use-jms-application-properties-in-businessworks-6x-and-businessworks-container-edition-r3384/) | BW6X, BWCE | Messaging |
| [Call External Scripts](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/bw6x-bwce-how-to-call-a-command-or-a-script-from-businessworks-or-businessworks-container-edition-r3389/) | BW6X, BWCE | System Integration |
| [SmartMapper](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/bw6x-bwce-how-to-use-the-smartmapper-in-businessworks-6x-and-businessworks-container-edition-r3391/) | BW6X, BWCE | Mapping Automation |
| [Debug SSL/TLS](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/bw6x-bwce-how-to-debug-ssltls-connections-in-businessworks-and-businessworks-container-edition-r3392/) | BW6X, BWCE | Security Debug |
| [Studio Tips](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/bw6x-bwce-studio-tips-and-tricks-for-businessworks-6x-and-businessworks-container-edition-r3393/) | BW6X, BWCE | Productivity |
| [JMS Priorities](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/bw6x-bwce-using-jms-message-priorities-with-businessworks-and-businessworks-container-edition-r3394/) | BW6X, BWCE | Message Priority |
| [EMS Compression](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/bw6x-bwce-using-tibco-ems-message-compression-in-businessworks-and-businessworks-container-edition-r3395/) | BW6X, BWCE | Performance |
| [JSON Compatibility](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/bw6x-bwce-how-to-manage-ascending-compatibility-for-json-formats-in-businessworks-and-businessworks-container-edition-r3400/) | BW6X, BWCE | Schema Evolution |
| [Disable XML Validation](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/bw6x-bwce-how-to-disable-xml-validation-at-activity-level-in-businessworks-and-businessworks-container-edition-r3401/) | BW6X, BWCE | Performance |
| [Version Matching](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/bw6x-bwce-businessworks-container-edition-and-businessworks-6x-matching-release-versions-r3402/) | BW6X, BWCE | Compatibility |
| [Concatenate Properties](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/bw6x-bwce-how-to-concatenate-properties-in-businessworks-and-businessworks-container-edition-r3408/) | BW6X, BWCE | Configuration |
| [JDBC Drivers Doc](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/bw6x-bwce-bw5x-where-to-find-the-tibcosoftwareinc-jdbc-drivers-documentation-r3410/) | All Versions | Database |
| [OAuth 2.0](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/bw6x-bwce-using-oauth-20-in-businessworks-and-businessworks-container-edition-r3411/) | BW6X, BWCE | Security |
| [Binary Encoding](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/bw6x-bwce-how-to-decode-encode-a-string-in-binary-format-in-businessworks-and-businessworks-container-edition-r3412/) | BW6X, BWCE | Data Handling |
| [BW Agent REST API](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/bw6x-how-to-use-the-bwagent-rest-api-in-businessworks-r3419/) | BW6X | API Automation |
| [Hawk REST API](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/bw6x-how-to-use-the-hawk-6x-rest-api-in-a-businessworks-context-r3420/) | BW6X | Monitoring API |
| [Templates](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/bw6x-bwce-how-to-use-templates-in-businessworks-and-businessworks-container-edition-r3421/) | BW6X, BWCE | Reusability |
| [Stream Files](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/bw6x-bwce-how-to-stream-a-file-over-http-or-https-in-businessworks-and-businessworks-container-edition-r3424/) | BW6X, BWCE | Large Files |
| [Startup/Shutdown Process](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/bw6x-bwce-how-to-execute-a-process-at-application-start-up-or-shutdown-in-businessworks-and-businessworks-container-edition-r3425/) | BW6X, BWCE | Lifecycle |
| [Getting Started](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/bw6x-bwce-how-to-get-started-with-businessworks-and-businessworks-container-edition-r3427/) | BW6X, BWCE | Basics |
| [Shared Variables](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/bw6x-bwce-useful-things-to-know-about-module-shared-variables-in-businessworks-and-businessworks-container-edition-r3429/) | BW6X, BWCE | State Management |
| [Update XSD Namespace](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/bw6x-bwce-how-to-update-an-xsd-schema-namespace-in-businessworks-and-businessworks-container-edition-r3430/) | BW6X, BWCE | Schema |
| [Properties in Mappings](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/bw6x-bwce-how-to-access-property-values-in-mappings-in-businessworks-and-businessworks-container-edition-r3431/) | BW6X, BWCE | Mapping |
| [JDBC Best Practices](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/bw6x-bwce-useful-things-to-know-about-jdbc-activities-in-businessworks-and-businessworks-container-edition-r3444/) | BW6X, BWCE | Database |
| [Improve Studio UX](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/bw6x-bwce-how-to-improve-the-businessworks-studio-user-experience-r3511/) | BW6X, BWCE | IDE |
| [Check BW Version](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/bw6x-bwce-how-to-check-the-businessworks-version-from-an-application-r3512/) | BW6X, BWCE | Runtime Info |
| [Date Calculations](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/bw6x-bwce-how-to-calculate-the-number-of-days-between-two-dates-in-businessworks-and-businessworks-container-edition-r3523/) | BW6X, BWCE | Date Handling |
| [BWCE Releases](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/bwce-release-highlights-for-recent-businessworks-container-edition-versions-r3525/) | BWCE | Release Notes |
| [BW6 Releases](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/bw6x-release-highlights-for-recent-businessworks-versions-r3526/) | BW6X | Release Notes |
| [Extract JSON](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/bw6x-bwce-how-to-extract-field-values-from-a-json-message-without-using-an-xml-schema-in-businessworks-and-businessworks-container-edition-r3527/) | BW6X, BWCE | JSON Parsing |
| [Handle Bad JSON](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/bw6x-bwce-how-to-get-an-error-message-when-a-rest-component-binding-receives-a-badly-formatted-json-message-in-businessworks-and-businessworks-container-edition-r3547/) | BW6X, BWCE | Error Handling |
| [Mapper Threading](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/bw6x-bwce-multi-threading-in-the-businessworks-mapper-and-the-businessworks-container-edition-mapper-r3551/) | BW6X, BWCE | Concurrency |
| [Cron Expressions](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/bw6x-bwce-how-to-use-cron-expressions-for-scheduling-tasks-in-the-timer-activity-r3552/) | BW6X, BWCE | Scheduling |
| [XSD in WSDL](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/bw6x-bwce-how-to-use-an-xml-schema-definition-embedded-in-an-wsdl-in-businessworks-and-businessworks-container-edition-r3553/) | BW6X, BWCE | Web Services |
| [REST/JSON Config](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/bw6x-bwce-properties-available-to-configure-the-businessworks-and-businessworks-container-edition-rest-json-palette-r3554/) | BW6X, BWCE | REST Config |
| [JMS Request-Reply](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/bw6x-bwce-how-to-manage-jms-request-reply-scenarios-in-businessworks-and-businessworks-container-edition-r3557/) | BW6X, BWCE | Messaging Patterns |
| [SQL Windows Auth](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/bw-5x-bw6x-bwce-how-to-connect-to-an-sql-server-database-using-windows-authentication-from-a-linux-environment-r3559/) | All Versions | Database Auth |

---

## Newly Added Articles


Additional articles imported from the TIBCO BusinessWorks community library.


---

## Newly Added Articles (Development & AI)


### AI, RAG & MCP

#### Team-Based Mapping Intelligence in BW6: Sharing Knowledge Across Projects
**Summary:** In enterprise integration environments, consistency across mappings is critical.  
**Tags:** `BW6X`, `mapping`, `mapper`, `ai`, `businessworks`

**Description:**  
In enterprise integration environments, consistency across mappings is critical. Integration teams often work on multiple projects where similar schema structures appear repeatedly, yet each developer may end up solving the same mapping challenges independently.

Smart Mapper in TIBCO ActiveMatrix BusinessWorks addresses this problem through Shared Learning, allowing teams to contribute mapping intelligence to a centralized repository. When one developer solves a complex mapping problem, that knowledge becomes available to the entire team. Over time, Smart Mapper evolves from a simple auto-mapping utility into an enterprise knowledge base for integration mappings. This article is part of an ongoing series on Smart Mapper capabilities in BW6, covering various aspects such as automation, mapping quality, and team collaboration.

**Link:** [Article](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/team-based-mapping-intelligence-in-bw6-sharing-knowledge-across-projects-r3813/)

#### Improving Mapping Quality with Recommendations and Reinforcement Learning in BW6
**Summary:** Data mapping is one of the most time-consuming activities when building integrations.  
**Tags:** `BW5X`, `BW6X`, `mapping`, `mapper`, `ai`

**Description:**  
Data mapping is one of the most time-consuming activities when building integrations. In complex schemas, developers often need to manually identify matching fields across deeply nested structures.Starting with recent versions of TIBCO ActiveMatrix BusinessWorks (BW6), the Smart Mapper introduces intelligent recommendations that significantly reduce manual mapping effort while improving consistency.

This article explains how Smart Mapper generates mapping recommendations, how its scoring algorithm works, and how tuning its parameters can improve mapping quality. This article is part of an ongoing series on Smart Mapper capabilities in BW6, covering various aspects such as automation, mapping quality, and team collaboration. You may also find these related articles helpful: Reducing Manual Mapping Effort in BW6: Introducing Offline AI Mapper Team-Based Mapping Intelligence in BW6: Sharing Knowledge Across Projects Why Mapping Recommendations Matter In real-world integrations, schemas rarely match perfectly.

**Link:** [Article](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/improving-mapping-quality-with-recommendations-and-reinforcement-learning-in-bw6-r3812/)

#### Reducing Manual Mapping Effort in BW6: Introducing Offline AI Mapper
**Summary:** Data mapping is a cornerstone of integration development, often consuming the majority of development cycles.  
**Tags:** `BW6X`, `mapping`, `mapper`, `ai`, `businessworks`

**Description:**  
Data mapping is a cornerstone of integration development, often consuming the majority of development cycles. In modern enterprise landscapes involving hundreds of fields and deeply nested structures, manual mapping is often time-consuming and error-prone.

Offline AI Mapper(Smart Mapper) in TIBCO ActiveMatrix BusinessWorks provides an intelligent assistant that automatically determines how data is to be mapped in an activity's Input tab by analyzing structural and semantic patterns. Rather than requiring developers to manually drag every source field onto its target counterpart, Smart Mapper evaluates multiple structural and semantic dimensions — name similarity, data type, ancestor context, hierarchical depth, and cardinality — and automatically generates high-confidence mappings.

**Link:** [Article](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/reducing-manual-mapping-effort-in-bw6-introducing-offline-ai-mapper-r3811/)

#### BW Smart Flows : Smart Exception Handling using BW AI Plugin
**Summary:** Handling exceptions in integration flows traditionally requires manual intervention, static error handling logic, or application redeployment.  
**Tags:** `BW6X`, `BWCE`, `plugin`, `troubleshooting`, `mcp`

**Description:**  
Handling exceptions in integration flows traditionally requires manual intervention, static error handling logic, or application redeployment. This article demonstrates how TIBCO BusinessWorks Smart Flows, combined with MCP (Model Context Protocol), enable intelligent, natural language–driven exception handling for both system and business exceptions.

Using two retail use cases, this article shows how MCP-enhanced Smart Flows can analyze failures, suggest corrective actions, and enable seamless recovery — all without modifying core process logic. Introduction: As integration landscapes become more complex, error handling and recovery mechanisms must evolve. Traditional approaches often lead to: Extended downtime, Manual troubleshooting, Rigid exception logic, Process redeployment for simple data corrections. BW Smart Flows introduce a new paradigm by integrating AI-driven analysis and natural language interaction into BusinessWorks processes.

**Link:** [Article](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/tibco-bw-smart-flows-smart-exception-handling-using-bw-ai-plugin-r3594/)

#### Extending BW6 with MCP: Enabling Intelligent Access to BWAgent Operations
**Summary:** TIBCO BusinessWorks has always included the BWAgent, a lightweight daemon process that plays a central role in the runtime architecture.  
**Tags:** `BW6X`, `rest`, `mcp`, `soap`, `ai`

**Description:**  
TIBCO BusinessWorks has always included the BWAgent, a lightweight daemon process that plays a central role in the runtime architecture. The BWAgent is responsible for:

Provisioning and managing AppNodes and applications, Executing administrative and lifecycle operations, Synchronizing runtime metadata between the datastore and the local file system, Enabling communication and coordination between agents running on different machines. Traditionally, BWAgent capabilities have been accessed through multiple interfaces, including: bwadmin (command-line interface), TIBCO Enterprise Administrator (TEA) UI, BWAgent REST APIs. What's New in BW 6.12.0 HF02: With BW 6.12.0 HF02, TIBCO has introduced Model Context Protocol (MCP) server support for REST and SOAP services.

**Link:** [Article](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/extending-bw6-with-mcp-enabling-intelligent-access-to-bwagent-operations-r3592/)

#### From Data to Dialogue: Turning BW into a Conversational Analytics Engine by using BW…
**Summary:** It’s Monday morning.  
**Tags:** `BW6X`, `BWCE`, `plugin`, `database`, `engine`

**Description:**  
It’s Monday morning. The weekly operations meeting starts, and someone asks:

Quote “Why did online sales drop last week?” The BI analyst opens dashboards. Runs multiple queries. Checks promotion calendars. Looks at inventory reports. Reads campaign briefs. Thirty to forty minutes later, the team finally has the answer. But what if that answer appeared in 10 seconds — complete with evidence and recommendations? That’s the promise of combining Business Intelligence systems like BW with Retrieval-Augmented Generation (RAG). Moving from Reports to Conversations Traditional BI tools are excellent at answering what happened. But the real business questions usually ask why something happened and what to do next.

**Link:** [Article](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/ragdatatodialog/)

#### Less Data, More Intelligence: Secure AI with BW RAG
**Summary:** Many early implementations take a straightforward approach — they simply feed large volumes of enterprise data into the model’s context window.  
**Tags:** `BW6X`, `BWCE`, `database`, `rag`, `windows`

**Description:**  
Many early implementations take a straightforward approach — they simply feed large volumes of enterprise data into the model’s context window. Entire reports, documents, database extracts, or knowledge bases are appended to prompts so the model can generate answers.

While this works, it introduces two significant problems. First, data exposure risk increases dramatically. When large datasets are included in prompts, sensitive information that may not be relevant to the question becomes visible to the model. In regulated environments, this can create governance, compliance, security and privacy concerns. Context windows are expensive and inefficient. BW RAG Solution BW Retrieval-Augmented Generation (RAG) changes the architecture. Instead of sending large amounts of raw data to the AI model, RAG introduces an intelligent retrieval layer.

**Link:** [Article](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/ragsecureai/)


### Maven & CI/CD

#### Deploying TIBCO BusinessWorks 6 Applications with GitHub Actions and Maven
**Summary:** TIBCO BusinessWorks 6 (BW6) is an enterprise integration platform used across industries for service orchestration, API integration, and backend process automation.  
**Tags:** `BW6X`, `maven`, `plugin`, `deployment`, `github`

**Description:**  
TIBCO BusinessWorks 6 (BW6) is an enterprise integration platform used across industries for service orchestration, API integration, and backend process automation. Historically, BW6 deployments have been manual affairs: a developer builds an EAR in TIBCO Business Studio, hands it to an operations team, and someone manually uploads it through the TIBCO Administrator console or runs a deployment script from a workstation. This pattern is brittle, error-prone, and inherently unscalable.

GitHub Actions is one of the most widely-adopted CI/CD platforms today. It powers pipelines for millions of repositories worldwide, from tiny open-source projects to Fortune 500 enterprises. Its tight integration with GitHub's code hosting, pull request, and environment protection features makes it a natural fit for any team already working in GitHub — including integration developers building BW6 applications. When you combine GitHub Actions with BW6's Maven plugin you gain a fully automated, auditable deployment pipeline where every push to main triggers a build, packages the EAR, deploys to DEV automatically, and gates PROD behind a human approval.

**Link:** [Article](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/deploying-tibco-businessworks-6-applications-with-github-actions-and-maven-r3825/)

#### Comprehensive Guide to BW6 Maven Plugin Goals
**Summary:** TIBCO BusinessWorks 6 (BW6) provides several Maven goals to manage builds, deployments, and runtime operations.  
**Tags:** `BW6X`, `maven`, `xml`, `plugin`, `deployment`

**Description:**  
TIBCO BusinessWorks 6 (BW6) provides several Maven goals to manage builds, deployments, and runtime operations. Each goal can be executed independently or bound to a Maven lifecycle phase. This article summarizes the main BW6 Maven goals, their descriptions, parameters, and usage

Each goal corresponds to a specific task in the application lifecycle, such as packaging, deployment, export, or utility operations. Below is a detailed description of all 12 commonly used Maven goals. You can see the list of goals exposed by a plugin version using below command mvn help:describe -Dplugin=com.tibco.plugins:bw6-maven-plugin:2.11.0 -Dfull ++++++++++ [INFO] Scanning for projects... [INFO] Starting Maven Build for BW6 Project................................. [INFO] Checking for In-Project JAR dependencies if any and Pushing them to Local Maven Repository [INFO] ...

**Link:** [Article](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/comprehensive-guide-to-bw6-maven-plugin-goals-r3820/)

#### Using BWDESIGN with Maven in BusinessWorks 6
**Summary:** The BW6 maven Plugin provides a set of Maven goals that help automate tasks for TIBCO BusinessWorks™ 6 and BusinessWorks™ Container Edition projects.  
**Tags:** `BW6X`, `BWCE`, `maven`, `containers`, `json`

**Description:**  
The BW6 maven Plugin provides a set of Maven goals that help automate tasks for TIBCO BusinessWorks™ 6 and BusinessWorks™ Container Edition projects. One of the most useful goals in this plugin is bwdesignUtility, which allows developers to validate, inspect, and generate design artifacts directly from the command line through Maven.

What Is the BW Design Utility Goal? The bwdesignUtility goal is a Maven goal in the TIBCO BW6 Maven plugin that enables command-line interaction with a BusinessWorks project's design data. Typically, you will use the Maven plugin with bwdesignUtility to execute the following tasks: Validate the BW Module and Application project, Generate Process Diagrams, Generate Manifest JSON (TCI BW), Export Profile. This is especially helpful when building automated CI/CD pipelines, generating design documentation, or pre-validating projects before a full build.

**Link:** [Article](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/using-bwdesign-with-maven-in-businessworks-6-r3609/)

#### Deploying Mavenized BW6 Applications Across Runtime Environments
**Summary:** The BusinessWorks Maven Plugin enables "Mavenization"—converting standard TIBCO projects into Maven-compliant projects with Project Object Model (pom.xml) files.  
**Tags:** `BW6X`, `maven`, `docker`, `kubernetes`, `containers`

**Description:**  
The BusinessWorks Maven Plugin enables "Mavenization"—converting standard TIBCO projects into Maven-compliant projects with Project Object Model (pom.xml) files. This allows developers to use standard Maven goals to package EAR files and deploy them directly to various runtimes.

The five primary deployment modes supported are: Deployment to BW6 AppNode (AppSpace): For physical or virtual BW6 environments managed by a BWAgent. EAR Deployment with Config File: For deploying pre-built EAR files without rebuilding source code. Deployment to Docker (BWCE): For creating Docker images and starting containers for BW6 Container Edition. Deployment to TIBCO Cloud Integration (TCI): For pushing applications directly to the TIBCO Cloud. Deployment to TIBCO Platform: For Promoting application builds to Kubernetes-based data planes managed by the TIBCO Control Plane.

**Link:** [Article](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/deploying-mavenized-bw6-applications-across-runtime-environments-r3607/)

#### Working with Custom XPath Modules in Mavenized BW6 Projects
**Summary:** As BusinessWorks applications evolve, developers often extend standard functionality using custom XPath functions or reusable extension modules.  
**Tags:** `BW6X`, `maven`, `xpath`, `xpath-modules`, `businessworks`

**Description:**  
As BusinessWorks applications evolve, developers often extend standard functionality using custom XPath functions or reusable extension modules. These components introduce additional packaging considerations — especially when Maven is used to automate builds.

This article demonstrates how to: include custom XPath modules in Mavenized BW projects, package applications that depend on custom xpath modules, manage external Custom XPath Function modules. Section 1 — Understanding Custom XPath Modules: Custom XPath modules extend BusinessWorks expression capabilities by introducing reusable functions. These are typically used to encapsulate complex logic, standardize transformations, simplify repeated expressions. Custom XPath modules are not standalone runtime artifacts — they must be referenced correctly, packaged in build order, available during application assembly.

**Link:** [Article](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/working-with-custom-xpath-modules-in-mavenized-bw6-projects-r3604/)

#### Working with Shared Modules in Mavenized BW6 Projects
**Summary:** As BusinessWorks solutions grow, shared functionality — such as common processes, schemas, utilities, or integrations — is often reused across multiple applications.  
**Tags:** `BW6X`, `maven`, `shared-modules`, `businessworks`, `integration`

**Description:**  
As BusinessWorks solutions grow, shared functionality — such as common processes, schemas, utilities, or integrations — is often reused across multiple applications. Shared modules allow teams to centralize this logic, improving maintainability and consistency.

When Maven is introduced, shared modules become part of a structured multi-module build. Maven coordinates dependencies, packaging order, and artifact generation, ensuring that reusable components are built and consumed correctly. This guide walks through: Understanding shared modules in BW, Mavenizing applications that use shared modules, Mavenizing applications that use External shared modules. Section 1 - Understanding Shared Modules in BusinessWorks. A shared module is a reusable BW component that provides common logic or assets to multiple applications. Examples include common services, utility processes, schemas, shared configurations.

**Link:** [Article](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/working-with-shared-modules-in-mavenized-bw6-projects-r3603/)

#### Mavenizing & Packaging Your First BW6 Application
**Summary:** converting an existing BW application into a Maven-managed project.  
**Tags:** `BW6X`, `maven`, `businessworks`, `integration`, `how-to`

**Description:**  
converting an existing BW application into a Maven-managed project

, understanding the generated Maven structure, running Maven packaging, verifying build output. By the end, you will have a repeatable Maven build workflow for BW applications. Section 1 — Mavenizing a BW Application: 'Mavenizing' a BW project converts it into a structured build project driven by Maven instead of manual Studio packaging. This process: generates Maven POM files, introduces build automation, prepares the project for repeatable packaging.

**Link:** [Article](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/mavenizing-packaging-your-first-bw6-application-r3602/)

#### BW6 Maven Plugin - Introduction, Maven Fundamentals & Installation Guide
**Summary:** This article provides a foundational guide to using Apache Maven with TIBCO ActiveMatrix BusinessWorks.  
**Tags:** `BW6X`, `maven`, `plugin`, `installation`, `compatibility`

**Description:**  
This article provides a foundational guide to using Apache Maven with TIBCO ActiveMatrix BusinessWorks. It combines the introductory concepts, Maven fundamentals, and environment setup steps into a single reference designed to prepare developers for Maven-based BusinessWorks workflows

This article provides a foundational guide to using Apache Maven with TIBCO ActiveMatrix BusinessWorks. The sections are organized to build understanding progressively: Part A introduces the BW Maven Plugin and explains its purpose and compatibility requirements, Part B covers essential Maven concepts needed to understand build automation, Part C walks through the installation and setup process. Part A - Introduction: Modern integration delivery demands repeatable builds, automation, and consistency across environments. While BW Studio enables powerful visual development, manual packaging introduces variability that becomes difficult to scale.

**Link:** [Article](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/bw6-maven-plugin-introduction-maven-fundamentals-installation-guide-r3601/)

#### Steps Required to Deploy an Existing Maven-Based BWCE Project on the TIBCO Platform
**Summary:** This article outlines the necessary steps to deploy an existing Maven-based BWCE application on the TIBCO platform.  
**Tags:** `BWCE`, `maven`, `plugin`, `deployment`, `properties`

**Description:**  
This article outlines the necessary steps to deploy an existing Maven-based BWCE application on the TIBCO platform.  Fortunately, the process requires only minor modifications to the pom file and the addition of a few extra files to your project.

Synopsis: This article outlines the necessary steps to deploy an existing Maven-based BWCE application on the TIBCO platform. Fortunately, the process requires only minor modifications to the pom file and the addition of a few extra files to your project. Minimum BWCE Version: 2.9.1, Minimum Plugin Version: 2.9.8. STEP 1 - Update Plugin Version: Update the Application POM file, BW maven plugin version to 2.9.8 or higher. STEP 2 - Add Platform Properties To POM File: There are some additional properties that are used by the maven plugin when working with the TIBCO platform. project.type defines the deployment type for the BWCE application (must be set to platform).

**Link:** [Article](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/steps-required-to-deploy-an-existing-maven-based-bwce-project-on-the-tibco-platform-r3502/)

#### Automate TIBCO BusinessWorks? Container Edition deployments to K8S via Maven and…
**Summary:** Here are the steps to create an Automation Pipeline for CI using Maven for dependency management, Jenkins for job scheduling for TIBCO BusinessWorks?.  
**Tags:** `BWCE`, `maven`, `docker`, `kubernetes`, `containers`

**Description:**  
Here are the steps to create an Automation Pipeline for CI using Maven for dependency management, Jenkins for job scheduling for TIBCO BusinessWorks? Container Edition deployments to Kubernetes (GKE) over Docker containers.

Pre-requisites: Install Maven plugin from https://github.com/TIBCOSoftware/bw6-plugin-maven/releases on existing TIBCO BusinessWorks? 6 or TIBCO BusinessWorks? Container Edition installation to generate the required POM files in TIBCO BusinessStudio?. Install Jenkins from https://jenkins.io/ or there?s also a Jenkins docker image on https://hub.docker.com/_/jenkins Install Docker - https://docs.docker.com/docker-for-mac/install/ (a reference to the link for Mac) Access to GCP Console https://console.cloud.google.com (needed if you?re leveraging GKE) Install gcloud CLI from https://cloud.google.com/sdk/docs/quickstart-macos (needed if you?re leveraging GKE for the scenario) Step 1: BusinessWo...

**Link:** [Article](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/automate-tibco-businessworkstm-container-edition-deployments-k8s-maven-and-jenkins-cicd/)

#### Scripted Build and Deployment for TIBCO ActiveMatrix BusinessWorks
**Summary:** The following is a list of build and deployment tools for TIBCO ActiveMatrix BusinessWorks.  
**Tags:** `BW5X`, `maven`, `deployment`, `release-notes`, `businessworks`

**Description:**  
The following is a list of build and deployment tools for TIBCO ActiveMatrix BusinessWorks.

Tool Interpreter Builds EARS Builds DTLs Deploys EARs Last Release Date No. of Releases Release Status License Ant For ActiveMatrix BusinesWorks Apache Ant Yes Unknown Yes 2008-01-31 1 Beta GPL TIBant Apache Ant Yes Yes Yes 2013-03-05 10+ Stable LGPL bw-maven Apache Maven No Yes No 2011-07-28 1 Unknown Unknown Please feel free to edit this resource to update details or add any new tools or tools that have been missed.

**Link:** [Article](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/scripted-build-and-deployment-tibco-activematrix-businessworkstm/)


### Development

#### EMS - Adapters and Plugins - Useful things to know about LTS releases
**Summary:** This article is just to group useful support and documentation resources about Long Term Support (LTS) releases for BW5.X, BW6.X and other TIBCO products.  
**Tags:** `BW5X`, `BW6X`, `ems`, `release-notes`, `businessworks`

**Description:**  
This article is just to group useful support and documentation resources about Long Term Support (LTS) releases for BW5.X, BW6.X and other TIBCO products.

Support article on LTS releases. Overwiew and list of LTS releases. BW 5.X Adapters and Plugins LTS releases. BW 6.X Plugins LTS releases.

**Link:** [Article](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/bw5x-bw6x-ems-adapters-and-plugins-useful-things-to-know-about-lts-releases-r3599/)

#### ActiveMatrix BusinessWorks 6 Demo Video
**Summary:** Short video walkthrough of the BusinessWorks 6 Studio, runtime, and core capabilities.
**Tags:** `BW6X`, `demo`, `video`, `overview`, `getting-started`

**Description:**
A short demo recording introducing the BusinessWorks 6 platform: Studio design environment, project structure, palettes, and a basic process flow. Useful for first-time evaluators or for sharing with stakeholders who need a quick visual overview of what BW6 looks like before committing to deeper exploration.

The video predates BW 6.10+ but the Studio layout and core concepts (modules, processes, activities, mapper) are unchanged. For up-to-date capability reviews, also see the BW6.X release-highlights articles.

**Link:** [Article](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/tibco-activematrix-businessworkstm-6-demo-video/)
#### ? Community Edition Connectors
**Summary:** Please see the TIBCO Cloud Integration Connector Compatibility Worksheet for details on TIBCO Community Edition Connectors for TIBCO BusinessWorks.  
**Tags:** `BW6X`, `BWCE`, `cloud-integration`, `connectors`, `compatibility`

**Description:**  
Please see the TIBCO Cloud Integration Connector Compatibility Worksheet for details on TIBCO Community Edition Connectors for TIBCO BusinessWorks.

Go to articles There are no comments to display. Join the conversation You can post now and register later. If you have an account, sign in now to post with your account. Note: Your post will require moderator approval before it will be visible. Add a comment... Table of Contents Reference Home Articles Platform Integration BusinessWorks TIBCO ActiveMatrix BusinessWorks? Community Edition Connectors All Activity

**Link:** [Article](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/tibco-activematrix-businessworkstm-community-edition-connectors/)

#### Connectors Compatibility Lists
**Summary:** Reference matrix of supported plugins, adapters, and connector versions for ActiveMatrix BusinessWorks.
**Tags:** `BW5X`, `BW6X`, `connectors`, `compatibility`, `reference`

**Description:**
This community page tracks compatibility of ActiveMatrix BusinessWorks plugins and adapters across BusinessWorks engine versions, OS releases, and runtime platforms. Use it as a starting point when evaluating whether a given plugin (e.g., SAP, Salesforce, JDE, Siebel, MQ) is supported on the BW release you are running.

The page links out to per-plugin compatibility matrices maintained alongside the product downloads. Treat the live page as authoritative — versions and lifecycle status change as plugins are released, deprecated, or retired.

**Link:** [Article](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/tibco-activematrix-businessworks-connectors-compatibility-lists/)
#### ADB Hebrew Support Configurations
**Summary:** Configure the BusinessWorks ADB (Active Database) adapter to handle Hebrew (right-to-left) character sets.
**Tags:** `BW5X`, `adb`, `database`, `i18n`, `character-set`

**Description:**
This article documents the configuration changes required for the BusinessWorks ADB adapter to correctly publish and consume Hebrew character data from a database. Hebrew is a right-to-left script with specific character-set requirements (typically UTF-8 or a Hebrew-specific encoding) that must be aligned across the database, the JDBC driver, and the ADB adapter configuration.

Misconfigured locale or NLS settings show up as garbled output, question marks, or failed publications. The article covers the relevant ADB configuration entries, JDBC connection properties, and OS-level locale considerations needed for end-to-end Hebrew text fidelity.

**Link:** [Article](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/adb-hebrew-support-configurations/)
#### BusinessWorks 6.3.2 - REST Resource HOWTO Example - A simple one
**Summary:** TIBCO BusinessWorks provides REST samples, but they are pretty complicated.  
**Tags:** `BW6X`, `rest`, `xml`, `businessworks`, `integration`

**Description:**  
TIBCO BusinessWorks provides REST samples, but they are pretty complicated. Here, I have much simpler examples using only the file and XML palette. There are step-by-step instructions and also ready-made project examples.

1. Simple REST example: Download the word document with pictures and the project in the zip file testrestexample.zip from Resources below. 2. A more complicated example with a multi-operation subprocess. This example continues from Step #1. Download the word document with pictures and the project in the zip file testrestexamplewithsubprocess.zip from Resources below testrestexample.zip 1.75 MB 319 downloads testrestexamplewithsubprosess.zip 2.06 MB 323 downloads

**Link:** [Article](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/tibco-businessworkstm-632-rest-resource-howto-example-simple-one/)

#### BusinessWorks? 5
**Summary:** Click Here for information on TIBCO BusinessWorks?.  
**Tags:** `BW5X`, `BW6X`, `deployment`, `soap`, `best-practices`

**Description:**  
Click Here for information on TIBCO BusinessWorks? version 6

BusinessWorks is an integration product suite for the enterprise. The software allows you to create services and integrate applications using a visual, model-driven development environment, and then deploy them in the BusinessWorks runtime. This section contains a variety of educational and how-to materials designed to help you get up and running with BusinessWorks quickly and easily. To simplify locating content, we've organized them into the following categories: Getting Started Installing BusinessWorks 5.x TIBCO Universal Installer Hints Using Palettes Working with the poller feature of the file palette to detect file changes (creation, modification, or deletion) and kick off a process.

**Link:** [Article](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/tibco-activematrix-businessworks-5/)

#### Clarification on SOAP Array
**Summary:** SOAP Array is one of the few features in the legacy SOAP Encoding standard that is still commonly used today.  
**Tags:** `BW5X`, `xml`, `xsd`, `wsdl`, `http`

**Description:**  
SOAP Array is one of the few features in the legacy SOAP Encoding standard that is still commonly used today. In general, a SOAP message with SOAP Array cannot be processed with a standard XML processor and therefore many interoperability issues arise around messages with SOAP Array. In this article, we provide some understanding of the concept and mention some common interoperability issues.

SOAP Array was first defined in the SOAP 1.1 specification, Section 5. Section 5 defines SOAP Encoding, which is an encoding style based on a simple type system. When using WSDL to describe a SOAP interface, use "encoded" binding to choose an encoding style other than literally applying XSD schema. In most cases, SOAP Encoding is chosen as the encoding style by setting encodingStyle="http://schemas.xmlsoap.org/soap/encoding/". Additionally, since "encoded" binding always comes with RPC style, SOAP Array is traditionally used with RPC-encoded bindings.

**Link:** [Article](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/clarification-soap-array/)

#### Clarifications on Data Mapping
**Summary:** The Input tab of the activity allows you to supply the data that an activity expects as input.  
**Tags:** `BW6X`, `BWCE`, `mapping`, `mapper`, `xslt`

**Description:**  
The Input tab of the activity allows you to supply the data that an activity expects as input. The interface is a GUI editor of Extensible Stylesheet Language Transformation (XSLT), also called Data Mapper. TIBCO ActiveMatrix BusinessWorks? implements the transformation logic into XSLT code and executes it at runtime using the result as the activity input.

ActiveMatrix BusinessWorks documentation gives a good explanation of the mapper interface. For detailed information, please refer to ActiveMatrix BusinessWorks Process Design Guide, Chapter 8 -- Mapping and Transforming Data: Overview of Mapping and Transformation. In this article, we will address common confusion regarding the data mapper. Does mapping change the schema? More specifically, does mapping make an optional element required?? The answer is no.

**Link:** [Article](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/clarifications-data-mapping/)

#### Convert Oracle XMLType to String
**Summary:** Convert Oracle XMLType column values to strings for use in BusinessWorks JDBC and mapping activities.
**Tags:** `BW6X`, `BWCE`, `oracle`, `xml`, `jdbc`

**Description:**
Oracle's XMLType is a structured XML data type that JDBC drivers and BusinessWorks XSD-based mappers do not always handle directly. Converting XMLType values to plain strings at the SQL or driver layer lets BW process them as ordinary text or re-parse them through Parse XML for downstream mapping.

This reference covers the SQL-side conversion (XMLType.getStringVal() / getClobVal()) and the BusinessWorks JDBC activity configuration needed to retrieve the converted result. Use it when an Oracle table column is XMLType and the BW process needs to read, transform, or pass it on as XML or string content.

**Link:** [Article](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/convert-oracle-xmltype-string/)
#### Correlate EMS messages in a request response scenario
**Summary:** Consider the scenario where you are using a JMS Queue Requestor which sends a request and waits for a reply.  
**Tags:** `BW6X`, `BWCE`, `jms`, `ems`, `troubleshooting`

**Description:**  
Consider the scenario where you are using a JMS Queue Requestor which sends a request and waits for a reply. Additionally, you have a corresponding process (say a JMSQueue Receiver) that receives these requests and sends back replies (Reply To JMS Message).

The JMS request/reply activity uses temporary destinations to ensure that reply messages are received only by the process instance that sent the request. While sending each request the JMS Queue Requestor creates a temporary queue for the reply. It then sends the temporary reply queue name along with the request message. The temporary queue name is unique for each process instance. If the replyToQueue queue (static) is specified then all replies will be sent to the same queue and there will be no guarantee that the correct reply will be received by the process instance that sent the request.

**Link:** [Article](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/how-correlate-ems-messages-request-response-scenario/)

#### Creating MS Office Files Using XML Schema Document Type
**Summary:** There are schemas for various types of documents (Excel, Word, etc.) There are also various schemas for the versions as well.  
**Tags:** `BW6X`, `BWCE`, `xml`, `businessworks`, `integration`

**Description:**  
There are schemas for various types of documents (Excel, Word, etc.) There are also various schemas for the versions as well.

This example creates an XLS file using the Excel 2003 schema. When run, it will create a file in c:\tmp\msofficedocuments (the directory will be created automatically) that you can open normally by double-clicking the file (if you have Excel 2003 installed.) More information can be found at Microsoft's Download Center. (A little bit of tweaking has to be done because the schemas include other schemas in the distribution.) This isn't really a "TIBCO thing" since you could (obviously) use this schema from anywhere, but as I've had uses to create Excel files from TIBCO I thought I'd throw the example out there as something you could do to create something a little fancier than CSV files.

**Link:** [Article](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/creating-ms-office-files-using-xml-schema-document-type/)

#### Enable additional logging in TIBCO ActiveMatrix BusinessWorks™ 5
**Summary:** This article explains how to enable additional logging for debugging purposes in TIBCO ActiveMatrix BusinessWorks™ 5 (BW).  
**Tags:** `BW5X`, `logging`, `debugging`, `properties`, `businessworks`

**Description:**  
This article explains how to enable additional logging for debugging purposes in TIBCO ActiveMatrix BusinessWorks™ 5 (BW).

General Logging Activity Tracing: To enable additional logging for all the activities in all the process definitions in an application, set the property Trace.Task.* to true. It is possible to enable additional logging for specific process definitions or specific activities. To enable additional logging for all the activities in this process definition only, set the property: Trace.Task.<process>.process.*=true. Whitespace characters in names must be escaped. Activity Input/Output Logging: When tracing is enabled for an activity, it is possible to get the activity input and output.

**Link:** [Article](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/how-to-enable-additional-logging-in-tibco-activematrix-businessworks5/)

#### Enable SOAP Tracing to Capture SOAP Replies
**Summary:** Turn on BusinessWorks SOAP tracing so request/response envelopes are captured to the engine log for troubleshooting.
**Tags:** `BW5X`, `soap`, `troubleshooting`, `logging`, `web-services`

**Description:**
When debugging a SOAP web-service call from BusinessWorks, the most useful artifact is the actual request and response envelope as it left or arrived at the engine. This article shows how to enable SOAP tracing in BusinessWorks 5.X so the raw SOAP envelopes are written to the engine log alongside normal trace output.

The trace setting is controlled via JVM properties or BW activity logging configuration. Enable it temporarily during diagnosis (it is verbose and can affect performance), capture the failing request/response, then disable it again. Useful for diagnosing schema mismatches, namespace issues, and authentication failures against external SOAP endpoints.

**Link:** [Article](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/enable-soap-tracing-capture-soap-reply/)
#### Extending XPath Functions
**Summary:** The attached zip file has 2 items in it.  
**Tags:** `BW6X`, `BWCE`, `xpath`, `businessworks`, `integration`

**Description:**  
The attached zip file has 2 items in it. One is a Java program that shows a template of how to create a custom XPath function (the function does a string replace using regular expressions.) The other is a TIBCO ActiveMatrix BusinessWorks? project (created in TIBCO Designer? 5.6) that uses the custom function.

There is some very basic documentation on how to use the template to create your own custom functions (it is pretty straightforward) and the project shows how to add the Java class file into a project to make the functions available. I wrote it as an example for someone (as an aside, the project also has a replace string process definition that is built only using native XPath as well just for comparison) and thought it might be of general interest. If more information or instruction is needed, let me know and I'll update the example. AddingACustomXPathFunction.zip 14.09 kB · 215 downloads

**Link:** [Article](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/extending-xpath-functions/)

#### Hybrid Integration Platform (HIP) Demo
**Summary:** The Hybrid Integration Platform (HIP) is the key technology foundation for pervasive integration, enabling businesses to derive a Competitive Edge by providing them the Flexibility, Adaptability and Scalability.  
**Tags:** `BW6X`, `BWCE`, `hybrid-integration`, `businessworks`, `integration`

**Description:**  
The Hybrid Integration Platform (HIP) is the key technology foundation for pervasive integration, enabling businesses to derive a Competitive Edge by providing them the Flexibility, Adaptability and Scalability. A key for success to any business in today?s complex world is different integration platforms working together seamlessly.

A Hybrid Integration Platform lets organizations provide a compelling customer experience by connecting anything, anyone, and anywhere from the core on-premise systems all the way to edge IoT devices. This demo is intended to showcase how TIBCO's spectrum of integration provides the most advanced Hybrid Integration Platform to its Customers. The following slide on a high level depicts the possible components of a Hybrid Integration Platform. In the era of cloud, mobile, big data, and IoT, a single integration platform is not sufficient anymore. Businesses now require to integrate with applications that are on-premise and on the cloud.

**Link:** [Article](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/hybrid-integration-platform-hip-demo/)

#### Improve http connections performers in TIBCO ActiveMatrix BusinessWorks? using…
**Summary:** HTTP persistent connections are the idea of using the same TCP connection to send and receive multiple HTTP requests/responses, as opposed to opening a new one for every...  
**Tags:** `BW6X`, `BWCE`, `http`, `plugin`, `performance`

**Description:**  
HTTP persistent connections are the idea of using the same TCP connection to send and receive multiple HTTP requests/responses, as opposed to opening a new one for every single request/response pair. Using persistent connections is very important for improving HTTP performance.

There are several advantages of using persistent connections, including: Network friendly. Less network traffic due to fewer setting up and tearing down of TCP connections. Reduced latency on subsequent requests. Due to avoidance of the initial TCP handshake Long-lasting connections allow TCP sufficient time to determine the congestion state of the network, thus reacting appropriately. Ex.

**Link:** [Article](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/how-improve-http-connections-performers-tibco-activematrix-businessworkstm-using-persistent/)

#### Managed File Transfer - BusinessWorks Managed File Transfer Palette
**Summary:** This document highlights various components included in the TIBCO ActiveMatrix BusinessWorks Managed File Transfer palette and is intended to help garner an understanding of how to use the...  
**Tags:** `BW5X`, `mft`, `businessworks`, `integration`, `how-to`

**Description:**  
This document highlights various components included in the TIBCO ActiveMatrix BusinessWorks Managed File Transfer palette and is intended to help garner an understanding of how to use the palette. It is supplementary material and is not intended to replace existing documentation.

This document is applicable to TIBCO Managed File Transfer Command Center, Internet Server, Platform Server, and ActiveMatrix BusinessWorks Microsoft Word - TIBCO MFT - BusinessWorks MFT Palette.docx.pdf 272.14 kB 293 downloads

**Link:** [Article](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/tibcor-managed-file-transfer-businessworks-managed-file-transfer-palette/)

#### Managed File Transfer - Requirements and Sizing Guide
**Summary:** The purpose of this document is to provide a valuable reference source for TIBCO customers, partners, and employees regarding minimum software and hardware requirements, as well as high-level...  
**Tags:** `BW6X`, `BWCE`, `jms`, `database`, `mft`

**Description:**  
The purpose of this document is to provide a valuable reference source for TIBCO customers, partners, and employees regarding minimum software and hardware requirements, as well as high-level sizing guidelines, for TIBCO Managed File Transfer and TIBCO Slingshot products.

This document will be updated as new information or guidelines become available.

**Link:** [Article](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/tibco-managed-file-transfer-requirements-and-sizing-guide/)

#### Map HL7 securityText field in BW 5.X - How to map dynamic variable to Mixed Type…
**Summary:** This is the solution to map HL7 securityText field in BW 5.X .  
**Tags:** `BW5X`, `BW6X`, `hl7`, `businessworks`, `integration`

**Description:**  
This is the solution to map HL7 securityText field in BW 5.X :

Download this file from Resources below: how_to_map_text_field_in_bw_5.x.docx The equivalent solution for BW 6.X is available in the following TIBCO KB. how_to_map_text_field_in_bw_5.x.docx 520.19 kB 299 downloads

**Link:** [Article](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/how-map-hl7-securitytext-field-bw-5x-how-map-dynamic-variable-mixed-type-complex-element-which/)

#### Plug-in for Twitter Video Demo
**Summary:** This video shows you how the TIBCO ActiveMatrix BusinessWorks Plug-in for Twitter allows you to leverage and interact with Twitter data from your own systems in a few...  
**Tags:** `BW5X`, `twitter`, `businessworks`, `integration`, `how-to`

**Description:**  
This video shows you how the TIBCO ActiveMatrix BusinessWorks Plug-in for Twitter allows you to leverage and interact with Twitter data from your own systems in a few steps.

See the linked article for full details, configuration steps, and screenshots.

**Link:** [Article](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/tibco-activematrix-businessworkstm-plug-twitter-video-demo/)

#### RabbitMQ : TIBCO BusinessWorks? (Designer) integration/configuration
**Summary:** The following article describes the process of integrating RabbitMQ with the TIBCO BusinessWorks?.  
**Tags:** `BW6X`, `BWCE`, `jms`, `https`, `installation`

**Description:**  
The following article describes the process of integrating RabbitMQ with the TIBCO BusinessWorks? (Designer). Please keep in mind that the admin access user might be required to finish specific tasks.

The local instance of RabbitMQ To be able to launch the RabbitMQ installer, install first the Open Telecom Platform (the version I used was 23.0) and set the $ERLANG_HOME env var. Erlang: https://www.erlang.org/downloads Once done, download and install the RabbitMQ on your machine (in my case: Win10 OS). RabbitMQ: https://github.com/rabbitmq/rabbitmq-server/releases/ When the installation process is finished, user needs to verify if the RMQ service is up and running (use the cmd services.msc command). If so, install the management plugin that will let You to manage the broker via GUI.

**Link:** [Article](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/rabbitmq-tibco-businessworkstm-designer-integrationconfiguration/)

#### RetrieveResources Process 4 .Net - Retrieve WSDL from TIBCO ActiveMatrix BusinessWorks…
**Summary:** set 'application/soap+xml' in "Content-Type" at "Send HTTP Response" activity.  
**Tags:** `BW5X`, `xml`, `wsdl`, `http`, `soap`

**Description:**  
set 'application/soap+xml' in "Content-Type" at "Send HTTP Response" activity.

Screen Shot: Download the attached sample project (bwRetrive.zip) from Resources below. bwretrive.zip 26.6 kB 255 downloads

**Link:** [Article](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/retrieveresources-process-4-net-retrieve-wsdl-tibco-activematrix-businessworkstm-net/)

#### Set the timezone in TIBCO ActiveMatrix BusinessWorks?
**Summary:** Set the fallowing java.property in bwengin.tra and designer.tra (values are a sample).  
**Tags:** `BW6X`, `BWCE`, `properties`, `businessworks`, `integration`

**Description:**  
Set the fallowing java.property in bwengin.tra and designer.tra (values are a sample)

java.property.user.country=US java.property.user.language=en java.property.user.timezone=Asia/Jerusalem Go to articles There are no comments to display. Join the conversation You can post now and register later. If you have an account, sign in now to post with your account. Note: Your post will require moderator approval before it will be visible. Add a comment... Home Articles Platform Integration BusinessWorks Set the timezone in TIBCO ActiveMatrix BusinessWorks? All Activity

**Link:** [Article](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/set-timezone-tibco-activematrix-businessworkstm/)

#### Simulating WS-Addressing Structures for TIBCO ActiveMatrix BusinessWorks
**Summary:** TIBCO ActiveMatrix BusinessWorks does not natively support Web Services Addressing (WS-Addressing) as of version 5.7.x.  
**Tags:** `BW5X`, `xml`, `testing`, `businessworks`, `integration`

**Description:**  
TIBCO ActiveMatrix BusinessWorks does not natively support Web Services Addressing (WS-Addressing) as of version 5.7.x. The underlying XML engines are flexible, however, and you can create WS-Addressing compatible WSDLs and map in-to and out-of the WS-Addressing elements and attributes.

Creating a new listener will not be automatic and any of the underlying functions will have to be architected into a solution. This document only covers the WS-Addressing schema structure within ActiveMatrix BusinessWorks. This document covers the specific case of testing ActiveMatrix BusinessWorks against the Axis2 (v1.4.1) WsaMappingTest, which is basically an 'echo' model. This approach can be used to build out other Web Services functions as well, such as SAML or Web Services Security. WS-Addressing_in_BW.docx 158.68 kB 259 downloads

**Link:** [Article](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/simulating-ws-addressing-structures-tibco-activematrix-businessworkstm/)

#### Split Large XML Files
**Summary:** How to parse a large XML document is a common problem in XML applications.  
**Tags:** `BW6X`, `BWCE`, `xml`, `xpath`, `xslt`

**Description:**  
How to parse a large XML document is a common problem in XML applications. A large XML document always has many repeatable elements and the application needs to handle these elements iteratively . The problem is obtaining the elements from the document with the least possible overhead. Sometimes XML documents are so large (100MB or more) that they are difficult to handle with traditional XML parsers.

How to parse a large XML document is a common problem in XML applications. A large XML document always has many repeatable elements and the application needs to handle these elements iteratively. The problem is obtaining the elements from the document with the least possible overhead. Sometimes XML documents are so large (100MB or more) that they are difficult to handle with traditional XML parsers. One traditional parser is Document Object Model (DOM) based. It is easy to use, supports navigation in any direction (e.g., parent and previous sibling) and allows for arbitrary modifications.

**Link:** [Article](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/how-split-large-xml-files/)

#### Testing Tools for ActiveMatrix BusinessWorks
**Summary:** Survey of testing tools and approaches for ActiveMatrix BusinessWorks projects — unit, integration, and load.
**Tags:** `BW5X`, `BW6X`, `testing`, `tools`, `quality`

**Description:**
This community page collects testing tools and patterns commonly used with ActiveMatrix BusinessWorks: BW Test (the in-product unit-test framework), soapUI for service-level testing, JMeter and load-runner alternatives for performance, and CI integration patterns for running BW tests as part of a build pipeline.

Use it as a jumping-off point when standing up a test strategy for a BW codebase. The deeper articles linked from this page cover specific recipes (BW Test mocking, soapUI assertions for SOAP/JMS, etc.).

**Link:** [Article](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/testing-tools-tibco-activematrix-businessworkstm/)
#### Troubleshooting an TIBCO® EMS client (TIBCO ActiveMatrix BusinessWorks?) that stops…
**Summary:** The following are some basic checks that can be performed to determine why a client stops processing messages from a TIBCO EMS queue.  
**Tags:** `BW6X`, `BWCE`, `ems`, `troubleshooting`, `memory`

**Description:**  
The following are some basic checks that can be performed to determine why a client stops processing messages from a TIBCO EMS queue. Each case may vary depending on process design and other factors.

Check that the TIBCO ActiveMatrix BusinessWorks? client connection to the EMS server is okay and that there are no related reconnect issues due to network failure, etc. You can run the following commands from the tibemsadmin tool to check this. show server Provides statistics on the total number of queues, topics, pending messages on the server, memory usage, etc. show connections Displays client connections and sessions show connections version Shows the EMS client libraries used by the client. It is recommended that the client libraries be on the same version as the EMS server to take advantages of the latest defect fixes and enhancements.

**Link:** [Article](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/troubleshooting-ems-client-activematrix-businessworks-stops-processing-messages-ems-queue/)

#### Update time zone data in TIBCO ActiveMatrix BusinessWorks™ 5 environment
**Summary:** The Internet Assigned Number Authority (IANA) time zone database is updated periodically to reflect changes to time zone boundaries, UTC offsets, and daylight-saving rules.  
**Tags:** `BW5X`, `https`, `database`, `oracle`, `installation`

**Description:**  
The Internet Assigned Number Authority (IANA) time zone database is updated periodically to reflect changes to time zone boundaries, UTC offsets, and daylight-saving rules. This article explains how to update time zone data in TIBCO ActiveMatrix BusinessWorks™ 5 (BW) environment.

How to find the latest time zone database version: Information at https://www.iana.org/time-zones. How to find the time zone data version in BW: Download TZUpdater tool from Oracle. Run TZUpdater tool with java -jar tzupdater.jar -V. How to update time zone data in BW: Two options - update JRE if there is a JRE update release that incorporates the updated time zone data, or install TRA service pack/TIBCO Supplemental Updates.

**Link:** [Article](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/how-to-update-time-zone-data-in-tibco-activematrix-businessworks5-environment/)

#### Using DataSource to create JDBC Connection
**Summary:** For most applications that need to use JDBC, the default behavior of TIBCO ActiveMatrix BusinessWorks when creating JDBC connections is to use the DriverManager class to create a...  
**Tags:** `BW5X`, `jdbc`, `performance`, `businessworks`, `integration`

**Description:**  
For most applications that need to use JDBC, the default behavior of TIBCO ActiveMatrix BusinessWorks when creating JDBC connections is to use the DriverManager class to create a connection object. The process involves calling a synchronized method named 'getConnection', which could cause performance issues.

Table of Contents Configuring ActiveMatrix BusinessWorks to Use a DataSource Custom DataSource for Unsupported Drivers Assumptions and Avoiding Common Errors Encountered Issues For most applications that need to use JDBC, the default behavior of TIBCO ActiveMatrix BusinessWorks when creating JDBC connections is to use the DriverManager class to create a connection object. The process involves calling a synchronized method named 'getConnection', which could cause performance issues in some cases if the call gets blocked. To avoid such a risk, applications can use the DataSource interface.

**Link:** [Article](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/using-datasource-create-jdbc-connection/)

#### V5.x Deployment Process
**Summary:** The attached document lists the procedures for deploying TIBCO ActiveMatrix BusinessWorks 5.x projects onto all environments (Development, Staging, Beta and Production).  
**Tags:** `BW5X`, `rendezvous`, `database`, `deployment`, `installation`

**Description:**  
The attached document lists the procedures for deploying TIBCO ActiveMatrix BusinessWorks 5.x projects onto all environments (Development, Staging, Beta and Production). The intended audience for this document is project administrators and Production Control personnel.

Developers can also refer to this document to understand the deployment process. This document covers the initial release and subsequent deployments of projects but not the initial installation or setup of the administration server, domain, or adapters or any application specific deployment procedures (e.g. database changes, application server changes, etc.). This document does not cover the deployment and configuration of other TIBCO Components, such as TIBCO BusinessConnect, TIBCO Enterprise Message Service, and TIBCO Hawk. The reader of this document is suggested to consult the appropriate documentation for the deployment and configuration of other TIBCO components.

**Link:** [Article](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/tibco-activematrix-businessworkstm-v5x-deployment-process/)

#### Working with Namespace Prefixes in TIBCO ActiveMatrix BusinessWorks?
**Summary:** This article discusses the options available for controlling the way TIBCO ActiveMatrix BusinessWorks?.  
**Tags:** `BW6X`, `BWCE`, `xml`, `mapping`, `namespace`

**Description:**  
This article discusses the options available for controlling the way TIBCO ActiveMatrix BusinessWorks? creates/manages namespaces and namespace prefixes. Download the sample project that illustrates the options from Resources below.

Moving namespace declarations to root node When a schema imports elements from different namespaces, a mapping places the namespace declarations in the child nodes of the output. See the following example. AB12 2 XY34 Test Priority To move these to the root node, follow these steps: Select the root node under the "Input" tab of the activity Click the "Edit Statement" button (!) Select the option "Exclude result prefixes" ActiveMatrix BusinessWorks does not output the prefixes that are used in the stylesheet but not used in the resulting XML.

**Link:** [Article](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/working-namespace-prefixes-tibco-activematrix-businessworks/)

#### Insert Bulk XML Data into Oracle Tables
**Summary:** Approach for bulk-inserting XML payloads into Oracle tables with dynamic field or table targets from BusinessWorks.
**Tags:** `BW5X`, `xml`, `oracle`, `jdbc`, `bulk-insert`

**Description:**
This community contribution (slide deck attached) walks through a pattern for taking XML payloads from a BusinessWorks process and bulk-inserting them into Oracle tables, where either the field or the table name may need to be selected at runtime.

The approach combines BW's XML parsing/mapping with Oracle's dynamic SQL features so a single process can accept varied XML structures and route the data to different targets without per-target hard-coding. Useful for ingestion processes where source XML schemas evolve or where multiple downstream tables share a common parser.

**Link:** [Article](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/xml-action-oracle-inserting-bulk-xml-data-table-dynamic-field-or-table/)
#### XML Output from Oracle Using Dynamic SQL
**Summary:** Generate XML directly from Oracle using dynamic SQL — faster than BW SQL Direct for runtime-built statements.
**Tags:** `BW5X`, `oracle`, `xml`, `sql`, `performance`

**Description:**
This article (slide deck attached) shows how to produce XML output directly from an Oracle database using dynamic SQL, rather than building the XML inside BusinessWorks after the query returns. The approach lets the database do the XML structuring work and is reported to outperform the BW SQL Direct activity in cases where the SQL statement must be built at runtime.

Use it when you have variable WHERE clauses, columns, or table targets and want to avoid repeated round-trips through BW for assembly. The pattern is most useful in BW 5.X integrations where SQL Direct's overhead becomes a bottleneck for dynamically-built queries.

**Link:** [Article](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/xml-output-oracle-using-dynamic-sql/)
---

## Newly Added Articles (Operations)


### Operations

#### Set up open telemetry traces and metrics in BusinessWorks 6.X
**Summary:** Open telemetry traces are useful to have an end-to-end view on the execution of orchestrations involving front end, back end and BusinessWorks applications, it is also useful to...  
**Tags:** `BW6X`, `containers`, `https`, `telemetry`, `monitoring`

**Description:**  
Open telemetry traces are useful to have an end-to-end view on the execution of orchestrations involving front end, back end and BusinessWorks applications, it is also useful to identify performance bottlenecks in such orchestration scenarios.

Open telemetry metrics are useful to monitor a BusinessWorks engine activity and the underlying JVM load over time. Available KPI’s mostly cover BusinessWorks process instance executions and JVM resources usage. This article explains how to enable open telemetry traces and metrics in BusinessWorks, how to manage end to end traces and how to integrate with an open telemetry compliant service provider. Open telemetry support has been introduced in BusinessWorks 6.8 / BusinessWorks Container Edition 2.7. Open telemetry metrics support has been introduced in BusinessWorks 6.10 / BusinessWorks Container Edition 2.9.

**Link:** [Article](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/bw6x-how-to-set-up-open-telemetry-traces-and-metrics-in-businessworks-6x-r3823/)

#### Install and configure a BW 6.12 development environment on a Windows Workstation
**Summary:** The attached pdf document explains how to install and configure a BusinessWorks development environment using LTS releases on a Windows Workstation.  
**Tags:** `BW6X`, `installation`, `release-notes`, `windows`, `testing`

**Description:**  
The attached pdf document explains how to install and configure a BusinessWorks development environment using LTS releases on a Windows Workstation.

The following file is also attached: . A test project that can be used to test the installation (HelloWorldBW6XJMS.zip) BusinessWorks 6.12 Workstation installation V1.0 17-03-2026.pdf 7.01 MB · 33 downloads HelloWorldBW6XJMS.zip 22.48 kB · 10 downloads

**Link:** [Article](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/bw6x-how-to-install-and-configure-a-bw-612-development-environment-on-a-windows-workstation-r3818/)

#### Install and configure a BW 6.X environment using LTS releases on a Linux server
**Summary:** The attached pdf document explains how to install and configure a production grade BW 5.6 environment using LTS releases on a Linux server .  
**Tags:** `BW6X`, `json`, `installation`, `domain`, `release-notes`

**Description:**  
The attached pdf document explains how to install and configure a production grade BW 5.6 environment using LTS releases on a Linux server .

The following files are also attached: . silent-files.zip . install.sh . tibemsd.conf . bwagent_db.json . HelloWorldLog.application_1.0.0.ear tibemsd.conf 12.33 kB · 15 downloads bwagent_db.json 1.8 kB · 14 downloads HelloWorldLog.application_1.0.0.ear 8.59 kB · 15 downloads install.sh 1.14 kB · 15 downloads silent-files.zip 4.79 kB · 14 downloads BusinessWorks 6.12 installation and domain configuration V1.0 18-03-2026.pdf 5.09 MB · 12 downloads

**Link:** [Article](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/bw6x-how-to-install-and-configure-a-bw-6x-environment-using-lts-releases-on-a-linux-server-r3816/)

#### Install and configure a BW 5.16 development environment on a Windows Workstation
**Summary:** The attached pdf document explains how to install and configure a BusinessWorks development environment using LTS releases on a Windows Workstation.  
**Tags:** `BW5X`, `installation`, `release-notes`, `windows`, `testing`

**Description:**  
The attached pdf document explains how to install and configure a BusinessWorks development environment using LTS releases on a Windows Workstation.

The following file is also attached: . A test project that can be used to test the installation (HelloWorldJMS.zip) HelloWorldJMS.zip Unavailable BusinessWorks 5.16.1 Workstation installation V1.0 25-02-2026.pdf Unavailable 1

**Link:** [Article](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/bw5x-how-to-install-and-configure-a-bw-516-development-environment-on-a-windows-workstation-r3808/)

#### Install and configure a BW 5.X domain using LTS releases on a Linux server
**Summary:** The attached pdf document explains how to install and configure a production grade BW 5.X domain using LTS releases on a Linux server .  
**Tags:** `BW5X`, `xml`, `installation`, `domain`, `release-notes`

**Description:**  
The attached pdf document explains how to install and configure a production grade BW 5.X domain using LTS releases on a Linux server .

The following files are also attached: . CreateDomain.xml . HelloWorld.EAR . silent_files.zip . rv-8.8.1.000_prodInfo.xml . tibemsd.conf Last update : April 8th, 2026 tibco_install.sh Unavailable CreateDomain.xml Unavailable HelloWorld.ear Unavailable rv-8.8.1.000_prodInfo.xml Unavailable tibemsd.conf Unavailable silent_files.zip Unavailable BusinessWorks 5.16.1 installation and domain configuration V1.3 08-04-2026.pdf Unavailable

**Link:** [Article](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/bw5x-how-to-install-and-configure-a-bw-5x-domain-using-lts-releases-on-a-linux-server-r3806/)

#### EMS - Rendezvous - Useful things to known about TIBCO Products activation
**Summary:** This article is mostly to have in one place all TIBCO Knowledge base articles and documentations on license activation (for BW 5.X, BW 6.X, EMS and Rendezvous).  
**Tags:** `BW5X`, `BW6X`, `ems`, `rendezvous`, `logging`

**Description:**  
This article is mostly to have in one place all TIBCO Knowledge base articles and documentations on license activation (for BW 5.X, BW 6.X, EMS and Rendezvous).

General elements on activation: It is recommended to use TIBCO products with In Product Activation. Includes references to TIBCO Activation FAQ, license renewal articles, activation log messages and error codes. Elements on TIBCO Rendezvous: At the time of this writing use of RV 8.8.1 with In Product Activation is recommended. The license can be set with the TIBRV_LICENSE environment variable. Activation Requirements for TIBCO Rendezvous 8.8.x are listed in linked articles.

**Link:** [Article](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/bw5x-bw6x-ems-rendezvous-useful-things-to-known-about-tibco-products-activation-r3600/)

#### BW6.X Container - Container image size reduction in BusinessWorks 6.12
**Summary:** In the latest 6.12 release BusinessWorks 6.X and BusinessWorks Container Edition have been merged for the first time into a single unified package.  
**Tags:** `BW6X`, `BWCE`, `containers`, `rest`, `http`

**Description:**  
In the latest 6.12 release BusinessWorks 6.X and BusinessWorks Container Edition have been merged for the first time into a single unified package

. Other significant improvements are that the BusinessWorks Container image size has been significantly reduced, and some properties have been introduced to be able to exclude some elements from the image to make it even smaller. The properties available to reduce the BusinessWorks 6.12 Container image size are the following: EXCLUDE_JDBC: with this property the JDBC drivers present by default (Postgres, MySQL, SQLServer,...) in the Container image are excluded. EXCLUDE_GOVERNANCE: with this property the governance jars present by default in the Container image are excluded (used to manage Policies with SOAP, REST and HTTP end points).

**Link:** [Article](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/bw6x-container-container-image-size-reduction-in-businessworks-612-r3588/)

#### [Question] HA structure about TEA Server
**Summary:** How to config TEA if we have multiple tea servers in a large BW6 network?.  
**Tags:** `BW6X`, `ems`, `businessworks`, `integration`, `how-to`

**Description:**  
How to config TEA if we have multiple tea servers in a large BW6 network?

Can we build tea as active-active and each tea server could sync the users with the other one simultaneouly? Or we need a shared storage like ems server? (active-standby mode) If we have multiple bw agent, should we register all bwagents to the same tea server url or we should register separately? Can anybody give me some suggestion?

**Link:** [Article](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/question-ha-structure-about-tea-server-r3516/)

#### 7 Reasons to Extend Your TIBCO RTView Monitors with RTView
**Summary:** Many organizations have licensed RTView monitoring packages through TIBCO®, an SL Corporation partner.  
**Tags:** `BW6X`, `BWCE`, `monitoring`, `rtview`, `businessworks`

**Description:**  
Many organizations have licensed RTView monitoring packages through TIBCO®, an SL Corporation partner. These RTView solutions are targeted specifically for TIBCO BusinessWorks?, TIBCO Enterprise Messaging Service?, and TIBCO BusinessEvents®, each monitoring one technology at a time.

Middleware support teams often struggle with visibility into what some refer to as the middleware ?black box.? TIBCO offers the RTView Monitoring packages to complement and enhance the basic admin tools that come with the middleware technology products.

**Link:** [Article](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/7-reasons-extend-your-tibco-rtview-monitors-rtview/)

#### ActiveMatrix® 3.1.3 Integration Co-existence Guide Aug 2011
**Summary:** Each of the TIBCO products offers an installation guide well suited for installing that given product in a standalone fashion.  
**Tags:** `BW6X`, `BWCE`, `installation`, `engine`, `compatibility`

**Description:**  
Each of the TIBCO products offers an installation guide well suited for installing that given product in a standalone fashion. However, our Field staff and customers often install multiple products together required to compose an end-to-end solution. Given the large number of products, the various released versions of these products, subtle dependencies between products, co-existence of products becomes very challenging in an integration environment.

The goal of this document is to outline co-existence of multiple TIBCO products in an integration environment such that we help our product users reduce the unnecessary trial and error and compatibility issues. As such, this document will not cover all possible supported and unsupported product co-existence combinations. Rather, we will outline a set of common scenarios and recommendations. This document is intended for TIBCO Global Support and Field organizations. Do examine exact customer requirements for applicability prior to applying recommendations described in this document.

**Link:** [Article](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/tibco-activematrixr-313-integration-co-existence-guide-aug-2011/)

#### Amazon EKS Config Maps with TIBCO BusinessWorks? Container Edition
**Summary:** Config Maps is a feature provided by Kubernetes to decouple configuration artifacts from the image itself making your containers much more portable.  
**Tags:** `BWCE`, `kubernetes`, `containers`, `aws-eks`, `https`

**Description:**  
Config Maps is a feature provided by Kubernetes to decouple configuration artifacts from the image itself making your containers much more portable. Essentially, you are eliminating any hard-coded aspects of your configurations/variables within the design time and taking care of it during runtime. So if you ever have to swap these values/parameters, it's just a matter of changing your configuration document rather than regenerating the EAR file.

Config Maps on any flavor of Kubernetes are the same (this includes EKS, AKS, etc...). So for this video, we deployed our TIBCO BusinessWorks? Container Edition application onto EKS while using Config Maps. But this can be done on any version of Kubernetes. TIBCO BusinessWorks Container Edition has native support for Config Maps so there's nothing special/different you need to do to use them. For more information about Config Maps check out: https://kubernetes.io/docs/tasks/configure-pod-container/configure-pod-configmap/

**Link:** [Article](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/amazon-eks-config-maps-tibco-businessworks-container-edition/)

#### Application monitoring on Docker (TIBCO BusinessWorks? Container Edition 2.3.2)
**Summary:** Follow these steps to implement Application monitoring of TIBCO BusinessWorks?.  
**Tags:** `BWCE`, `docker`, `containers`, `http`, `postgresql`

**Description:**  
Follow these steps to implement Application monitoring of TIBCO BusinessWorks? Container Edition application on Docker.

DOCKER MONITORING (TIBCO BusinessWorks? Container Edition 2.3.2) Download the bwce_mon.zip TIBCO BusinessWorks Container Edition monitoring zip file, from http://edelivery.tibco.com. Extract the zip file in the docker folder of your TIBCO BusinessWorks Container Edition C:\BWCE2.3.2\bwce\2.3\docker\bwcemonitoring Navigate to the bwce_mon directory and build the docker image by running the following command: docker build -t bwce/monitoring:latest . Ensure that MySQL or PostgreSQL is running and the user is created with all the privileges. You can use a standalone docker to run the monitoring applicaton by passing the two environment variables.

**Link:** [Article](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/application-monitoring-docker-tibco-businessworks-container-edition/)

#### AppManage Commands
**Summary:** The resultant log file will have the following content (with mention of difference) for example.  
**Tags:** `BW6X`, `BWCE`, `xml`, `logging`, `deployment`

**Description:**  
The resultant log file will have the following content (with mention of difference) for example:

******* Processing GV section with name Global Variables ******* ******* Processing service section ******* ******* Processing service section with name Addition

**Link:** [Article](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/appmanage-commands/)

#### BusinessWork 6 Plugin for Apache Ignite
**Summary:** This is the official documentation site for the Apache Ignite plugin in development.  
**Tags:** `BW6X`, `BWCE`, `https`, `plugin`, `memory`

**Description:**  
This is the official documentation site for the Apache Ignite plugin in development.

Please feel free to leave suggestions, comments, or report bug issues ( you can do it as well on GitHub ) Apache Ignite plugin provides a convenient and easy-to-use interface for developers to work with large-scale data sets in real-time and other aspects of in-memory computing. This plugin has the following features: Zero coding and visual development with Tibco BW 6.

**Link:** [Article](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/tibco-businesswork-6-plugin-apache-ignite/)

#### BusinessWorks Container Edition on Alicloud
**Summary:** Create a Sample TIBCO BusinessWorks Container Edition application and create a docker image of the same application.  
**Tags:** `BWCE`, `docker`, `containers`, `alicloud`, `logging`

**Description:**  
Create a Sample TIBCO BusinessWorks Container Edition application and create a docker image of the same application

Push the application image to the Docker hub Alibaba cloud account with Alibaba container service enabled. Procedure Create Application Create Cluster Log on to the Container Service console. Click Clusters in the left navigation pane, and then click Create Cluster in the upper-right corner. Enter the basic information of the cluster. Cluster Name: The name of the cluster to be created. Set the network type of the cluster. You can set the network types to Classic or VPC. Corresponding ECS instances and other cloud resources are managed under the corresponding network environment. If you select Classic, no additional configuration is required.

**Link:** [Article](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/tibco-businessworks-container-edition-alicloud/)

#### BusinessWorks Container Edition with Amazon ECS and Fargate
**Summary:** Amazon recently announced AWS Fargate during Re: Invent 2017.  
**Tags:** `BWCE`, `containers`, `aws`, `aws-fargate`, `deployment`

**Description:**  
Amazon recently announced AWS Fargate during Re: Invent 2017. With Fargate, instead of having to use EC2 instances (VMs), you can use just a container. Fargate provisions a container within the platform itself for your applications without having to deal with all the underlying infrastructure.

By using a combination of ECS and Fargate, you will no longer have to worry about keeping your EC2 instances up to date with the latest security patches. Amazon manages the Fargate platform, while still allowing some control to manage your applications. Of course, there are some use cases where Fargate won't be the right choice. Let's say your application requires bridge networking, Fargate doesn't support that so you would have to use the traditional ECS + EC2 instances model for those container deployments. Or if you want to have control of the instances that are running your containers, EC2 would be a better choice.

**Link:** [Article](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/tibco-businessworks-container-edition-amazon-ecs-and-fargate/)

#### BusinessWorks Container Edition with Amazon EKS
**Summary:** AWS recently made Amazon EKS generally available to the public in us-east-1 (N.  
**Tags:** `BWCE`, `kubernetes`, `containers`, `aws`, `aws-eks`

**Description:**  
AWS recently made Amazon EKS generally available to the public in us-east-1 (N. Virginia) and us-west-2 (Oregon) with more regions to come in the future. Essentially, EKS is an easy way to deploy a Kubernetes cluster on AWS, where you don't have to manage the Control Plane nodes; all you need to worry about are the worker nodes.

This makes it a lot easier to handle while simplifying the process. Also, other AWS services integrate directly with EKS, so if you plan to use ECR as your repository you no longer need to worry about access tokens. Or maybe you want to use Cloudwatch for more control on the management/logging side. Either way, you are staying within the AWS ecosystem. TIBCO BusinessWorks Container Edition (BWCE) was built to work on any PaaS/IaaS, with Amazon EKS being no different. If you've built BWCE applications for other PaaS environments (Kubernetes or something else), and want to now deploy them to EKS, it's just a matter of taking the EAR file generate from BWCE and pushing it to EKS.

**Link:** [Article](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/tibco-businessworkstm-container-edition-amazon-eks/)

#### BusinessWorks Process Monitor, a Video overview
**Summary:** Here's a video of TIBCO BusinessWorks ProcessMonitor, an integration process monitoring solution for TIBCO ActiveMatrix BusinessWorks we have recently released.  
**Tags:** `BW5X`, `monitoring`, `businessworks`, `integration`, `how-to`

**Description:**  
Here's a video of TIBCO BusinessWorks ProcessMonitor, an integration process monitoring solution for TIBCO ActiveMatrix BusinessWorks we have recently released.

You can also find information about BusinessWorks ProcessMonitor here.

**Link:** [Article](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/tibco-businessworkstm-process-monitor-video-overview/)

#### BusinessWorks? Container Edition
**Summary:** Click Here for information on TIBCO ActiveMatrix BusinessWorks?.  
**Tags:** `BWCE`, `docker`, `containers`, `aws`, `sap`

**Description:**  
Click Here for information on TIBCO ActiveMatrix BusinessWorks?

This section contains a variety of educational and how-to materials designed to help you get up and running with TIBCO BusinessWorks Container Edition (BWCE) quickly and easily.

**Link:** [Article](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/tibco-businessworks-container-edition/)

#### BusinessWorks? Container Edition on the AWS Marketplace
**Summary:** TIBCO BusinessWorks?.  
**Tags:** `BWCE`, `containers`, `aws`, `plugin`, `deployment`

**Description:**  
TIBCO BusinessWorks? Container Edition is now available on the AWS Marketplace. You can quickly and easily create cloud-native integration applications and deploy them on AWS leveraging native features of AWS Elastic Container Service or your choice of Docker-based PaaS build on AWS for container management. Consumption-based pricing model helps you to pay only for the number of containers running per hour. This gives you the flexibility to scale on demand and manage software costs as you go.

Table of Contents How to subscribe to TIBCO BusinessWorks Container Edition on the AWS Marketplace Using a Cloud Formation template to set up an Amazon ECS cluster Using a Cloud Formation template to extend your TIBCO BusinessWorks Container Edition image Setting up your development environment Develop a TIBCO BusinessWorks Container Edition application with the Salesforce plugin Deploy your newly created application onto your ECS cluster Integrating your TIBCO BusinessWorks Container Edition application with several AWS services Launching a standalone TIBCO BusinessWorks Container Edition EC2 instance Sample TIBCO BusinessWorks Container Edition application deployment on a standalone EC2 in...

**Link:** [Article](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/tibco-businessworks-container-edition-aws-marketplace/)

#### BusinessWorks? Container Edition Tutorial: Deploy highly-available and scalable…
**Summary:** Amazon EC2 Container Service ("ECS" hereafter) is a scalable container management service that allows you to manage Docker containers on a cluster of Amazon EC2 instances.  
**Tags:** `BWCE`, `docker`, `kubernetes`, `containers`, `aws`

**Description:**  
Amazon EC2 Container Service ("ECS" hereafter) is a scalable container management service that allows you to manage Docker containers on a cluster of Amazon EC2 instances. Some of the latest improvements -- including auto-scaling at the container level and load balancing to multiple containers running the same image with dynamic port mapping on a given instance -- make it a viable and probably simpler alternative to Google Kubernetes and Docker Swarm.

TIBCO BusinessWorks Container Edition provides a simple, visual, and low-code way to create microservices, especially when it comes to orchestration workloads.

**Link:** [Article](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/tibco-businessworks-container-edition-tutorial-deploy-highly-available-and-scalable/)

#### BusinessWorks? Container Edition Tutorial: Deploy highly-available and scalable…
**Summary:** Amazon EC2 Container Service ("ECS" hereafter) is a scalable container management service that allows you to manage Docker containers on a cluster of Amazon EC2 instances.  
**Tags:** `BWCE`, `docker`, `containers`, `aws`, `deployment`

**Description:**  
Amazon EC2 Container Service ("ECS" hereafter) is a scalable container management service that allows you to manage Docker containers on a cluster of Amazon EC2 instances.

This sequel, which should take you about 15 minutes to complete, will walk you through the additional steps needed to define Auto Scaling policies both at the container and instance level.

**Link:** [Article](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/tibco-businessworkstm-container-edition-tutorial-deploy-highly-available-and-scalable/)

#### Capturing network packets on Windows machines when using Wireshark is not an option
**Summary:** Wireshark is a convenient tool for capturing network packets on Windows machines but it is generally not installed on Production machines.  
**Tags:** `BW6X`, `BWCE`, `monitoring`, `windows`, `github`

**Description:**  
Wireshark is a convenient tool for capturing network packets on Windows machines but it is generally not installed on Production machines. This article lists a couple of alternatives.

Packet Monitor (pktmon): pktmon start -c -f E:\temp\PktMon.etl, pktmon stop. To convert the output file to pcapng format: pktmon etl2pcap. Netsh: netsh trace start capture=yes tracefile=E:\temp\PktMon.etl, netsh trace stop. To convert the output file to pcapng format use etl2pcapng.exe from github.com/microsoft/etl2pcapng.

**Link:** [Article](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/capturing-network-packets-on-windows-machines-when-using-wireshark-is-not-an-option/)

#### Configure JDBC Connection in TIBCO ActiveMatrix BusinessWorks™ 5 when Oracle DB server…
**Summary:** This article explains how to configure JDBC Connection shared resource in TIBCO ActiveMatrix BusinessWorks™ 5 (BW) when the Oracle DB server connection information is stored in LDAP.  
**Tags:** `BW5X`, `jdbc`, `database`, `oracle`, `businessworks`

**Description:**  
This article explains how to configure JDBC Connection shared resource in TIBCO ActiveMatrix BusinessWorks™ 5 (BW) when the Oracle DB server connection information is stored in LDAP.

The first step is to identify the LDAP entry that contains the connection information. For this, run ldapsearch with the Oracle Context DN as the base. For example, In the above example, the Oracle Context DN is cn=OracleContext,dc=example,dc=com and the DN of the entry that contains the connection information is cn=orcl19tw2012,cn=OracleContext,dc=example,dc=com (see the attribute orclNetDescString) With the above setup, the URLs would be as follows - Oracle JDBC driver jdbc:oracle:thin:@ldap://ldaphost:389/cn=OracleContext,dc=example,dc=com/orcl19tw2012 OR jdbc:oracle:thin:@ldap://ldaphost:389/orcl19tw2012,cn=OracleContext,dc=example,dc=com TIBCO Database Driver Supplement Software jdbc:ti...

**Link:** [Article](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/how-to-configure-jdbc-connection-in-tibco-activematrix-businessworks-5-bw-when-oracle-db-server-connection-information-is-stored-in-ldap/)

#### Configuring soapUI to test TIBCO® SOAP over JMS
**Summary:** SOAP_over_JMS_with_soapUI_For_Tibcommunity.pdf
5.01 MB · 338 downloads.  
**Tags:** `BW6X`, `BWCE`, `jms`, `soap`, `testing`

**Description:**  
SOAP_over_JMS_with_soapUI_For_Tibcommunity.pdf
5.01 MB · 338 downloads

Home Articles Platform Integration BusinessWorks Configuring soapUI to test TIBCO® SOAP over JMS Configuring soapUI to test TIBCO® SOAP over JMS Share Followers By Manoj Chaurasia October 26, 2022 · 1,826 views This document explains the procedure to setup Eviware soapUI tool to test SOAP over JMS services exposed by TIBCO ActiveMatrix BusinessWorks? and TIBCO ActiveMatrix® Service Grid. SOAP_over_JMS_with_soapUI_For_Tibcommunity.pdf 5.01 MB · 338 downloads Go to articles There are no comments to display. Join the conversation You can post now and register later. If you have an account, sign in now to post with your account.

**Link:** [Article](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/configuring-soapui-test-tibcor-soap-over-jms/)

#### Configuring TIBCO BusinessWorks Container Edition Application Monitor on RedHat OpenShift
**Summary:** This tutorial assumes you have a working knowledge of BusinessWorks Container Edition (BWCE) and RedHat OpenShift.  
**Tags:** `BWCE`, `docker`, `openshift`, `containers`, `https`

**Description:**  
This tutorial assumes you have a working knowledge of BusinessWorks Container Edition (BWCE) and RedHat OpenShift.

The BWCE Application Monitor allows administrators to get detailed process-level monitoring and metrics of each BWCE application that has been deployed in your container management environment. Whilst the documentation at https://docs.tibco.com provide detailed setup and usage instructions they only cover Pivotal Cloud Foundry and Docker. This tutorial expands on that documentation to show how the BWCE Application Monitor can be deployed on RedHat OpenShift. Pre-Requisites Docker installed and configured on your machine Access to RedHat OpenShift (Origin or MiniShift).

**Link:** [Article](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/configuring-tibco-businessworks-container-edition-application-monitor-redhat-openshift/)

#### Connecting BusinessWorks and OpenMQ
**Summary:** Configure ActiveMatrix BusinessWorks to send and receive JMS messages via the OpenMQ message broker.
**Tags:** `BW5X`, `openmq`, `jms`, `messaging`, `integration`

**Description:**
This guide walks through configuring BusinessWorks JMS activities to interoperate with the OpenMQ broker (the open-source message broker formerly bundled with GlassFish). It covers the JNDI lookup setup, the OpenMQ client JAR placement on the BW classpath, the JMS Connection Factory configuration, and the destination naming conventions OpenMQ expects.

Useful when integrating BusinessWorks with non-EMS messaging infrastructure, particularly in development or hybrid environments where OpenMQ is already in use. The same general pattern (custom JNDI provider + client JAR + connection factory) extends to other JMS providers.

**Link:** [Article](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/connecting-tibco-activematrix-businessworkstm-and-openmq/)
#### Deloying TIBCO BusinessWorks? Container Edition on Azure Container Service
**Summary:** Microservices and Cloud actually make a good couple.  
**Tags:** `BW6X`, `BWCE`, `docker`, `containers`, `azure`

**Description:**  
Microservices and Cloud actually make a good couple. TIBCO BusinessWorks Container Edition is one of the leading TIBCO platforms to develop microservices. In order to run these, you need a container platform (CloudFoundry or Docker). You could set up your own container platform or?.. get one in the Cloud.  Microsoft is one of the vendors that offer a Docker platform in the Cloud named Azure Container Service.(https://azure.microsoft.com/en-us/services/container-service/).  TIBCO BusinessWorks Container Edition (http://www.tibco.com/assets/bltac2e394e00bd3553/ds-businessworks-container-edition.pdf) can be run on Azure. This document describes how to do this.

Table of Contents Preparation Generate a SSH key pair using Putty Key Generator. Have available a Azure account. Have available a docker VM. Create a TIBCO BusinessWorks Container Edition VM. Create a simple Restful TIBCO BusinessWorks 6 application. Create a Docker environment on Azure Creating an ear file for docker deployment Test the implementations Reference: Microservices and Cloud actually make a good couple. TIBCO BusinessWorks Container Edition is one of the leading TIBCO platforms to develop microservices. In order to run these, you need a container platform (CloudFoundry or Docker). You could set up your own container platform or?.. get one in the Cloud.

**Link:** [Article](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/deloying-tibco-businessworkstm-container-edition-azure-container-service/)

#### Deploying and Developing application with TIBCO Cloud Messaging, TIBCO Cloud…
**Summary:** This article walks through an example using TIBCO Cloud Messaging, TIBCO Cloud Integration, and TIBCO BusinessWorks Container Edition together to create a basic pub/sub app.  
**Tags:** `BWCE`, `containers`, `deployment`, `cloud-integration`, `cloud-messaging`

**Description:**  
This article walks through an example using TIBCO Cloud Messaging, TIBCO Cloud Integration, and TIBCO BusinessWorks Container Edition together to create a basic pub/sub app. Knowledge about TIBCO Cloud Integration and TIBCO BusinessWorks Container Edition will be helpful.

Getting Started: There are a few things we need to do before we can develop our applications. The first is making sure that we have all the necessary components. You can receive a free trial of TIBCO Cloud Messaging and TIBCO Cloud Integration from cloud.tibco.com so sign up for those. Also, make sure you have the TIBCO BusinessWorks Container Edition studio available. Your TIBCO Cloud Messaging trial broker may take a little while to be active. Make sure the status says active before starting. Generate key (Under Authentication Keys), we will be using this key to connect with TIBCO Cloud Messaging. Now, under Download SDK's, download the Java/Android SDK.

**Link:** [Article](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/deploying-and-developing-application-tibco-cloud-messaging-tibco-cloud-integration/)

#### Deployment Guide: TIBCO BusinessWorks™ 6.12 deployment on Docker and Kubernetes
**Summary:** TIBCO ActiveMatrix BusinessWorks Container Edition (BWCE) enables you to build cloud-native applications and run them seamlessly within Docker containers and Kubernetes clusters.  
**Tags:** `BW5X`, `BW6X`, `BWCE`, `docker`, `kubernetes`

**Description:**  
TIBCO ActiveMatrix BusinessWorks Container Edition (BWCE) enables you to build cloud-native applications and run them seamlessly within Docker containers and Kubernetes clusters.

Starting with the release of TIBCO ActiveMatrix BusinessWorks 6.12.0, BWCE is embedded directly within the product. This eliminates the need for a separate BWCE installer and provides a unified development environment in TIBCO Business Studio for containerized deployments. This guide walks you through: Preparing your environment Building the required Docker images Running the application locally Deploying the application to Kubernetes 2. Preparation and Prerequisites Licenses & Activation: Obtain licenses via the TIBCO Software Downloads site. Docker Engine: Installed Docker runtime. Kubernetes Cluster: Docker Desktop. 3.

**Link:** [Article](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/tibcobw612demo/)

#### Developing and Deploying applications with TIBCO BusinessWorks Container Edition on…
**Summary:** This guide provides the steps to follow in order to deploy TIBCO BusinessWorks Container Edition application as a docker service in docker swarm.  
**Tags:** `BWCE`, `docker`, `containers`, `aws`, `rest`

**Description:**  
This guide provides the steps to follow in order to deploy TIBCO BusinessWorks Container Edition application as a docker service in docker swarm. The swarm being setup in Amazon Web Services (AWS).

We carry out the setup in two phases, viz. development, and deployment. In order to demonstrate this, we develop a simple TIBCO BusinessWorks REST Application, create a docker image out of it in the development phase, and deploy it as a docker service in docker swarm in the deployment phase. Pre-Requisite TIBCO BusinessWorks Container Edition Access to an AWS account with permissions to use CloudFormation and create the following objects: EC2 instances + Auto Scaling groups IAM profiles DynamoDB Tables SQS Queue VPC + subnets and security groups ELB CloudWatch Log Group SSH key in AWS in the region where you want to deploy (required to access the completed Docker install) To access the full ...

**Link:** [Article](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/developing-and-deploying-applications-tibco-businessworkstm-container-edition-docker-swarm/)

#### Digitizing Customer Experiences - A Microservices Perspective
**Summary:** This article focuses on Customer OnBoarding and how companies can leverage TIBCO's Hybrid integration platform to digitize their Customer OnBoarding process.  
**Tags:** `BW6X`, `BWCE`, `kubernetes`, `containers`, `monitoring`

**Description:**  
This article focuses on Customer OnBoarding and how companies can leverage TIBCO's Hybrid integration platform to digitize their Customer OnBoarding process. The demo runs on a Kubernetes cluster and showcases our strengths like being DevOps compliant, Elastic scaling, API-Led design, and many other factors. The key components of this demo can be found below:

Assets CustomerOnBoarding Kubernetes Setup & UseCase: This video explains how the flow of the use case is set up and how microserivces running on containers are being used for providing compelling customer experiences Elastic Scaling: Optimizing infrastructure costs and attaining operational excellence is something every customer is looking for and Elastic scaling Hystrix Monitoring: A demo that walks through how you can set up circuit breaker patterns with Zero Coding and ensure your system is ready for Failures. Configuration Management & Service Discovery: Microservices are more than just containers.

**Link:** [Article](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/digitizing-customer-experiences-microservices-perspective/)

#### Garbage Collector tuning for TIBCO ActiveMatrix BusinessWorks?
**Summary:** Add the following lines to /tibco/designer/x.x/bin/designer.tra or bwengine.tra.  
**Tags:** `BW6X`, `BWCE`, `engine`, `concurrency`, `properties`

**Description:**  
Add the following lines to /tibco/designer/x.x/bin/designer.tra or bwengine.tra

java.heap.size.max %HEAP_SIZE% java.extended.properties=-XX\:UseConcMarkSweepGC -XX\:UseParNewGC-XX\:+CMSParallelRemarkEnabled -XX\:NewSize\=64m -XX\:MaxNewSize\=%HEAP_SIZE% -XX:MinHeapFreeRatio=52 -XX:MaxHeapFreeRatio=90 -XX:GCTimeRatio=19 If every engine has it's own HEAP size then Add: java.extended.properties = -XX:MinHeapFreeRatio=52 -XX:MaxHeapFreeRatio=90 -XX:GCTimeRatio=19

**Link:** [Article](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/garbage-collector-tuning-bw/)

#### Generate thread dump of TIBCO ActiveMatrix BusinessWorks™ 5 engine process when JMX is…
**Summary:** If JMX is enabled, Java VisualVM can be used to take thread dumps of local and remote TIBCO ActiveMatrix BusinessWorks™ 5 (BW) engine processes.  
**Tags:** `BW5X`, `threading`, `engine`, `linux`, `windows`

**Description:**  
If JMX is enabled, Java VisualVM can be used to take thread dumps of local and remote TIBCO ActiveMatrix BusinessWorks™ 5 (BW) engine processes. But JMX is usually not enabled in Production environments. This article lists a few other options for various Operating Systems.

If JMX is enabled, Java VisualVM can be used to take thread dumps of local and remote TIBCO ActiveMatrix BusinessWorks™ 5 (BW) engine processes. But JMX is usually not enabled in Production environments. Red Hat Linux, Solaris, Windows: Use jstack utility from JDK_HOME/bin: jstack -l pid_of_bwengine > threaddump.txt. Red Hat Linux, Solaris, HP-Ux: Use kill -3 pid_of_bwengine command to generate thread dump. Windows: Press Ctrl+Break to generate a thread dump.

**Link:** [Article](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/how-to-generate-thread-dump-of-tibco-activematrix-businessworks5-engine-process-when-jmx-is-not-enabled/)

#### Getting started with TIBCO BusinessWorks™ 5 (Containers) on TIBCO® Platform -…
**Summary:** This article explains how to configure In-Product Activation on TIBCO® Platform.  
**Tags:** `BW6X`, `BWCE`, `containers`, `configuration`, `businessworks`

**Description:**  
This article explains how to configure In-Product Activation on TIBCO® Platform.

Environment - TIBCO® Control Plane 1.13.0. When configuring In-Product Activation on TIBCO® Platform, the license file can be uploaded at global level or data plane level. Global level: Click Data Planes and then click Global configuration. Click Activation and then click Upload and upload the license file. Once the license file is uploaded at the global level, the data plane configuration needs to be updated to use the global license file. Click Data Planes and then click Data Plane Configuration. Click Activation and then click Use Global License File. The data plane should now be linked to the global license file. Data plane level: Go to Data Plane Configuration and click Activation.

**Link:** [Article](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/getting-started-with-tibco-businessworks-5-containers-on-tibco-platform-configuring-in-product-activation/)

#### Getting started with TIBCO BusinessWorks™ 5 (Containers) on TIBCO® Platform -…
**Summary:** With the introduction of BW5(Containers) capability in TIBCO® Platform, it is now possible to deploy BW5 applications in a containerized environment in TIBCO® Platform and monitor and manage...  
**Tags:** `BW5X`, `containers`, `monitoring`, `deployment`, `businessworks`

**Description:**  
With the introduction of BW5(Containers) capability in TIBCO® Platform, it is now possible to deploy BW5 applications in a containerized environment in TIBCO® Platform and monitor and manage the applications using TIBCO® Control Plane. This article explains how to deploy a simple BW5(Containers) application.

Environment - TIBCO® Control Plane 1.13.0. Before you begin - 1. Provision BW5(Containers) capability. 2. Configure activation. Deployment Steps: Go to the data plane and click BW5(Containers) capability card. Click Create New APP Build & Deploy. Click browse to upload, upload EAR file and click Next. Enter Application Build Name and click Create Build. Once the App Build is created, click Deploy App. Click Deploy under Managed By BW5 Provisioner. Check EUA and click Deploy App. The app build is created and the application deployed. The app build is listed under the BW5(Containers) capability card. The application is listed under the data plane. Click Run to start the application.

**Link:** [Article](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/getting-started-with-tibco-businessworks-5-containers-on-tibco-platform-deploying-a-simple-application/)

#### Getting started with TIBCO BusinessWorks™ 5 (Containers) on TIBCO® Platform -…
**Summary:** The BW5(Containers) capability must be provisioned on a data plane before BW5 applications can be deployed.  
**Tags:** `BW5X`, `containers`, `businessworks`, `integration`, `how-to`

**Description:**  
The BW5(Containers) capability must be provisioned on a data plane before BW5 applications can be deployed. This article explains how to provision the BW5(Containers) capability on a data plane.

Environment - TIBCO® Control Plane 1.13.0. Click Data Planes and then click Go to Data Plane on the data plane card. Click Provision a capability. Click Start under Provision TIBCO BusinessWorks™ 5 (Containers). Select the Storage Class and click Add Ingress Controller. Specify Ingress Controller, Ingress Class Name, Resource Name and Default FQDN. Then click Add. Select the Ingress Controller that was just added. Then click Next. Check EUA and click BW5 (Containers) Provision Capability. Once provisioning is complete, click View Integration Capabilities Details. Click Provision BW5 (Containers) & Plug-ins. Select BW5 (Containers) version to provision and click Next.

**Link:** [Article](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/getting-started-with-tibco-businessworks-5-containers-on-tibco-platform-provisioning-the-bw5containers-capability/)

#### Kubernetes Deployment Strategies with TIBCO BusinessWorks Container Edition
**Summary:** Kubernetes supports a number of different deployment strategies and choosing the right deployment procedure depends on your needs.  
**Tags:** `BWCE`, `kubernetes`, `containers`, `deployment`, `release-notes`

**Description:**  
Kubernetes supports a number of different deployment strategies and choosing the right deployment procedure depends on your needs. I've put together a series of posts that describe how you can use each of those deployment strategies with TIBCO BusinessWorks Container Edition.

As a quick overview, the main deployment strategies are: Recreate: All existing Pods are killed and new Pods are created. The entire application is redeployed ? but requires downtime Ramped/Rolling Update: Release a new version, route traffic to it and terminate an existing version, then move on to the next instance. Removes any downtime whilst Pods are updated, but you have no control over traffic and you will need to ensure API compatibility across versions Blue/Green: Release a new version alongside the older version and then switch traffic. Avoids API compatibility issues, instance rollback but double the resources are required Canary: Release a new version to a subset of users.

**Link:** [Article](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/kubernetes-deployment-strategies-tibco-businessworks-container-edition/)

#### New feature in TIBCO ActiveMatrix BusinessWorks™ 5.16.0 - Support for OpenTelemetry Traces
**Summary:** This article takes a quick look at one of the new features introduced in TIBCO ActiveMatrix BusinessWorks™ (BW) 5.16.0 - support for OpenTelemetry Traces.  
**Tags:** `BW5X`, `http`, `opentelemetry`, `telemetry`, `engine`

**Description:**  
This article takes a quick look at one of the new features introduced in TIBCO ActiveMatrix BusinessWorks™ (BW) 5.16.0 - support for OpenTelemetry Traces.

BW now supports OpenTelemetry Traces. BW engines can be configured to export traces telemetry data. TIBCO Control Plane: To view traces in TIBCO Control Plane UI in an environment managed by TIBCO Control Plane, add properties to bwengine.tra or application .tra file: java.property.bw.engine.opentelemetry.traces.enable=true, java.property.otel.exporter.otlp.traces.protocol=http/protobuf, java.property.otel.exporter.otlp.traces.endpoint=http://bmdp_host/tibco/agent/o11y/data_plane_id/traces.

**Link:** [Article](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/new-feature-in-tibco-activematrix-businessworks-5-support-for-opentelemetry-traces/)

#### New feature in TIBCO ActiveMatrix BusinessWorks™ 5.16.1 - support for OpenTelemetry…
**Summary:** This article takes a quick look at one of the new features introduced in TIBCO ActiveMatrix BusinessWorks™ (BW) 5.16.1 - support for OpenTelemetry Metrics.  
**Tags:** `BW5X`, `docker`, `http`, `opentelemetry`, `telemetry`

**Description:**  
This article takes a quick look at one of the new features introduced in TIBCO ActiveMatrix BusinessWorks™ (BW) 5.16.1 - support for OpenTelemetry Metrics.

BW now supports OpenTelemetry Metrics. BW engines can be configured to send metrics telemetry data. Environment TIBCO ActiveMatrix BusinessWorks™ 5.16.1, Prometheus (with OTLP receiver enabled) and Grafana on Docker. To send OpenTelemetry metrics to a Prometheus server, add the following properties to bwengine.tra or application .tra file: java.property.bw.engine.opentelemetry.metrics.enable=true, java.property.otel.exporter.otlp.metrics.protocol=http/protobuf, java.property.otel.exporter.otlp.metrics.endpoint=http://prometheus_host:prometheus_port/api/v1/otlp/v1/metrics. Once the properties are added and the application restarted, metrics should be available in Prometheus and Grafana.

**Link:** [Article](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/new-feature-in-tibco-activematrix-businessworks-5161-support-for-opentelemetry-metrics/)

#### Performance Tuning in TIBCO ActiveMatrix BusinessWorks
**Summary:** How do you use variables to improve the performance of TIBCO ActiveMatrix BusinessWorks Engine while using XPath?.  
**Tags:** `BW5X`, `http`, `xpath`, `performance`, `engine`

**Description:**  
How do you use variables to improve the performance of TIBCO ActiveMatrix BusinessWorks Engine while using XPath? This document guides you through this question and how to achieve the same in ActiveMatrix BusinessWorks Designer.

Additions: Checkpoint Usage, Blocking Activities, HTTP Performance. Download the file from Resources below. Performance_Tuning_-_Dhaval_Kotecha.doc 371 kB 278 downloads

**Link:** [Article](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/performance-tuning-businessworks/)

#### Reprocess Failed Transactions in TIBCO Businessworks
**Summary:** TIBCO Businessworks is a Java-based platform, however, normally very little development is done in Java.  
**Tags:** `BW6X`, `BWCE`, `xslt`, `monitoring`, `logging`

**Description:**  
TIBCO Businessworks is a Java-based platform, however, normally very little development is done in Java. At it's heart TIBCO Businessworks is an XSLT processing engine with lots of connectivity components.

REPROCESSING OF FAILED TRANSACTIONS Write a Rulebase to verify the log for reprocessing failed transactions. Select the TraceLevel method in EventLog microagent for logging event. Provide values for conditions to be monitored in Test Editor. Jovi Soft Solutions provides the best AEM Training. Online training by real time experts. The alert message is set to display errors. Note: .hrb File created for the Reprocessing of failed transactions: MONITORING OF JVM PARAMETERS Monitoring of JVM Parameters in TIBCO requires a similar procedure used in, Monitoring of memory and virtual memory. Please refer to the previous post MONITORING OF MEMORY, VIRTUAL MEMORY Monitoring of Threads.

**Link:** [Article](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/how-reprocess-failed-transactions-tibco-businessworkstm/)

#### Setting up an Amazon EKS Cluster
**Summary:** This article is focused on setting up an EKS cluster and the possible pitfalls that you may experience while doing so.  
**Tags:** `BW6X`, `BWCE`, `aws`, `aws-eks`, `https`

**Description:**  
This article is focused on setting up an EKS cluster and the possible pitfalls that you may experience while doing so. Hopefully, this will be helpful in setting up your own EKS cluster! We will focus on some of the major milestones in the setup.

To get started, we suggest looking at the official documentation, https://docs.aws.amazon.com/eks/latest/userguide/getting-started.html. If you follow this, you should be able to get everything set up, but issues may arise, so ill list the most common ones below. Possible issues: The access Key and Secret Access Key haven't been set yet. In order for your computer to connect to the EKS cluster it needs these keys to authenticate yourself as the actual user. These keys can be set by running "aws configure" within your terminal. Please keep in mind that this stores your keys, so only do this on a private computer that only you have access to. Your keys essentially give access to your account.

**Link:** [Article](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/setting-amazon-eks-cluster/)

#### Steps to migrate RCS designer project to TIBCO Designer? Add-in for TIBCO Business Studio?
**Summary:** Steps_to_migrate_RCS_designer_project_to_DABS.doc
566 kB · 192 downloads.  
**Tags:** `BW6X`, `BWCE`, `migration`, `testing`, `businessworks`

**Description:**  
Steps_to_migrate_RCS_designer_project_to_DABS.doc
566 kB · 192 downloads

Migrating designer RCS project to TIBCO Designer? Add-in for TIBCO Business Studio? has some tweaks and needs to follow some steps. I am uploading document based on our findings while testing. Steps are specified considering CVS is used as RCS but steps will be more over same for other RCS. Steps_to_migrate_RCS_designer_project_to_DABS.doc 566 kB · 192 downloads

**Link:** [Article](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/steps-migrate-rcs-designer-project-tibco-designertm-add-tibco-business-studiotm/)

#### Streaming TIBCO Cloud? Integration app logs and metrics to Elasticsearch (EFK)
**Summary:** This tutorial explains how you can run the TIBCO Cloud?.  
**Tags:** `BW6X`, `BWCE`, `docker`, `containers`, `https`

**Description:**  
This tutorial explains how you can run the TIBCO Cloud? Integration - Hybrid Agent in a Docker container to stream logs from TIBCO Cloud Integration Integrate (BusinessWorks) and Develop (Flogo), and collect them to EFK (Elasticsearch + Fluentd + Kibana) stack using container logs.

Please refer to the below product documentation links for more details on the TIBCO Cloud Integration Hybrid Agent and its log streaming feature: Using the TIBCO Cloud Integration - Hybrid Agent: https://integration.cloud.tibco.com/docs/tci/using/hybrid-agent/index.html Streaming logs using the hybrid agent: https://integration.cloud.tibco.com/docs/tci/using/hybrid-agent/hybrid-proxy/log-streaming.html NOTE - EFK and TIBCO Cloud Integration - Hybrid Agent setup scripts are included in the attachment.

**Link:** [Article](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/streaming-tibco-cloudtm-integration-app-logs-and-metrics-elasticsearch-efk/)

#### This is a short guide on how to run the JDBC basic sample using TIBCO Businessworks…
**Summary:** The complete info can be found on the TIBCO Businessworks documentation, the purpose of this post it's only to add extra info that can be helpful to run...  
**Tags:** `BWCE`, `docker`, `containers`, `jdbc`, `oracle`

**Description:**  
The complete info can be found on the TIBCO Businessworks documentation, the purpose of this post it's only to add extra info that can be helpful to run the sample. The sample by default use oracle, We use mysql because is the db used by the monitoring application by default so we have already the container running on my machine.

The first step is to start the mysql container. We use the docker-compose.yml file provided with the SW. In this compose file are specified 4 containers (the monitoring app, mysql, postgres, and mongodb). For this sample is required only mysql so feel free to comment or delete the other containers or lines not needed. Note: We have modified the default file to add a network (my_network) so the containers mysql and monitoring app are on the same network and the monitoring app can talk to mysql directly. A monitoring app is not used in this sample but the same concept is used to link the sample JDBC application with the mysql db container at runtime.

**Link:** [Article](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/tibco-businessworkstm-container-edition-samples-docker-jdbc-basic/)

#### TIBCO® RTView® for TIBCO BusinessWorks?
**Summary:** TIBCO® RTView® for TIBCO BusinessWorks?.  
**Tags:** `BW6X`, `BWCE`, `containers`, `monitoring`, `troubleshooting`

**Description:**  
TIBCO® RTView® for TIBCO BusinessWorks? software provides an out-of-the-box centralized view of real-time and historical performance metrics across multiple metrics:

TIBCO BusinessWorks? Container Edition and TIBCO BusinessWorks? 6 applications, containers, appnodes, and processes TIBCO BusinessWorks? 5 servers, engines, processes, and activities and presents the results through a mobile-friendly dashboard. It includes pre-defined rules and alerts for typical BusinessWorks environments and allows the customization of thresholds and alert management features. The monitor maintains a complete history of performance metrics and alerts for analysis and troubleshooting. Turnkey TIBCO BusinessWorks Monitoring No need to spend your time building displays.

**Link:** [Article](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/tibco-rtview-tibco-businessworks-wiki/)

#### Understanding TIBCO ActiveMatrix BusinessWorks? Engine Memory and CPU consumption
**Summary:** One of the key features of the TIBCO ActiveMatrix BusinessWorks?.  
**Tags:** `BW6X`, `BWCE`, `troubleshooting`, `performance`, `memory`

**Description:**  
One of the key features of the TIBCO ActiveMatrix BusinessWorks? Engine is its ability to optimize system resources (CPU, memory, and disk) and therefore generate higher throughput. Memory consumption increases as the number of jobs being processed increases. If the JVM max heap size is sufficient, then the ActiveMatrix BusinessWorks engine will process all jobs and when completed, memory usage should return to normal.

Sometimes, the ?java.lang.OutOfMemory? error in the ActiveMatrix BusinessWorks engine is reported by users. ?OutOfMemory? exceptions occur when there is not enough memory for the ActiveMatrix BusinessWorks engine to process jobs. Occasionally, users report that ActiveMatrix BusinessWorks engine(s)? performance is slow, CPU utilization is high and there is a noticeable increase in memory consumption. The following explains some of the issues surrounding excessive ActiveMatrix BusinessWorks resource usage. CPU and thread utilization are governed by various factors: Load on the engine. The number of jobs being processed when the CPU spike is observed. JVM heap consumption.

**Link:** [Article](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/understanding-activematrix-businessworks-engine-memory-and-cpu-consumption/)

#### Upgrading TIBCO BusinessWorks Container Engine Runtime in a Kubernetes Environment
**Summary:** In this article I want to show you how to upgrade the TIBCO BusinessWorks Container Edition runtime (the BWCE Base Image) for an application/microservice that is deployed in...  
**Tags:** `BWCE`, `kubernetes`, `containers`, `rest`, `upgrade`

**Description:**  
In this article I want to show you how to upgrade the TIBCO BusinessWorks Container Edition runtime (the BWCE Base Image) for an application/microservice that is deployed in a Kubernetes environment and achieve a Zero Downtime upgrade, without having to rebuild your application EAR file etc. This will significantly reduce the time for you to upgrade your BusinessWorks Container Edition versions and also mean that much less testing is required as you are not changing any of your business logic and the application itself does not need to be rebuilt.

I'll be using a simple Greeting microservice that is a REST API that responds with a message, the container hostname and the BusinessWorks runtime version: Building the BusinessWorks Container Edition Base Image --> There's lots of instructions and different examples of how to do this at TIBCO's official github repo here that I'd recommend you take a look at. I'm going to start with my application built using version 2.7.3 of BusinessWorks Container Edition, then upgrade the runtime to 2.8.0.

**Link:** [Article](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/community-upgrading-tibco-businessworks-container-engine-runtime-in-a-kubernetes-environment/)

#### Upgrading TIBCO BusinessWorks Container Engine Runtime in Docker
**Summary:** I considered an alternative Title - 'How Containerisation massively reduces your upgrade process', as this is applicable for any technology that you containerise, but I wanted to show...  
**Tags:** `BWCE`, `docker`, `containers`, `deployment`, `upgrade`

**Description:**  
I considered an alternative Title - 'How Containerisation massively reduces your upgrade process', as this is applicable for any technology that you containerise, but I wanted to show you how to do this specifically with TIBCO BusinessWorks Container Edition as it removes one of the biggest costs/effort of upgrading a BusinessWorks infrastructure.

Let's consider a scenario with 'classic' BusinessWorks - either version 5.x or 6.x. Here, you will have a set of servers (deployed on either physical/virtual/cloud) where you deploy the applications that you build. These applications are tested, running and scaled to the right level to cope with your peak demand. Let's say you have BusinessWorks 6.7.0 running and things are nice and stable (as all things TIBCO are of course!). TIBCO release 3 new versions of BusinessWorks over the next 2 years, let's call them 6.8.0, 6.8.1 and 6.9.0. This means that you are now 3 versions behind and TIBCO's support policy means that they will announce an end of support date for 6.7.0 in due course.

**Link:** [Article](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/community-upgrading-tibco-businessworks-container-engine-runtime-in-docker/)

#### What's New in BusinessWorks
**Summary:** Landing page for "what's new" announcements across BusinessWorks releases — features, plugins, and platform updates.
**Tags:** `BW6X`, `BWCE`, `release-notes`, `whats-new`, `reference`

**Description:**
This is the umbrella community page that aggregates "what's new" posts across BusinessWorks 6.X, BWCE, and BW5.X release announcements. Use it as the entry point when checking what shipped in a recent BW release before drilling into the individual release-highlights articles.

For BW 6.X-specific highlights see the BW6.X release-highlights article (r3526); for BWCE-specific highlights see the BWCE release-highlights article (r3525). For BW 5.16.x feature posts (OpenTelemetry, SSL TCP), see the dedicated BW5 articles in this index.

**Link:** [Article](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/what-s-new-in-businessworks/)
#### Xpath/xquery functions support by TIBCO ActiveMatrix BusinessWorks? engine
**Summary:** These functions are supported by the TIBCO ActiveMatrix BusinessWorks?.  
**Tags:** `BW6X`, `BWCE`, `http`, `mapper`, `xpath`

**Description:**  
These functions are supported by the TIBCO ActiveMatrix BusinessWorks? engine. Not all are currently supported by the mapper GUI and so you may see mapper warnings (i.e. "No such function."), but they should work at runtime.

These are thoroughly documented in the specs: http://www.w3.org/TR/xpath and http://www.w3.org/TR/xquery-operators/ Category Function Name Function Signature Version Summary Examples binary hex-to-string hex-to-string( hexEncodedString , optEncoding ) tib Converts a hex binary encoded string into a string using the specified character encoding. If not specified, the default encoding, UTF-8, is used. hex-to-string('48656C6C6F20576F726C64') = Hello World binary base64-to-hex base64-to-hex( base64EncodedString ) tib Converts a base64 binary encoded string into a hex encoded string.

**Link:** [Article](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/xpathxquery-functions-support-tibco-activematrix-businessworkstm-engine/)

#### Zero Downtime deployment of BusinessWorks Container Edition with Kubernetes ? Part 1
**Summary:** Much of the discussion about deploying applications in Containers centers around how an orchestration platform such as Kubernetes provides Elastic Scalability of your applications ?.  
**Tags:** `BWCE`, `kubernetes`, `containers`, `deployment`, `zero-downtime`

**Description:**  
Much of the discussion about deploying applications in Containers centers around how an orchestration platform such as Kubernetes provides Elastic Scalability of your applications ? allowing incoming demand to scale your application up and down to meet demand appropriately. This can be extremely cost effective when you?re paying hourly usage rates for cloud hosting, and provides one of the biggest cost savings over data center hosting when you have a proper cloud-native deployment. To do this properly, the application in your container needs to provide the appropriate metrics that can be queried by Kubernetes to determine the scaling up or down points.

After scalability, the next topic is Self-Healing ? when a micro service is no longer responding, a new container is started, traffic is routed to the new container, and the old container is unceremoniously removed. To remove any downtime, this means that you need at least 2 instances of your micro service running (n+1) and that way, there should be no interruption of service. In this post, I want to talk about another aspect of Containerisation that I think has been overlooked of late, but has a significant impact on how organisations manage platforms t

**Link:** [Article](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/zero-downtime-deployment-businessworks-container-edition-kubernetes-part-1/)

#### Zero Downtime Deployment of BusinessWorks Container Edition with Kubernetes ? Part 2
**Summary:** In my first post in this series, we created a Greeting Service using TIBCO BusinessWorks Container Edition and we created manifest files and deployed our Micro Service into...  
**Tags:** `BWCE`, `docker`, `kubernetes`, `containers`, `deployment`

**Description:**  
In my first post in this series, we created a Greeting Service using TIBCO BusinessWorks Container Edition and we created manifest files and deployed our Micro Service into Minikube.

In this post, we?re going to upgrade our original version of the Micro Service to version 1.1 and we?ll use the Recreate strategy to perform the upgrade. To do this, I?ve created a new manifest file (here) that has 2 changes to it. The first is to point it to the newer version of the Docker Image that we created earlier (v1.1), and also to add in the definition of the Recreate Strategy.

**Link:** [Article](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/zero-downtime-deployment-businessworks-container-edition-kubernetes-part-2/)

#### Zero Downtime Deployment of BusinessWorks Container Edition with Kubernetes ? Part 3
**Summary:** In my previous two posts (Part 1 and Part 2)we created and deployed a Micro Service using TIBCO BusinessWorks Container Edition into Kubernetes (I used Minikube), and then...  
**Tags:** `BWCE`, `kubernetes`, `containers`, `deployment`, `upgrade`

**Description:**  
In my previous two posts (Part 1 and Part 2)we created and deployed a Micro Service using TIBCO BusinessWorks Container Edition into Kubernetes (I used Minikube), and then upgraded it using the Recreate strategy.

In this post, we?re going to take the original deployment of Version 1.0 (which we rolled back to at the end of the second post) and upgrade it again to 1.1, but this time using the Rolling Update strategy. Rolling Updates, also known as Ramped Updates are actually the default deployment strategy in Kubernetes, so if you don?t make any changes to your manifest file ? this is the strategy that would be used. Of course ? you can make changes so that you have a little more control over how the deployment strategy is employed.

**Link:** [Article](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/zero-downtime-deployment-businessworks-container-edition-kubernetes-part-3/)

#### Zero Downtime Deployment of BusinessWorks Container Edition with Kubernetes ? Part 4
**Summary:** In my previous three posts (Part 1, Part 2, and Part 3)we created and deployed a Micro Service using TIBCO BusinessWorks Container Edition into Kubernetes (I used Minikube),...  
**Tags:** `BWCE`, `kubernetes`, `containers`, `deployment`, `upgrade`

**Description:**  
In my previous three posts (Part 1, Part 2, and Part 3)we created and deployed a Micro Service using TIBCO BusinessWorks Container Edition into Kubernetes (I used Minikube), and then upgraded it using the Recreate and Rolling Update strategy.

In this post, we?re going to take the original deployment of Version 1.0 (which we rolled back to at the end of the second post) and upgrade it again to 1.1, but this time using the Blue/Green strategy. A Blue/Green deployment strategy (sometimes also known as Red/Black) allows you to deploy upgraded services alongside your existing services and the two don?t interact in any way. The URL of the Service defined is different so it allows you to test the new deployment before switching over all the traffic. I?ve created an example manifest file where the changes I?ve made are pretty minimal and really just add in the keywords ?version: green?. The complete version of the file is here.

**Link:** [Article](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/zero-downtime-deployment-businessworks-container-edition-kubernetes-part-4/)

#### Zero Downtime Deployment of BusinessWorks Container Edition with Kubernetes ? Part 5
**Summary:** In my previous posts (Part 1, Part 2, Part 3, and Part 4)we created and deployed a Micro Service using TIBCO BusinessWorks Container Edition into Kubernetes (I used...  
**Tags:** `BWCE`, `kubernetes`, `containers`, `deployment`, `upgrade`

**Description:**  
In my previous posts (Part 1, Part 2, Part 3, and Part 4)we created and deployed a Micro Service using TIBCO BusinessWorks Container Edition into Kubernetes (I used Minikube) and then upgraded it using the Recreate, Rolling Update, and Blue/Green strategies.

In this post, we?re going to take the original deployment of Version 1.0 (which we rolled back to at the end of the second post) and upgrade it again to 1.1, but this time using the Canary deployment strategy. With a Canary deployment strategy, we want to deploy a new version of a microservice and route some traffic to it, whilst most traffic goes to the original version. If we see no issues, we can increase the number of new Pods of the new version ? taking more and more of the traffic over time. In this example, we really need more replicas to show it working a little better, so I will deploy our original version with 3 replicas instead of 2.

**Link:** [Article](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/zero-downtime-deployment-businessworks-container-edition-kubernetes-part-5/)


### Newsletters

#### BusinessWorks Support Newsletter - August 2019
**Summary:** News on the latest releases, hotfixes, knowledgebase articles, and technical tips.  
**Tags:** `BW5X`, `BW6X`, `BWCE`, `containers`, `http`

**Description:**  
News on the latest releases, hotfixes, knowledgebase articles, and technical tips

Send comments to https://support.tibco.com Upgrade To The Latest Product Releases TIBCO ActiveMatrix BusinessWorks 6.5.1 was released on February 22, 2019.

**Link:** [Article](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/tibco-businessworks-support-newsletter-august-2019/)

#### BusinessWorks Support Newsletter - June 2021
**Summary:** News on the latest releases, hotfixes, knowledgebase articles, and technical tips.  
**Tags:** `BW6X`, `BWCE`, `http`, `https`, `oauth`

**Description:**  
News on the latest releases, hotfixes, knowledgebase articles, and technical tips.

Send comments to https://support.tibco.com Upgrade to the Latest Product Releases TIBCO ActiveMatrix BusinessWorks 6.7.0 software was released on November 18, 2020. Check the release notes for a complete list of new features, changes in functionality, and defect fixes. A few highlights: Smart Mapper (preview) provides the ability to intelligently determine how data is to be mapped in the activity's input tab. Support for OpenAPI 3.0 specification. Support is added for OAuth 2.0 client configuration. Process diff viewer for comparing changes visually. Application templates. Plug-ins manager for improved plug-in installation experience in the TIBCO Business Studio tool.

**Link:** [Article](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/tibco-businessworks-support-newsletter-june-2021/)

#### BusinessWorks Support Newsletter - May 2020
**Summary:** News on the latest releases, hotfixes, knowledgebase articles, and technical tips.  
**Tags:** `BW5X`, `BW6X`, `BWCE`, `containers`, `ems`

**Description:**  
News on the latest releases, hotfixes, knowledgebase articles, and technical tips.

Send comments to https://support.tibco.com Upgrade to the Latest Product Releases TIBCO ActiveMatrix BusinessWorks? 6.6.0 was released on November 18, 2019.

**Link:** [Article](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/tibco-businessworks-support-newsletter-may-2020/)


---

## Newly Added Articles (Security)


### Security

#### Configure a BusinessWorks 6.X application to connect to an EMS instance using SSL/TLS
**Summary:** This article is to explain how to configure a JMS connection shared resource of a BusinessWorks 6.X application to connect to an EMS instance using SSL/TLS, it also...  
**Tags:** `BW6X`, `jms`, `ems`, `https`, `ssl`

**Description:**  
This article is to explain how to configure a JMS connection shared resource of a BusinessWorks 6.X application to connect to an EMS instance using SSL/TLS, it also explains how to configure existing applications to use SSL/TLS by only using properties managed by the EMS client library.

Creation of a KeyStore file Before setting up the configuration in Studio you need to create a keystore containing one of the public certificates of the target EMS instance. You can get such certificates using tools like java keytool or KeyStore Explorer as covered in the article explaining how to connect to an HTTPS endpoint. KeyStore Explorer can connect to an EMS instance using the Examine -> Examine SSL/TLS menu. After connecting to the target EMS instance the certificate hierarchy is displayed. In the example above we are connecting to an EMS instance configured with the EMS sample certificates and there is a single certificate in the hierarchy.

**Link:** [Article](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/bw6x-how-to-configure-a-businessworks-6x-application-to-connect-to-an-ems-instance-using-ssltls-r3805/)

#### Trusted certificates management in BusinessWorks 5.X
**Summary:** In the past a BusinessWorks 5.X standard activity configured to use SSL/TLS needed to have the full chain of the server public certificates in the trust folder to...  
**Tags:** `BW5X`, `ssl`, `tls`, `certificates`, `release-notes`

**Description:**  
In the past a BusinessWorks 5.X standard activity configured to use SSL/TLS needed to have the full chain of the server public certificates in the trust folder to be able to validate the identity of the server and establish the SSL/TLS connection, the root, intermediate and leaf certificates.

In recent versions, I mean BusinessWorks 5.15.x and 5.16.x, it is only needed to have the root and intermediate certificates which help reduce the certificate management overhead. Furthermore in recent BusinessWorks 5.X releases there is a property that allows BusinessWorks clients to validate SSL/TLS servers identities using only one of the public certificates (i.e. the root, intermediate or leaf certificate). The default BusinessWorks 5.X behavior can be changed by just adding the following property in the application tra file: java.property.com.tibco.security.NoExplicitCAChain=true.

**Link:** [Article](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/bw5x-useful-things-to-know-about-trusted-certificates-management-in-businessworks-5x-r3590/)

#### Debug BusinessWorks Shared Resources SSL/TLS connection issues from the Studio design…
**Summary:** In many cases a shared resource defines a connection to a system or an application and includes the capability to test the connection from the Studio design time...  
**Tags:** `BW6X`, `BWCE`, `ssl`, `tls`, `plugin`

**Description:**  
In many cases a shared resource defines a connection to a system or an application and includes the capability to test the connection from the Studio design time environment.

A common challenge while using this capability is to analyse SSL/TLS connection issues. This article is to describe a solution to get SSL/TLS detailed logs while testing a Shared Resource connection from the Studio design time environment. The content of this article is particularly useful while using Shared Resources that connect to a target system to download meta-data, like for example the OData Plugin. In other cases you can just start the BusinessWorks application from the Debugger and check for error messages in the standard Studio log.

**Link:** [Article](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/bw6x-bwce-how-to-debug-businessworks-shared-resources-ssltls-connection-issues-from-the-studio-design-time-environment-r3587/)

#### BusinessWorks? Tutorial: Using JSON Web Tokens (JWT)
**Summary:** JSON Web Token (JWT) is an open standard (RFC 7519) that defines a compact and self-contained way for securely transmitting information between parties as a JSON object.  
**Tags:** `BW6X`, `BWCE`, `json`, `jwt`, `shared-modules`

**Description:**  
JSON Web Token (JWT) is an open standard (RFC 7519) that defines a compact and self-contained way for securely transmitting information between parties as a JSON object. This information can be verified and trusted because it is digitally signed. JWTs can be signed using a secret (with the HMAC algorithm) or a public/private key pair using RSA.

Here are some scenarios where JSON Web Tokens are useful: Authentication: This is the most common scenario for using JWT.

**Link:** [Article](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/tibco-businessworks-tutorial-using-json-web-tokens-jwt/)

#### Capture HTTP messages in TIBCO ActiveMatrix BusinessWorks™ 5
**Summary:** When troubleshooting HTTP invocation issues, it might be necessary to capture request and response messages including headers in some scenarios.  
**Tags:** `BW5X`, `http`, `https`, `ssl`, `tls`

**Description:**  
When troubleshooting HTTP invocation issues, it might be necessary to capture request and response messages including headers in some scenarios. This article discusses a few different options for capturing HTTP messages in TIBCO ActiveMatrix BusinessWorks™ 5 (BW).

1. SSL debug logging: If the invocation is over TLS (HTTPS), TLS debug logs will contain the request and response messages. 2. Other options include using packet capture tools (Wireshark) and process logging.

**Link:** [Article](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/how-to-capture-http-messages-in-tibco-activematrix-businessworks5/)

#### Certificate trust behavior in TIBCO ActiveMatrix BusinessWorks™ 5
**Summary:** This article discusses the default certificate trust behavior and configuration options.  
**Tags:** `BW5X`, `certificates`, `configuration`, `businessworks`, `integration`

**Description:**  
This article discusses the default certificate trust behavior and configuration options.

Default behavior: By default, BW trusts an entity's certificate only if any intermediate CA certificates and the root CA certificate in the certificate chain are placed in the Trusted Certificates folder in the project or in the location specified in the global variable BW_GLOBAL_TRUSTED_CA_STORE. For example, with a server certificate chain (Server -> IntermediateCA -> RootCA), both the intermediate CA certificate and the root CA certificate must be placed in the Trusted Certificates folder for BW to trust the server certificate.

**Link:** [Article](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/certificate-trust-behavior-in-tibco-activematrix-businessworks5/)

#### Common Errors in TIBCO ActiveMatrix BusinessWorks? related to SSL communication
**Summary:** #Please note, this article may contain out of date URLs due to the Spotfire Community migration.  
**Tags:** `BW6X`, `BWCE`, `ssl`, `certificates`, `migration`

**Description:**  
#Please note, this article may contain out of date URLs due to the Spotfire Community migration.

Table of Contents Section-I: Enabling Tracing Section-II: Common Errors Error message: ?iaik.security.ssl.SSLException: Server certificate rejected by ChainVerifier? Error Message: No PrivateKeyInfo: iaik.asn1.CodingException: ASN.1 creation error:Length: Too large ASN.1 object Error: com.tibco.security.AXSecurityException: RSA signature failed to initialize for verifying: Unsupported keysize or algorithm parameters Error: iaik.security.ssl.SSLException: Peer sent alert: Alert Fatal: unexpected Message Error: SSLException while handshaking: Peer sent alert: Alert Fatal: decrypt error Error: SSLException while handshaking: Certificate verify message signature error! Error: com.tibco.security....

**Link:** [Article](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/common-errors-tibco-activematrix-businessworkstm-related-ssl-communication/)

#### Configuring TIBCO ActiveMatrix BusinessWorks™ 5 to connect to IBM DB2 database server…
**Summary:** This article explains how to configure JDBC Connection shared resource in TIBCO ActiveMatrix BusinessWorks™ 5 to connect to IBM DB2 database server over TLS.  
**Tags:** `BW5X`, `ssl`, `tls`, `certificates`, `jdbc`

**Description:**  
This article explains how to configure JDBC Connection shared resource in TIBCO ActiveMatrix BusinessWorks™ 5 to connect to IBM DB2 database server over TLS.

IBM Data Server Driver for JDBC and SQLJ - db2jcc4.jar JDBC Driver Select the following driver from the Select driver dropdown. com.ibm.db2.jcc.DB2Driver Database URL To enable TLS with server certificate validation, specify the URL as follows - jdbc:db2://host:port/database:sslConnection=true;sslTrustStoreLocation=path_to_truststore_file;sslTrustStorePassword=password; For example, jdbc:db2://dbserver:25001/sample:sslConnection=true;sslTrustStoreLocation=D:/PKI/trust.jks;sslTrustStorePassword=password; sslConnection - Set this property to true to enable TLS sslTrustStoreLocation - Path to the truststore file containing trusted certificates sslTrustStorePassword - Truststore password TIBCO D...

**Link:** [Article](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/configuring-tibco-activematrix-businessworks-5-to-connect-to-ibm-db2-database-server-over-tls/)

#### Configuring TIBCO ActiveMatrix BusinessWorks™ 5 to connect to MariaDB database server…
**Summary:** This article explains how to configure JDBC Connection shared resource in TIBCO ActiveMatrix BusinessWorks™ 5 to connect to MariaDB database server over TLS.  
**Tags:** `BW5X`, `tls`, `jdbc`, `database`, `mariadb`

**Description:**  
This article explains how to configure JDBC Connection shared resource in TIBCO ActiveMatrix BusinessWorks™ 5 to connect to MariaDB database server over TLS.

Prerequisite: The JDBC driver JAR file (MariaDB Connector/J) must be available in bwengine classpath. JDBC Driver: org.mariadb.jdbc.Driver. Database URL: jdbc:mariadb://host:port/database?useSSL=true&trustStore=path&trustStorePassword=password&keyStore=path&keyStorePassword=password. useSSL=true to enable TLS.

**Link:** [Article](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/configuring-tibco-activematrix-businessworks5-to-connect-to-mariadb-database-server-over-tls/)

#### Configuring TIBCO ActiveMatrix BusinessWorks™ 5 to connect to Microsoft SQL Server…
**Summary:** This article explains how to configure JDBC Connection shared resource in TIBCO ActiveMatrix BusinessWorks™ 5 to connect to Microsoft SQL Server database over TLS.  
**Tags:** `BW5X`, `ssl`, `tls`, `encryption`, `jdbc`

**Description:**  
This article explains how to configure JDBC Connection shared resource in TIBCO ActiveMatrix BusinessWorks™ 5 to connect to Microsoft SQL Server database over TLS.

Microsoft JDBC Driver for SQL Server: Select com.microsoft.sqlserver.jdbc.SQLServerDriver. Database URL: jdbc:sqlserver://host:port;databaseName=database;encrypt=true;trustStore=path_to_trust_store;trustStorePassword=password. TIBCO Database Driver Supplement Software (TDDS): Select tibcosoftwareinc.jdbc.sqlserver.SQLServerDriver. Database URL: jdbc:tibcosoftwareinc:sqlserver://host:port;databaseName=database;EncryptionMethod=SSL;TrustStore=path_to_trust_store;TrustStorePassword=password;ValidateServerCertificate=true.

**Link:** [Article](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/configuring-tibco-activematrix-businessworks-5-to-connect-to-microsoft-sql-server-database-over-tls/)

#### Configuring TIBCO ActiveMatrix BusinessWorks™ 5 to connect to MySQL database over TLS
**Summary:** This article explains how to configure JDBC Connection shared resource in TIBCO ActiveMatrix BusinessWorks™ 5 to connect to MySQL database over TLS.  
**Tags:** `BW5X`, `ssl`, `tls`, `certificates`, `jdbc`

**Description:**  
This article explains how to configure JDBC Connection shared resource in TIBCO ActiveMatrix BusinessWorks™ 5 to connect to MySQL database over TLS

. Prerequisite: The JDBC driver JAR file (MySQL Connector/J) must be available in bwengine classpath. JDBC Driver: Select com.mysql.jdbc.Driver. Database URL: jdbc:mysql://host:port/database?sslMode=VERIFY_CA&trustCertificateKeyStoreUrl=file:path_to_trust_store&trustCertificateKeyStorePassword=password&clientCertificateKeyStoreUrl=file:path_to_keystore&clientCertificateKeyStorePassword=password. sslMode set to VERIFY_CA to enable SSL and verify server certificate.

**Link:** [Article](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/configuring-tibco-activematrix-businessworks5-to-connect-to-mysql-database-over-tls/)

#### Configuring TIBCO ActiveMatrix BusinessWorks™ 5 to connect to Oracle database server…
**Summary:** This article explains how to configure JDBC Connection shared resource in TIBCO ActiveMatrix BusinessWorks™ 5 to connect to Oracle database server over TLS.  
**Tags:** `BW5X`, `tls`, `certificates`, `jdbc`, `database`

**Description:**  
This article explains how to configure JDBC Connection shared resource in TIBCO ActiveMatrix BusinessWorks™ 5 to connect to Oracle database server over TLS.

Oracle JDBC driver - ojdbc8.jar JDBC Driver Select the following driver from the Select driver dropdown. oracle.jdbc.driver.OracleDriver (thin) Database URL To connect over TLS with mutual authentication, specify the URL as follows - jdbc:oracle:thin:@tcps://host:port/service?wallet_location=path_to_wallet_directory For example, jdbc:oracle:thin:@tcps://dbserver:2484/orcl19.tibco.com?wallet_location=D:/PKI/wallet wallet_location - Path to the directory where the wallet file containing the trusted certificates, client's certificate and client's private key is present.

**Link:** [Article](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/configuring-tibco-activematrix-businessworks-5-to-connect-to-oracle-database-server-over-tls/)

#### Configuring TIBCO ActiveMatrix BusinessWorks™ 5 to connect to PostgreSQL database…
**Summary:** This article explains how to configure JDBC Connection shared resource in TIBCO ActiveMatrix BusinessWorks™ 5 to connect to PostgreSQL database server over TLS.  
**Tags:** `BW5X`, `ssl`, `tls`, `certificates`, `jdbc`

**Description:**  
This article explains how to configure JDBC Connection shared resource in TIBCO ActiveMatrix BusinessWorks™ 5 to connect to PostgreSQL database server over TLS

. Prerequisite: The JDBC driver JAR file (PostgreSQL JDBC Driver) must be available in bwengine classpath. JDBC Driver: Select org.postgresql.Driver. Database URL: jdbc:postgresql://host:port/database?ssl=true&sslmode=verify-ca&sslrootcert=path_to_server_cert_file&sslkey=path_to_client_key_file&sslpassword=password&sslcert=path_to_client_cert_file. ssl=true to enable TLS, sslmode=verify-ca to validate server certificate.

**Link:** [Article](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/configuring-tibco-activematrix-businessworks5-to-connect-to-postgresql-database-server-over-tls/)

#### Configuring TIBCO ActiveMatrix BusinessWorks™ 5 to connect to Sybase database (SAP…
**Summary:** This article explains how to configure JDBC Connection shared resource in TIBCO ActiveMatrix BusinessWorks™ 5 to connect to Sybase database (SAP ASE) over TLS.  
**Tags:** `BW5X`, `ssl`, `tls`, `sap`, `jdbc`

**Description:**  
This article explains how to configure JDBC Connection shared resource in TIBCO ActiveMatrix BusinessWorks™ 5 to connect to Sybase database (SAP ASE) over TLS

. Prerequisite: The JDBC driver JAR file (jconn4.jar or TISybase.jar) must be available in bwengine classpath. jConnect driver - jconn4.jar: JDBC Driver: com.sybase.jdbc4.jdbc.SybDriver. Database URL: jdbc:sybase:Tds:host:port/database?ENABLE_SSL=true. TIBCO Database Driver Supplement Software (TDDS) - TISybase.jar: Select tibcosoftwareinc.jdbc.sybase.SybaseDriver. Database URL: jdbc:tibcosoftwareinc:sybase://host:port;databaseName=database;EncryptionMethod=SSL;ValidateServerCertificate=true;TrustStore=path_to_truststore_file;TrustStorePassword=truststore_password.

**Link:** [Article](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/configuring-tibco-activematrix-businessworks5-to-connect-to-sybase-database-sap-ase-over-tls/)

#### Connect to Red Hat AMQ over TLS in TIBCO ActiveMatrix BusinessWorks™ 5
**Summary:** This article explains how to configure TIBCO ActiveMatrix BusinessWorks™ 5 to connect to Red Hat AMQ over TLS.  
**Tags:** `BW5X`, `jms`, `tls`, `properties`, `businessworks`

**Description:**  
This article explains how to configure TIBCO ActiveMatrix BusinessWorks™ 5 to connect to Red Hat AMQ over TLS.

Versions used: TIBCO ActiveMatrix BusinessWorks™ 5.15.0, Red Hat AMQ 7.8. Step 1 - Add the client JAR file to classpath: Copy the artemis-jms-client-all-2.16.0.redhat-00046.jar to a location in the classpath (for example, TIBCO_HOME/tpcl/5.12/lib) or add the location of the JAR file to the classpath. Step 2 - Create JMS Connection shared resource: JNDI Context Factory: org.apache.activemq.artemis.jndi.ActiveMQInitialContextFactory. JNDI Context URL: tcp://host:port?sslEnabled=true&keyStorePath=...&keyStorePassword=...&trustStorePath=...&trustStorePassword=... Properties include sslEnabled, keyStorePath, keyStorePassword, trustStorePath, trustStorePassword.

**Link:** [Article](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/how-to-connect-to-red-hat-amq-over-tls-in-tibco-activematrix-businessworks5/)

#### Connecting to MQ Server from TIBCO ActiveMatrix Businessworks? over SSL using file…
**Summary:** On Windows, the default installation is straightforward.  
**Tags:** `BW6X`, `BWCE`, `jms`, `http`, `ssl`

**Description:**  
On Windows, the default installation is straightforward. If you choose the custom installation option make sure WebSphere MQ Explorer and JMS Messaging are selected as part of the installation. In order to install MQ Explorer, the trial version of WebSphere MQ 6.0 requires Eclipse 3.0 or greater. Once you complete the installation successfully, you can start configuring the Queue Manager.

Trial version of WebSphere MQ Server can be downloaded from - http://www.ibm.com/developerworks/downloads/ws/wmq. Configuring the Queue Manager Open MQ Explorer using Start > IBM WebSphere MQ > WebSphere MQ Explorer Right-click on the Queue Manager folder and select New > Queue Manager Provide the Queue Manager name and leave the remaining entries to default values. Click Next to continue. To Enable SSL for the newly created Queue Manager, right-click on it to launch its Properties. In

**Link:** [Article](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/connecting-mq-server-tibco-activematrix-businessworkstm-over-ssl-using-file-based-jndi-lookup/)

#### Enable certificate revocation checking in TIBCO ActiveMatrix BusinessWorks™ 5
**Summary:** Certificate revocation checking is disabled by default in TIBCO ActiveMatrix BusinessWorks™ 5.  
**Tags:** `BW5X`, `certificates`, `properties`, `businessworks`, `integration`

**Description:**  
Certificate revocation checking is disabled by default in TIBCO ActiveMatrix BusinessWorks™ 5. This article explains how to enable the same.

Revocation checking using CRLs: To enable revocation checking using CRLs, add the following properties to the deployed application .tra file/designer.tra file: java.property.com.sun.security.enableCRLDP=true, java.property.com.tibco.security.CheckRevocation=true, java.property.com.tibco.security.NoExplicitCAChain=true. Revocation checking using OCSP: Same properties as above plus uncomment ocsp.enable=true in the Java security properties file (TIBCO_HOME/tibcojre64/1.8.0/lib/security/java.security or TIBCO_HOME/tibcojre64/11/conf/security/java.security).

**Link:** [Article](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/how-to-enable-certificate-revocation-checking-in-tibco-activematrix-businessworks5/)

#### Finding a Certificate Chain (and more with X.509, PKI and TLS/SSL)
**Summary:** Attached is a PPT in PDF form that covers a good amount of ground on X.509, PKI, and TLS/SSL.  
**Tags:** `BW6X`, `BWCE`, `ssl`, `tls`, `certificates`

**Description:**  
Attached is a PPT in PDF form that covers a good amount of ground on X.509, PKI, and TLS/SSL.

All Browsers will validate a chain, but when you go to find the chain, the browsers will pick the first certificate based on the Distinguished Name. Many CA cert vendors are re-releasing 'same-named' CA certs, so the chain can be a 'false chain'. Why is this? It is cryptographically cheaper to parse a public key and certificate than it is to validate the signature, and it is not always possible to trace serial numbers, so Browser vendors look to the DN/CN and pick the first one they find...Bob is Bob, even if the DNA is different? No. Sites are not under any obligation to send the full chain. I have many examples of partial chains, usually missing the self-signed ROOT.

**Link:** [Article](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/finding-certificate-chain-and-more-x509-pki-and-tlsssl/)

#### Install SSL certificates in TIBCO ActiveMatrix BusinessWorks? HTTP client/Server?
**Summary:** As you own the server, you will have to create a certificate that will uniquely identify your server.  
**Tags:** `BW5X`, `http`, `ssl`, `certificates`, `encryption`

**Description:**  
As you own the server, you will have to create a certificate that will uniquely identify your server. To create the certificate you can use a command line utility called 'keytool' which is shipped with the java jdk and jre. The command we'll use is

keytool -genkey -alias server-alias -keyalg RSA -keypass yourpassword -storepass yourpassword -keystore keystore.jks short summary of the keytool options used: -alias Used to give a name to your key - should be unique for its purpose. -keyalg Encryption algorithm type -keypass Password affiliated to key -storepass Password affiliated to keystore.jks keystore.jks Name of the file which acts as key repository. After typing in this command, you will be asked questions, and answer accordingly. In the end, your key, called server-alias, will be stored in the repository file, keystore.jks. This entry in keystore.jks will have a public as well as a private key.

**Link:** [Article](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/how-install-ssl-certificates-tibco-activematrix-businessworks-http-clientserver/)

#### Managing cipher suites used by TIBCO ActiveMatrix BusinessWorks™ 5
**Summary:** This article explains how to manage cipher suites used by TIBCO ActiveMatrix BusinessWorks™ 5 (BW).  
**Tags:** `BW5X`, `tls`, `debugging`, `businessworks`, `integration`

**Description:**  
This article explains how to manage cipher suites used by TIBCO ActiveMatrix BusinessWorks™ 5 (BW).

How to check which cipher suites are enabled: If BW is the client, to identify which cipher suites are enabled, check TLS debug logs. The ClientHello handshake message shows the list of cipher suites supported by the client. The cipher suites supported by BW depend on the underlying JRE.

**Link:** [Article](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/managing-cipher-suites-used-by-tibco-activematrix-businessworks5/)

#### Managing SSL/TLS protocol versions in TIBCO ActiveMatrix BusinessWorks™ 5
**Summary:** This article explains how to manage SSL/TLS protocol versions in TIBCO ActiveMatrix BusinessWorks™ 5 (BW).  
**Tags:** `BW5X`, `http`, `ssl`, `tls`, `properties`

**Description:**  
This article explains how to manage SSL/TLS protocol versions in TIBCO ActiveMatrix BusinessWorks™ 5 (BW).

TLS protocol versions enabled by default in BW environments The TLS protocol versions enabled by default in a BW environment vary based on the JRE version. Let's take the case of BW 5.15.0, which uses Java 11. The property jdk.tls.disabledAlgorithms in the security properties file (TIBCO_HOME/tibcojre64/11/conf/security/java.security) shows which protocol versions are disabled. jdk.tls.disabledAlgorithms=SSLv3, TLSv1, TLSv1.1, RC4, DES, MD5withRSA, \ DH keySize < 1024, EC keySize < 224, 3DES_EDE_CBC, anon, NULL, \ include jdk.disabled.namedCurves By default, SSLv3, TLS 1.0 and TLS 1.1 are disabled on JRE level and only TLS 1.2 and TLS 1.3 are enabled.

**Link:** [Article](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/managing-tls-protocol-versions-in-tibco-activematrix-businessworks-5/)

#### Mapping WS-Security UsernameToken credentials dynamically in TIBCO ActiveMatrix…
**Summary:** When the WS-Security UsernameToken-based Authentication option is selected in an outbound security policy that is attached to a SOAP Request Reply activity, TIBCO ActiveMatrix BusinessWorks™ 5 (BW) uses...  
**Tags:** `BW5X`, `wsdl`, `mapping`, `configuration`, `soap`

**Description:**  
When the WS-Security UsernameToken-based Authentication option is selected in an outbound security policy that is attached to a SOAP Request Reply activity, TIBCO ActiveMatrix BusinessWorks™ 5 (BW) uses credentials retrieved from an Identity shared resource. It is a common requirement to be able to map username and password dynamically. This article explains how to achieve this in BW.

Configuration steps include importing the schema, adding wsse imports to the concrete WSDL, adding a message element for Security, and mapping username/password header dynamically in the SOAP Request Reply activity.

**Link:** [Article](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/mapping-ws-security-usernametoken-credentials-dynamically-in-tibco-activematrix-businessworks5/)

#### New feature in TIBCO ActiveMatrix BusinessWorks™ 5.16.0 - Support for SSL in TCP palette
**Summary:** This article takes a quick look at one of the new features introduced in TIBCO ActiveMatrix BusinessWorks™ (BW) 5.16.0 - SSL support in TCP palette.  
**Tags:** `BW5X`, `ssl`, `certificates`, `configuration`, `businessworks`

**Description:**  
This article takes a quick look at one of the new features introduced in TIBCO ActiveMatrix BusinessWorks™ (BW) 5.16.0 - SSL support in TCP palette.

TCP palette in BW now supports communication over SSL. SSL configuration is done in TCP Connection shared resource. A new checkbox has been added to TCP Connection shared resource for enabling SSL. SSL configuration (Trusted Certificates Folder, Identity shared resource etc.) is similar to other palettes. Two applications are used here - a TCP server and a TCP client. The client application opens a connection and writes some data on the connection. The server application reads the data and logs the same.

**Link:** [Article](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/new-feature-in-tibco-activematrix-businessworks-5-support-for-ssl-in-tcp-palette/)

#### Signing WS-Security elements in a SOAP message in TIBCO ActiveMatrix BusinessWorks™ 5
**Summary:** When the Integrity option is selected in an outbound security policy, TIBCO ActiveMatrix BusinessWorks™ 5 (BW) signs the SOAP Body element only.  
**Tags:** `BW5X`, `soap`, `namespace`, `businessworks`, `integration`

**Description:**  
When the Integrity option is selected in an outbound security policy, TIBCO ActiveMatrix BusinessWorks™ 5 (BW) signs the SOAP Body element only. It is a common requirement to sign WS-Security elements along with the SOAP Body element. This article explains how to configure BW to sign WS-Security elements in a SOAP message.

When the Integrity option is selected in an outbound security policy, TIBCO ActiveMatrix BusinessWorks™ 5 (BW) signs the SOAP Body element only. It is a common requirement to sign WS-Security elements along with the SOAP Body element. To sign additional elements along with SOAP Body, specify the elements along with the SOAP Body element in the Message Elements for Signature field under the Outbound tab of Security Policy Association shared resource. Then under Prefix Namespace Pair, add the prefixes SOAP-ENV and wsu and select the corresponding namespaces.

**Link:** [Article](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/signing-ws-security-elements-in-a-soap-message-in-tibco-activematrix-businessworks5/)


---

## Newly Added Articles (Design Patterns)


### Design Patterns

#### BW6X - BWCE - Plugin for SAP Solutions - How to enable SAP Load Balancing connections…
**Summary:** While using the BusinessWorks Plugin for SAP Solutions to connect as a client to a SAP instance this is quiet common to use Dedicated Application Server connections in...  
**Tags:** `BW6X`, `BWCE`, `plugin`, `sap`, `properties`

**Description:**  
While using the BusinessWorks Plugin for SAP Solutions to connect as a client to a SAP instance this is quiet common to use Dedicated Application Server connections in development and test environments and to use Load Balanced connections in the production environment.

This article is to explain how to switch from a 'Dedicated Application Server' connection to a 'Load Balancing' connection by just updating the runtime configuration. The approach described in this article also works to switch from a 'SNC' connection to a 'SNC with Load Balancing' connection. This can be done by updating the value of the 'Third Party Library Options' configuration option that in the default SAP Connection configuration is set with the 'SAPClientOptions' Module property. The following SAP JCO library properties have to be set to enable the Load Balancing: jco.client.ashost, jco.client.sysnr, jco.client.mshost, jco.client.msserv, jco.client.group.

**Link:** [Article](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/bw6x-bwce-sap-plugin-how-to-enable-sap-load-balancing-connections-in-the-businessworks-sap-plugin-r3585/)

#### Best Practices: Design Patterns
**Summary:** Download the document that describes the design patterns generally involved in using TIBCO products and technology.  
**Tags:** `BW6X`, `BWCE`, `design-patterns`, `best-practices`, `businessworks`

**Description:**  
Download the document that describes the design patterns generally involved in using TIBCO products and technology. It serves as both a concept guide and a reference to TIBCO best practice designs.

Download the document, from Resources below, that describes the design patterns generally involved in using TIBCO products and technology. It serves as both a concept guide and a reference to TIBCO best practice designs. TIBCODesignPatterns.pdf 1.22 MB 634 downloads

**Link:** [Article](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/tibcor-best-practices-design-patterns/)

#### Turbine Server for TIBCO BusinessWorks Container Edition on Kubernetes/OpenShift
**Summary:** Hystrix dashboard is used to monitor the circuit status when the circuit breaker is enabled in TIBCO BusinessWorks Container Edition.  
**Tags:** `BWCE`, `maven`, `docker`, `kubernetes`, `openshift`

**Description:**  
Hystrix dashboard is used to monitor the circuit status when the circuit breaker is enabled in TIBCO BusinessWorks Container Edition. To monitor multiple applications on the same Hystrix dashboard, a stream aggregator is required. The turbine server is a stream aggregator that collects the required data from all pods which has circuit-breaker enabled.

The server can be configured to run on both Kubernetes and Openshift platforms. The project uses Netflix turbine-core 1.0.0 library. Custom code is written to fetch the pod details on K8S/Openshift platform and populate the endpoints in the turbine initializer. The application runs as a container, periodically updating the pod endpoints. It listens at 8090/hystrix.stream endpoint of the pods. This endpoint is specific to TIBCO BusinessWorks Container Edition applications.

**Link:** [Article](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/turbine-server-tibco-businessworkstm-container-edition-kubernetesopenshift/)
