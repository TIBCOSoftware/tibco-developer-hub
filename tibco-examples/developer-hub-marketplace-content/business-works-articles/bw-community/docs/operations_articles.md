### Operations Articles

### BW6.X Operations

#### EMS Connection Reconnection
**Summary:** Ensure reliable EMS connectivity with automatic reconnection strategies and failover configurations.  
**Tags:** `BW6X`, `BWCE`, `EMS`, `high-availability`, `connection-management`

**Description:**  
This critical operations guide provides comprehensive strategies for ensuring reliable EMS connectivity in BusinessWorks applications, covering automatic reconnection mechanisms, failover configurations, and high availability patterns. You'll learn how to configure connection factories for resilience, implement primary/secondary EMS server failover, handle network interruptions gracefully, and maintain message ordering during reconnection events. The article explains various reconnection parameters and their impact on application behavior.

Advanced topics include implementing custom reconnection logic for complex scenarios, managing durable subscriber reconnection, handling message replay during connection recovery, and monitoring EMS connection health. The guide addresses cluster-aware connection strategies, load balancing across multiple EMS servers, handling split-brain scenarios, and implementing connection circuit breakers. Best practices cover testing failover scenarios, minimizing message loss during reconnection, maintaining transaction integrity, and strategies for zero-downtime EMS server maintenance.

**Link:** [Article](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/bw6x-bwce-how-to-make-sure-tibco-businessworks-applications-can-connect-or-reconnect-to-an-ems-server-in-every-cases-r3357/)

### BW5.X Operations

#### EMS Connection Management
**Summary:** Ensure reliable EMS connectivity with connection pooling, failover, and reconnection strategies in BW5.X.  
**Tags:** `BW5X`, `EMS`, `connection-management`, `high-availability`

**Description:**  
This comprehensive guide addresses EMS connection management in BusinessWorks 5.X environments, focusing on achieving maximum reliability and availability. You'll learn how to configure connection pools for optimal performance, implement fault-tolerant connection factories, manage reconnection behavior during network failures, and ensure message delivery guarantees are maintained. The article covers both development and production configurations, explaining the impact of different connection parameters on system behavior.

Critical operational topics include implementing EMS server failover with minimal message loss, managing connection storms during mass reconnection events, handling authentication failures gracefully, and monitoring connection pool health. The guide provides troubleshooting procedures for common connection issues, performance tuning for high-throughput scenarios, strategies for connection resource management, and best practices for EMS topology design. Special attention is given to maintaining ordered message delivery and transaction boundaries during connection recovery.

**Link:** [Article](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/bw5x-how-to-make-sure-tibco-businessworks-5x-can-connect-or-reconnect-to-an-ems-server-in-every-cases-r3344/)

#### Robust Domain Setup
**Summary:** Best practices for setting up a fault-tolerant BusinessWorks 5.X domain with high availability.  
**Tags:** `BW5X`, `domain`, `high-availability`, `setup`

**Description:**  
This infrastructure guide provides comprehensive best practices for establishing a robust and fault-tolerant BusinessWorks 5.X domain architecture. You'll learn how to design domain topology for high availability, configure primary and secondary domain controllers, implement database backend for domain persistence, and manage domain synchronization across multiple sites. The article covers both small-scale and enterprise-level domain configurations with detailed setup procedures.

Advanced topics include implementing domain failover mechanisms, managing split-brain scenarios, optimizing domain performance for large deployments, and implementing disaster recovery procedures. The guide addresses network requirements for domain communication, security hardening for domain components, monitoring domain health and performance, and strategies for domain migration and upgrade. Best practices cover capacity planning, backup and recovery procedures, domain maintenance windows, and techniques for minimizing domain-related downtime.

**Link:** [Article](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/bw5x-how-to-set-up-a-robust-businessworks-5x-domain-r3345/)

#### Find TRA Component Versions
**Summary:** Identify exact versions of TRA components and libraries in a BusinessWorks 5.X installation.  
**Tags:** `BW5X`, `TRA`, `versioning`, `troubleshooting`

**Description:**  
This diagnostic guide explains how to identify exact versions of TRA (TIBCO Runtime Agent) components and libraries in BusinessWorks 5.X installations, essential for troubleshooting and support purposes. You'll learn various methods to extract version information, including command-line tools, log file analysis, registry queries, and programmatic approaches. The article covers version identification for all TRA components including adapters, engines, and administration tools.

Advanced diagnostic topics include comparing installed versions against support matrices, identifying version mismatches that could cause issues, tracking version history across environments, and automating version inventory collection. The guide provides scripts and tools for comprehensive version reporting, strategies for maintaining version consistency across deployments, troubleshooting version-related compatibility issues, and best practices for version documentation and change management.

**Link:** [Article](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/bw5x-how-to-find-exact-tra-components-versions-in-a-businessworks-5x-environment-r3346/)

#### Truncate Deployment History
**Summary:** Clean up deployment history tables to improve Administrator performance and reduce database size.  
**Tags:** `BW5X`, `deployment`, `maintenance`, `database`

**Description:**  
This maintenance guide provides procedures for safely truncating deployment history in BusinessWorks 5.X to improve Administrator performance and manage database growth. You'll learn how to identify history tables, assess the impact of history data on performance, implement archival strategies, and execute truncation procedures without disrupting operations. The article includes SQL scripts for various database platforms and explains the relationship between different history tables.

Advanced maintenance topics include implementing automated history cleanup procedures, setting up history retention policies, archiving history data for compliance requirements, and monitoring database growth trends. The guide addresses performance impact during cleanup operations, strategies for incremental history management, recovery procedures if cleanup goes wrong, and best practices for scheduling maintenance windows. Special consideration is given to maintaining audit trails while managing database size.

**Link:** [Article](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/bw5x-how-to-truncate-deployment-history-in-businessworks-5x-r3347/)

#### Reinstall Hawk and Admin Services
**Summary:** Procedures for uninstalling and reinstalling Hawk Agent and Administrator Server as Windows services.  
**Tags:** `BW5X`, `Hawk`, `Windows`, `services`, `installation`

**Description:**  
This technical guide provides detailed procedures for uninstalling and reinstalling Hawk Agent and Administrator Server as Windows services in BusinessWorks 5.X domains. You'll learn how to properly remove existing services, clean up registry entries, handle service dependencies, and reinstall services with correct configurations. The article covers common issues that necessitate reinstallation and provides preventive measures to avoid service corruption.

Advanced service management topics include configuring service startup parameters, managing service accounts and permissions, implementing service monitoring and auto-restart, and handling service failures gracefully. The guide addresses troubleshooting service installation failures, managing services in clustered environments, scripting service installation for automation, and best practices for service maintenance. Special sections cover migration to newer Windows versions and handling service interactions with Windows security features.

**Link:** [Article](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/bw5x-how-to-uninstall-and-re-install-the-hawk-agent-and-the-administrator-server-as-windows-services-in-a-businessworks-5x-domain-r3348/)

#### Start Engines When Domain Down
**Summary:** Emergency procedures for starting BusinessWorks 5.X engines when the domain administrator is unavailable.  
**Tags:** `BW5X`, `disaster-recovery`, `domain`, `startup`

**Description:**  
This critical operations guide provides emergency procedures for starting BusinessWorks 5.X engines when the domain administrator is unavailable due to failure or network issues. You'll learn how to start engines in local mode, bypass domain authentication, maintain service availability during domain outages, and resynchronize engines when domain connectivity is restored. The article includes step-by-step procedures for various failure scenarios.

Advanced disaster recovery topics include implementing automated failover to local mode, managing application state without domain coordination, handling distributed transactions during domain outage, and preventing split-brain scenarios. The guide addresses risk mitigation strategies, monitoring engines running without domain supervision, documenting emergency procedures, and best practices for minimizing the need for domain-independent operation. Special attention is given to compliance and audit considerations when bypassing normal startup procedures.

**Link:** [Article](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/bw5x-how-to-start-businessworks-5x-engines-when-the-domain-is-down-r3563/)

### Additional Key Articles with Descriptions

#### Zero-Downtime Deployment
**Summary:** Strategies for deploying new application versions without service interruption using rolling updates.  
**Tags:** `BW6X`, `deployment`, `zero-downtime`, `high-availability`

**Description:**  
This critical operations guide provides comprehensive strategies for achieving zero-downtime deployments in BusinessWorks 6.X environments. You'll learn how to implement blue-green deployments, execute rolling updates across clustered applications, manage session state during transitions, and coordinate database schema changes with application updates. The article covers various deployment patterns and their trade-offs in terms of complexity, resource requirements, and risk mitigation.

Advanced deployment strategies include implementing canary releases for gradual rollout, managing feature flags for controlled activation, handling backward compatibility during transitions, and automating deployment orchestration. The guide addresses load balancer configuration for seamless traffic switching, monitoring deployment progress, implementing automatic rollback triggers, and best practices for deployment validation. Special attention is given to maintaining transaction integrity and handling long-running processes during deployment transitions.

**Link:** [Article](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/bw6x-how-to-deploy-a-new-release-of-an-application-with-zero-downtime-in-businessworks-r3565/)

#### Process Large Files
**Summary:** Strategies for handling large file processing including streaming, chunking, and pagination.  
**Tags:** `BW6X`, `BWCE`, `large-files`, `streaming`, `performance`

**Description:**  
This comprehensive guide addresses the challenges of processing large files in BusinessWorks applications without exhausting system resources. You'll learn various strategies including file streaming, chunk-based processing, parallel file processing, and memory-mapped file techniques. The article explains how to choose the appropriate strategy based on file size, processing requirements, and available resources, with detailed implementation examples for each approach.

Advanced file handling topics include implementing resumable file processing, managing temporary storage for intermediate results, coordinating distributed file processing, and optimizing I/O performance. The guide addresses error recovery for partial file processing, monitoring progress for long-running file operations, implementing file validation without full loading, and best practices for file cleanup. Special sections cover cloud storage integration, handling compressed files efficiently, and strategies for processing files that exceed available memory by orders of magnitude.

**Link:** [Article](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/bw6x-bwce-how-to-process-larges-files-in-businessworks-and-businessworks-container-edition-r3413/)

#### Azure Key Vault Integration
**Summary:** Integrate BusinessWorks with Azure Key Vault for centralized secrets management and certificate storage.  
**Tags:** `BW6X`, `BWCE`, `Azure`, `Key-Vault`, `secrets`, `cloud`

**Description:**  
This cloud security guide demonstrates how to integrate BusinessWorks applications with Azure Key Vault for enterprise-grade secrets management. You'll learn how to configure Azure authentication, retrieve secrets and certificates at runtime, implement secret rotation without downtime, and manage access policies for different environments. The article covers both managed identity and service principal authentication methods with detailed configuration examples.

Advanced integration topics include implementing secret caching with automatic refresh, managing multi-region key vault deployments, handling key vault throttling and failures gracefully, and monitoring secret access patterns. The guide addresses compliance considerations for secret management, audit logging integration, disaster recovery for key vault failures, and best practices for secret versioning. Special sections cover migration from local secret storage to key vault, cost optimization strategies, and implementing least-privilege access models for production deployments.

**Link:** [Article](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/bw6x-bwce-security-how-to-connect-to-an-azure-key-vault-in-businessworks-r3568/)

#### Getting Started Guide
**Summary:** Comprehensive beginner's guide covering installation and fundamental concepts.  
**Tags:** `BW6X`, `BWCE`, `getting-started`, `tutorial`, `beginner`

**Description:**  
This comprehensive beginner's guide provides everything needed to start developing with BusinessWorks, covering installation procedures, development environment setup, creating your first application, and understanding fundamental concepts. You'll learn the complete journey from downloading the software to deploying a working integration, with detailed explanations of core components like processes, activities, transitions, resources, and modules. The guide includes hands-on tutorials for common integration patterns such as file processing, database operations, web service creation, and message-based integration, each with step-by-step instructions and troubleshooting tips.

Beyond the basics, the guide introduces important architectural concepts including the BusinessWorks engine architecture, application packaging and deployment models, configuration management strategies, and development best practices. The article provides learning paths tailored for different roles (developer, administrator, architect), recommended resources for continued learning including official documentation and community forums, and practical exercises designed to reinforce key concepts. Special sections address common beginner mistakes and how to avoid them, transitioning from other integration platforms, understanding BusinessWorks-specific terminology, and building a solid foundation for advanced development techniques.

**Link:** [Article](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/bw6x-bwce-how-to-get-started-with-businessworks-and-businessworks-container-edition-r3427/)

#### JDBC Best Practices
**Summary:** Important considerations and optimization techniques for JDBC activities.  
**Tags:** `BW6X`, `BWCE`, `JDBC`, `database`, `best-practices`

**Description:**  
This comprehensive guide covers critical considerations and optimization techniques for using JDBC activities effectively in BusinessWorks applications. You'll learn optimal connection pool configuration strategies for different database workloads, transaction management best practices including distributed transactions, query optimization techniques to minimize database load, and proper error handling for various database failure scenarios. The article addresses common performance bottlenecks such as N+1 query problems, inefficient batch processing, and connection pool exhaustion, providing concrete solutions and preventive measures for each.

Advanced database integration topics include implementing database-specific features across different vendors (Oracle, SQL Server, PostgreSQL, MySQL), managing large result sets with streaming and pagination, optimizing batch operations for bulk data processing, and implementing intelligent retry logic with exponential backoff. The guide covers critical production considerations including connection resilience and failover strategies, database query monitoring and performance analysis, preventing SQL injection through proper parameterization, and managing database schema evolution. Special sections address working with stored procedures efficiently, handling CLOBs and BLOBs without memory issues, implementing database connection encryption, and strategies for database migration and version compatibility.

**Link:** [Article](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/bw6x-bwce-useful-things-to-know-about-jdbc-activities-in-businessworks-and-businessworks-container-edition-r3444/)

#### Studio Tips and Tricks
**Summary:** Collection of productivity tips, shortcuts, and hidden features for BusinessWorks Studio.  
**Tags:** `BW6X`, `BWCE`, `studio`, `productivity`, `tips`

**Description:**  
This comprehensive collection of productivity enhancements transforms how developers work with BusinessWorks Studio, significantly improving development efficiency and reducing common frustrations. You'll discover essential keyboard shortcuts for frequent operations, optimal workspace layouts for different development tasks, advanced search and navigation techniques including regex search and reference finding, and hidden debugging features that accelerate troubleshooting. The guide reveals lesser-known tools such as the expression editor shortcuts, template generation capabilities, batch refactoring operations, and custom perspective configurations that can dramatically speed up development workflows.

Advanced Studio optimization includes configuring memory settings for large projects, customizing content assist and code completion, integrating external tools and scripts, and managing plugins for enhanced functionality. The article addresses common Studio performance issues with concrete solutions, workspace corruption recovery procedures, efficient project organization strategies, and team collaboration features. Special sections cover platform-specific optimizations for Windows, Linux, and macOS, creating reusable code templates and snippets, debugging complex multi-application scenarios, and maintaining Studio health over time. Best practices include workspace backup strategies, managing Studio updates without disrupting projects, and creating standardized Studio configurations for team consistency.

**Link:** [Article](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/bw6x-bwce-studio-tips-and-tricks-for-businessworks-6x-and-businessworks-container-edition-r3393/)

#### Using OAuth 2.0
**Summary:** Implement OAuth 2.0 authentication and authorization flows in REST services.  
**Tags:** `BW6X`, `BWCE`, `OAuth`, `authentication`, `REST`, `security`

**Description:**  
This comprehensive security guide demonstrates implementing OAuth 2.0 authentication and authorization in BusinessWorks REST services, covering all major OAuth flows and their appropriate use cases. You'll learn how to implement Authorization Code flow for web applications, Client Credentials flow for service-to-service communication, Resource Owner Password flow for trusted applications, and the deprecated Implicit flow for legacy support. The guide provides detailed configuration examples for both OAuth client implementation (consuming OAuth-protected APIs) and OAuth server implementation (protecting your own APIs), including integration with popular identity providers like Azure AD, Okta, and Auth0.

Advanced OAuth implementation topics include sophisticated token management with automatic refresh, secure token storage using encryption, implementing PKCE (Proof Key for Code Exchange) for public clients, and managing OAuth scopes for fine-grained authorization. The guide addresses critical security considerations including preventing token leakage, implementing token revocation, handling OAuth errors gracefully, and monitoring OAuth transactions for security threats. Production deployment topics cover high availability for OAuth flows, implementing rate limiting for token endpoints, managing OAuth client registrations dynamically, and strategies for migrating from basic authentication to OAuth. Special sections address JWT (JSON Web Token) validation, implementing custom token validators, OAuth debugging techniques, and compliance considerations for different industries.

**Link:** [Article](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/bw6x-bwce-using-oauth-20-in-businessworks-and-businessworks-container-edition-r3411/)

#### Basic Authentication Implementation
**Summary:** Implement HTTP basic authentication for REST services and web applications.  
**Tags:** `BW6X`, `BWCE`, `authentication`, `basic-auth`, `REST`

**Description:**  
This security implementation guide provides comprehensive coverage of HTTP basic authentication in BusinessWorks 6.X and Container Edition for both client and server scenarios. You'll learn how to configure authentication headers properly, implement credential management securely, integrate with various authentication backends (LDAP, Active Directory, databases), and handle authentication failures with appropriate error responses. The article demonstrates practical implementations for common scenarios including multi-tenant authentication, role-based access control, session management, and authentication caching for performance optimization.

Advanced authentication topics include implementing account lockout policies to prevent brute force attacks, credential rotation strategies without service disruption, integrating with enterprise SSO systems, and implementing authentication audit logging for compliance. The guide addresses critical security considerations such as protecting credentials in transit using TLS, secure credential storage using encryption, preventing timing attacks on authentication, and implementing rate limiting for authentication endpoints. Production best practices cover monitoring authentication metrics, implementing authentication health checks, handling authentication in clustered environments, and strategies for gradual migration from basic authentication to more secure methods like OAuth or SAML while maintaining backward compatibility for existing clients.

**Link:** [Article](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/bw-6x-bwce-security-how-to-use-basic-authentication-in-businessworks-and-businessworks-container-edition-r3403/)

#### HTTPS Server Configuration
**Summary:** Configure BusinessWorks to expose REST APIs and services using HTTPS with SSL certificates.  
**Tags:** `BW6X`, `BWCE`, `HTTPS`, `SSL/TLS`, `API-security`

**Description:**  
This comprehensive security guide explains how to properly configure BusinessWorks applications to expose REST APIs and web services over HTTPS, ensuring secure communication channels for production deployments. You'll learn how to generate and install SSL certificates, configure TLS protocols and cipher suites for optimal security, implement certificate validation and hostname verification, and manage certificate renewal without downtime. The article covers various certificate types including self-signed certificates for development, commercial certificates for production, wildcard certificates for multiple services, and Let's Encrypt integration for automated certificate management.

Advanced HTTPS configuration topics include implementing perfect forward secrecy, configuring HSTS (HTTP Strict Transport Security) headers, managing TLS session resumption for performance, and implementing certificate pinning for enhanced security. The guide addresses common HTTPS deployment challenges such as SSL termination strategies in load-balanced environments, handling mixed HTTP/HTTPS content, debugging SSL handshake failures, and monitoring certificate expiration. Production considerations cover performance impact of SSL/TLS encryption, implementing TLS 1.3 for improved performance and security, managing cipher suite compatibility with various clients, and strategies for maintaining PCI DSS compliance. Special sections address certificate automation using ACME protocol, implementing mTLS (mutual TLS) for service-to-service communication, and handling certificate revocation through CRL and OCSP.

**Link:** [Article](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/bw6x-bwce-security-how-to-expose-an-api-or-a-service-in-https-in-businessworks-and-businessworks-container-edition-r3397/)

#### Enable Activity Level Logging
**Summary:** Configure detailed activity-level logging for debugging and audit purposes in production environments.  
**Tags:** `BW6X`, `BWCE`, `logging`, `debugging`, `audit`

**Description:**  
This operational guide provides comprehensive instructions for enabling and managing activity-level logging in BusinessWorks applications, essential for debugging complex issues and maintaining audit trails in production environments. You'll learn how to configure logging at different granularity levels, selectively enable logging for specific processes or activities, implement dynamic logging level changes without restart, and manage log output formats for various analysis tools. The article explains the performance implications of detailed logging and provides strategies for minimizing overhead while capturing necessary diagnostic information.

Advanced logging configurations include implementing contextual logging with correlation IDs, structured logging for machine-readable output, log sampling for high-volume scenarios, and conditional logging based on runtime conditions. The guide addresses critical operational considerations such as log rotation and retention policies, centralized log aggregation using tools like ELK stack or Splunk, implementing log-based alerting for critical events, and ensuring sensitive data masking in logs for compliance. Production best practices cover managing logging performance impact, implementing audit logging for regulatory compliance, troubleshooting using activity logs effectively, and strategies for log analysis at scale. Special sections address logging in containerized deployments, distributed tracing integration, and maintaining logging consistency across microservices architectures.

**Link:** [Article](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/bw6x-bwce-how-to-enable-activity-level-logging-in-businessworks-6x-and-businessworks-container-edition-r3383/)

#### JMS Load Balancing
**Summary:** Configure smooth load balancing for JMS message processing across multiple engine instances.  
**Tags:** `BW5X`, `BW6X`, `BWCE`, `JMS`, `load-balancing`

**Description:**  
This comprehensive guide addresses optimal JMS load balancing configurations for distributing message processing across multiple BusinessWorks engine instances, ensuring efficient resource utilization and high throughput. You'll learn how to configure concurrent consumers appropriately, implement consumer group patterns for parallel processing, manage message distribution algorithms, and prevent message concentration on specific instances. The article covers various load balancing strategies including round-robin distribution, weighted distribution based on instance capacity, dynamic load balancing based on queue depth, and affinity-based routing for stateful processing.

Advanced load balancing topics include implementing work-stealing algorithms for dynamic rebalancing, managing poison message handling across instances, coordinating transactional message processing, and preventing duplicate processing in distributed scenarios. The guide addresses critical production considerations such as maintaining message ordering when required, handling instance failures gracefully, implementing back-pressure mechanisms, and monitoring load distribution effectiveness. Performance optimization covers tuning prefetch sizes for optimal throughput, managing connection pooling across instances, implementing circuit breakers for failing consumers, and strategies for elastic scaling based on queue metrics. Special sections address load balancing in cloud environments, integration with container orchestration platforms, and managing heterogeneous instance capabilities.

**Link:** [Article](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/bw6x-bwce-bw5x-how-to-ensure-smooth-load-balancing-of-jms-messages-in-businessworks-5x-businessworks-6x-and-businessworks-container-edition-r3360/)

#### Separate Log Files per Application
**Summary:** Configure independent log files for each deployed application for better log management and analysis.  
**Tags:** `BW6X`, `logging`, `configuration`, `management`

**Description:**  
This logging management guide demonstrates how to configure separate log files for each deployed BusinessWorks application, essential for maintaining organized logging in multi-application deployments. You'll learn how to configure log4j appenders for application isolation, implement dynamic log file naming based on application properties, manage log rotation independently per application, and maintain centralized logging alongside application-specific logs. The article provides detailed configuration examples for various logging frameworks and explains the file system considerations for high-volume logging scenarios.

Advanced logging separation techniques include implementing hierarchical logging structures for application components, managing shared library logging across applications, coordinating log timestamps across distributed applications, and implementing log correlation for cross-application transactions. The guide addresses operational considerations such as disk space management for multiple log streams, implementing log compression and archival strategies, monitoring log file growth and rotation, and maintaining logging performance with multiple file handles. Best practices cover log file naming conventions for easy identification, implementing log retention policies per application, integrating with log management platforms, and strategies for troubleshooting using separated logs. Special sections address containerized logging strategies, managing logs in shared file systems, and implementing security controls for log access.

**Link:** [Article](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/bw6x-how-to-have-separate-log-files-per-application-in-businessworks-r3422/)

#### Monitor Memory and Threads via JMX
**Summary:** Use JMX and JVisualVM to monitor AppNode memory consumption, thread pools, and performance metrics.  
**Tags:** `BW6X`, `JMX`, `monitoring`, `performance`, `memory`

**Description:**  
This comprehensive monitoring guide explains how to leverage JMX (Java Management Extensions) and visualization tools like JVisualVM to monitor BusinessWorks AppNode performance metrics in real-time. You'll learn how to enable JMX monitoring safely in production, connect monitoring tools remotely, analyze memory usage patterns including heap and non-heap memory, and identify thread pool utilization and bottlenecks. The article provides detailed instructions for setting up monitoring dashboards, configuring alerts for critical metrics, interpreting garbage collection logs, and identifying memory leaks through heap dump analysis.

Advanced monitoring techniques include implementing custom MBeans for application-specific metrics, scripting JMX queries for automated monitoring, correlating JMX metrics with application performance, and implementing predictive analysis for capacity planning. The guide addresses production monitoring challenges such as securing JMX connections with SSL and authentication, minimizing monitoring overhead on production systems, implementing monitoring in containerized environments, and integrating with enterprise monitoring platforms like Prometheus and Grafana. Performance troubleshooting topics cover identifying thread deadlocks and contention, analyzing CPU usage patterns, monitoring I/O and network metrics, and establishing performance baselines. Special sections address monitoring in cloud environments, implementing distributed tracing alongside JMX monitoring, and creating automated responses to performance anomalies.

**Link:** [Article](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/bw6x-how-to-monitor-a-businessworks-appnode-memory-and-threads-usage-using-jmx-and-jvisualvm-r3423/)

#### Start Impaired Applications
**Summary:** Techniques for starting applications that have dependency issues or configuration problems.  
**Tags:** `BW6X`, `BWCE`, `troubleshooting`, `startup`, `recovery`

**Description:**  
This troubleshooting guide provides essential techniques for starting BusinessWorks applications that fail to start normally due to dependency issues, configuration problems, or resource unavailability. You'll learn how to identify the root cause of impairment through log analysis, bypass non-critical dependencies temporarily, implement startup retry mechanisms with configurable delays, and use diagnostic modes to isolate problems. The article covers various impairment scenarios including missing external services, invalid credentials, resource exhaustion, and configuration conflicts, providing specific recovery procedures for each.

Advanced recovery techniques include implementing graceful degradation for partially functional applications, managing cascading failures in dependent applications, automating recovery procedures through scripts, and maintaining service availability during recovery. The guide addresses critical operational decisions such as when to force-start impaired applications, managing data consistency during impaired operation, implementing compensating transactions for failed dependencies, and communicating application status to monitoring systems. Production considerations cover documenting recovery procedures for operations teams, implementing circuit breakers for failing dependencies, monitoring application health during impaired operation, and strategies for preventing impairment through defensive design. Special sections address handling impairment in clustered deployments, managing stateful applications during recovery, and implementing automated failover for chronically impaired applications.

**Link:** [Article](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/bw6x-bwce-how-to-start-an-impaired-application-in-businessworks-and-businessworks-container-edition-r3426/)

#### Parallel Processing Patterns
**Summary:** Implement parallel execution patterns for improved throughput and performance.  
**Tags:** `BW5X`, `BW6X`, `BWCE`, `parallelism`, `performance`, `concurrency`

**Description:**  
This design pattern guide explores various parallel processing techniques in BusinessWorks for maximizing throughput and reducing processing time for large workloads. You'll learn how to implement fork-join patterns for parallel task execution, configure parallel process instances for concurrent message processing, design scatter-gather patterns for distributed processing, and manage thread pools for optimal parallelism. The article provides detailed examples of different parallelization strategies including data parallelism for batch processing, task parallelism for independent operations, pipeline parallelism for streaming data, and hybrid approaches for complex workflows.

Advanced parallel processing topics include implementing work distribution algorithms for load balancing, managing shared state and synchronization in parallel processes, handling partial failures in parallel execution branches, and implementing timeout mechanisms for parallel operations. The guide addresses critical design considerations such as determining optimal parallelism levels based on resource constraints, preventing thread starvation and deadlocks, managing memory consumption in parallel processing, and monitoring parallel execution performance. Production optimization covers dynamic parallelism adjustment based on system load, implementing back-pressure mechanisms for flow control, coordinating transactions across parallel branches, and strategies for testing and debugging parallel processes. Special sections address parallelism in cloud and containerized environments, GPU acceleration for specific workloads, and implementing map-reduce patterns in BusinessWorks.

**Link:** [Article](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/bw6x-bwce-bw5x-how-to-do-parallel-processing-within-a-businessworks-process-r3390/)

#### Sequential Processing Patterns
**Summary:** Ensure ordered message processing while maintaining performance in distributed environments.  
**Tags:** `BW5X`, `BW6X`, `BWCE`, `sequencing`, `ordering`, `messaging`

**Description:**  
This pattern implementation guide provides comprehensive strategies for maintaining strict message ordering in BusinessWorks applications while optimizing performance in distributed processing environments. You'll learn how to implement various sequencing patterns including single-threaded processing for strict ordering, sequence number-based ordering for distributed sources, time-based ordering for event processing, and dependency-based ordering for complex workflows. The article explains the trade-offs between ordering guarantees and throughput, providing guidance on selecting appropriate patterns based on business requirements and technical constraints.

Advanced sequencing techniques include implementing sliding window protocols for ordered parallel processing, managing out-of-order message handling with resequencing buffers, coordinating sequence across multiple channels, and implementing idempotent processing for replay scenarios. The guide addresses critical challenges such as handling late-arriving messages, managing sequence gaps and duplicates, implementing timeout mechanisms for missing messages, and maintaining order during system failures. Performance optimization covers batching strategies for sequential processing, implementing checkpoint mechanisms for recovery, minimizing latency in ordered processing, and strategies for scaling sequential processors. Special sections address ordering in event streaming architectures, maintaining consistency in distributed transactions, implementing saga patterns with ordering guarantees, and testing strategies for sequence-dependent processes.

**Link:** [Article](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/bw6x-bwce-bw5x-how-to-process-messages-in-sequence-with-businessworks-r3388/)

#### Limit Memory Usage Patterns
**Summary:** Design patterns and configurations to constrain memory consumption in resource-limited environments.  
**Tags:** `BW5X`, `BW6X`, `BWCE`, `memory-management`, `optimization`

**Description:**  
This resource management guide provides essential patterns and techniques for controlling memory consumption in BusinessWorks applications, crucial for stable operation in resource-constrained environments. You'll learn how to implement streaming patterns to avoid loading large datasets, configure memory limits for process instances, design pagination strategies for large result sets, and implement memory-aware caching mechanisms. The article covers various memory optimization techniques including lazy loading for on-demand data access, memory pooling for resource reuse, off-heap storage for large objects, and memory-mapped files for efficient file processing.

Advanced memory management topics include implementing memory budgets for different components, garbage collection tuning for predictable memory behavior, detecting and preventing memory leaks, and implementing circuit breakers for memory protection. The guide addresses critical design decisions such as choosing between memory and disk trade-offs, implementing spill-to-disk mechanisms for overflow, managing memory in multi-tenant deployments, and coordinating memory usage across clustered instances. Production considerations cover monitoring memory usage patterns, implementing alerts for memory thresholds, analyzing heap dumps for optimization opportunities, and strategies for capacity planning. Special sections address container memory limits and Java heap settings, memory optimization for cloud deployments, implementing memory-efficient data structures, and testing applications under memory pressure.

**Link:** [Article](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/bw6x-bwce-bw5x-how-to-limit-memory-usage-in-businessworks-and-businessworks-container-edition-r3370/)

#### Large SQL Results Handling
**Summary:** Optimize database operations for large result sets using pagination, cursors, and batch processing.  
**Tags:** `BW6X`, `BWCE`, `SQL`, `database`, `performance`, `large-data`

**Description:**  
This data handling guide provides comprehensive strategies for efficiently processing large SQL result sets in BusinessWorks without overwhelming system resources. You'll learn how to implement database pagination for controlled data retrieval, use scrollable cursors for memory-efficient processing, design batch processing patterns for large updates, and optimize fetch sizes for different scenarios. The article demonstrates various techniques including chunk-based processing with configurable batch sizes, streaming result sets for continuous processing, parallel query execution for performance, and incremental data extraction for ETL operations.

Advanced database patterns include implementing database-side filtering and aggregation, managing long-running queries with timeout protection, coordinating distributed queries across multiple databases, and implementing change data capture for incremental processing. The guide addresses critical performance considerations such as preventing full table scans, optimizing index usage for large queries, managing database connection pool sizing, and implementing query result caching strategies. Production optimization covers monitoring query performance metrics, implementing database load balancing, handling database failover during long operations, and strategies for minimizing database lock contention. Special sections address working with different database vendors' specific features, implementing data archival strategies, managing temporal data efficiently, and testing strategies for large-scale data operations.

**Link:** [Article](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/bw6x-bwce-how-to-manage-sql-queries-handling-large-data-volumes-in-businessworks-and-businessworks-container-edition-r3414/)

#### Share Same Port Between Applications
**Summary:** Techniques for configuring multiple BusinessWorks 6.X applications to share the same network port.  
**Tags:** `BW6X`, `networking`, `port-sharing`, `configuration`

**Description:**  
This networking guide demonstrates advanced techniques for configuring multiple BusinessWorks applications to share the same network port, essential for optimizing resource utilization and simplifying firewall configurations. You'll learn how to implement context path-based routing for REST services, configure virtual hosting for hostname-based separation, use protocol multiplexing for mixed traffic types, and implement port unification patterns. The article provides detailed configuration examples for different sharing scenarios including multi-version API hosting, multi-tenant service deployment, microservices aggregation, and load distribution across applications.

Advanced port sharing techniques include implementing custom routing logic for complex scenarios, managing SSL/TLS certificates for multiple applications, coordinating application lifecycle on shared ports, and handling port conflicts during deployment. The guide addresses critical considerations such as performance implications of port sharing, security isolation between applications, debugging and monitoring shared port traffic, and implementing quality of service policies. Production deployment topics cover high availability configurations for shared ports, managing rolling updates without port conflicts, implementing traffic shaping and throttling, and strategies for gradual migration to port sharing. Special sections address container networking for port sharing, service mesh integration, implementing API gateways, and troubleshooting common port sharing issues.

**Link:** [Article](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/bw6x-how-to-share-the-same-port-between-multiple-businessworks-6x-applications-r3376/)

#### Complex Mapping Scenarios
**Summary:** Advanced mapping techniques for handling complex data transformation scenarios.  
**Tags:** `BW6X`, `BWCE`, `mapping`, `data-transformation`, `advanced`

**Description:**  
This advanced mapping guide explores sophisticated data transformation techniques for handling complex scenarios that go beyond simple field-to-field mappings in BusinessWorks. You'll learn how to implement hierarchical data transformations for nested structures, manage many-to-many relationships with cross-references, handle polymorphic data with type-based routing, and implement recursive transformations for tree structures. The article provides comprehensive examples of challenging transformations including data pivoting and unpivoting, denormalization for performance, aggregation with grouping, and conditional structure generation based on business rules.

Advanced mapping techniques include implementing custom Java functions for complex logic, optimizing memory usage for large transformations, handling circular references in data structures, and implementing validation within transformations. The guide addresses critical mapping challenges such as maintaining referential integrity during transformation, handling incomplete or malformed data gracefully, implementing data enrichment from multiple sources, and managing transformation versioning. Performance optimization covers using XSLT for complex XML transformations, implementing streaming transformations for large documents, caching reference data for lookups, and strategies for parallel transformation processing. Special sections address industry-specific transformations (EDI, HL7, SWIFT), implementing data quality rules in mappings, testing complex transformations thoroughly, and maintaining transformation documentation.

**Link:** [Article](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/bw6x-bwce-complex-mapping-scenarios-in-businessworks-6x-and-businessworks-container-edition-r3382/)

#### Using Templates
**Summary:** Create reusable process templates and patterns to standardize development.  
**Tags:** `BW6X`, `BWCE`, `templates`, `reusability`, `patterns`

**Description:**  
This development efficiency guide demonstrates how to create and leverage reusable process templates in BusinessWorks to standardize development practices and accelerate project delivery. You'll learn how to design parameterizable template processes, create template libraries for common integration patterns, implement template inheritance for specialization, and manage template versioning effectively. The article provides practical examples of essential templates including error handling frameworks, logging and auditing templates, retry and compensation patterns, and service wrapper templates that enforce organizational standards.

Advanced template strategies include implementing dynamic template selection at runtime, creating composite templates from smaller components, managing template dependencies and relationships, and automating template generation from specifications. The guide addresses governance aspects such as template approval workflows, enforcing template usage through policies, measuring template effectiveness and reuse, and maintaining template documentation. Development process improvements cover template discovery mechanisms for developers, template customization guidelines, testing strategies for templated processes, and migration approaches for template updates. Special sections address creating industry-specific template libraries, implementing template-based code generation, managing templates in CI/CD pipelines, and strategies for template standardization across teams.

**Link:** [Article](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/bw6x-bwce-how-to-use-templates-in-businessworks-and-businessworks-container-edition-r3421/)

#### Module Shared Variables
**Summary:** Understanding scope, lifecycle, and best practices for module shared variables.  
**Tags:** `BW6X`, `BWCE`, `shared-variables`, `threading`, `state-management`

**Description:**  
This state management guide provides in-depth coverage of module shared variables in BusinessWorks, explaining their proper usage for maintaining state within application modules. You'll learn the distinction between different variable scopes (module, process, job), understand thread-safety implications and locking mechanisms, implement proper initialization and cleanup procedures, and design patterns for safe concurrent access. The article clarifies common misconceptions about shared variables and demonstrates appropriate use cases including configuration caching, connection pooling, statistical accumulation, and session state management.

Advanced shared variable patterns include implementing read-write locks for performance, managing complex state machines with shared variables, coordinating state across process instances, and implementing event-driven updates. The guide addresses critical considerations such as preventing race conditions and deadlocks, managing memory consumption of shared state, handling shared variable persistence and recovery, and monitoring shared variable access patterns. Production challenges cover cluster synchronization of shared state, debugging shared variable issues, implementing shared variable versioning, and strategies for migrating from global variables. Special sections address shared variables in containerized deployments, alternatives to shared variables for distributed state, testing strategies for concurrent access, and best practices for shared variable documentation.

**Link:** [Article](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/bw6x-bwce-useful-things-to-know-about-module-shared-variables-in-businessworks-and-businessworks-container-edition-r3429/)

#### Handle Badly Formatted JSON
**Summary:** Error handling strategies for REST services receiving malformed JSON.  
**Tags:** `BW6X`, `BWCE`, `JSON`, `error-handling`, `REST`

**Description:**  
This error handling guide provides robust strategies for REST services to gracefully handle malformed, invalid, or unexpected JSON payloads without service disruption. You'll learn how to implement comprehensive JSON validation with meaningful error messages, design fallback parsing strategies for partially valid data, log malformed requests for analysis and debugging, and return appropriate HTTP status codes with detailed error responses. The article covers various JSON error scenarios including syntax errors, type mismatches, missing required fields, unexpected additional properties, and encoding issues, providing specific handling strategies for each.

Advanced error recovery techniques include implementing progressive JSON parsing for salvageable data, building error correction algorithms for common mistakes, managing client-specific error handling rules, and implementing retry mechanisms with format hints. The guide addresses security considerations such as preventing JSON injection attacks, avoiding information disclosure in error messages, implementing rate limiting for malformed requests, and detecting potential security probes. Operational aspects cover monitoring JSON error patterns for quality improvement, implementing alerting for error spikes, analyzing error trends for client issues, and strategies for client education and API documentation. Special sections address handling large malformed payloads efficiently, implementing JSON schema evolution with backward compatibility, testing error handling comprehensively, and maintaining error handling consistency across services.

**Link:** [Article](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/bw6x-bwce-how-to-get-an-error-message-when-a-rest-component-binding-receives-a-badly-formatted-json-message-in-businessworks-and-businessworks-container-edition-r3547/)

#### Binary Encoding and Decoding
**Summary:** Handle binary data encoding and decoding including Base64 and hexadecimal transformations.  
**Tags:** `BW6X`, `BWCE`, `encoding`, `binary`, `Base64`

**Description:**  
This data handling guide provides comprehensive techniques for encoding and decoding binary data in BusinessWorks processes, essential for integrating with systems that require binary data exchange. You'll learn how to implement Base64 encoding for email attachments and web services, perform hexadecimal conversions for cryptographic operations, handle URL encoding for special characters, and manage character encoding transformations between different formats. The article demonstrates practical applications including file content encoding for transmission, binary protocol implementation, encrypted data handling, and image data processing within XML/JSON payloads.

Advanced encoding techniques include implementing streaming encoders for large binary data, handling different Base64 variants (standard, URL-safe, MIME), managing padding and line breaks in encoded data, and optimizing encoding performance for high-volume processing. The guide addresses critical considerations such as memory management for large binary operations, handling encoding errors and data corruption, maintaining data integrity during transformations, and implementing custom encoding schemes. Production topics cover monitoring encoding operation performance, implementing caching for frequently encoded data, handling platform-specific encoding differences, and strategies for debugging encoding issues. Special sections address working with compressed data, implementing binary diff algorithms, handling multimedia content encoding, and testing strategies for encoding correctness.

**Link:** [Article](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/bw6x-bwce-how-to-decode-encode-a-string-in-binary-format-in-businessworks-and-businessworks-container-edition-r3412/)

#### Date Calculations
**Summary:** Date manipulation techniques for calculating time differences and business days.  
**Tags:** `BW6X`, `BWCE`, `date-manipulation`, `calculations`

**Description:**  
This practical guide demonstrates comprehensive date manipulation techniques in BusinessWorks for implementing time-based business logic and calculations. You'll learn how to calculate date differences in various units (days, hours, business days), handle time zone conversions accurately, implement holiday calendars for business day calculations, and manage date arithmetic for scheduling operations. The article provides solutions for common scenarios including age calculations, deadline management, SLA tracking, billing period calculations, and recurring schedule generation.

Advanced date handling includes implementing custom calendar systems for different locales, managing daylight saving time transitions correctly, handling historical dates and leap year calculations, and implementing complex recurrence patterns. The guide addresses critical date processing challenges such as dealing with partial dates and fuzzy matching, managing date precision and rounding, handling invalid dates gracefully, and implementing date validation rules. Performance considerations cover optimizing date operations in loops, caching calendar calculations, implementing efficient date range queries, and strategies for bulk date processing. Special sections address internationalization and localization of dates, working with different calendar systems (Gregorian, Lunar, Fiscal), testing date-dependent logic across time zones, and handling edge cases in date calculations.

**Link:** [Article](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/bw6x-bwce-how-to-calculate-the-number-of-days-between-two-dates-in-businessworks-and-businessworks-container-edition-r3523/)

#### SQL Server Windows Authentication from Linux
**Summary:** Configure SQL Server connections using Windows authentication from Linux-based BusinessWorks deployments.  
**Tags:** `BW5X`, `BW6X`, `BWCE`, `SQL-Server`, `authentication`, `Linux`

**Description:**  
This cross-platform integration guide solves the complex challenge of connecting to SQL Server databases using Windows authentication from Linux-based BusinessWorks deployments. You'll learn how to configure Kerberos authentication for Linux systems, set up Service Principal Names (SPNs) correctly, manage keytab files for credential storage, and troubleshoot common authentication failures. The article provides detailed step-by-step procedures for different scenarios including single sign-on configurations, service account setups, domain trust relationships, and multi-domain environments.

Advanced authentication topics include implementing credential delegation for multi-hop scenarios, managing Kerberos ticket renewal automatically, handling authentication across network boundaries, and implementing fallback authentication mechanisms. The guide addresses critical security considerations such as protecting keytab files properly, implementing least-privilege access principles, auditing authentication attempts, and maintaining compliance with security policies. Production deployment covers high availability configurations, managing authentication in containerized deployments, troubleshooting Kerberos issues systematically, and strategies for authentication testing. Special sections address differences between SQL Server versions, working with Azure SQL Database, implementing connection pooling with Windows authentication, and migration strategies from SQL authentication.

**Link:** [Article](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/bw-5x-bw6x-bwce-how-to-connect-to-an-sql-server-database-using-windows-authentication-from-a-linux-environment-r3559/)

#### SFTP Algorithm Negotiation Issues
**Summary:** Fix SSH/SFTP connection failures due to algorithm negotiation issues in the SFTP plugin.  
**Tags:** `BW5X`, `BW6X`, `BWCE`, `SFTP`, `SSH`, `troubleshooting`

**Description:**  
This troubleshooting guide addresses the common "Algorithm negotiation fail" error that occurs when BusinessWorks SFTP connections fail due to incompatible SSH algorithms between client and server. You'll learn how to diagnose algorithm compatibility issues, update JSch library configurations, enable additional algorithms safely, and manage security versus compatibility trade-offs. The article provides specific solutions for different scenarios including connecting to legacy systems, working with hardened servers, handling updated SSH daemons, and managing cipher suite requirements.

Advanced SFTP configuration includes implementing custom algorithm preferences, managing host-specific configurations, handling key exchange algorithms properly, and implementing algorithm fallback strategies. The guide addresses security implications of algorithm choices, compliance requirements for encryption standards, managing deprecated algorithms safely, and implementing compensating controls. Troubleshooting procedures cover enabling debug logging for SSH negotiation, analyzing packet captures for algorithm exchange, testing with different SSH clients, and systematically identifying supported algorithms. Special sections address working with different SFTP server implementations, handling FIPS compliance requirements, managing SSH protocol versions, and strategies for maintaining long-term compatibility.

**Link:** [Article](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/bw5x-bw6x-bwce-how-to-resolve-the-%E2%80%9Ccomjcraftjschjschalgonegofailexception-algorithm-negotiation-fail-%E2%80%9D-error-while-using-the-businessworks-plugin-for-sftp-r3518/)

#### Check Runtime Environment
**Summary:** Determine BusinessWorks runtime environment details including version, JVM, and system properties.  
**Tags:** `BW5X`, `BW6X`, `runtime`, `environment`, `diagnostics`

**Description:**  
This diagnostic guide provides comprehensive methods for determining BusinessWorks runtime environment details, essential for troubleshooting, support, and ensuring compatibility. You'll learn how to programmatically retrieve version information, access JVM properties and settings, identify installed features and plugins, and gather system configuration details. The article demonstrates various techniques including using built-in functions, accessing system properties, executing diagnostic commands, and implementing custom monitoring solutions that track environment characteristics.

Advanced diagnostic capabilities include building automated environment verification scripts, comparing environments for consistency, detecting configuration drift over time, and implementing environment-aware application behavior. The guide addresses operational requirements such as generating environment reports for auditing, validating prerequisites before deployment, troubleshooting environment-specific issues, and maintaining environment documentation. Production considerations cover monitoring environment changes, implementing alerts for critical settings, tracking Java security updates, and strategies for environment standardization. Special sections address containerized environment detection, cloud platform identification, gathering diagnostic bundles for support, and implementing automated compliance checking.

**Link:** [Article](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/bw6x-bw-5x-how-to-check-the-businessworks-runtime-environment-r3524/)

### Cross-Version Operations

#### Ensure Stable Response Times
**Summary:** Performance tuning techniques to maintain consistent response times across high-load scenarios.  
**Tags:** `BW5X`, `BW6X`, `performance`, `tuning`, `stability`

**Description:**  
This performance optimization guide provides techniques for maintaining stable and predictable response times in BusinessWorks applications under varying load conditions. You'll learn how to identify and eliminate response time variability sources, implement performance isolation between components, configure thread pools for consistent behavior, and manage resource contention effectively. The article covers profiling techniques, performance metrics collection, and analysis methods for identifying bottlenecks.

Advanced performance topics include implementing adaptive throttling mechanisms, managing garbage collection impact on response times, optimizing database query performance, and handling burst traffic patterns. The guide addresses CPU and memory tuning, I/O optimization strategies, network latency management, and techniques for maintaining SLA compliance. Best practices cover performance testing methodologies, capacity planning approaches, implementing performance monitoring dashboards, and strategies for gradual performance degradation rather than catastrophic failure under extreme load.

**Link:** [Article](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/bw-6x-bw5x-how-to-ensure-stable-response-times-in-businessworks-r3358/)

---


| Article Title | Version | Focus Area |
|--------------|---------|------------|
| [EMS Reconnection BW5](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/bw5x-how-to-make-sure-tibco-businessworks-5x-can-connect-or-reconnect-to-an-ems-server-in-every-cases-r3344/) | BW5X | High Availability |
| [Robust Domain Setup](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/bw5x-how-to-set-up-a-robust-businessworks-5x-domain-r3345/) | BW5X | Infrastructure |
| [Find TRA Versions](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/bw5x-how-to-find-exact-tra-components-versions-in-a-businessworks-5x-environment-r3346/) | BW5X | Troubleshooting |
| [Truncate History](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/bw5x-how-to-truncate-deployment-history-in-businessworks-5x-r3347/) | BW5X | Maintenance |
| [Reinstall Services](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/bw5x-how-to-uninstall-and-re-install-the-hawk-agent-and-the-administrator-server-as-windows-services-in-a-businessworks-5x-domain-r3348/) | BW5X | Windows Services |
| [EMS Auto-reconnect](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/bw6x-bwce-how-to-make-sure-tibco-businessworks-applications-can-connect-or-reconnect-to-an-ems-server-in-every-cases-r3357/) | BW6X, BWCE | Messaging HA |
| [Stable Response Times](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/bw-6x-bw5x-how-to-ensure-stable-response-times-in-businessworks-r3358/) | BW5X, BW6X | Performance |
| [JMS Load Balancing](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/bw6x-bwce-bw5x-how-to-ensure-smooth-load-balancing-of-jms-messages-in-businessworks-5x-businessworks-6x-and-businessworks-container-edition-r3360/) | All Versions | Message Distribution |
| [TRA and config.ini](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/bw6x-important-things-to-know-about-businessworks-6x-tra-files-and-configini-files-r3361/) | BW6X | Configuration |
| [Config Templates](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/bw6x-useful-things-to-know-about-appspace_configini_template-and-appnode_configini_template-files-r3362/) | BW6X | Deployment |
| [Monitor Processes](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/bw-6x-how-to-monitor-process-activity-in-businessworks-6x-r3363/) | BW6X | Monitoring |
| [Multiple BW Versions](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/bw6x-how-to-run-two-different-versions-of-businessworks-6x-on-the-same-machine-r3364/) | BW6X | Multi-version |
| [Install Hotfixes](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/bw6x-something-important-not-to-forget-when-installing-a-businessworks-6x-hotfix-r3365/) | BW6X | Maintenance |
| [Refresh App Status](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/bw6x-how-to-refresh-application-statuses-in-businessworks-6x-r3366/) | BW6X | Admin Console |
| [Active-Passive Setup](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/bw6x-how-to-set-up-an-active-passive-configuration-in-businessworks-6x-r3367/) | BW6X | HA Clustering |
| [Set Flow Limits](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/bw6x-bwce-how-to-set-a-flow-limit-for-a-given-businessworks-6x-or-businessworks-container-edition-component-r3368/) | BW6X, BWCE | Resource Control |
| [Windows Services](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/bw6x-how-to-run-businessworks-6x-bwagents-and-appnodes-as-windows-services-r3378/) | BW6X | Windows Automation |
| [Auto-start Apps](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/bw6x-how-to-start-businessworks-6x-appnodes-and-applications-automatically-at-server-boot-r3381/) | BW6X | Boot Automation |
| [Activity Logging](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/bw6x-bwce-how-to-enable-activity-level-logging-in-businessworks-6x-and-businessworks-container-edition-r3383/) | BW6X, BWCE | Debugging |
| [OSGi Commands](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/bw6x-how-to-send-osgi-commands-to-a-businessworks-appnode-using-curl-r3386/) | BW6X | Remote Management |
| [Start All Apps](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/bw6x-how-to-start-all-deployed-applications-when-a-businessworks-6x-appnode-is-started-r3405/) | BW6X | Bulk Operations |
| [Bulk Properties](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/bw6x-how-to-set-properties-for-all-appnodes-at-once-in-a-businessworks-6x-environment-r3406/) | BW6X | Config Management |
| [TEA Performance](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/bw6x-bwce-how-to-ensure-stable-tea-response-times-in-a-businessworks-6x-environment-r3409/) | BW6X, BWCE | Admin Performance |
| [Disable Starters](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/bw6x-bwce-how-to-disable-a-process-starter-at-start-up-in-businessworks-r3416/) | BW6X, BWCE | Startup Control |
| [BW Agent Security](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/bw6x-security-how-to-secure-the-bwagent-rest-api-r3417/) | BW6X | API Security |
| [End of Support](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/bw6x-bwce-bw5x-where-to-find-end-of-support-dates-for-tibco-products-r3418/) | All Versions | Lifecycle |
| [Separate Logs](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/bw6x-how-to-have-separate-log-files-per-application-in-businessworks-r3422/) | BW6X | Log Management |
| [JMX Monitoring](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/bw6x-how-to-monitor-a-businessworks-appnode-memory-and-threads-usage-using-jmx-and-jvisualvm-r3423/) | BW6X | Performance Monitor |
| [Start Impaired Apps](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/bw6x-bwce-how-to-start-an-impaired-application-in-businessworks-and-businessworks-container-edition-r3426/) | BW6X, BWCE | Recovery |
| [Recreate BW Config](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/bw-6x-how-to-recreate-bwagent-local-configuration-files-from-the-bwagent-database-r3441/) | BW6X | Disaster Recovery |
| [SFTP Algorithm Fix](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/bw5x-bw6x-bwce-how-to-resolve-the-%E2%80%9Ccomjcraftjschjschalgonegofailexception-algorithm-negotiation-fail-%E2%80%9D-error-while-using-the-businessworks-plugin-for-sftp-r3518/) | All Versions | SFTP Issues |
| [Check Runtime](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/bw6x-bw-5x-how-to-check-the-businessworks-runtime-environment-r3524/) | BW5X, BW6X | Diagnostics |
| [Rendezvous License](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/bw5x-bw6x-how-to-set-a-default-license-when-using-rendezvous-in-auto-start-mode-r3558/) | BW5X, BW6X | RV Config |
| [Smart Engine Stats](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/bw6x-bwce-how-to-collect-statistics-on-a-businessworks-or-businessworks-container-edition-configuration-using-the-smart-engine-r3561/) | BW6X, BWCE | Performance Analysis |
| [Set Properties](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/bw6-how-to-set-property-values-in-businessworks-r3562/) | BW6X | Configuration |
| [Start Without Domain](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/bw5x-how-to-start-businessworks-5x-engines-when-the-domain-is-down-r3563/) | BW5X | Emergency Start |
| [Start Without Agents](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/bw6x-how-to-start-businessworks-appnodes-when-bwagents-are-down-r3564/) | BW6X | Emergency Start |
| [Zero Downtime Deploy](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/bw6x-how-to-deploy-a-new-release-of-an-application-with-zero-downtime-in-businessworks-r3565/) | BW6X | Blue-Green Deploy |
| [Logging Guide](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/bw6x-useful-things-to-know-about-logging-within-businessworks-r3572/) | BW6X | Best Practices |
| [Update via API](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/bw6x-how-to-update-an-appnode-configuration-using-the-bwagent-rest-api-r3574/) | BW6X | API Automation |


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
