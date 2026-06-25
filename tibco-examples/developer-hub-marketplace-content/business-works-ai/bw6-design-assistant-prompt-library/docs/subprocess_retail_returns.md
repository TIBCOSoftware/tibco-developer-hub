# retail.bw.sample.palette.subprocess.RetailReturnProcess

**Target Runtime:** TIBCO ActiveMatrix BusinessWorks™ 6.x

**Description:** A retail return processing application that initiates a return request, delegates validation to a subprocess, maps return details, and logs the outcome.

---

## 1. Project Hierarchy

| Component Type | Name |
| :---- | :---- |
| **Application Module** | `retail.bw.sample.palette.subprocess.RetailReturnProcess` |
| **Application Project** | `retail.bw.sample.palette.subprocess.RetailReturnProcess.application` |

### Prompt 1:
```
Can you create an application called retail.bw.sample.palette.subprocess.RetailReturnProcess ?
```


---

## 2. Process Architecture

### Prompt 2:
```
Can you create two processes, ReturnMainProcess.bwp and ValidateReturn.bwp, in the package retailreturnprocess ?
```

### Process Inventory

| Package Name | Process Name |
| :---- | :---- |
| `retailreturnprocess` | `ReturnMainProcess.bwp` |
| `retailreturnprocess` | `ValidateReturn.bwp` |

---

## 3. Process Logic

### 1. ReturnMainProcess.bwp

### Prompt 3:
```
In ReturnMainProcess.bwp, can you add the activities Timer → Log → CallProcess → Log1 and link them in sequence, then configure:
- Timer: Interval = 60 seconds
- Log: message = "Retail return initiated"
- CallProcess: Process Name = ValidateReturn.bwp
- Log1: message = "Retail return completed"
```

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

### Prompt 4:
```
In ValidateReturn.bwp, can you add the activities Start → Mapper → Log → End and link them in sequence, then configure:
- Mapper: customerId = "CUST1001", returnStatus = "Approved"
- Log: message = $Mapper/returnStatus
```

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
