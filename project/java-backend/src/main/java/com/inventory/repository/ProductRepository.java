package com.inventory.repository;

import com.inventory.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    
    // Find by SKU
    Optional<Product> findBySku(String sku);
    
    // Find by barcode
    Optional<Product> findByBarcode(String barcode);
    
    // Find by category
    List<Product> findByCategory(String category);
    
    // Find by supplier
    List<Product> findBySupplier(String supplier);
    
    // Find products with low stock
    @Query("SELECT p FROM Product p WHERE p.quantity <= p.minStockLevel")
    List<Product> findLowStockProducts();
    
    // Find out of stock products
    @Query("SELECT p FROM Product p WHERE p.quantity = 0")
    List<Product> findOutOfStockProducts();
    
    // Search products by name or SKU
    @Query("SELECT p FROM Product p WHERE LOWER(p.name) LIKE LOWER(CONCAT('%', :searchTerm, '%')) " +
           "OR LOWER(p.sku) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    List<Product> searchProducts(@Param("searchTerm") String searchTerm);
    
    // Find products by price range
    @Query("SELECT p FROM Product p WHERE p.price BETWEEN :minPrice AND :maxPrice")
    List<Product> findByPriceRange(@Param("minPrice") java.math.BigDecimal minPrice, 
                                   @Param("maxPrice") java.math.BigDecimal maxPrice);
    
    // Get total inventory value
    @Query("SELECT COALESCE(SUM(p.quantity * p.price), 0) FROM Product p")
    java.math.BigDecimal getTotalInventoryValue();
    
    // Get category summary
    @Query("SELECT p.category, COUNT(p), SUM(p.quantity) FROM Product p GROUP BY p.category")
    List<Object[]> getCategorySummary();
    
    // Get supplier summary
    @Query("SELECT p.supplier, COUNT(p) FROM Product p GROUP BY p.supplier")
    List<Object[]> getSupplierSummary();
    
    // Check if SKU exists (excluding current product ID for updates)
    @Query("SELECT COUNT(p) > 0 FROM Product p WHERE p.sku = :sku AND p.id != :id")
    boolean existsBySkuAndIdNot(@Param("sku") String sku, @Param("id") Long id);
    
    // Check if barcode exists (excluding current product ID for updates)
    @Query("SELECT COUNT(p) > 0 FROM Product p WHERE p.barcode = :barcode AND p.id != :id")
    boolean existsByBarcodeAndIdNot(@Param("barcode") String barcode, @Param("id") Long id);
}