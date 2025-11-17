-- Inventory Management System Database Schema

-- Create database
CREATE DATABASE IF NOT EXISTS inventory_management;
USE inventory_management;

-- Create products table
CREATE TABLE products (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    sku VARCHAR(100) NOT NULL UNIQUE,
    category VARCHAR(100) NOT NULL,
    quantity INT NOT NULL DEFAULT 0,
    price DECIMAL(12,2) NOT NULL,
    supplier VARCHAR(255) NOT NULL,
    barcode VARCHAR(100) UNIQUE,
    min_stock_level INT NOT NULL DEFAULT 10,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_category (category),
    INDEX idx_supplier (supplier),
    INDEX idx_sku (sku),
    INDEX idx_barcode (barcode),
    INDEX idx_low_stock (quantity, min_stock_level)
);

-- Insert sample data
INSERT INTO products (name, sku, category, quantity, price, supplier, barcode, min_stock_level) VALUES
('Laptop HP EliteBook', 'HP-EB-001', 'Electronics', 25, 899.99, 'HP Inc.', '1234567890123', 10),
('Wireless Mouse Logitech', 'LG-WM-002', 'Accessories', 5, 29.99, 'Logitech', '2345678901234', 20),
('Office Chair Ergonomic', 'OC-ERG-003', 'Furniture', 15, 199.99, 'Office Supplies Co.', '3456789012345', 8),
('Dell Monitor 24 inch', 'DL-MON-004', 'Electronics', 12, 249.99, 'Dell Technologies', '4567890123456', 5),
('Keyboard Mechanical', 'KB-MECH-005', 'Accessories', 30, 79.99, 'Corsair', '5678901234567', 15),
('Printer Laser HP', 'HP-PR-006', 'Electronics', 8, 299.99, 'HP Inc.', '6789012345678', 5);

-- Create indexes for better performance
CREATE INDEX idx_name_search ON products(name);
CREATE INDEX idx_created_at ON products(created_at);
CREATE INDEX idx_updated_at ON products(updated_at);

-- Create view for low stock products
CREATE VIEW low_stock_products AS
SELECT * FROM products 
WHERE quantity <= min_stock_level;

-- Create view for inventory value summary
CREATE VIEW inventory_value_summary AS
SELECT 
    category,
    COUNT(*) as product_count,
    SUM(quantity) as total_quantity,
    SUM(quantity * price) as total_value,
    AVG(price) as average_price
FROM products 
GROUP BY category;

-- Create stored procedure for updating stock
DELIMITER //
CREATE PROCEDURE UpdateStock(
    IN product_id BIGINT,
    IN new_quantity INT
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;
    
    START TRANSACTION;
    
    UPDATE products 
    SET quantity = new_quantity, 
        updated_at = CURRENT_TIMESTAMP 
    WHERE id = product_id;
    
    COMMIT;
END //
DELIMITER ;