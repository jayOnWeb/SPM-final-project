import React, { useState } from 'react';
import { Truck, Plus, CheckCircle2, History } from 'lucide-react';
import { useInventory } from '../context/InventoryContext';

export const RestockTab = () => {
  const { products, restockLogs, restockProduct } = useInventory();

  const [selectedProductId, setSelectedProductId] = useState(products[0]?.id || '');
  const [quantity, setQuantity] = useState(25);
  const [supplier, setSupplier] = useState('Amul Dairy Depot');

  const suppliers = [
    'Amul Dairy Depot',
    'Local Farm Fresh FPO',
    'Beverage Wholesale Ltd',
    'Snack & FMCG Distributors',
    'Direct Brand Warehouse'
  ];

  const handleRestock = (e) => {
    e.preventDefault();
    if (!selectedProductId) return;

    restockProduct(Number(selectedProductId), quantity, supplier);
  };

  const currentSelectedProduct = products.find((p) => p.id === Number(selectedProductId));

  return (
    <div className="space-y-5">
      {/* Restock Input Form */}
      <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs">
        <div className="flex items-center gap-2 mb-1">
          <span className="p-1 rounded bg-blue-100 text-blue-800 font-bold">
            <Truck className="w-4 h-4" />
          </span>
          <h2 className="text-base font-bold text-gray-900">
            Receive Supplier Shipment & Restock
          </h2>
        </div>
        <p className="text-xs text-gray-500 mb-4">
          Add fresh stock received from wholesale suppliers directly into your dark store inventory.
        </p>

        <form onSubmit={handleRestock} className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          {/* Product Select */}
          <div className="sm:col-span-1">
            <label className="block text-xs font-semibold text-gray-600 mb-1">
              Select Product
            </label>
            <select
              value={selectedProductId}
              onChange={(e) => setSelectedProductId(e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-800 focus:bg-white focus:outline-none"
            >
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} (Current: {p.stock})
                </option>
              ))}
            </select>
          </div>

          {/* Quantity to Add */}
          <div className="sm:col-span-1">
            <label className="block text-xs font-semibold text-gray-600 mb-1">
              Quantity to Add
            </label>
            <input
              type="number"
              min="1"
              required
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="e.g. 50"
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:bg-white focus:outline-none font-semibold text-gray-900"
            />
          </div>

          {/* Supplier */}
          <div className="sm:col-span-1">
            <label className="block text-xs font-semibold text-gray-600 mb-1">
              Supplier Depot
            </label>
            <select
              value={supplier}
              onChange={(e) => setSupplier(e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-800 focus:bg-white focus:outline-none"
            >
              {suppliers.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* Submit Button */}
          <div className="sm:col-span-1 flex items-end">
            <button
              type="submit"
              className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Add to Stock</span>
            </button>
          </div>
        </form>

        {currentSelectedProduct && (
          <div className="mt-3 text-xs text-gray-500 bg-gray-50 p-2 rounded-lg border border-gray-100 flex items-center justify-between">
            <span>
              Selected: <strong>{currentSelectedProduct.name}</strong>
            </span>
            <span>
              Current stock: <strong>{currentSelectedProduct.stock}</strong> units &rarr; After restock:{' '}
              <strong className="text-blue-600">
                {currentSelectedProduct.stock + Number(quantity || 0)}
              </strong>{' '}
              units
            </span>
          </div>
        )}
      </div>

      {/* Restock History Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-xs">
        <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between bg-gray-50">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-gray-500" />
            <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider">
              Recent Restock History
            </h3>
          </div>
          <span className="text-xs text-gray-500">{restockLogs.length} shipments logged</span>
        </div>

        <table className="w-full text-left text-sm">
          <thead className="bg-white border-b border-gray-200 text-xs font-medium text-gray-500">
            <tr>
              <th className="px-4 py-2.5">Date</th>
              <th className="px-4 py-2.5">Product Name</th>
              <th className="px-4 py-2.5">Quantity Added</th>
              <th className="px-4 py-2.5">Supplier</th>
              <th className="px-4 py-2.5 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-xs">
            {restockLogs.map((log) => (
              <tr key={log.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-gray-500 font-mono">{log.date}</td>
                <td className="px-4 py-3 font-semibold text-gray-900">{log.productName}</td>
                <td className="px-4 py-3">
                  <span className="font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded border border-green-200">
                    +{log.qty} units
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-600">{log.supplier}</td>
                <td className="px-4 py-3 text-right">
                  <span className="text-green-600 font-medium flex items-center justify-end gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Added to Shelf
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
