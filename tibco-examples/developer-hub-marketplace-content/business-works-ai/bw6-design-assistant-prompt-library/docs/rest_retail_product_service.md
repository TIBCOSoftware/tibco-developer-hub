# Retail_Product_Service

**Target Runtime:** TIBCO ActiveMatrix BusinessWorks™ 6.x

**Description:** A retail product REST API service that exposes GET and POST operations for managing product information, maps incoming requests to a defined product schema, and logs all incoming requests.

---

## 1. Project Hierarchy

| Component Type | Name |
| :---- | :---- |
| **Application Module** | `Retail_Product_Service` |
| **Application Project** | `Retail_Product_Service.application` |

### Prompt 1:
```
Can you create an application called Retail_Product_Service ?
```


---

## 2. Schemas and Resources

### Prompt 2:
```
Can you add a schema called Product.xsd with the elements productId (xs:integer), productName (xs:string), productPrice (xs:decimal) and category (xs:string), using the XML below ?
```

Create the following schema file and add it to the project:

**Name:** Product.xsd

| Element Name | Data Type | Description |
| :---- | :---- | :---- |
| productId | xs:integer | Unique identifier for the product |
| productName | xs:string | Name of the retail product |
| productPrice | xs:decimal | Price of the product |
| category | xs:string | Product category |

```xml
<?xml version="1.0" encoding="UTF-8"?>
<xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema"
           targetNamespace="http://www.tibco.com/retail/product"
           xmlns:tns="http://www.tibco.com/retail/product"
           elementFormDefault="qualified">

    <xs:element name="Product" type="tns:ProductType"/>

    <xs:complexType name="ProductType">
        <xs:sequence>
            <xs:element name="productId"    type="xs:integer"/>
            <xs:element name="productName"  type="xs:string"/>
            <xs:element name="productPrice" type="xs:decimal"/>
            <xs:element name="category"     type="xs:string"/>
        </xs:sequence>
    </xs:complexType>

</xs:schema>
```

---

## 3. REST Service Configuration

### Prompt 3:
```
Can you create a REST service called ProductService with Swagger documentation enabled and the following two operations:
- GET Product: HTTP Method GET, Path /products/{productId}, Response Schema Product.xsd, mapping productId = $ReceiveHTTPRequest/Parameters/productId, productName = "Sample Product", productPrice = xsd:decimal("99.99"), category = "General"
- POST Product: HTTP Method POST, Path /products, Request Schema and Response Schema Product.xsd, mapping productId, productName, productPrice and category from $ReceiveHTTPRequest/Body/tns:Product/...
```

**Name:** ProductService

* **Configure attribute**
  * "Enable Swagger Documentation" with value `true`

### Operations

| Operation Name | HTTP Method | Description |
| :---- | :---- | :---- |
| GET Product | GET | Returns sample product details for a given product |
| POST Product | POST | Accepts and processes incoming product information |

#### GET Product Operation

* **Configure attribute**
  * "HTTP Method" with value `GET`
  * "Path" with value `/products/{productId}`
  * "Response Schema" with `Product.xsd`
* **Configure nodes**
  * `productId` ➔ `$ReceiveHTTPRequest/Parameters/productId`
  * `productName` ➔ `"Sample Product"`
  * `productPrice` ➔ `xsd:decimal("99.99")`
  * `category` ➔ `"General"`

#### POST Product Operation

* **Configure attribute**
  * "HTTP Method" with value `POST`
  * "Path" with value `/products`
  * "Request Schema" with `Product.xsd`
  * "Response Schema" with `Product.xsd`
* **Configure nodes**
  * `productId` ➔ `$ReceiveHTTPRequest/Body/tns:Product/tns:productId`
  * `productName` ➔ `$ReceiveHTTPRequest/Body/tns:Product/tns:productName`
  * `productPrice` ➔ `$ReceiveHTTPRequest/Body/tns:Product/tns:productPrice`
  * `category` ➔ `$ReceiveHTTPRequest/Body/tns:Product/tns:category`

---

## 4. Process Logic

### Prompt 4:
```
In the process ProductAPIProcess.bwp, can you add the activities Receive HTTP Request → Mapper → Log → Send HTTP Response and link them in sequence, then configure:
- Receive HTTP Request: REST Service = Retail_Product_Service.ProductService, Operation = the respective GET or POST operation
- Mapper: use schema Product.xsd and map the fields per the GET or POST operation (see below)
- Log: message = concat("Retail product request: ", $ReceiveHTTPRequest/Body/tns:Product/tns:productName)
- Send HTTP Response: Response Code = 200, Body = $Mapper/tns:Product
```

**Process Name: ProductAPIProcess.bwp**

### Create below activities in sequence & link them

`Receive HTTP Request` → `Mapper` → `Log` → `Send HTTP Response` and all should be linked with each other.

### Activity Configurations as below

#### Activity 1: Receive HTTP Request (Starter)

* **Configure attribute**
  * "REST Service" with `Retail_Product_Service.ProductService`
  * "Operation" with the respective GET or POST operation

#### Activity 2: Mapper

* **Configure schema:** `Product.xsd`
* **Configure nodes for GET operation:**
  * `productId` ➔ `$ReceiveHTTPRequest/Parameters/productId`
  * `productName` ➔ `"Sample Product"`
  * `productPrice` ➔ `xsd:decimal("99.99")`
  * `category` ➔ `"General"`
* **Configure nodes for POST operation:**
  * `productId` ➔ `$ReceiveHTTPRequest/Body/tns:Product/tns:productId`
  * `productName` ➔ `$ReceiveHTTPRequest/Body/tns:Product/tns:productName`
  * `productPrice` ➔ `$ReceiveHTTPRequest/Body/tns:Product/tns:productPrice`
  * `category` ➔ `$ReceiveHTTPRequest/Body/tns:Product/tns:category`

#### Activity 3: Log

* **Configure node**
  * `message` ➔ `concat("Retail product request: ", $ReceiveHTTPRequest/Body/tns:Product/tns:productName)`

#### Activity 4: Send HTTP Response

* **Configure attribute**
  * "Response Code" with value `200`
* **Configure node**
  * `Body` ➔ `$Mapper/tns:Product`
