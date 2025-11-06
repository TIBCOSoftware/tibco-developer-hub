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

| Article Title                                                                                                                                                                                                                                                                     | Version      | Focus Area            |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------ | --------------------- |
| [Call Dynamic Sub-Processes](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/how-to-call-dynamic-sub-processes-in-businessworks-and-businessworks-container-edition-r3341/)                                                                | BW6X, BWCE   | Process Orchestration |
| [Manage HTTP Flows](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/bw5x-how-to-manage-http-flows-in-tibco-businessworks-5x-r3343/)                                                                                                        | BW5X         | HTTP Management       |
| [Email TLS BW5](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/bw5x-how-to-connect-to-an-email-server-using-tlsv12-from-businessworks-5x-r3350/)                                                                                          | BW5X         | Email Security        |
| [HTTP Basic Auth BW5](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/bw5x-security-how-to-use-http-basic-authentication-in-businessworks-5x-r3351/)                                                                                       | BW5X         | Authentication        |
| [Parse JSON Flexibly](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/bw5x-how-to-parse-json-messages-with-extra-fields-or-fields-in-an-unexpected-order-in-businessworks-5x-r3352/)                                                       | BW5X         | JSON Parsing          |
| [Switch HTTP/HTTPS BW5](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/bw5x-how-to-switch-between-http-and-https-using-a-runtime-configuration-in-businessworks-5x-r3353/)                                                                | BW5X         | Protocol Config       |
| [Include In-Line Comments](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/bw6x-bwce-how-to-include-in-line-comments-in-businessworks-mappings-r3355/)                                                                                     | BW6X, BWCE   | Documentation         |
| [Solve Deserialization Errors](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/bw6x-bwce-how-to-solve-the-%E2%80%9Cunable-to-de-serialize-bw-process-error%E2%80%9D-when-debugging-two-applications-in-businessworks-6x-studio-r3356/)     | BW6X, BWCE   | Debugging             |
| [Memory Saving Mode](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/bw6x-bwce-bw5x-how-to-enable-engine-memory-saving-mode-in-businessworks-6x-and-businessworks-container-edition-r3359/)                                                | All Versions | Performance           |
| [Share BW Installation](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/bw6x-bwce-how-to-share-a-businessworks-6x-installation-between-multiple-users-r3371/)                                                                              | BW6X, BWCE   | Multi-user Setup      |
| [Share Same Port](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/bw6x-how-to-share-the-same-port-between-multiple-businessworks-6x-applications-r3376/)                                                                                   | BW6X         | Networking            |
| [Runtime Connection Selection](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/bw6x-bwce-how-to-select-a-connection-configuration-at-runtime-in-businessworks-6x-and-businessworks-container-edition-r3377/)                               | BW6X, BWCE   | Dynamic Config        |
| [Access HTTP Headers](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/bw6x-bwce-how-to-access-http-headers-while-exposing-or-invoking-web-services-in-businessworks-6x-and-businessworks-container-edition-r3379/)                         | BW6X, BWCE   | Web Services          |
| [Manage Swagger Updates](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/bw6x-bwce-how-to-manage-a-swagger-file-update-in-businessworks-6x-and-businessworks-container-edition-r3380/)                                                     | BW6X, BWCE   | API Management        |
| [Complex Mapping](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/bw6x-bwce-complex-mapping-scenarios-in-businessworks-6x-and-businessworks-container-edition-r3382/)                                                                      | BW6X, BWCE   | Data Transform        |
| [JMS Properties](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/bw6x-bwce-how-to-use-jms-application-properties-in-businessworks-6x-and-businessworks-container-edition-r3384/)                                                           | BW6X, BWCE   | Messaging             |
| [Call External Scripts](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/bw6x-bwce-how-to-call-a-command-or-a-script-from-businessworks-or-businessworks-container-edition-r3389/)                                                          | BW6X, BWCE   | System Integration    |
| [SmartMapper](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/bw6x-bwce-how-to-use-the-smartmapper-in-businessworks-6x-and-businessworks-container-edition-r3391/)                                                                         | BW6X, BWCE   | Mapping Automation    |
| [Debug SSL/TLS](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/bw6x-bwce-how-to-debug-ssltls-connections-in-businessworks-and-businessworks-container-edition-r3392/)                                                                     | BW6X, BWCE   | Security Debug        |
| [Studio Tips](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/bw6x-bwce-studio-tips-and-tricks-for-businessworks-6x-and-businessworks-container-edition-r3393/)                                                                            | BW6X, BWCE   | Productivity          |
| [JMS Priorities](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/bw6x-bwce-using-jms-message-priorities-with-businessworks-and-businessworks-container-edition-r3394/)                                                                     | BW6X, BWCE   | Message Priority      |
| [EMS Compression](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/bw6x-bwce-using-tibco-ems-message-compression-in-businessworks-and-businessworks-container-edition-r3395/)                                                               | BW6X, BWCE   | Performance           |
| [JSON Compatibility](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/bw6x-bwce-how-to-manage-ascending-compatibility-for-json-formats-in-businessworks-and-businessworks-container-edition-r3400/)                                         | BW6X, BWCE   | Schema Evolution      |
| [Disable XML Validation](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/bw6x-bwce-how-to-disable-xml-validation-at-activity-level-in-businessworks-and-businessworks-container-edition-r3401/)                                            | BW6X, BWCE   | Performance           |
| [Version Matching](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/bw6x-bwce-businessworks-container-edition-and-businessworks-6x-matching-release-versions-r3402/)                                                                        | BW6X, BWCE   | Compatibility         |
| [Concatenate Properties](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/bw6x-bwce-how-to-concatenate-properties-in-businessworks-and-businessworks-container-edition-r3408/)                                                              | BW6X, BWCE   | Configuration         |
| [JDBC Drivers Doc](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/bw6x-bwce-bw5x-where-to-find-the-tibcosoftwareinc-jdbc-drivers-documentation-r3410/)                                                                                    | All Versions | Database              |
| [OAuth 2.0](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/bw6x-bwce-using-oauth-20-in-businessworks-and-businessworks-container-edition-r3411/)                                                                                          | BW6X, BWCE   | Security              |
| [Binary Encoding](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/bw6x-bwce-how-to-decode-encode-a-string-in-binary-format-in-businessworks-and-businessworks-container-edition-r3412/)                                                    | BW6X, BWCE   | Data Handling         |
| [BW Agent REST API](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/bw6x-how-to-use-the-bwagent-rest-api-in-businessworks-r3419/)                                                                                                          | BW6X         | API Automation        |
| [Hawk REST API](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/bw6x-how-to-use-the-hawk-6x-rest-api-in-a-businessworks-context-r3420/)                                                                                                    | BW6X         | Monitoring API        |
| [Templates](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/bw6x-bwce-how-to-use-templates-in-businessworks-and-businessworks-container-edition-r3421/)                                                                                    | BW6X, BWCE   | Reusability           |
| [Stream Files](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/bw6x-bwce-how-to-stream-a-file-over-http-or-https-in-businessworks-and-businessworks-container-edition-r3424/)                                                              | BW6X, BWCE   | Large Files           |
| [Startup/Shutdown Process](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/bw6x-bwce-how-to-execute-a-process-at-application-start-up-or-shutdown-in-businessworks-and-businessworks-container-edition-r3425/)                             | BW6X, BWCE   | Lifecycle             |
| [Getting Started](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/bw6x-bwce-how-to-get-started-with-businessworks-and-businessworks-container-edition-r3427/)                                                                              | BW6X, BWCE   | Basics                |
| [Shared Variables](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/bw6x-bwce-useful-things-to-know-about-module-shared-variables-in-businessworks-and-businessworks-container-edition-r3429/)                                              | BW6X, BWCE   | State Management      |
| [Update XSD Namespace](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/bw6x-bwce-how-to-update-an-xsd-schema-namespace-in-businessworks-and-businessworks-container-edition-r3430/)                                                        | BW6X, BWCE   | Schema                |
| [Properties in Mappings](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/bw6x-bwce-how-to-access-property-values-in-mappings-in-businessworks-and-businessworks-container-edition-r3431/)                                                  | BW6X, BWCE   | Mapping               |
| [JDBC Best Practices](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/bw6x-bwce-useful-things-to-know-about-jdbc-activities-in-businessworks-and-businessworks-container-edition-r3444/)                                                   | BW6X, BWCE   | Database              |
| [Improve Studio UX](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/bw6x-bwce-how-to-improve-the-businessworks-studio-user-experience-r3511/)                                                                                              | BW6X, BWCE   | IDE                   |
| [Check BW Version](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/bw6x-bwce-how-to-check-the-businessworks-version-from-an-application-r3512/)                                                                                            | BW6X, BWCE   | Runtime Info          |
| [Date Calculations](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/bw6x-bwce-how-to-calculate-the-number-of-days-between-two-dates-in-businessworks-and-businessworks-container-edition-r3523/)                                           | BW6X, BWCE   | Date Handling         |
| [BWCE Releases](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/bwce-release-highlights-for-recent-businessworks-container-edition-versions-r3525/)                                                                                        | BWCE         | Release Notes         |
| [BW6 Releases](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/bw6x-release-highlights-for-recent-businessworks-versions-r3526/)                                                                                                           | BW6X         | Release Notes         |
| [Extract JSON](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/bw6x-bwce-how-to-extract-field-values-from-a-json-message-without-using-an-xml-schema-in-businessworks-and-businessworks-container-edition-r3527/)                          | BW6X, BWCE   | JSON Parsing          |
| [Handle Bad JSON](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/bw6x-bwce-how-to-get-an-error-message-when-a-rest-component-binding-receives-a-badly-formatted-json-message-in-businessworks-and-businessworks-container-edition-r3547/) | BW6X, BWCE   | Error Handling        |
| [Mapper Threading](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/bw6x-bwce-multi-threading-in-the-businessworks-mapper-and-the-businessworks-container-edition-mapper-r3551/)                                                            | BW6X, BWCE   | Concurrency           |
| [Cron Expressions](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/bw6x-bwce-how-to-use-cron-expressions-for-scheduling-tasks-in-the-timer-activity-r3552/)                                                                                | BW6X, BWCE   | Scheduling            |
| [XSD in WSDL](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/bw6x-bwce-how-to-use-an-xml-schema-definition-embedded-in-an-wsdl-in-businessworks-and-businessworks-container-edition-r3553/)                                               | BW6X, BWCE   | Web Services          |
| [REST/JSON Config](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/bw6x-bwce-properties-available-to-configure-the-businessworks-and-businessworks-container-edition-rest-json-palette-r3554/)                                             | BW6X, BWCE   | REST Config           |
| [JMS Request-Reply](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/bw6x-bwce-how-to-manage-jms-request-reply-scenarios-in-businessworks-and-businessworks-container-edition-r3557/)                                                       | BW6X, BWCE   | Messaging Patterns    |
| [SQL Windows Auth](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/bw-5x-bw6x-bwce-how-to-connect-to-an-sql-server-database-using-windows-authentication-from-a-linux-environment-r3559/)                                                  | All Versions | Database Auth         |
