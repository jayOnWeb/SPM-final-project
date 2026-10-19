import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Plus,
  AlertTriangle,
  Scale,
  Edit2,
  Trash2,
  Boxes,
  Zap,
  TrendingDown,
  Clock,
  Sparkles,
  ArrowUpDown
} from 'lucide-react';
import { useInventory } from '../../context/InventoryContext';
import { CATEGORIES } from '../../types/constants';
import { StockBadge, ExpiryBadge } from '../common/Badge';
import { SKUModal } from './SKUModal';
import { StockAdjustModal } from './StockAdjustModal';

export const InventoryModule = () => {
  const {
    inventory,
    addSKU,
    updateSKU,
    deleteSKU,
    adjustStock,
    generateAutoReplenishPO
  } = useInventory();

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [stockFilter, setStockFilter] = useState('ALL'); // 'ALL', 'LOW_STOCK', 'OUT_OF_STOCK', 'EXPIRING_SOON'
  const [sortBy, setSortBy] = useState('NAME'); // 'NAME', 'STOCK_LOW', 'EXPIRY_SOON', 'MARGIN'

  // Modal States
  const [isSKUModalOpen, setIsSKUModalOpen] = useState(false);
  const [editingSKU, setEditingSKU] = useState(null);
  const [adjustingSKU, setAdjustingSKU] = useState(null);

  // Computed KPIs
  const totalSKUs = inventory.length;
  const totalUnits = inventory.reduce((sum, item) => sum + item.stock, 0);
  const totalValuation = inventory.reduce((sum, item) => sum + item.stock * item.costPrice, 0);
  
  const lowStockItems = inventory.filter((item) => item.stock <= item.minSafetyStock && item.stock > 0);
  const outOfStockItems = inventory.filter((item) => item.stock === 0);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const expiringSoonItems = inventory.filter((item) => {
    if (!item.expiryDate) return false;
    const diff = (new Date(item.expiryDate) - today) / (1000 * 60 * 60 * 24);
    return diff >= 0 && diff <= 3;
  });

  // Filtered and Sorted list
  const filteredInventory = useMemo(() => {
    return inventory
      .filter((item) => {
        // Search query
        const query = searchQuery.toLowerCase();
        const matchesSearch =
          item.name.toLowerCase().includes(query) ||
          item.id.toLowerCase().includes(query) ||
          item.rack.toLowerCase().includes(query) ||
          (item.barcode && item.barcode.includes(query));

        // Category filter
        const matchesCategory =
          selectedCategory === 'All Categories' || item.category === selectedCategory;

        // Stock status filter
        let matchesStock = true;
        if (stockFilter === 'LOW_STOCK') {
          matchesStock = item.stock <= item.minSafetyStock && item.stock > 0;
        } else if (stockFilter === 'OUT_OF_STOCK') {
          matchesStock = item.stock === 0;
        } else if (stockFilter === 'EXPIRING_SOON') {
          if (!item.expiryDate) return false;
          const diff = (new Date(item.expiryDate) - today) / (1000 * 60 * 60 * 24);
          matchesStock = diff >= 0 && diff <= 3;
        }

        return matchesSearch && matchesCategory && matchesStock;
      })
      .sort((a, b) => {
        if (sortBy === 'STOCK_LOW') return a.stock - b.stock;
        if (sortBy === 'EXPIRY_SOON') {
          return new Date(a.expiryDate || '2099-01-01') - new Date(b.expiryDate || '2099-01-01');
        }
        if (sortBy === 'MARGIN') {
          const marginA = ((a.sellingPrice - a.costPrice) / a.sellingPrice) * 100;
          const marginB = ((b.sellingPrice - b.costPrice) / b.sellingPrice) * 100;
          return marginB - marginA;
        }
        return a.name.localeCompare(b.name);
      });
  }, [inventory, searchQuery, selectedCategory, stockFilter, sortBy, today]);

  return (
    <div className="space-y-6">
      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Catalog
            </span>
            <div className="text-2xl font-black text-slate-900 mt-1">{totalSKUs} SKUs</div>
            <div className="text-xs text-slate-500 mt-0.5">{totalUnits} units on shelves</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <Boxes className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Stock Valuation
            </span>
            <div className="text-2xl font-black text-slate-900 mt-1">₹{totalValuation.toLocaleString()}</div>
            <div className="text-xs text-emerald-600 font-medium mt-0.5">At micro-depot cost</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            ₹
          </div>
        </div>

        <div
          onClick={() => setStockFilter(stockFilter === 'LOW_STOCK' ? 'ALL' : 'LOW_STOCK')}
          className={`p-4 rounded-2xl border shadow-sm flex items-center justify-between cursor-pointer transition ${
            stockFilter === 'LOW_STOCK'
              ? 'bg-amber-100 border-amber-400 ring-2 ring-amber-400'
              : 'bg-white border-slate-200/80 hover:border-amber-300'
          }`}
        >
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-amber-700 uppercase tracking-wider">
                Low Safety Stock
              </span>
              {lowStockItems.length > 0 && (
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
              )}
            </div>
            <div className="text-2xl font-black text-amber-900 mt-1">
              {lowStockItems.length + outOfStockItems.length} SKUs
            </div>
            <div className="text-xs text-amber-700 mt-0.5">
              {outOfStockItems.length > 0 ? `${outOfStockItems.length} Out of Stock` : 'Needs reorder'}
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <TrendingDown className="w-6 h-6" />
          </div>
        </div>

        <div
          onClick={() => setStockFilter(stockFilter === 'EXPIRING_SOON' ? 'ALL' : 'EXPIRING_SOON')}
          className={`p-4 rounded-2xl border shadow-sm flex items-center justify-between cursor-pointer transition ${
            stockFilter === 'EXPIRING_SOON'
              ? 'bg-orange-100 border-orange-400 ring-2 ring-orange-400'
              : 'bg-white border-slate-200/80 hover:border-orange-300'
          }`}
        >
          <div>
            <span className="text-xs font-semibold text-orange-700 uppercase tracking-wider">
              FEFO Expiry Alert
            </span>
            <div className="text-2xl font-black text-orange-900 mt-1">
              {expiringSoonItems.length} SKUs
            </div>
            <div className="text-xs text-orange-700 mt-0.5">Expiring in ≤ 3 days</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center font-bold">
            <Clock className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Main Controls & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by SKU name, Barcode, Bin (e.g. Zone A), or SKU-1001..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-slate-600 font-bold"
              >
                Clear
              </button>
            )}
          </div>

          {/* Quick Filter & Sort Options */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center bg-slate-100 rounded-xl p-1 text-xs font-medium text-slate-600">
              <span className="px-2 text-slate-400">Sort:</span>
              <button
                onClick={() => setSortBy('NAME')}
                className={`px-2.5 py-1 rounded-lg transition ${
                  sortBy === 'NAME' ? 'bg-white text-slate-900 font-bold shadow-xs' : 'hover:text-slate-900'
                }`}
              >
                Name
              </button>
              <button
                onClick={() => setSortBy('STOCK_LOW')}
                className={`px-2.5 py-1 rounded-lg transition ${
                  sortBy === 'STOCK_LOW' ? 'bg-white text-slate-900 font-bold shadow-xs' : 'hover:text-slate-900'
                }`}
              >
                Lowest Stock
              </button>
              <button
                onClick={() => setSortBy('EXPIRY_SOON')}
                className={`px-2.5 py-1 rounded-lg transition ${
                  sortBy === 'EXPIRY_SOON' ? 'bg-white text-slate-900 font-bold shadow-xs' : 'hover:text-slate-900'
                }`}
              >
                FEFO Expiry
              </button>
            </div>

            {/* Auto Reorder Shortcut button */}
            <button
              onClick={generateAutoReplenishPO}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-amber-50 text-amber-900 border border-amber-300 hover:bg-amber-100 transition cursor-pointer"
              title="Automatically create PO for all low stock items"
            >
              <Zap className="w-3.5 h-3.5 text-amber-600 fill-current" />
              <span>Auto-Reorder ({lowStockItems.length + outOfStockItems.length})</span>
            </button>

            {/* Add SKU Button */}
            <button
              onClick={() => {
                setEditingSKU(null);
                setIsSKUModalOpen(true);
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white shadow-sm transition active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ Add SKU</span>
            </button>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
          {CATEGORIES.map((category) => {
            const isSelected = selectedCategory === category;
            const count =
              category === 'All Categories'
                ? inventory.length
                : inventory.filter((i) => i.category === category).length;
            return (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition cursor-pointer font-medium flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <span>{category}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isSelected ? 'bg-amber-600/40 text-slate-950 font-extrabold' : 'bg-slate-200 text-slate-500'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
              <tr>
                <th className="px-5 py-3.5">SKU & Barcode</th>
                <th className="px-4 py-3.5">Product & Category</th>
                <th className="px-4 py-3.5">Rack / Bin Location</th>
                <th className="px-4 py-3.5">Current Stock Level</th>
                <th className="px-4 py-3.5">Batch & Expiry (FEFO)</th>
                <th className="px-4 py-3.5">Cost / Price</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredInventory.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-12 text-slate-400">
                    <Boxes className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                    <p className="font-medium text-slate-600">No SKUs match your filter criteria.</p>
                    <p className="text-xs text-slate-400 mt-1">Try resetting filters or adding a new SKU.</p>
                  </td>
                </tr>
              ) : (
                filteredInventory.map((item) => {
                  const marginPct = (
                    ((item.sellingPrice - item.costPrice) / item.sellingPrice) *
                    100
                  ).toFixed(0);
                  const stockRatio = Math.min(100, Math.round((item.stock / (item.minSafetyStock * 2)) * 100));

                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-slate-50/60 transition group"
                    >
                      {/* SKU & Barcode */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        <div className="font-mono font-bold text-xs text-slate-900">{item.id}</div>
                        <div className="text-[11px] text-slate-400 font-mono flex items-center gap-1">
                          <span>EAN: {item.barcode}</span>
                        </div>
                      </td>

                      {/* Product Name & Category */}
                      <td className="px-4 py-4">
                        <div className="font-bold text-slate-900 group-hover:text-amber-600 transition">
                          {item.name}
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs text-slate-500 font-medium">{item.unit}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">
                            {item.category}
                          </span>
                        </div>
                      </td>

                      {/* Rack / Bin Location */}
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-mono font-semibold bg-slate-100 text-slate-800 border border-slate-200">
                          📍 {item.rack}
                        </span>
                      </td>

                      {/* Stock Level with Gauge */}
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <StockBadge stock={item.stock} minSafetyStock={item.minSafetyStock} />
                          <span className="text-xs text-slate-500">
                            / Min {item.minSafetyStock}
                          </span>
                        </div>
                        {/* Visual stock gauge */}
                        <div className="w-28 bg-slate-100 h-1.5 rounded-full mt-1.5 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${
                              item.stock === 0
                                ? 'bg-rose-500'
                                : item.stock <= item.minSafetyStock
                                ? 'bg-amber-500'
                                : 'bg-emerald-500'
                            }`}
                            style={{ width: `${item.stock === 0 ? 5 : stockRatio}%` }}
                          />
                        </div>
                      </td>

                      {/* Batch & Expiry (FEFO) */}
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="text-xs font-mono font-medium text-slate-700">
                          {item.batchNo || 'N/A'}
                        </div>
                        <div className="mt-1">
                          <ExpiryBadge expiryDate={item.expiryDate} />
                        </div>
                      </td>

                      {/* Cost / Price */}
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="text-xs font-medium text-slate-600">
                          Cost: <span className="font-semibold text-slate-900">₹{item.costPrice}</span>
                        </div>
                        <div className="text-xs font-bold text-slate-900">
                          MRP: ₹{item.sellingPrice}{' '}
                          <span className="text-[10px] text-emerald-600 font-bold">
                            (+{marginPct}%)
                          </span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-1">
                          {/* Stock Audit / Adjust */}
                          <button
                            onClick={() => setAdjustingSKU(item)}
                            title="Audit Stock / Record Damage or Shrinkage"
                            className="p-1.5 text-slate-600 hover:text-amber-700 hover:bg-amber-50 rounded-lg transition"
                          >
                            <Scale className="w-4 h-4" />
                          </button>

                          {/* Edit SKU */}
                          <button
                            onClick={() => {
                              setEditingSKU(item);
                              setIsSKUModalOpen(true);
                            }}
                            title="Edit SKU Details"
                            className="p-1.5 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>

                          {/* Delete SKU */}
                          <button
                            onClick={() => {
                              if (window.confirm(`Are you sure you want to delete ${item.name} (${item.id})?`)) {
                                deleteSKU(item.id);
                              }
                            }}
                            title="Delete SKU"
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* SKU Modal */}
      <SKUModal
        isOpen={isSKUModalOpen}
        onClose={() => {
          setIsSKUModalOpen(false);
          setEditingSKU(null);
        }}
        onSave={(data) => {
          if (editingSKU) {
            updateSKU(editingSKU.id, data);
          } else {
            addSKU(data);
          }
        }}
        editItem={editingSKU}
      />

      {/* Stock Adjust Modal */}
      <StockAdjustModal
        isOpen={!!adjustingSKU}
        onClose={() => setAdjustingSKU(null)}
        sku={adjustingSKU}
        onAdjust={adjustStock}
      />
    </div>
  );
};
