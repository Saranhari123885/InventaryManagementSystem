import React from 'react';
import { TrendingUp, Package, AlertTriangle, DollarSign } from 'lucide-react';

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

interface AnalyticsProps {
  products: Product[];
}

const Analytics: React.FC<AnalyticsProps> = ({ products }) => {
  // Calculate analytics data
  const totalProducts = products.length;
  const totalValue = products.reduce((sum, p) => sum + (p.quantity * p.price), 0);
  const lowStockItems = products.filter(p => p.quantity <= p.minStockLevel);
  const outOfStockItems = products.filter(p => p.quantity === 0);
  
  // Category breakdown
  const categoryBreakdown = products.reduce((acc, product) => {
    acc[product.category] = (acc[product.category] || 0) + product.quantity;
    return acc;
  }, {} as Record<string, number>);

  // Supplier breakdown
  const supplierBreakdown = products.reduce((acc, product) => {
    acc[product.supplier] = (acc[product.supplier] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Top value products
  const topValueProducts = [...products]
    .sort((a, b) => (b.quantity * b.price) - (a.quantity * a.price))
    .slice(0, 5);

  const analyticsCards = [
    {
      title: 'Total Products',
      value: totalProducts.toString(),
      change: '+12%',
      trend: 'up',
      icon: Package,
      color: 'bg-blue-500'
    },
    {
      title: 'Total Inventory Value',
      value: `$${totalValue.toLocaleString()}`,
      change: '+8.2%',
      trend: 'up',
      icon: DollarSign,
      color: 'bg-green-500'
    },
    {
      title: 'Low Stock Items',
      value: lowStockItems.length.toString(),
      change: '-5%',
      trend: 'down',
      icon: AlertTriangle,
      color: 'bg-amber-500'
    },
    {
      title: 'Out of Stock',
      value: outOfStockItems.length.toString(),
      change: '0%',
      trend: 'neutral',
      icon: TrendingUp,
      color: 'bg-red-500'
    }
  ];

  return (
    <div>
      <div className="flex items-center mb-6">
        <TrendingUp className="h-6 w-6 text-blue-600 mr-3" />
        <h2 className="text-xl font-semibold text-gray-900">Inventory Analytics</h2>
      </div>

      <div className="space-y-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {analyticsCards.map((card, index) => (
            <div key={index} className="bg-white rounded-lg border shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{card.title}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{card.value}</p>
                  <div className="flex items-center mt-2">
                    <span className={`text-sm font-medium ${
                      card.trend === 'up' ? 'text-green-600' : 
                      card.trend === 'down' ? 'text-red-600' : 
                      'text-gray-600'
                    }`}>
                      {card.change}
                    </span>
                    <span className="text-sm text-gray-500 ml-2">vs last month</span>
                  </div>
                </div>
                <div className={`${card.color} p-3 rounded-lg`}>
                  <card.icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Category Breakdown */}
          <div className="bg-white rounded-lg border shadow-sm p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Inventory by Category</h3>
            <div className="space-y-3">
              {Object.entries(categoryBreakdown).map(([category, quantity]) => {
                const percentage = (quantity / products.reduce((sum, p) => sum + p.quantity, 0)) * 100;
                return (
                  <div key={category}>
                    <div className="flex justify-between text-sm">
                      <span className="font-medium text-gray-700">{category}</span>
                      <span className="text-gray-500">{quantity} items ({percentage.toFixed(1)}%)</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Supplier Distribution */}
          <div className="bg-white rounded-lg border shadow-sm p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Products by Supplier</h3>
            <div className="space-y-3">
              {Object.entries(supplierBreakdown).map(([supplier, count]) => {
                const percentage = (count / totalProducts) * 100;
                return (
                  <div key={supplier}>
                    <div className="flex justify-between text-sm">
                      <span className="font-medium text-gray-700">{supplier}</span>
                      <span className="text-gray-500">{count} products ({percentage.toFixed(1)}%)</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                      <div
                        className="bg-green-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Top Value Products */}
        <div className="bg-white rounded-lg border shadow-sm p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Top Products by Value</h3>
          <div className="overflow-hidden">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Product</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Category</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Quantity</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Unit Price</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Total Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {topValueProducts.map((product, index) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <span className="text-sm font-medium text-blue-600 mr-2">#{index + 1}</span>
                        <span className="text-sm text-gray-900">{product.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">{product.category}</td>
                    <td className="py-3 px-4 text-sm text-gray-900">{product.quantity}</td>
                    <td className="py-3 px-4 text-sm text-gray-900">${product.price.toFixed(2)}</td>
                    <td className="py-3 px-4 text-sm font-medium text-gray-900">
                      ${(product.quantity * product.price).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Stock Alerts */}
        {lowStockItems.length > 0 && (
          <div className="bg-white rounded-lg border shadow-sm p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <AlertTriangle className="h-5 w-5 text-amber-500 mr-2" />
              Stock Alerts
            </h3>
            <div className="space-y-3">
              {lowStockItems.map(product => (
                <div key={product.id} className="flex items-center justify-between p-3 bg-amber-50 rounded-lg border border-amber-200">
                  <div>
                    <p className="text-sm font-medium text-amber-900">{product.name}</p>
                    <p className="text-xs text-amber-700">SKU: {product.sku}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-amber-900">
                      {product.quantity} left
                    </p>
                    <p className="text-xs text-amber-700">
                      Min: {product.minStockLevel}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Analytics;