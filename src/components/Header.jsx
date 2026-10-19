import React from 'react';
import { RotateCcw, Zap } from 'lucide-react';
import { useInventory } from '../context/InventoryContext';

export const Header = () => {
  const { resetAll } = useInventory();

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-20">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-amber-500 text-white flex items-center justify-center font-bold shadow-sm">
            <Zap className="w-5 h-5 fill-current" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900 leading-tight">
              QuickCommerce IMS
            </h1>
            <p className="text-xs text-gray-500">
              Simple 10-Minute Dark Store Inventory System
            </p>
          </div>
        </div>

        {/* Reset button */}
        <button
          onClick={() => {
            if (window.confirm('Reset inventory and orders back to default?')) {
              resetAll();
            }
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-gray-600 hover:text-red-600 bg-gray-50 hover:bg-red-50 border border-gray-200 rounded-lg transition"
          title="Reset to default demo data"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Demo Data</span>
        </button>
      </div>
    </header>
  );
};
