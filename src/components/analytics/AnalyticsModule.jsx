import React from 'react';
import {
  BarChart3,
  TrendingUp,
  Activity,
  ShieldCheck,
  AlertTriangle,
  History,
  Clock,
  Layers,
  PieChart,
  CheckCircle2,
  Trash2,
  Package
} from 'lucide-react';
import { useInventory } from '../../context/InventoryContext';
import { CATEGORIES } from '../../types/constants';

export const AnalyticsModule = () => {
  const { inventory, orders, purchaseOrders, auditLogs, activeStore } = useInventory();

  // Metrics computation
  const totalSKUs = inventory.length;
  const outOfStockCount = inventory.filter((i) => i.stock === 0).length;
  const stockoutRate = totalSKUs > 0 ? ((outOfStockCount / totalSKUs) * 100).toFixed(1) : 0;
  const inStockRate = (100 - parseFloat(stockoutRate)).toFixed(1);

  const totalOrders = orders.length;
  const dispatchedOrders = orders.filter((o) => o.status === 'DISPATCHED');
  const slaFulfillmentRate = totalOrders > 0 ? (((dispatchedOrders.length + 1) / (totalOrders + 1)) * 100).toFixed(1) : 98.4;

  const totalInventoryValue = inventory.reduce((acc, curr) => acc + curr.stock * curr.costPrice, 0);
  const totalSalesRevenue = orders.reduce((acc, curr) => acc + curr.totalAmount, 0);

  // Expiry risk analysis
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const expiringIn3Days = inventory.filter((item) => {
    if (!item.expiryDate) return false;
    const diff = (new Date(item.expiryDate) - today) / (1000 * 60 * 60 * 24);
    return diff >= 0 && diff <= 3;
  });

  const potentialWastageValue = expiringIn3Days.reduce(
    (acc, item) => acc + item.stock * item.costPrice,
    0
  );

  // Category breakdown
  const categoryStats = CATEGORIES.filter((c) => c !== 'All Categories').map((category) => {
    const items = inventory.filter((i) => i.category === category);
    const count = items.length;
    const totalStock = items.reduce((s, it) => s + it.stock, 0);
    const valuation = items.reduce((s, it) => s + it.stock * it.costPrice, 0);
    return { category, count, totalStock, valuation };
  });

  return (
    <div className="space-y-6">
      {/* SPM Executive Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider">
            <span>In-Stock Availability</span>
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-3xl font-black text-slate-900 mt-2">{inStockRate}%</div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-semibold mt-1">
            <span>Target: &gt; 98.5%</span>
            <span className="text-slate-400">({outOfStockCount} OOS items)</span>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider">
            <span>10-Min SLA Fulfillment</span>
            <Activity className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-3xl font-black text-slate-900 mt-2">99.2%</div>
          <div className="flex items-center gap-1.5 text-xs text-blue-600 font-semibold mt-1">
            <span>Avg dispatch time: 2m 14s</span>
          </div>
        </div>

        {/* KPI 3 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider">
            <span>Active Depots Valuation</span>
            <TrendingUp className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-3xl font-black text-slate-900 mt-2">
            ₹{totalInventoryValue.toLocaleString()}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            Total sales processed: <strong>₹{totalSalesRevenue.toLocaleString()}</strong>
          </div>
        </div>

        {/* KPI 4 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider">
            <span>FEFO Wastage Exposure</span>
            <AlertTriangle className="w-4 h-4 text-orange-500" />
          </div>
          <div className="text-3xl font-black text-orange-950 mt-2">
            ₹{potentialWastageValue.toLocaleString()}
          </div>
          <div className="text-xs text-orange-600 font-semibold mt-1">
            {expiringIn3Days.length} SKUs expiring within 72 hrs
          </div>
        </div>
      </div>

      {/* Grid: Category Distribution & Dark Store Zones */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Breakdown */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-amber-500" />
              <h3 className="font-bold text-slate-900">Inventory Distribution by Category</h3>
            </div>
            <span className="text-xs text-slate-400 font-mono">Real-time LocalStorage</span>
          </div>

          <div className="space-y-3">
            {categoryStats.map((stat) => {
              const maxStock = Math.max(...categoryStats.map((s) => s.totalStock), 1);
              const percentage = Math.round((stat.totalStock / maxStock) * 100);

              return (
                <div key={stat.category} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-800">{stat.category}</span>
                    <span className="text-slate-500 font-mono">
                      {stat.totalStock} units • ₹{stat.valuation.toLocaleString()}
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-amber-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Dark Store Floor Map & Zone Utilization */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <PieChart className="w-5 h-5 text-indigo-600" />
              <h3 className="font-bold text-slate-900">Micro-Fulfillment Zones ({activeStore.name})</h3>
            </div>
            <span className="text-xs text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Optimal Layout
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-blue-50/70 border border-blue-200/70 rounded-xl space-y-1">
              <div className="font-bold text-blue-900 flex items-center justify-between">
                <span>Zone A: Chillers & Cold Chain</span>
                <span className="font-mono text-[10px]">2°C - 4°C</span>
              </div>
              <p className="text-blue-700 text-[11px]">Dairy, Milk, Butter, Silk Chocolates, Bread</p>
              <div className="font-mono font-bold text-blue-950 pt-1">Avg Pick: 35 secs</div>
            </div>

            <div className="p-3 bg-emerald-50/70 border border-emerald-200/70 rounded-xl space-y-1">
              <div className="font-bold text-emerald-900 flex items-center justify-between">
                <span>Zone B: Farm Fresh Produce</span>
                <span className="font-mono text-[10px]">Crates & Bins</span>
              </div>
              <p className="text-emerald-700 text-[11px]">Robusta Bananas, Tomatoes, Fresh Onions</p>
              <div className="font-mono font-bold text-emerald-950 pt-1">Avg Pick: 28 secs</div>
            </div>

            <div className="p-3 bg-amber-50/70 border border-amber-200/70 rounded-xl space-y-1">
              <div className="font-bold text-amber-900 flex items-center justify-between">
                <span>Zone C & D: Snacks & Beverages</span>
                <span className="font-mono text-[10px]">High Velocity</span>
              </div>
              <p className="text-amber-700 text-[11px]">Lay&apos;s, Kurkure, Bhujia, Coca-Cola, Red Bull</p>
              <div className="font-mono font-bold text-amber-950 pt-1">Avg Pick: 22 secs</div>
            </div>

            <div className="p-3 bg-purple-50/70 border border-purple-200/70 rounded-xl space-y-1">
              <div className="font-bold text-purple-900 flex items-center justify-between">
                <span>Zone E & F: Staples & Household</span>
                <span className="font-mono text-[10px]">Standard Aisles</span>
              </div>
              <p className="text-purple-700 text-[11px]">Maggi Noodles, Dettol Handwash, Cleaners</p>
              <div className="font-mono font-bold text-purple-950 pt-1">Avg Pick: 30 secs</div>
            </div>
          </div>
        </div>
      </div>

      {/* Operational Traceability & Audit Logs */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-slate-700" />
            <div>
              <h3 className="font-bold text-slate-900 text-sm">System Audit & Traceability Trail</h3>
              <p className="text-xs text-slate-500">
                Immutable event stream for cycle counts, order deductions, and inwarding.
              </p>
            </div>
          </div>
          <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-slate-200 text-slate-700">
            {auditLogs.length} Events Recorded
          </span>
        </div>

        <div className="divide-y divide-slate-100 max-h-96 overflow-y-auto">
          {auditLogs.map((log) => {
            const timeAgo = new Date(log.timestamp).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit'
            });

            const tagColor = {
              fulfillment: 'bg-emerald-100 text-emerald-800',
              picking: 'bg-purple-100 text-purple-800',
              inwarding: 'bg-indigo-100 text-indigo-800',
              audit: 'bg-amber-100 text-amber-800',
              inventory: 'bg-blue-100 text-blue-800',
              procurement: 'bg-indigo-100 text-indigo-800',
              system: 'bg-slate-100 text-slate-800'
            }[log.tag] || 'bg-slate-100 text-slate-800';

            return (
              <div key={log.id} className="p-4 hover:bg-slate-50 transition flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full mt-0.5 ${tagColor}`}>
                    {log.tag}
                  </span>
                  <div>
                    <div className="text-xs font-bold text-slate-900">{log.description}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-2">
                      <span>Action: <code className="font-mono">{log.action}</code></span>
                      <span>•</span>
                      <span>Actor: <strong className="text-slate-600">{log.user}</strong></span>
                    </div>
                  </div>
                </div>

                <div className="text-right flex-shrink-0 text-xs font-mono text-slate-400">
                  {timeAgo}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
