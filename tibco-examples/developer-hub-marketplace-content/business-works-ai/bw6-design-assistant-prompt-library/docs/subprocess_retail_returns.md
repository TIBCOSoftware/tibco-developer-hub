# retail.bw.sample.palette.subprocess.RetailReturnProcess

**Target Runtime:** TIBCO ActiveMatrix BusinessWorks™ 6.x

**Description:** A retail return processing application that initiates a return request, delegates validation to a subprocess, maps return details, and logs the outcome.

---

## 1. Project Hierarchy

| Component Type | Name |
| :---- | :---- |
| **Application Module** | `retail.bw.sample.palette.subprocess.RetailReturnProcess` |
| **Application Project** | `retail.bw.sample.palette.subprocess.RetailReturnProcess.application` |

---

## 2. Process Architecture

### Process Inventory

| Package Name | Process Name |
| :---- | :---- |
| `retailreturnprocess` | `ReturnMainProcess.bwp` |
| `retailreturnprocess` | `ValidateReturn.bwp` |

---

## 3. Process Logic

### 1. ReturnMainProcess.bwp

#### Create below activities in sequence & link them

`Timer` → `Log` → `CallProcess` → `Log1` and all should be linked with each other.

#### Activity Configurations as below

##### Activity 1: Timer (Starter)

* **Configure attribute**
  * `Interval` with value `60` (seconds)

##### Activity 2: Log

* **Configure node**
  * `message` ➔ `"Retail return initiated"`

##### Activity 3: CallProcess

* **Configure attribute**
  * "Process Name" with value `ValidateReturn.bwp`

##### Activity 4: Log1

* **Configure node**
  * `message` ➔ `"Retail return completed"`

---

### 2. ValidateReturn.bwp

#### Create below activities in sequence & link them

`Start` → `Mapper` → `Log` → `End` and all should be linked with each other.

#### Activity Configurations as below

##### Activity 1: Start

##### Activity 2: Mapper

* **Configure nodes:**
  * `customerId` ➔ `"CUST1001"` (Note: Ensure `$customerId` is defined as a process variable)
  * `returnStatus` ➔ `"Approved"` (Note: Ensure `$returnStatus` is defined as a process variable)

##### Activity 3: Log

* **Configure node**
  * `message` ➔ `$Mapper/returnStatus`

##### Activity 4: End
