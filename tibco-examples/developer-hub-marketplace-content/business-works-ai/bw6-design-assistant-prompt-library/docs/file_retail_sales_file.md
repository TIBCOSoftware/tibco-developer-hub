# Application name: retail.bw.sample.palette.file.RetailDailySales

**Target Runtime:** TIBCO ActiveMatrix BusinessWorks™ 6.x

**Description:** A retail sales data processing application that uses local process variables as input, maps sales records, writes a summarized output file, and logs the processing result.

---

## 1. Project Hierarchy

| Component Type | Name |
| :---- | :---- |
| **Application Module** | `retail.bw.sample.palette.file.RetailDailySales` |
| **Application Project** | `retail.bw.sample.palette.file.RetailDailySales.application` |

---

## 2. Module Properties Configuration

Create and Configure the following module properties:

| Property Name | Data Type | Value |
| :---- | :---- | :---- |
| OUTPUT\_FILE | String | C:/Retail/Output/sales\_summary.txt |
| DEFAULT\_STORE\_NAME | String | RetailMart |
| DEFAULT\_TOTAL\_SALES | String | 15000.00 |
| DEFAULT\_SALES\_DATE | String | 2025-01-01 |

---

## 3. Process Properties Configuration

Create and Configure the following process properties for `SalesFileProcessor.bwp`:

| Property Name | Data Type | Value |
| :---- | :---- | :---- |
| storeName | String | DEFAULT\_STORE\_NAME |
| totalSales | String | DEFAULT\_TOTAL\_SALES |
| salesDate | String | DEFAULT\_SALES\_DATE |
| OUTPUT\_FILE | String | OUTPUT\_FILE |

---

## 4. Schemas and Resources

Create the following schema file and add it to the project:

**Name:** RetailSalesSchema.xsd

| Element Name | Data Type | Description |
| :---- | :---- | :---- |
| storeName | xs:string | Name of the retail store |
| totalSales | xs:decimal | Total sales amount for the day |
| salesDate | xs:date | Date of the sales record |

```xml
<?xml version="1.0" encoding="UTF-8"?>
<xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema"
           targetNamespace="http://www.tibco.com/retail/sales"
           xmlns:tns="http://www.tibco.com/retail/sales"
           elementFormDefault="qualified">

    <xs:element name="RetailSales" type="tns:RetailSalesType"/>

    <xs:complexType name="RetailSalesType">
        <xs:sequence>
            <xs:element name="storeName"  type="xs:string"/>
            <xs:element name="totalSales" type="xs:decimal"/>
            <xs:element name="salesDate"  type="xs:date"/>
        </xs:sequence>
    </xs:complexType>

</xs:schema>
```

---

## 5. Process Logic

**Process Name: SalesFileProcessor.bwp**

### Create below activities in sequence & link them

`Timer` → `Mapper` → `Write File` → `Log` and all should be linked with each other.

### Activity Configurations as below

#### Activity 1: Timer (Starter)

* **Configure attribute**
  * `Interval` with value `60` (seconds)

#### Activity 2: Mapper

* **Configure schema:** `RetailSalesSchema.xsd`
* **Configure nodes:**
  * `storeName` ➔ `$storeName` (Note: Ensure `$storeName` is defined as a process variable)
  * `totalSales` ➔ `xsd:decimal($totalSales)` (Note: Ensure `$totalSales` is defined as a process variable)
  * `salesDate` ➔ `xsd:date($salesDate)` (Note: Ensure `$salesDate` is defined as a process variable)

#### Activity 3: Write File

* **Configure attribute**
  * `FileName` with module property `OUTPUT_FILE`
  * `Append` with value `true`
  * `Create Non Existing Directories` with value `true`
* **Configure node**
  * `textContent` ➔ `concat("Store: ", $Mapper/tns:storeName, " | Date: ", $Mapper/tns:salesDate, " | Total Sales: ", string($Mapper/tns:totalSales))`

#### Activity 4: Log

* **Configure node**
  * `message` ➔ `concat("Retail sales record processed for store: ", $Mapper/tns:storeName, " on ", $Mapper/tns:salesDate)`
