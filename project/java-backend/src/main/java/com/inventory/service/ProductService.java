package com.inventory.service;

import com.inventory.model.Product;
import com.inventory.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class ProductService {
    
    @Autowired
    private ProductRepository productRepository;
    
    // Get all products
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }
    
    // Get product by ID
    public Optional<Product> getProductById(Long id) {
        return productRepository.findById(id);
    }
    
    // Get product by SKU
    public Optional<Product> getProductBySku(String sku) {
        return productRepository.findBySku(sku);
    }
    
    // Get product by barcode
    public Optional<Product> getProductByBarcode(String barcode) {
        return productRepository.findByBarcode(barcode);
    }
    
    // Create new product
    public Product createProduct(Product product) {
        // Validate SKU uniqueness
        if (productRepository.findBySku(product.getSku()).isPresent()) {
            throw new RuntimeException("Product with SKU '" + product.getSku() + "' already exists");
        }
        
        // Validate barcode uniqueness if provided
        if (product.getBarcode() != null && !product.getBarcode().isEmpty()) {
            if (productRepository.findByBarcode(product.getBarcode()).isPresent()) {
                throw new RuntimeException("Product with barcode '" + product.getBarcode() + "' already exists");
            }
        }
        
        return productRepository.save(product);
    }
    
    // Update existing product
    public Product updateProduct(Long id, Product productDetails) {
        Optional<Product> optionalProduct = productRepository.findById(id);
        if (!optionalProduct.isPresent()) {
            throw new RuntimeException("Product not found with ID: " + id);
        }
        
        Product existingProduct = optionalProduct.get();
        
        // Validate SKU uniqueness
        if (productRepository.existsBySkuAndIdNot(productDetails.getSku(), id)) {
            throw new RuntimeException("Product with SKU '" + productDetails.getSku() + "' already exists");
        }
        
        // Validate barcode uniqueness if provided
        if (productDetails.getBarcode() != null && !productDetails.getBarcode().isEmpty()) {
            if (productRepository.existsByBarcodeAndIdNot(productDetails.getBarcode(), id)) {
                throw new RuntimeException("Product with barcode '" + productDetails.getBarcode() + "' already exists");
            }
        }
        
        // Update fields
        existingProduct.setName(productDetails.getName());
        existingProduct.setSku(productDetails.getSku());
        existingProduct.setCategory(productDetails.getCategory());
        existingProduct.setQuantity(productDetails.getQuantity());
        existingProduct.setPrice(productDetails.getPrice());
        existingProduct.setSupplier(productDetails.getSupplier());
        existingProduct.setBarcode(productDetails.getBarcode());
        existingProduct.setMinStockLevel(productDetails.getMinStockLevel());
        
        return productRepository.save(existingProduct);
    }
    
    // Delete product
    public void deleteProduct(Long id) {
        if (!productRepository.existsById(id)) {
            throw new RuntimeException("Product not found with ID: " + id);
        }
        productRepository.deleteById(id);
    }
    
    // Update stock quantity
    public Product updateStock(Long id, Integer newQuantity) {
        Optional<Product> optionalProduct = productRepository.findById(id);
        if (!optionalProduct.isPresent()) {
            throw new RuntimeException("Product not found with ID: " + id);
        }
        
        Product product = optionalProduct.get();
        product.setQuantity(newQuantity);
        return productRepository.save(product);
    }
    
    // Search products
    public List<Product> searchProducts(String searchTerm) {
        return productRepository.searchProducts(searchTerm);
    }
    
    // Get products by category
    public List<Product> getProductsByCategory(String category) {
        return productRepository.findByCategory(category);
    }
    
    // Get products by supplier
    public List<Product> getProductsBySupplier(String supplier) {
        return productRepository.findBySupplier(supplier);
    }
    
    // Get low stock products
    public List<Product> getLowStockProducts() {
        return productRepository.findLowStockProducts();
    }
    
    // Get out of stock products
    public List<Product> getOutOfStockProducts() {
        return productRepository.findOutOfStockProducts();
    }
    
    // Get products by price range
    public List<Product> getProductsByPriceRange(BigDecimal minPrice, BigDecimal maxPrice) {
        return productRepository.findByPriceRange(minPrice, maxPrice);
    }
    
    // Get total inventory value
    public BigDecimal getTotalInventoryValue() {
        return productRepository.getTotalInventoryValue();
    }
    
    // Get inventory statistics
    public InventoryStats getInventoryStats() {
        List<Product> allProducts = productRepository.findAll();
        List<Product> lowStockProducts = productRepository.findLowStockProducts();
        List<Product> outOfStockProducts = productRepository.findOutOfStockProducts();
        BigDecimal totalValue = productRepository.getTotalInventoryValue();
        
        return new InventoryStats(
            allProducts.size(),
            lowStockProducts.size(),
            outOfStockProducts.size(),
            totalValue,
            allProducts.stream().mapToInt(Product::getQuantity).sum()
        );
    }
    
    // Inner class for inventory statistics
    public static class InventoryStats {
        private final int totalProducts;
        private final int lowStockProducts;
        private final int outOfStockProducts;
        private final BigDecimal totalValue;
        private final int totalQuantity;
        
        public InventoryStats(int totalProducts, int lowStockProducts, int outOfStockProducts, 
                              BigDecimal totalValue, int totalQuantity) {
            this.totalProducts = totalProducts;
            this.lowStockProducts = lowStockProducts;
            this.outOfStockProducts = outOfStockProducts;
            this.totalValue = totalValue;
            this.totalQuantity = totalQuantity;
        }
        
        // Getters
        public int getTotalProducts() { return totalProducts; }
        public int getLowStockProducts() { return lowStockProducts; }
        public int getOutOfStockProducts() { return outOfStockProducts; }
        public BigDecimal getTotalValue() { return totalValue; }
        public int getTotalQuantity() { return totalQuantity; }
    }
}