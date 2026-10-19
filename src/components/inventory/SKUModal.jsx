import React, { useState, useEffect } from 'react';
import { X, Plus, Save } from 'lucide-react';
import { CATEGORIES } from '../../types/constants';

export const SKUModal = ({ isOpen, onClose, onSave, editItem = null }) => {
  const [formData, setFormData] = useState({
    name: '',
    unit: '',
    category: 'Dairy & Eggs',
    rack: '',
    stock: 20,
    minSafetyStock: 10,
    reorderQty: 40,
    costPrice: '',
    sellingPrice: '',
    batchNo: '',
    expiryDate: '',
    dailyBurnRate: 15,
    barcode: '',
    isPerishable: false
  });

  useEffect(() => {
    if (editItem) {
      setFormData(editItem);
    } else {
      // Default new SKU template
      const randomBarcode = `890${Math.floor(1000000000 + Math.random() * 9000000000)}`;
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 15);

      setFormData({
        name: '',
        unit: '500 g',
        category: 'Dairy & Eggs',
        rack: 'Zone A - Shelf A-01-A',
        stock: 25,
        minSafetyStock: 10,
        reorderQty: 50,
        costPrice: 40,
        sellingPrice: 50,
        batchNo: `BT-${Math.floor(100 + Math.random() * 900)}`,
        expiryDate: futureDate.toISOString().split('T')[0],
        dailyBurnRate: 12,
        barcode: randomBarcode,
        isPerishable: true
      });
    }
  }, [editItem, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              {editItem ? 'Edit SKU Details' : 'Add New Dark Store SKU'}
            </h3>
            <p className="text-xs text-slate-500">
              Configure micro-fulfillment parameters, bin location, and FEFO expiry.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Product Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Amul Salted Butter 100g"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
              >
                {CATEGORIES.filter((c) => c !== 'All Categories').map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Unit / Pack Size
              </label>
              <input
                type="text"
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                placeholder="e.g. 500 ml / 1 kg / 6 pcs"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Dark Store Bin / Rack Location *
              </label>
              <input
                type="text"
                required
                value={formData.rack}
                onChange={(e) => setFormData({ ...formData, rack: e.target.value })}
                placeholder="e.g. Zone A - Chiller A-01-B or Zone C - Aisle C-03-A"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
              <span className="text-[11px] text-slate-500">
                Pickers follow this rack sequence for 2-minute order picking.
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Current On-Shelf Stock *
              </label>
              <input
                type="number"
                min="0"
                required
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Min Safety Stock Threshold
              </label>
              <input
                type="number"
                min="1"
                value={formData.minSafetyStock}
                onChange={(e) => setFormData({ ...formData, minSafetyStock: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Cost Price (₹)
              </label>
              <input
                type="number"
                min="0"
                step="0.5"
                value={formData.costPrice}
                onChange={(e) => setFormData({ ...formData, costPrice: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Selling Price / MRP (₹)
              </label>
              <input
                type="number"
                min="0"
                step="0.5"
                value={formData.sellingPrice}
                onChange={(e) => setFormData({ ...formData, sellingPrice: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Batch Number
              </label>
              <input
                type="text"
                value={formData.batchNo}
                onChange={(e) => setFormData({ ...formData, batchNo: e.target.value })}
                placeholder="e.g. BT-9812-C"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Expiry Date (FEFO Tracking) *
              </label>
              <input
                type="date"
                required
                value={formData.expiryDate}
                onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Barcode / EAN
              </label>
              <input
                type="text"
                value={formData.barcode}
                onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-mono focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Estimated Daily Burn Rate
              </label>
              <input
                type="number"
                min="1"
                value={formData.dailyBurnRate}
                onChange={(e) => setFormData({ ...formData, dailyBurnRate: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Footer Controls */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-5 py-2 text-sm font-semibold bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-lg shadow-sm transition active:scale-95 cursor-pointer"
            >
              {editItem ? <Save className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              <span>{editItem ? 'Save SKU Changes' : 'Create Dark Store SKU'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
