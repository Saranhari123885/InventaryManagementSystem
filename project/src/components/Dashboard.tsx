import React, { useState, useEffect } from 'react';
import { Package, Plus, Search, BarChart3, AlertTriangle, Truck } from 'lucide-react';
import ProductList from './ProductList';
import AddProduct from './AddProduct';
import BarcodeScanner from './BarcodeScanner';
import Analytics from './Analytics';

interface Product {
  id: number;
  name: string;
  sku: string;
  category: string;
  quantity: number;
  price: number;
  supplier: string;
  barcode: string;
  minStockLevel: number;
  createdAt: string;
  updatedAt: string;
}

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data - In real app, this would come from your Java backend
  useEffect(() => {
    const mockProducts: Product[] = [
      {
        id: 1,
        name: 'Laptop HP EliteBook',
        sku: 'HP-EB-001',
        category: 'Electronics',
        quantity: 25,
        price: 899.99,
        supplier: 'HP Inc.',
        barcode: '1234567890123',
        minStockLevel: 10,
        createdAt: '2025-01-01',
        updatedAt: '2025-01-15'
      },
      {
        id: 2,
        name: 'Wireless Mouse Logitech',
        sku: 'LG-WM-002',
        category: 'Accessories',
        quantity: 5,
        price: 29.99,
        supplier: 'Logitech',
        barcode: '2345678901234',
        minStockLevel: 20,
        createdAt: '2025-01-02',
        updatedAt: '2025-01-14'
      },
      {
        id: 3,
        name: 'Office Chair Ergonomic',
        sku: 'OC-ERG-003',
        category: 'Furniture',
        quantity: 15,
        price: 199.99,
        supplier: 'Office Supplies Co.',
        barcode: '3456789012345',
        minStockLevel: 8,
        createdAt: '2025-01-03',
        updatedAt: '2025-01-13'
      }
    ];
    setProducts(mockProducts);
  }, []);

  const lowStockItems = products.filter(p => p.quantity <= p.minStockLevel);
  const totalValue = products.reduce((sum, p) => sum + (p.quantity * p.price), 0);

  const stats = [
    { title: 'Total Products', value: products.length, icon: Package, color: 'bg-blue-500' },
    { title: 'Low Stock Items', value: lowStockItems.length, icon: AlertTriangle, color: 'bg-amber-500' },
    { title: 'Total Inventory Value', value: `$${totalValue.toLocaleString()}`, icon: BarChart3, color: 'bg-green-500' },
    { title: 'Suppliers', value: new Set(products.map(p => p.supplier)).size, icon: Truck, color: 'bg-purple-500' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Package className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">Inventory Management</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search products..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center">
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-sm border mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6" aria-label="Tabs">
              {[
                { id: 'products', name: 'Products', icon: Package },
                { id: 'add', name: 'Add Product', icon: Plus },
                { id: 'scanner', name: 'Barcode Scanner', icon: Search },
                { id: 'analytics', name: 'Analytics', icon: BarChart3 }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors`}
                >
                  <tab.icon className="h-5 w-5" />
                  <span>{tab.name}</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'products' && <ProductList products={products} setProducts={setProducts} searchTerm={searchTerm} />}
            {activeTab === 'add' && <AddProduct products={products} setProducts={setProducts} />}
            {activeTab === 'scanner' && <BarcodeScanner products={products} />}
            {activeTab === 'analytics' && <Analytics products={products} />}
          </div>
        </div>

        {/* Low Stock Alert */}
        {lowStockItems.length > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex">
              <AlertTriangle className="h-5 w-5 text-amber-400" />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-amber-800">Low Stock Alert</h3>
                <div className="mt-2 text-sm text-amber-700">
                  <p>{lowStockItems.length} items are running low on stock:</p>
                  <ul className="mt-1 list-disc list-inside">
                    {lowStockItems.slice(0, 3).map(item => (
                      <li key={item.id}>{item.name} - Only {item.quantity} left</li>
                    ))}
                    {lowStockItems.length > 3 && <li>...and {lowStockItems.length - 3} more</li>}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;