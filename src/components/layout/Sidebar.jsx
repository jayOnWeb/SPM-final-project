import React from 'react';
import {
  Boxes,
  Truck,
  ClipboardList,
  BarChart3,
  Flame,
  AlertCircle
} from 'lucide-react';
import { useInventory } from '../../context/InventoryContext';

export const Navigation = ({ activeTab, setActiveTab }) => {
  const { inventory, orders, purchaseOrders } = useInventory();

  // Badges for navigation tabs
  const lowStockCount = inventory.filter((i) => i.stock <= i.minSafetyStock).length;
  const activeOrdersCount = orders.filter((o) => o.status !== 'DISPATCHED').length;
  const pendingPOCount = purchaseOrders.filter((p) => p.status === 'ORDERED' || p.status === 'IN_TRANSIT').length;

  const tabs = [
    {
      id: 'inventory',
      name: 'Dark Store Inventory',
      subtitle: 'SKU, FEFO Expiry & Bins',
      icon: Boxes,
      badge: lowStockCount > 0 ? `${lowStockCount} alert` : null,
      badgeColor: 'bg-amber-100 text-amber-800'
    },
    {
      id: 'fulfillment',
      name: '10-Min Fulfillment & Pickers',
      subtitle: 'Live SLA & Route Optimization',
      icon: Flame,
      badge: activeOrdersCount > 0 ? `${activeOrdersCount} live` : null,
      badgeColor: 'bg-rose-100 text-rose-700 animate-pulse'
    },
    {
      id: 'procurement',
      name: 'Procurement & Inwarding',
      subtitle: 'Purchase Orders & GRN',
      icon: Truck,
      badge: pendingPOCount > 0 ? `${pendingPOCount} transit` : null,
      badgeColor: 'bg-indigo-100 text-indigo-700'
    },
    {
      id: 'analytics',
      name: 'SPM Analytics & Audit',
      subtitle: 'KPIs, Wastage & Traceability',
      icon: BarChart3,
      badge: null
    }
  ];

  return (
    <div className="bg-white border-b border-slate-200 shadow-sm sticky top-16 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex overflow-x-auto space-x-2 py-2.5 no-scrollbar">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-left transition whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-sm ring-1 ring-slate-800'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <div
                  className={`p-2 rounded-lg ${
                    isActive ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm tracking-tight">{tab.name}</span>
                    {tab.badge && (
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${tab.badgeColor}`}>
                        {tab.badge}
                      </span>
                    )}
                  </div>
                  <p className={`text-[11px] font-normal ${isActive ? 'text-slate-300' : 'text-slate-400'}`}>
                    {tab.subtitle}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
