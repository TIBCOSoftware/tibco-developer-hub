INSERT INTO SmartRouting.Documents (DocumentType, SystemName, Endpoint, Enabled, JoltSpecification, Timeout, Retry)
VALUES 
('PurchaseOrder', 'SAP', '/posts', '1', '[{"operation": "shift","spec": {"orderNumber": "title","item": {"0": {"code": "body","shipTo": {"name": "userId"}}}}}]', 5, 5),
('PurchaseOrder', 'DummySystem', '/erp/po', '1', '[{"operation": "shift","spec": {"orderNumber": "title","item": {"0": {"code": "body","shipTo": {"name": "userId"}}}}}]',1,1),
('Delivery', 'DummySystem', '/delivery/v1', '0', '[{"operation": "shift","spec": {"orderNumber": "title","item": {"0": {"code": "body","shipTo": {"name": "userId"}}}}}]',3,3);




INSERT INTO SmartRouting.SourceSystem (DocumentType, SystemName, JoltSpecification, Enabled)
VALUES 
('PurchaseOrder', 'SourceA', '[{"operation": "shift","spec": {"orderid": "orderNumber","line": {"*": {"itemCode": "item[&1].code","QUANTITY": "item[&1].quantity","customerName": "item[&1].shipTo.name","customerStreet": "item[&1].shipTo.street"}}}}]', 1),
('PurchaseOrder', 'SourceB', NULL,0)


INSERT INTO SmartRouting.SystemInfo (SystemName,Protocol, Hostname, Port, Username, Password, Timeout, Retry)
VALUES
('SAP', 'HTTPS', 'jsonplaceholder.typicode.com', '443', NULL, NULL, 30, 5),
('DummySystem', 'HTTP', 'dummyhostname.com', '1443', 'userA', 'pass', 10, 2);