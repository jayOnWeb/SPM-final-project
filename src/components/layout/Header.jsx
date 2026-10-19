import React, { useRef } from 'react';
import {
  Zap,
  RotateCcw,
  Download,
  Upload,
  BookOpen,
  MapPin,
  Clock,
  AlertOctagon,
  Sparkles
} from 'lucide-react';
import { useInventory } from '../../context/InventoryContext';
import { DARK_STORES } from '../../types/constants';

export const Header = ({ onOpenSpmModal }) => {
  const {
    inventory,
    orders,
    activeStore,
    setActiveStore,
    generateRandomOrder,
    resetToDefault,
    exportData,
    importData,
    generateAutoReplenishPO
  } = useInventory();

  const fileInputRef = useRef(null);

  // Quick metrics for header ticker
  const activeOrdersCount = orders.filter((o) => o.status !== 'DISPATCHED').length;
  const lowStockCount = inventory.filter((i) => i.stock <= i.minSafetyStock).length;
  
  // Perishables expiring within 3 days
  const today = new Date();
  const expiringCount = inventory.filter((i) => {
    if (!i.expiryDate) return false;
    const diff = (new Date(i.expiryDate) - today) / (1000 * 60 * 60 * 24);
    return diff >= 0 && diff <= 3;
  }).length;

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      importData(e.target.files[0]);
    }
  };

  return (
    <header className="bg-slate-900 text-white sticky top-0 z-40 border-b border-slate-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Dark Store Info */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-300 flex items-center justify-center text-slate-950 font-black shadow-md shadow-amber-500/20">
              <Zap className="w-6 h-6 fill-current" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-amber-400 to-yellow-200 bg-clip-text text-transparent">
                  FlashStock IMS
                </span>
                <span className="text-[10px] font-bold bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded border border-amber-500/30 uppercase tracking-wider">
                  Q-Commerce Dark Store
                </span>
              </div>
              <div className="flex items-center text-xs text-slate-400 gap-1.5">
                <MapPin className="w-3 h-3 text-amber-400" />
                <select
                  value={activeStore.id}
                  onChange={(e) => {
                    const sel = DARK_STORES.find((s) => s.id === e.target.value);
                    if (sel) setActiveStore(sel);
                  }}
                  className="bg-transparent text-slate-300 font-medium hover:text-white cursor-pointer focus:outline-none"
                >
                  {DARK_STORES.map((store) => (
                    <option key={store.id} value={store.id} className="bg-slate-900 text-white">
                      {store.name} ({store.coverage})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Real-time Ticker Metrics */}
          <div className="hidden lg:flex items-center gap-4 bg-slate-800/80 px-3.5 py-1.5 rounded-lg border border-slate-700/60 text-xs">
            <div className="flex items-center gap-1.5 text-blue-400 font-semibold">
              <Clock className="w-3.5 h-3.5 animate-spin" />
              <span>Active Orders: <span className="text-white font-bold">{activeOrdersCount}</span></span>
            </div>
            <div className="w-px h-4 bg-slate-700" />
            <div className="flex items-center gap-1.5 text-amber-400 font-semibold">
              <AlertOctagon className="w-3.5 h-3.5" />
              <span>Low Stock: <span className="text-white font-bold">{lowStockCount} SKUs</span></span>
            </div>
            <div className="w-px h-4 bg-slate-700" />
            <div className="flex items-center gap-1.5 text-orange-400 font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>FEFO Expiring: <span className="text-white font-bold">{expiringCount} SKUs</span></span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            {/* Quick simulated order */}
            <button
              onClick={generateRandomOrder}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-sm transition active:scale-95 cursor-pointer"
              title="Simulate incoming customer 10-min quick commerce order"
            >
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span>+ Sim Order</span>
            </button>

            {/* SPM Specs Modal trigger */}
            <button
              onClick={onOpenSpmModal}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-indigo-600/80 hover:bg-indigo-600 text-white border border-indigo-500/50 transition cursor-pointer"
              title="View SPM Project Documentation, WBS & Sprints"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">SPM Docs</span>
            </button>

            {/* Data Operations */}
            <div className="flex items-center bg-slate-800 rounded-lg p-0.5 border border-slate-700">
              <button
                onClick={exportData}
                title="Backup LocalStorage to JSON"
                className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-700 transition"
              >
                <Download className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => fileInputRef.current?.click()}
                title="Import JSON Backup into LocalStorage"
                className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-700 transition"
              >
                <Upload className="w-3.5 h-3.5" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleFileChange}
                className="hidden"
              />
              <button
                onClick={() => {
                  if (window.confirm('Reset all inventory, orders, and logs to pristine default seed data?')) {
                    resetToDefault();
                  }
                }}
                title="Reset to default seed data"
                className="p-1.5 text-rose-400 hover:text-rose-300 rounded hover:bg-slate-700 transition"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
