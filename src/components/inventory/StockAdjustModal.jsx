import React, { useState } from 'react';
import { X, AlertTriangle, CheckCircle, Scale } from 'lucide-react';

export const StockAdjustModal = ({ isOpen, onClose, sku, onAdjust }) => {
  const [adjustmentType, setAdjustmentType] = useState('DECREASE'); // 'INCREASE' or 'DECREASE'
  const [quantity, setQuantity] = useState(1);
  const [reason, setReason] = useState('DAMAGED');
  const [notes, setNotes] = useState('');

  if (!isOpen || !sku) return null;

  const reasons = [
    { id: 'DAMAGED', label: 'Damaged / Leaked in Rack' },
    { id: 'EXPIRED', label: 'Expired / Perished (FEFO Discard)' },
    { id: 'SHRINKAGE', label: 'Pilferage / Unaccounted Shrinkage' },
    { id: 'AUDIT_CORRECTION', label: 'Cycle Count Audit Discrepancy' },
    { id: 'SAMPLE', label: 'Vendor Sample / Quality Lab Test' },
    { id: 'FOUND', label: 'Found Unrecorded Stock on Shelf' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    const qtyNum = Number(quantity);
    if (!qtyNum || qtyNum <= 0) return;

    const finalDiff = adjustmentType === 'INCREASE' ? qtyNum : -qtyNum;
    onAdjust(sku.id, finalDiff, reason, notes);
    onClose();
  };

  const calculatedNewStock =
    adjustmentType === 'INCREASE'
      ? sku.stock + Number(quantity || 0)
      : Math.max(0, sku.stock - Number(quantity || 0));

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full overflow-hidden animate-in fade-in duration-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center gap-2">
            <Scale className="w-5 h-5 text-amber-500" />
            <h3 className="font-bold text-slate-900">Audit & Stock Adjustment</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="bg-amber-50 rounded-xl p-3 border border-amber-200/60">
            <div className="text-xs text-amber-800 font-medium">Target SKU:</div>
            <div className="font-bold text-slate-900 text-sm">{sku.name}</div>
            <div className="flex items-center justify-between mt-1 text-xs text-slate-600">
              <span>Bin: <span className="font-mono font-medium">{sku.rack}</span></span>
              <span>Current Stock: <strong className="text-slate-900">{sku.stock}</strong> units</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Adjustment Type
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setAdjustmentType('DECREASE')}
                className={`py-2 px-3 rounded-lg text-xs font-bold border transition ${
                  adjustmentType === 'DECREASE'
                    ? 'bg-rose-50 border-rose-300 text-rose-800 shadow-sm'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                - Reduce Stock (Damage/Waste)
              </button>
              <button
                type="button"
                onClick={() => setAdjustmentType('INCREASE')}
                className={`py-2 px-3 rounded-lg text-xs font-bold border transition ${
                  adjustmentType === 'INCREASE'
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-800 shadow-sm'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                + Add Stock (Found/Audit)
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Quantity to Adjust *
            </label>
            <input
              type="number"
              min="1"
              max={adjustmentType === 'DECREASE' ? sku.stock : 999}
              required
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-semibold focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
            <div className="text-[11px] text-slate-500 mt-1">
              New stock level will be: <strong className="text-slate-900">{calculatedNewStock}</strong> units.
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Operational Reason *
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
            >
              {reasons.map((r) => (
                <option key={r.id} value={r.label}>
                  {r.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Audit Note / Incident Details
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Found leaking packet during morning 7 AM audit"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-sm font-bold bg-slate-900 hover:bg-slate-800 text-white rounded-lg shadow-sm transition active:scale-95 cursor-pointer"
            >
              Confirm Stock Audit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
