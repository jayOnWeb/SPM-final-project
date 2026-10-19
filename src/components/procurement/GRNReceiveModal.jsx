import React, { useState } from 'react';
import { X, CheckCircle, Package, Calendar, Tag } from 'lucide-react';

export const GRNReceiveModal = ({ isOpen, onClose, po, onReceive }) => {
  const [itemsData, setItemsData] = useState(() => {
    if (!po) return [];
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 30);
    const defaultExpiry = futureDate.toISOString().split('T')[0];

    return po.items.map((item) => ({
      skuId: item.skuId,
      name: item.name,
      orderedQty: item.orderedQty,
      receivedQty: item.orderedQty,
      batchNo: `BT-${Math.floor(1000 + Math.random() * 9000)}`,
      expiryDate: item.expiryDate || defaultExpiry
    }));
  });

  if (!isOpen || !po) return null;

  const handleChange = (index, field, value) => {
    const updated = [...itemsData];
    updated[index][field] = value;
    setItemsData(updated);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onReceive(po.id, itemsData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-2xl w-full overflow-hidden animate-in fade-in duration-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
          <div>
            <div className="flex items-center gap-2">
              <Package className="w-5 h-5 text-emerald-600" />
              <h3 className="font-bold text-slate-900">
                Goods Received Note (GRN) Inwarding - {po.id}
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Supplier: <strong className="text-slate-800">{po.supplierName}</strong>. Stock will be auto-incremented into dark store bins.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
            {itemsData.map((item, idx) => (
              <div
                key={item.skuId}
                className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-bold text-sm text-slate-900">{item.name}</span>
                    <span className="text-xs text-slate-400 font-mono ml-2">({item.skuId})</span>
                  </div>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                    Ordered: {item.orderedQty} units
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 uppercase mb-1">
                      Received Quantity *
                    </label>
                    <input
                      type="number"
                      min="1"
                      required
                      value={item.receivedQty}
                      onChange={(e) => handleChange(idx, 'receivedQty', e.target.value)}
                      className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 uppercase mb-1 flex items-center gap-1">
                      <Tag className="w-3 h-3 text-slate-400" /> Batch Number *
                    </label>
                    <input
                      type="text"
                      required
                      value={item.batchNo}
                      onChange={(e) => handleChange(idx, 'batchNo', e.target.value)}
                      placeholder="e.g. BT-9812"
                      className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 uppercase mb-1 flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-400" /> Expiry Date (FEFO) *
                    </label>
                    <input
                      type="date"
                      required
                      value={item.expiryDate}
                      onChange={(e) => handleChange(idx, 'expiryDate', e.target.value)}
                      className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-5 py-2 text-sm font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow-sm transition active:scale-95 cursor-pointer"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Complete Inwarding & Add to Stock</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
