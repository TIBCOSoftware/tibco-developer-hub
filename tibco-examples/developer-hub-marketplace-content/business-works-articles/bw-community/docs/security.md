### Security Articles

#### IP White/Black Listing
**Summary:** Implement IP-based access control for securing BusinessWorks services and applications.  
**Tags:** `BW5X`, `BW6X`, `BWCE`, `security`, `IP-filtering`, `access-control`

**Description:**  
This security guide provides comprehensive strategies for implementing IP-based access control in BusinessWorks applications, essential for protecting services from unauthorized access. You'll learn how to configure IP whitelisting and blacklisting at different levels (network, application, service), implement dynamic IP filtering based on threat intelligence, manage IP lists efficiently, and handle IP spoofing attempts. The article covers both IPv4 and IPv6 filtering, CIDR notation support, and integration with enterprise security infrastructure.

Advanced security topics include implementing geo-blocking based on IP location, rate limiting per IP address, managing IP reputation scores, and handling requests from behind proxies and load balancers. The guide addresses compliance requirements for IP filtering, audit logging of blocked requests, implementing temporary IP bans for suspicious activity, and strategies for managing IP lists at scale. Best practices cover testing IP filtering rules, maintaining IP list documentation, implementing fail-safe mechanisms, and balancing security with legitimate user access.

**Link:** [Article](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/bw6x-bwce-bw5x-security-how-to-manage-ip-white-listing-or-black-listing-in-businessworks-and-businessworks-container-edition-r3396/)

#### Implement Mutual Authentication (Two-Way SSL)
**Summary:** Configure mutual TLS authentication for secure bidirectional certificate validation.  
**Tags:** `BW6X`, `BWCE`, `mutual-auth`, `two-way-SSL`, `certificates`

**Description:**  
This advanced security guide provides detailed instructions for implementing mutual authentication (two-way SSL/TLS) in BusinessWorks applications, ensuring both client and server authenticate each other using certificates. You'll learn how to configure trust stores and key stores, manage certificate chains, implement certificate validation logic, and handle certificate renewal without downtime. The article covers both inbound and outbound mutual authentication scenarios with practical examples.

Critical security topics include managing certificate lifecycle, implementing certificate pinning for additional security, handling certificate revocation lists (CRL) and OCSP, and troubleshooting common mutual authentication failures. The guide addresses compliance requirements, certificate management at scale, implementing different authentication strengths for different clients, and strategies for migrating from one-way to mutual authentication. Best practices cover certificate security, key management, audit logging of authentication events, and disaster recovery procedures for certificate compromise scenarios.

**Link:** [Article](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/bw6x-bwce-security-how-to-implement-mutual-authentication-two-way-ssl-in-businessworks-and-businessworks-container-edition-r3398/)

#### Configure HTTPS Client Connection
**Summary:** Set up HTTP client connections to securely access REST APIs and web services over HTTPS.  
**Tags:** `BW6X`, `BWCE`, `HTTPS`, `SSL-client`, `REST-API`, `web-services`

**Description:**  
This comprehensive guide covers configuring HTTP client connections in BusinessWorks to securely access external REST APIs and web services over HTTPS. You'll learn how to configure SSL/TLS settings, manage trusted certificates, handle different TLS versions, and implement proper certificate validation. The article covers importing certificates into trust stores, configuring cipher suites for optimal security, handling self-signed certificates in development environments, and managing connection pooling for HTTPS connections.

Advanced topics include implementing certificate pinning for enhanced security, handling Server Name Indication (SNI), configuring proxy settings for HTTPS connections, and troubleshooting common SSL handshake failures. The guide addresses performance optimization for HTTPS connections, managing connection timeouts, implementing retry logic for failed connections, and strategies for handling certificate expiration. Best practices cover secure credential management, proper error handling for SSL exceptions, logging security events, and testing HTTPS connections across different environments.

**Link:** [Article](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/bw6x-bwce-security-how-to-configure-an-http-client-connection-to-access-a-rest-api-or-web-services-exposed-over-https-in-businessworks-6x-and-businessworks-container-edition-r3387/)

#### Expose API/Service over HTTPS
**Summary:** Configure BusinessWorks services to securely expose APIs and services using HTTPS protocol.  
**Tags:** `BW6X`, `BWCE`, `HTTPS`, `SSL-server`, `API-security`, `service-exposure`

**Description:**  
This security guide provides detailed instructions for exposing BusinessWorks APIs and services securely over HTTPS. You'll learn how to configure SSL/TLS on HTTP servers, manage server certificates and private keys, implement proper cipher suite selection, and handle different TLS protocol versions. The article covers generating and installing SSL certificates, configuring key stores, setting up HTTPS listeners, and managing port configurations for secure communication.

Critical implementation topics include configuring SSL session management, implementing HTTP Strict Transport Security (HSTS), handling mixed content scenarios, and managing SSL offloading with load balancers. The guide addresses certificate renewal strategies, implementing proper redirect from HTTP to HTTPS, configuring custom SSL error pages, and monitoring SSL certificate expiration. Best practices cover security headers configuration, preventing SSL stripping attacks, implementing proper logging for security audit, and performance tuning for SSL/TLS operations.

**Link:** [Article](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/bw6x-bwce-security-how-to-expose-an-api-or-a-service-in-https-in-businessworks-and-businessworks-container-edition-r3397/)

#### Encrypt and Decrypt Secrets
**Summary:** Implement encryption and decryption mechanisms for protecting sensitive data and secrets.  
**Tags:** `BW6X`, `BWCE`, `encryption`, `secrets-management`, `data-protection`, `cryptography`

**Description:**  
This comprehensive security guide covers implementing encryption and decryption for secrets and sensitive data in BusinessWorks applications. You'll learn how to use built-in encryption capabilities, manage encryption keys securely, implement symmetric and asymmetric encryption, and handle encrypted configuration properties. The article covers encrypting passwords, API keys, connection strings, and other sensitive configuration data using various encryption algorithms and key management strategies.

Advanced security topics include implementing envelope encryption, managing key rotation policies, using Hardware Security Modules (HSMs), and integrating with enterprise key management systems. The guide addresses compliance requirements for data encryption (PCI-DSS, GDPR, HIPAA), implementing encryption at rest and in transit, secure key storage options, and strategies for migrating from plain text to encrypted secrets. Best practices cover key lifecycle management, implementing proper access controls for decryption operations, audit logging for cryptographic operations, and disaster recovery procedures for key loss scenarios.

**Link:** [Article](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/bw6x-bwce-security-how-to-encrypt-and-decrypt-secrets-in-businessworks-and-businessworks-container-edition-r3399/)

#### Implement Basic Authentication
**Summary:** Configure and implement HTTP Basic Authentication for securing REST APIs and web services.  
**Tags:** `BW6X`, `BWCE`, `basic-auth`, `authentication`, `REST-security`, `credentials`

**Description:**  
This security guide provides comprehensive instructions for implementing HTTP Basic Authentication in BusinessWorks applications. You'll learn how to configure basic authentication for both client and server scenarios, manage user credentials securely, implement proper credential validation, and handle authentication headers. The article covers setting up authentication realms, configuring user repositories, implementing password policies, and integrating with enterprise identity providers.

Important security considerations include protecting credentials in transit using HTTPS, implementing account lockout policies, managing credential rotation, and preventing brute force attacks. The guide addresses integration with LDAP/Active Directory, implementing role-based access control (RBAC), handling authentication failures gracefully, and strategies for migrating from basic to more advanced authentication methods. Best practices cover secure credential storage, implementing proper session management, audit logging of authentication events, and compliance with security standards.

**Link:** [Article](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/bw-6x-bwce-security-how-to-use-basic-authentication-in-businessworks-and-businessworks-container-edition-r3403/)

#### Dynamic HTTP/HTTPS Protocol Switching
**Summary:** Configure dynamic switching between HTTP and HTTPS protocols using application properties.  
**Tags:** `BW6X`, `BWCE`, `protocol-switching`, `HTTP`, `HTTPS`, `configuration-management`

**Description:**  
This technical guide demonstrates how to implement dynamic protocol switching between HTTP and HTTPS in BusinessWorks applications using configuration properties. You'll learn how to design protocol-agnostic services, manage environment-specific configurations, implement conditional SSL/TLS settings, and handle protocol transitions smoothly. The article covers using application properties for protocol selection, managing certificates conditionally, and implementing fallback mechanisms.

Advanced configuration topics include implementing gradual HTTPS migration strategies, managing mixed-mode deployments, handling protocol-specific timeouts and settings, and implementing proper health checks for both protocols. The guide addresses deployment strategies across different environments, testing protocol switching logic, managing performance implications, and troubleshooting protocol-related issues. Best practices cover configuration management, implementing proper logging for protocol changes, monitoring protocol usage, and ensuring zero-downtime protocol transitions.

**Link:** [Article](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/bw6x-bwce-security-how-to-switch-between-http-and-https-using-a-property-in-businessworks-and-businessworks-container-edition-r3404/)

#### Secure Email Connections with TLS
**Summary:** Configure email server connections using TLS v1.2 for secure email communication.  
**Tags:** `BW6X`, `BWCE`, `email-security`, `TLS`, `SMTP`, `mail-encryption`

**Description:**  
This security guide provides detailed instructions for establishing secure email server connections using TLS v1.2 in BusinessWorks applications. You'll learn how to configure SMTP/POP3/IMAP connections with TLS encryption, manage email server certificates, implement STARTTLS, and handle different email security protocols. The article covers configuring mail server authentication, managing port configurations for secure email, and troubleshooting TLS handshake issues with email servers.

Critical email security topics include implementing SPF, DKIM, and DMARC compliance, handling encrypted email attachments, managing email server certificate validation, and preventing email spoofing. The guide addresses integration with enterprise email systems (Exchange, Gmail, Office 365), implementing email rate limiting, handling bounced emails securely, and strategies for email audit logging. Best practices cover secure credential management for email accounts, implementing proper error handling for email failures, monitoring email security events, and compliance with email security standards.

**Link:** [Article](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/bw6x-bwce-security-how-to-connect-to-an-email-server-using-tlsv12-from-businessworks-and-businessworks-container-edition-r3415/)

#### Azure Key Vault Integration
**Summary:** Integrate BusinessWorks with Azure Key Vault for centralized secrets and key management.  
**Tags:** `BW6X`, `BWCE`, `Azure`, `key-vault`, `cloud-security`, `secrets-management`

**Description:**  
This cloud security guide demonstrates how to integrate BusinessWorks applications with Azure Key Vault for enterprise-grade secrets management. You'll learn how to configure Azure Active Directory authentication, implement managed identity access, retrieve secrets and certificates from Key Vault, and handle key rotation automatically. The article covers setting up Key Vault connections, implementing proper RBAC policies, managing access tokens, and handling Key Vault throttling.

Advanced cloud integration topics include implementing secret caching strategies, managing Key Vault high availability, using Key Vault for encryption keys, and implementing Hardware Security Module (HSM) backed keys. The guide addresses compliance and governance requirements, implementing audit logging for secret access, managing multi-region Key Vault deployments, and disaster recovery strategies. Best practices cover implementing least privilege access, managing secret versioning, monitoring Key Vault usage and costs, and strategies for migrating existing secrets to Azure Key Vault.

**Link:** [Article](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/bw6x-bwce-security-how-to-connect-to-an-azure-key-vault-in-businessworks-r3568/)

---

| Article Title | Version | Focus Area |
|--------------|---------|------------|
| [IP Filtering](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/bw6x-bwce-bw5x-security-how-to-manage-ip-white-listing-or-black-listing-in-businessworks-and-businessworks-container-edition-r3396/) | All Versions | Access Control |
| [HTTPS Client](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/bw6x-bwce-security-how-to-configure-an-http-client-connection-to-access-a-rest-api-or-web-services-exposed-over-https-in-businessworks-6x-and-businessworks-container-edition-r3387/) | BW6X, BWCE | SSL Client |
| [HTTPS Server](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/bw6x-bwce-security-how-to-expose-an-api-or-a-service-in-https-in-businessworks-and-businessworks-container-edition-r3397/) | BW6X, BWCE | SSL Server |
| [Mutual Auth](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/bw6x-bwce-security-how-to-implement-mutual-authentication-two-way-ssl-in-businessworks-and-businessworks-container-edition-r3398/) | BW6X, BWCE | Two-Way SSL |
| [Encrypt Secrets](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/bw6x-bwce-security-how-to-encrypt-and-decrypt-secrets-in-businessworks-and-businessworks-container-edition-r3399/) | BW6X, BWCE | Encryption |
| [Basic Auth BW6](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/bw-6x-bwce-security-how-to-use-basic-authentication-in-businessworks-and-businessworks-container-edition-r3403/) | BW6X, BWCE | Authentication |
| [HTTP/HTTPS Switch](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/bw6x-bwce-security-how-to-switch-between-http-and-https-using-a-property-in-businessworks-and-businessworks-container-edition-r3404/) | BW6X, BWCE | Protocol Config |
| [Email TLS](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/bw6x-bwce-security-how-to-connect-to-an-email-server-using-tlsv12-from-businessworks-and-businessworks-container-edition-r3415/) | BW6X, BWCE | Email Security |
| [Azure Key Vault](https://community.tibco.com/articles/37_tibco-platform/40_integration/53_businessworks/bw6x-bwce-security-how-to-connect-to-an-azure-key-vault-in-businessworks-r3568/) | BW6X, BWCE | Cloud Security |


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
