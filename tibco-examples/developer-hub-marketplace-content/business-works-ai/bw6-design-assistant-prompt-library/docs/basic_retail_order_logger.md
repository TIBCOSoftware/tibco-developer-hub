# Project Specification: Retail_Order_Logger

## Project Overview

| Field | Value |
| :---- | :---- |
| **Application Module Name** | `Retail_Order_Logger` |
| **Application Name** | `Retail_Order_Logger.application` |

### Prompt 1:
```
Can you create an application called Retail_Order_Logger ?
```


---

## A. Module Properties Configuration

### Prompt 2:
```
Can you add the following module properties: orderStoreId (Long) = 10001, defaultOrderId (Integer) = 501, enableOrderValidation (Boolean) = true, orderApiPassword (Password) = Retail@123 ? Also create a group called retailGroup with a property storeName (String) = RetailMart.
```

Create and Configure the following module properties:

| Property Name | Data Type | Value |
| :---- | :---- | :---- |
| orderStoreId | Long | 10001 |
| defaultOrderId | Integer | 501 |
| enableOrderValidation | Boolean | true |
| orderApiPassword | Password | Retail@123 |

Create a new group **retailGroup** with the following property:

| Property Name | Data Type | Value |
| :---- | :---- | :---- |
| storeName | String | RetailMart |

---

## B. Schemas and Resources

### Prompt 3:
```
Can you add a schema called RetailOrderSchema.xsd to the project using the XML below ?
```

Copy the following schema into the project:

**Name:** RetailOrderSchema.xsd

```xml
<?xml version="1.0" encoding="UTF-8"?>
<xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema"
           targetNamespace="http://www.tibco.com/retail/order"
           xmlns:tns="http://www.tibco.com/retail/order"
           elementFormDefault="qualified">

    <xs:element name="RetailOrder" type="tns:RetailOrderType"/>

    <xs:complexType name="RetailOrderType">
        <xs:sequence>
            <xs:element name="orderName"    type="xs:string"/>
            <xs:element name="orderId"      type="xs:integer"/>
            <xs:element name="storeId"      type="xs:long"/>
            <xs:element name="orderDate"    type="xs:dateTime"/>
            <xs:element name="orderStatus"  type="xs:string"/>
            <xs:element name="customerInfo" type="tns:CustomerInfoType"/>
            <xs:element name="orderItems"   type="tns:OrderItemsType"/>
            <xs:element name="orderTotal"   type="xs:decimal"/>
        </xs:sequence>
    </xs:complexType>

    <xs:complexType name="CustomerInfoType">
        <xs:sequence>
            <xs:element name="customerId"    type="xs:integer"/>
            <xs:element name="customerName"  type="xs:string"/>
            <xs:element name="customerEmail" type="xs:string"/>
            <xs:element name="customerPhone" type="xs:string"/>
        </xs:sequence>
    </xs:complexType>

    <xs:complexType name="OrderItemsType">
        <xs:sequence>
            <xs:element name="item" type="tns:OrderItemType" maxOccurs="unbounded"/>
        </xs:sequence>
    </xs:complexType>

    <xs:complexType name="OrderItemType">
        <xs:sequence>
            <xs:element name="itemId"       type="xs:integer"/>
            <xs:element name="itemName"     type="xs:string"/>
            <xs:element name="quantity"     type="xs:integer"/>
            <xs:element name="unitPrice"    type="xs:decimal"/>
            <xs:element name="totalPrice"   type="xs:decimal"/>
        </xs:sequence>
    </xs:complexType>

</xs:schema>
```

---

## C. Process Architecture

### Prompt 4:
```
Can you create two processes, OrderProcess.bwp and ValidateOrder.bwp, in the package retail_order_logger ?
```

### Process Inventory

| Package Name | Process Name |
| :---- | :---- |
| `retail_order_logger` | `OrderProcess.bwp` |
| `retail_order_logger` | `ValidateOrder.bwp` |

---

## D. Process Implementation

### 1. OrderProcess.bwp

### Prompt 5:
```
In OrderProcess.bwp, can you add the activities Timer → Log → Mapper → Log1 → CallProcess → Log2 and link them in sequence, then configure:
- Log: Input message = $Timer/Time
- Mapper: use schema RetailOrderSchema.xsd, set orderName = $_processContext/ApplicationName and orderId = xsd:integer(bw:getModuleProperty("defaultOrderId"))
- Log1: Input message = $Mapper/tns:orderName
- CallProcess: call ValidateOrder.bwp
- Log2: Input message = bw:getModuleProperty("orderApiPassword")
```

**Activities:** `Timer` → `Log` → `Mapper` → `Log1` → `CallProcess` → `Log2`

Link all activities in sequence.

**Configurations:**

* **Log:**
  * Configure node:
    * **Input > ActivityInput > message:** `$Timer/Time`

* **Mapper:**
  * Configure schema: `RetailOrderSchema.xsd`
  * After schema configuration, configure nodes:
    * **orderName:** `$_processContext/ApplicationName`
    * **orderId:** `xsd:integer(bw:getModuleProperty("defaultOrderId"))`

* **Log1:**
  * Configure node:
    * **Input > ActivityInput > message:** `$Mapper/tns:orderName`

* **CallProcess:**
  * Configure attribute:
    * **Process Name:** `ValidateOrder.bwp`

* **Log2:**
  * Configure node:
    * **Input > ActivityInput > message:** `bw:getModuleProperty("orderApiPassword")`

---

### 2. ValidateOrder.bwp

### Prompt 6:
```
In ValidateOrder.bwp, can you add the activities Start → Log → Log1 → End and link them in sequence, then configure:
- Log: Input message = bw:getModuleProperty("BW.PROCESS.NAME")
- Log1: Input message = bw:getModuleProperty("/retailGroup/storeName")
```

**Activities:** `Start` → `Log` → `Log1` → `End`

Link all activities in sequence.

**Configurations:**

* **Log:**
  * Configure node:
    * **Input > ActivityInput > message:** `bw:getModuleProperty("BW.PROCESS.NAME")`

* **Log1:**
  * Configure node:
    * **Input > ActivityInput > message:** `bw:getModuleProperty("/retailGroup/storeName")`
