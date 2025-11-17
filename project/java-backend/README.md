# Inventory Management System - Java Backend

This is the complete Java Spring Boot backend for the Inventory Management System. Since WebContainer doesn't support Java runtime, you'll need to run this locally.

## Prerequisites

- Java 17 or higher
- Maven 3.6+
- MySQL 8.0+

## Setup Instructions

1. **Database Setup:**
   ```sql
   CREATE DATABASE inventory_management;
   CREATE USER 'inventory_user'@'localhost' IDENTIFIED BY 'inventory_password';
   GRANT ALL PRIVILEGES ON inventory_management.* TO 'inventory_user'@'localhost';
   FLUSH PRIVILEGES;
   ```

2. **Configure Database Connection:**
   Update `src/main/resources/application.properties` with your database credentials.

3. **Run the Application:**
   ```bash
   cd java-backend
   mvn clean install
   mvn spring-boot:run
   ```

4. **Update Frontend Configuration:**
   In your React app, update the API base URL to point to `http://localhost:8080`

The backend will be available at `http://localhost:8080` and provides REST APIs for all CRUD operations.

## API Endpoints

- GET /api/products - Get all products
- GET /api/products/{id} - Get product by ID
- POST /api/products - Create new product
- PUT /api/products/{id} - Update product
- DELETE /api/products/{id} - Delete product
- GET /api/products/barcode/{barcode} - Search by barcode
- GET /api/products/low-stock - Get low stock products

## Features Included

- Complete CRUD operations for products
- Barcode scanning support
- Low stock alerts
- Category and supplier management
- Real-time inventory tracking
- Comprehensive validation
- Error handling
- CORS configuration for frontend integration