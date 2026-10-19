import React from 'react';
import { BarChart2, DollarSign, ShoppingBag, AlertTriangle, CheckCircle, BookOpen } from 'lucide-react';
import { useInventory } from '../context/InventoryContext';

export const SummaryTab = () => {
  const { products, orders } = useInventory();

  // Metrics
  const completedOrders = orders.filter((o) => o.status === 'Delivered');
  const totalRevenue = completedOrders.reduce((sum, o) => sum + o.total, 0);
  const outOfStockItems = products.filter((p) => p.stock === 0);
  const lowStockItems = products.filter((p) => p.stock <= p.minStock && p.stock > 0);

  return (
    <div className="space-y-5">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs">
          <div className="text-xs text-gray-500 font-medium flex items-center justify-between">
            <span>Total Sales Revenue</span>
            <DollarSign className="w-4 h-4 text-green-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900 mt-1">
            ₹{totalRevenue}
          </div>
          <div className="text-xs text-green-600 mt-0.5">
            From {completedOrders.length} delivered orders
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs">
          <div className="text-xs text-gray-500 font-medium flex items-center justify-between">
            <span>Orders Completed</span>
            <ShoppingBag className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900 mt-1">
            {completedOrders.length} / {orders.length}
          </div>
          <div className="text-xs text-gray-500 mt-0.5">
            {orders.length - completedOrders.length} pending / packed
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs">
          <div className="text-xs text-gray-500 font-medium flex items-center justify-between">
            <span>Critical Stock Items</span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-gray-900 mt-1">
            {outOfStockItems.length + lowStockItems.length}
          </div>
          <div className="text-xs text-red-600 mt-0.5">
            {outOfStockItems.length} out of stock, {lowStockItems.length} low stock
          </div>
        </div>
      </div>

      {/* Critical Items List */}
      {outOfStockItems.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex items-center gap-2 text-red-800 font-bold text-xs uppercase tracking-wider mb-2">
            <AlertTriangle className="w-4 h-4 text-red-600" />
            <span>Items Needing Immediate Restock (Out of Stock)</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {outOfStockItems.map((item) => (
              <span
                key={item.id}
                className="bg-white border border-red-300 px-2.5 py-1 rounded-lg text-xs font-semibold text-red-700"
              >
                {item.name} ({item.category})
              </span>
            ))}
          </div>
        </div>
      )}

      {/* SPM Project Overview Box for Viva / College Submission */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-xs space-y-4">
        <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
          <BookOpen className="w-5 h-5 text-amber-500" />
          <div>
            <h3 className="font-bold text-gray-900 text-sm">
              Software Project Management (SPM) - Project Notes
            </h3>
            <p className="text-xs text-gray-500">
              Key points to explain to your evaluator during project presentation.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 space-y-1">
            <div className="font-bold text-gray-900">Module 1: Dark Store Inventory</div>
            <p className="text-gray-600 leading-relaxed">
              Maintains real-time SKU catalog, stock units, expiry dates, and categories. Allows direct stock increment/decrement and low-stock alerts.
            </p>
          </div>

          <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 space-y-1">
            <div className="font-bold text-gray-900">Module 2: 10-Minute Order Fulfillment</div>
            <p className="text-gray-600 leading-relaxed">
              Demonstrates fast 3-step order pipeline: <strong>Pending &rarr; Packed &rarr; Delivered</strong>. Automatically reduces inventory when an order is marked delivered.
            </p>
          </div>

          <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 space-y-1">
            <div className="font-bold text-gray-900">Module 3: Inwarding & Restock</div>
            <p className="text-gray-600 leading-relaxed">
              Simulates receiving fresh shipments from supplier depots (e.g., Amul, local farms) and automatically adds quantity back to on-shelf inventory.
            </p>
          </div>

          <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 space-y-1">
            <div className="font-bold text-gray-900">Module 4: SPM Architecture & Storage</div>
            <p className="text-gray-600 leading-relaxed">
              Built 100% in React.js with browser <code>localStorage</code> persistence. Requires zero backend installation and runs fully offline.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
