# Tibco BusinessWorks Design Assistant Prompt Library

The **BusinessWorks Design Assistant Prompt Library** helps users quickly onboard the BusinessWorks Design Assistant by providing a curated collection of expertly crafted prompts for common integration development scenarios built on TIBCO ActiveMatrix BusinessWorks™ 6.x.

Instead of starting from a blank prompt, users can leverage ready-to-use templates designed for integration development activities such as application design, process and subprocess orchestration, database interactions, JMS messaging, REST and SOAP service development, file processing, and module property configuration.

---

## What the Prompt Library Enables

| Benefit | Description |
| :---- | :---- |
| **Get started faster** | Proven prompts tailored for real-world integration scenarios on BW6 |
| **Reduce the learning curve** | Guided examples of effective interactions with the Design Assistant, grounded in practical integration use cases |
| **Improve prompt quality** | Structured, domain-specific templates built around common integration patterns such as database queries and updates, message queue processing, and service invocation |
| **Promote consistency across teams** | Standardized approach for developers, architects, and support engineers to describe and implement integration patterns across projects |
| **Increase productivity** | Eliminates the need to repeatedly craft prompts for common tasks such as JDBC queries, JMS queue processing, REST API configuration, and SOAP service generation |
| **Reduce configuration errors** | Incorporates lessons learned from real prompt iterations, including known BW6 constraints around project naming conventions, SOAP activity generation, shared resource configuration, and error handling patterns |

---

## Who Is This For?

Whether you are a new BusinessWorks developer building your first integration or an experienced integration architect designing enterprise-grade systems, the BusinessWorks Integration Prompt Library serves as a practical starting point to maximize the value of the BusinessWorks Design Assistant and achieve faster, more accurate outcomes across your integration projects.

---

## Prompt categories

| Category | Prompt |
|---|---|
| Basic | [Basic Retail Order Logger](basic_retail_order_logger.md) |
| JDBC | [Retail Inventory JDBC Processing Example](jdbc_retail_inventory_db.md) |
| JMS | [Retail Order Queue](jms_retail_order_queue.md) |
| REST | [Retail Product Service](rest_retail_product_service.md) |
| File | [Retail Daily Sales File](file_retail_sales_file.md) |
| SubProcess | [Retail Returns Subprocess](subprocess_retail_returns.md) |
| SOAP | [Retail Loyalty Service](soap_retail_loyalty_service.md) |

## How to use

Open a prompt, copy the full text block, and paste it into your AI assistant.

## Notes

These prompts are designed to help generate BW6 application guidance. Review all generated implementation details in TIBCO Business Studio for BusinessWorks before using them in a real project.
- All prompts are designed for **TIBCO BusinessWorks 6.x**
- Examples follow BW6 development terminology and structure
- Prompts are implementation-focused and reusable

---

# Repository Structure

```text
docs/
├── index.md
├── prompt_library.md
├── REST-Retail_Product_Service.md
├── SOAP-Retail_Loyalty_Service.md
├── JMS-Retail_Order_Queue.md
├── JDBC-Retail_inventory_DB.md
├── File-Retail_Sales_File.md
└── SubProcess-Retail_Returns.md
```

---

# Example Use Cases

You can use these prompts to:
- Generate BW6 project structures
- Create process implementations
- Build REST and SOAP services
- Configure JMS and JDBC resources
- Create subprocess orchestration
- Standardize BW6 development practices

---

# Maintainer

TIBCO BW6 Design Assistant Prompt Library

---
