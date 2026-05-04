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

## Newly Added Articles (Development)


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
