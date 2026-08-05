# retailLoyaltyService

**Target Runtime:** TIBCO ActiveMatrix BusinessWorks™ 6.x

**Description:** A retail loyalty SOAP service that receives customer loyalty requests, maps loyalty points and tier information, logs the incoming request, and returns a loyalty points response.

---

## 1. Project Hierarchy

| Component Type | Name |
| :---- | :---- |
| **Application Module** | `retailLoyaltyService` |
| **Application Project** | `retailLoyaltyService.application` |

### Prompt 1:
```
Can you create an application called retailLoyaltyService ?
```


---

## 2. Schemas and Resources

### Prompt 2:
```
Can you add a WSDL called LoyaltyService.wsdl to the project using the definition below ? It defines a GetLoyaltyPoints operation with a LoyaltyRequest input (customerId, requestDate) and a LoyaltyResponse output (customerId, loyaltyPoints, customerTier).
```

> If you prefer to add the WSDL manually instead, follow the WSDL Setup steps below.

### WSDL Setup

* **Step 1:** Create a new file named `LoyaltyService.wsdl` on your local machine at `C:\Retail\WSDL\LoyaltyService.wsdl`
* **Step 2:** Copy and paste the following content into the file and save it:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<wsdl:definitions xmlns:wsdl="http://schemas.xmlsoap.org/wsdl/"
                  xmlns:soap="http://schemas.xmlsoap.org/wsdl/soap/"
                  xmlns:tns="http://www.tibco.com/retail/loyalty"
                  xmlns:xs="http://www.w3.org/2001/XMLSchema"
                  targetNamespace="http://www.tibco.com/retail/loyalty"
                  name="LoyaltyService">

    <wsdl:types>
        <xs:schema targetNamespace="http://www.tibco.com/retail/loyalty">
            <xs:element name="LoyaltyRequest">
                <xs:complexType>
                    <xs:sequence>
                        <xs:element name="customerId"  type="xs:string"/>
                        <xs:element name="requestDate" type="xs:date"/>
                    </xs:sequence>
                </xs:complexType>
            </xs:element>
            <xs:element name="LoyaltyResponse">
                <xs:complexType>
                    <xs:sequence>
                        <xs:element name="customerId"    type="xs:string"/>
                        <xs:element name="loyaltyPoints" type="xs:integer"/>
                        <xs:element name="customerTier"  type="xs:string"/>
                    </xs:sequence>
                </xs:complexType>
            </xs:element>
        </xs:schema>
    </wsdl:types>

    <wsdl:message name="LoyaltyRequestMessage">
        <wsdl:part name="parameters" element="tns:LoyaltyRequest"/>
    </wsdl:message>

    <wsdl:message name="LoyaltyResponseMessage">
        <wsdl:part name="parameters" element="tns:LoyaltyResponse"/>
    </wsdl:message>

    <wsdl:portType name="LoyaltyPortType">
        <wsdl:operation name="GetLoyaltyPoints">
            <wsdl:input  message="tns:LoyaltyRequestMessage"/>
            <wsdl:output message="tns:LoyaltyResponseMessage"/>
        </wsdl:operation>
    </wsdl:portType>

    <wsdl:binding name="LoyaltyBinding" type="tns:LoyaltyPortType">
        <soap:binding style="document"
                      transport="http://schemas.xmlsoap.org/soap/http"/>
        <wsdl:operation name="GetLoyaltyPoints">
            <soap:operation soapAction="GetLoyaltyPoints"/>
            <wsdl:input>  <soap:body use="literal"/> </wsdl:input>
            <wsdl:output> <soap:body use="literal"/> </wsdl:output>
        </wsdl:operation>
    </wsdl:binding>

    <wsdl:service name="LoyaltyPointsService">
        <wsdl:port name="LoyaltyPort" binding="tns:LoyaltyBinding">
            <soap:address location="http://localhost:8080/loyalty"/>
        </wsdl:port>
    </wsdl:service>

</wsdl:definitions>
```

* **Step 3:** In BW Studio, right-click the `retailLoyaltyService` module and select **Import → File System**
* **Step 4:** Browse to `C:\Retail\WSDL\` and import `LoyaltyService.wsdl` into the project

> **Note:** Verify the WSDL appears under the project resources before proceeding to process creation.

---

## 3. Process Logic

### Prompt 3:
```
Can you generate a process called LoyaltyProcess.bwp from the WSDL LoyaltyService.wsdl using the GetLoyaltyPoints operation (this auto-generates the SOAP Receive and SOAP Reply activities), then between them add a Mapper → Log and configure:
- Mapper: customerId = $SOAPReceive/Body/tns:LoyaltyRequest/tns:customerId, loyaltyPoints = xsd:integer("250"), customerTier = "Gold"
- Log: message = concat("Retail loyalty request received for customer: ", $SOAPReceive/Body/tns:LoyaltyRequest/tns:customerId)
- SOAP Reply: customerId = $Mapper/customerId, loyaltyPoints = $Mapper/loyaltyPoints, customerTier = $Mapper/customerTier
```

> **Note:** Do NOT manually add or configure the SOAP Receive activity — it must be generated from the WSDL.

**Process Name: LoyaltyProcess.bwp**

* **Create the process** by right-clicking the `retailLoyaltyService` package and selecting **Generate Process from WSDL**
* **Select** `LoyaltyService.wsdl` as the source WSDL
* **Select** operation `GetLoyaltyPoints`
* This will **automatically generate** the `SOAP Receive` and `SOAP Reply` activities with correct schema bindings

> **Note:** Do NOT manually add or configure the SOAP Receive activity. It must be generated from the WSDL.

### Create below activities in sequence & link them between the auto-generated SOAP Receive and SOAP Reply

`Mapper` → `Log` and all should be linked with each other.

### Activity Configurations as below

#### Activity 1: SOAP Receive (Auto-generated — do not modify)

#### Activity 2: Mapper

* **Configure nodes:**
  * `customerId` ➔ `$SOAPReceive/Body/tns:LoyaltyRequest/tns:customerId`
  * `loyaltyPoints` ➔ `xsd:integer("250")`
  * `customerTier` ➔ `"Gold"`

#### Activity 3: Log

* **Configure node**
  * `message` ➔ `concat("Retail loyalty request received for customer: ", $SOAPReceive/Body/tns:LoyaltyRequest/tns:customerId)`

#### Activity 4: SOAP Reply (Auto-generated)

* **Configure nodes:**
  * `customerId` ➔ `$Mapper/customerId`
  * `loyaltyPoints` ➔ `$Mapper/loyaltyPoints`
  * `customerTier` ➔ `$Mapper/customerTier`
