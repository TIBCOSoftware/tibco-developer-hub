# retail.bw.jdbc.InventoryUpdate

**Target Runtime:** TIBCO ActiveMatrix BusinessWorks™ 6.x

**Description:** A scheduled retail inventory management process that retrieves product details from a retail database, updates inventory stock levels, and logs processing results to a file.

---

## 1. Project Hierarchy

| Component Type | Name |
| :---- | :---- |
| **Application Module** | `retail.bw.jdbc.InventoryUpdate` |
| **Application Project** | `retail.bw.jdbc.InventoryUpdate.application` |

### Prompt 1:
```
Can you create an application called retail.bw.jdbc.InventoryUpdate ?
```


---

## 2. Module Properties Configuration

### Prompt 2:
```
Can you add the following module properties: USERNAME (String) = retail_user, jdbc_PASSWORD (Password) = Retail@123, JDBC_URL (String) = jdbc:postgresql://localhost:5432/retaildb, JDBCConnectionResource (jdbc) = retailapp.RetailDBConnection, JDBC_DRIVER (String) = org.postgresql.Driver, PRODUCT_ID (Integer) = 501, OUTPUT_FILE (String) = c:/tmp/RetailInventory/inventory_update.log ?
```

Create and Configure the following module properties:

| Property Name | Data Type | Value |
| :---- | :---- | :---- |
| USERNAME | String | retail\_user |
| jdbc\_PASSWORD | Password | Retail@123 |
| JDBC\_URL | String | jdbc:postgresql://localhost:5432/retaildb |
| JDBCConnectionResource | jdbc | retailapp.RetailDBConnection |
| JDBC\_DRIVER | String | org.postgresql.Driver |
| PRODUCT\_ID | Integer | 501 |
| OUTPUT\_FILE | String | c:/tmp/RetailInventory/inventory\_update.log |

---

## 3. Process Properties Configuration

### Prompt 3:
```
For the process Process.bwp, can you add the following process properties, each defaulting to the module property of the matching name: OUTPUT_FILE (String) = OUTPUT_FILE, product_id (Integer) = PRODUCT_ID ?
```

Create and Configure the following process properties for `Process.bwp`:

| Property Name | Data Type | Value |
| :---- | :---- | :---- |
| OUTPUT\_FILE | String | OUTPUT\_FILE |
| product\_id | Integer | PRODUCT\_ID |

---

## 4. Shared Resources

### Prompt 4:
```
Can you create a JDBC shared resource called RetailDBConnection (retail.bw.jdbc.InventoryUpdate.RetailDBConnection) with Username = module property USERNAME, Password = module property jdbc_PASSWORD, Database Driver = module property JDBC_DRIVER and Database URL = module property JDBC_URL ?
```

**Name:** RetailDBConnection

* **Configure attributes in shared resource `retail.bw.jdbc.InventoryUpdate.RetailDBConnection`**
  * Username with module property `USERNAME`
  * Password with module property `jdbc_PASSWORD`
  * "Database Driver" with module property `JDBC_DRIVER`
  * "Database URL" with module property `JDBC_URL`

---

## 5. Process Logic

### Prompt 5:
```
In the process Process.bwp, can you add the activities Timer → JDBC Query → JDBC Update → Write File → Log and link them in sequence, then configure:
- JDBC Query: JDBC Shared Resource = retail.bw.jdbc.InventoryUpdate.RetailDBConnection, SQL = "SELECT PRODUCT_ID, PRODUCT_NAME, STOCK_QUANTITY FROM PRODUCT_TABLE WHERE PRODUCT_ID = ?", add parameter product_id (INTEGER), set product_id = $product_id
- JDBC Update: SQL = "UPDATE PRODUCT_TABLE SET STOCK_QUANTITY = STOCK_QUANTITY - 1 WHERE PRODUCT_ID = ?", add parameter product_id (INTEGER), set jdbcUpdateActivityInput = $JDBCQuery/Record[1]
- Write File: FileName = module property OUTPUT_FILE, textContent = concat("inventory records updated: ", string($JDBCUpdate/noOfUpdates))
- Log: message = concat("Retail Inventory Process Complete: Updated stock for ", xsd:string($JDBCQuery/Record[1]/PRODUCT_NAME))
```

**Process Name: Process.bwp**

### Create below activities in sequence & link them

`Timer` → `JDBC Query` → `JDBC Update` → `Write File` → `Log` and all should be linked with each other.

### Activity Configurations as below

#### Activity 1: Timer (Starter)

#### Activity 2: JDBC Query

* **Configure attribute**
  * "JDBC Shared Resource" with `retail.bw.jdbc.InventoryUpdate.RetailDBConnection`
* **SQL Statement**
  * `SELECT PRODUCT_ID, PRODUCT_NAME, STOCK_QUANTITY FROM PRODUCT_TABLE WHERE PRODUCT_ID = ?`
* **Add parameter**
  * `product_id` with datatype `INTEGER`
* **Configure node**
  * `product_id` ➔ `$product_id` (Note: Ensure `$product_id` is defined as a process variable)

#### Activity 3: JDBC Update

* **SQL Statement**
  * `UPDATE PRODUCT_TABLE SET STOCK_QUANTITY = STOCK_QUANTITY - 1 WHERE PRODUCT_ID = ?`
* **Add parameter**
  * `product_id` with datatype `INTEGER`
* **Configure node**
  * `jdbcUpdateActivityInput` ➔ `$JDBCQuery/Record[1]`

#### Activity 4: Write File

* **Configure attribute**
  * `FileName` with module property `OUTPUT_FILE`
* **Configure node**
  * `textContent` ➔ `concat("inventory records updated: ", string($JDBCUpdate/noOfUpdates))`

#### Activity 5: Log

* **Configure node**
  * `message` ➔ `concat("Retail Inventory Process Complete: Updated stock for ", xsd:string($JDBCQuery/Record[1]/PRODUCT_NAME))`
