CREATE SCHEMA [SmartRouting]
GO

CREATE LOGIN [SmartUser] 
WITH PASSWORD = 'SmartRouting123',
CHECK_POLICY = ON,
CHECK_EXPIRATION = ON;
GO

CREATE USER [SmartUser] 
FOR LOGIN [SmartUser]
WITH DEFAULT_SCHEMA = [SmartRouting];
GO

GRANT SELECT ON SCHEMA::SmartRouting TO SmartUser;
GO

CREATE TABLE SmartRouting.SystemInfo (
    Id INT IDENTITY(1,1) PRIMARY KEY,  -- Auto-increment primary key
    SystemName NVARCHAR(100) NOT NULL,  -- System name
    Protocol NVARCHAR(50) NOT NULL,  -- Protocol (e.g., HTTP, FTP)
    Hostname NVARCHAR(255) NOT NULL,  -- Hostname or IP
    Port INT NOT NULL,  -- Port number
	Timeout INT, -- HTTP Timeout
	Retry INT, -- Number of retry in case of error
	Username NVARCHAR(100) NULL, -- Credentials
	Password NVARCHAR(255) NULL  -- Credentials
);
GO

CREATE TABLE SmartRouting.Documents (
    Id INT IDENTITY(1,1) PRIMARY KEY,  -- Auto-increment primary key
    DocumentType NVARCHAR(100) NOT NULL,  -- Document type
    SystemName NVARCHAR(100) NOT NULL,  -- System name
	Endpoint NVARCHAR(100), -- System endpoint
	JoltSpecification NVARCHAR(MAX), -- JSON-to-JSON transformation
	Timeout INT, -- HTTP Timeout
	Retry INT, -- Number of retry in case of error
	Enabled BIT NOT NULL DEFAULT 1  -- Enable/Disable the sending
);
GO

CREATE TABLE SmartRouting.SourceSystem (
    Id INT IDENTITY(1,1) PRIMARY KEY,  -- Auto-increment primary key
    DocumentType NVARCHAR(100) NOT NULL,  -- Document type
    SystemName NVARCHAR(100) NOT NULL,  -- System name
	JoltSpecification NVARCHAR(MAX) NULL,  -- JSON transformation
	Enabled BIT NOT NULL DEFAULT 1  -- Enable/Disable the sending
);
GO