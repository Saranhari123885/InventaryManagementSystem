import React, { useState, useRef } from 'react';
import { Scan, Search, Package } from 'lucide-react';

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

interface BarcodeScannerProps {
  products: Product[];
}

const BarcodeScanner: React.FC<BarcodeScannerProps> = ({ products }) => {
  const [barcodeInput, setBarcodeInput] = useState('');
  const [scanResult, setScanResult] = useState<Product | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleBarcodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    searchByBarcode(barcodeInput);
  };

  const searchByBarcode = (barcode: string) => {
    setError('');
    setScanResult(null);

    if (!barcode.trim()) {
      setError('Please enter a barcode');
      return;
    }

    const product = products.find(p => p.barcode === barcode.trim());
    
    if (product) {
      setScanResult(product);
    } else {
      setError('Product not found with this barcode');
    }
  };

  const simulateBarcodeScanner = () => {
    setIsScanning(true);
    setError('');
    
    // Simulate scanning process
    setTimeout(() => {
      const productWithBarcode = products.find(p => p.barcode);
      if (productWithBarcode) {
        setBarcodeInput(productWithBarcode.barcode);
        searchByBarcode(productWithBarcode.barcode);
      } else {
        setError('No products with barcodes found in inventory');
      }
      setIsScanning(false);
    }, 2000);
  };

  const getStockStatus = (product: Product) => {
    if (product.quantity <= product.minStockLevel) {
      return { status: 'low', color: 'text-red-600 bg-red-100', text: 'Low Stock' };
    }
    if (product.quantity <= product.minStockLevel * 2) {
      return { status: 'medium', color: 'text-amber-600 bg-amber-100', text: 'Medium' };
    }
    return { status: 'good', color: 'text-green-600 bg-green-100', text: 'In Stock' };
  };

  return (
    <div>
      <div className="flex items-center mb-6">
        <Scan className="h-6 w-6 text-blue-600 mr-3" />
        <h2 className="text-xl font-semibold text-gray-900">Barcode Scanner</h2>
      </div>

      <div className="space-y-6">
        {/* Scanner Interface */}
        <div className="bg-gray-50 rounded-lg p-6">
          <div className="text-center mb-6">
            <div className="mx-auto w-48 h-32 bg-gray-200 rounded-lg flex items-center justify-center mb-4">
              {isScanning ? (
                <div className="text-blue-600">
                  <div className="animate-pulse">
                    <Scan className="h-12 w-12 mx-auto mb-2" />
                    <p className="text-sm">Scanning...</p>
                  </div>
                </div>
              ) : (
                <div className="text-gray-500">
                  <Scan className="h-12 w-12 mx-auto mb-2" />
                  <p className="text-sm">Camera View</p>
                </div>
              )}
            </div>
            
            <button
              onClick={simulateBarcodeScanner}
              disabled={isScanning}
              className="inline-flex items-center px-6 py-3 text-base font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isScanning ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Scanning...
                </>
              ) : (
                <>
                  <Scan className="h-5 w-5 mr-2" />
                  Start Scanning
                </>
              )}
            </button>
          </div>

          <div className="text-center text-gray-500">
            <p className="text-sm">Position the barcode within the frame to scan</p>
          </div>
        </div>

        {/* Manual Barcode Input */}
        <div className="bg-white border rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Manual Barcode Entry</h3>
          
          <form onSubmit={handleBarcodeSubmit} className="space-y-4">
            <div className="flex space-x-3">
              <div className="flex-1">
                <input
                  ref={inputRef}
                  type="text"
                  value={barcodeInput}
                  onChange={(e) => setBarcodeInput(e.target.value)}
                  placeholder="Enter barcode manually"
                  className="block w-full rounded-md border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                />
              </div>
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                <Search className="h-4 w-4 mr-2" />
                Search
              </button>
            </div>
            
            {error && (
              <p className="text-sm text-red-600">{error}</p>
            )}
          </form>
        </div>

        {/* Scan Result */}
        {scanResult && (
          <div className="bg-white border rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Scan Result</h3>
            
            <div className="border rounded-lg p-4 bg-green-50 border-green-200">
              <div className="flex items-start space-x-4">
                <Package className="h-8 w-8 text-green-600 mt-1" />
                <div className="flex-1">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900">{scanResult.name}</h4>
                      <p className="text-sm text-gray-600">SKU: {scanResult.sku}</p>
                      <p className="text-sm text-gray-600">Barcode: {scanResult.barcode}</p>
                    </div>
                    <div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Category:</span>
                          <span className="text-sm font-medium">{scanResult.category}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Quantity:</span>
                          <span className="text-sm font-medium">{scanResult.quantity}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Price:</span>
                          <span className="text-sm font-medium">${scanResult.price.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Status:</span>
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStockStatus(scanResult).color}`}>
                            {getStockStatus(scanResult).text}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="text-sm font-medium text-blue-900 mb-2">How to use the Barcode Scanner:</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Click "Start Scanning" to activate the camera scanner</li>
            <li>• Position the barcode within the camera frame</li>
            <li>• Alternatively, enter the barcode manually in the input field</li>
            <li>• The system will display product information once found</li>
            <li>• Use this feature for quick product lookups and inventory checks</li>
          </ul>
        </div>

        {/* Available Barcodes for Testing */}
        <div className="bg-gray-50 border rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-900 mb-3">Available Barcodes for Testing:</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {products.filter(p => p.barcode).map(product => (
              <div key={product.id} className="flex items-center justify-between bg-white p-3 rounded border">
                <div>
                  <p className="text-sm font-medium text-gray-900">{product.name}</p>
                  <p className="text-xs text-gray-500">{product.barcode}</p>
                </div>
                <button
                  onClick={() => {
                    setBarcodeInput(product.barcode);
                    searchByBarcode(product.barcode);
                  }}
                  className="text-blue-600 hover:text-blue-800 text-xs"
                >
                  Use
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BarcodeScanner;