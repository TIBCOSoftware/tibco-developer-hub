# retail.bw.jdbc.InventoryUpdate

**Target Runtime:** TIBCO ActiveMatrix BusinessWorks™ 6.x

**Description:** A scheduled retail inventory management process that retrieves product details from a retail database, updates inventory stock levels, and logs processing results to a file.

---

## 1. Project Hierarchy

| Component Type | Name |
| :---- | :---- |
| **Application Module** | `retail.bw.jdbc.InventoryUpdate` |
| **Application Project** | `retail.bw.jdbc.InventoryUpdate.application` |

---

## 2. Module Properties Configuration

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

Create and Configure the following process properties for `Process.bwp`:

| Property Name | Data Type | Value |
| :---- | :---- | :---- |
| OUTPUT\_FILE | String | OUTPUT\_FILE |
| product\_id | Integer | PRODUCT\_ID |

---

## 4. Shared Resources

**Name:** RetailDBConnection

* **Configure attributes in shared resource `retail.bw.jdbc.InventoryUpdate.RetailDBConnection`**
  * Username with module property `USERNAME`
  * Password with module property `jdbc_PASSWORD`
  * "Database Driver" with module property `JDBC_DRIVER`
  * "Database URL" with module property `JDBC_URL`

---

## 5. Process Logic

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
