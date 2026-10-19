import React from 'react';
import { Package, ShoppingBag, Truck, BarChart2 } from 'lucide-react';
import { useInventory } from '../context/InventoryContext';

export const Tabs = ({ activeTab, setActiveTab }) => {
  const { products, orders } = useInventory();

  const lowStockCount = products.filter((p) => p.stock <= p.minStock).length;
  const pendingOrdersCount = orders.filter((o) => o.status !== 'Delivered').length;

  const tabs = [
    {
      id: 'products',
      label: '1. Inventory (Stock)',
      icon: Package,
      badge: lowStockCount > 0 ? `${lowStockCount} low` : null,
      badgeColor: 'bg-amber-100 text-amber-800'
    },
    {
      id: 'orders',
      label: '2. Orders (10-Min Delivery)',
      icon: ShoppingBag,
      badge: pendingOrdersCount > 0 ? `${pendingOrdersCount} active` : null,
      badgeColor: 'bg-blue-100 text-blue-800'
    },
    {
      id: 'restock',
      label: '3. Restock (Suppliers)',
      icon: Truck,
      badge: null
    },
    {
      id: 'summary',
      label: '4. Summary & Project Info',
      icon: BarChart2,
      badge: null
    }
  ];

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 flex space-x-2 overflow-x-auto py-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold whitespace-nowrap transition cursor-pointer ${
                isActive
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.badge && (
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                    isActive ? 'bg-white text-amber-900' : tab.badgeColor
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
