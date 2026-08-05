# Retail_Order_Queue

**Target Runtime:** TIBCO ActiveMatrix BusinessWorks™ 6.x

**Description:** A retail order processing application that receives incoming orders from a JMS queue, logs order details to a file, and replies with a confirmation message.

---

## 1. Project Hierarchy

| Component Type | Name |
| :---- | :---- |
| **Application Module** | `Retail_Order_Queue` |
| **Application Project** | `Retail_Order_Queue.application` |

### Prompt 1:
```
Can you create an application called Retail_Order_Queue ?
```


---

## 2. Module Properties Configuration

### Prompt 2:
```
Can you add the following module properties (both String): QUEUE_NAME = retail.orders.queue, OUTPUT_FILE = C:\tmp\RetailOrders\orders.log ?
```

Create and Configure the following module properties:

| Property Name | Data Type | Value |
| :---- | :---- | :---- |
| QUEUE\_NAME | String | retail.orders.queue |
| OUTPUT\_FILE | String | C:\tmp\RetailOrders\orders.log |

---

## 3. Shared Resources

### Prompt 3:
```
Can you create the following shared resources:
- A JNDI configuration called EMSConfig (retail.jms.EMSConfig) with Provider = TIBCO EMS, Initial Context Factory = com.tibco.tibjms.naming.TibjmsInitialContextFactory, Provider URL = tibjmsnaming://localhost:7222
- A JMS connection called RetailJMSConnection (Retail_Order_Queue.RetailJMSConnection) with Messaging Style = Queue and JNDI Configuration = retail.jms.EMSConfig
```

### JNDI Configuration

**Name:** EMSConfig

* **Configure attributes in shared resource `retail.jms.EMSConfig`**
  * "Provider" with value `TIBCO EMS`
  * "Initial Context Factory" with value `com.tibco.tibjms.naming.TibjmsInitialContextFactory`
  * "Provider URL" with value `tibjmsnaming://localhost:7222`

### JMS Connection

**Name:** RetailJMSConnection

* **Configure attributes in shared resource `Retail_Order_Queue.RetailJMSConnection`**
  * "Messaging Style" with value `Queue`
  * "JNDI Configuration" with value `retail.jms.EMSConfig`

---

## 4. Process Logic

### Prompt 4:
```
In the process ReceiveRetailOrder.bwp, can you add the activities JMS Receive Message → Log → Write File → Reply to JMS Message and link them in sequence, then configure:
- JMS Receive Message: JMS Connection = Retail_Order_Queue.RetailJMSConnection, Messaging Style = Queue, Destination = module property QUEUE_NAME
- Log: message = concat("Retail order received: ", $JMSReceiveMessage/Body)
- Write File: FileName = module property OUTPUT_FILE, Append = true, Create Non Existing Directories = true
- Reply to JMS Message: Body = "Retail order processed successfully"
```

**Process Name: ReceiveRetailOrder.bwp**

### Create below activities in sequence & link them

`JMS Receive Message` → `Log` → `Write File` → `Reply to JMS Message` and all should be linked with each other.

### Activity Configurations as below

#### Activity 1: JMS Receive Message (Starter)

* **Configure attribute**
  * "JMS Connection" with `Retail_Order_Queue.RetailJMSConnection`
  * "Messaging Style" with value `Queue`
  * "Destination" with module property `QUEUE_NAME`

#### Activity 2: Log

* **Configure node**
  * `message` ➔ `concat("Retail order received: ", $JMSReceiveMessage/Body)`

#### Activity 3: Write File

* **Configure attribute**
  * `FileName` with module property `OUTPUT_FILE`
  * `Append` with value `true`
  * `Create Non Existing Directories` with value `true`

#### Activity 4: Reply to JMS Message

* **Configure node**
  * `Body` ➔ `"Retail order processed successfully"`
