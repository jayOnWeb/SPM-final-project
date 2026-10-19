import React, { useState } from 'react';
import { X, Plus, Trash2, Truck } from 'lucide-react';
import { useInventory } from '../../context/InventoryContext';
import { SUPPLIERS } from '../../types/constants';

export const NewPOModal = ({ isOpen, onClose }) => {
  const { inventory, createPurchaseOrder } = useInventory();

  const [supplierId, setSupplierId] = useState(SUPPLIERS[0]?.id || '');
  const [expectedDays, setExpectedDays] = useState(1);
  const [notes, setNotes] = useState('Standard replenishment order for dark store shelves.');
  const [items, setItems] = useState([
    { skuId: inventory[0]?.id || '', orderedQty: 40 }
  ]);

  if (!isOpen) return null;

  const selectedSupplier = SUPPLIERS.find((s) => s.id === supplierId);

  const handleAddItem = () => {
    setItems([...items, { skuId: inventory[0]?.id || '', orderedQty: 30 }]);
  };

  const handleRemoveItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleItemChange = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = value;
    setItems(updated);
  };

  const calculateTotal = () => {
    return items.reduce((acc, curr) => {
      const sku = inventory.find((i) => i.id === curr.skuId);
      return acc + (sku ? sku.costPrice * Number(curr.orderedQty || 0) : 0);
    }, 0);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (items.length === 0) return;

    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + Number(expectedDays));

    const poItems = items.map((curr) => {
      const sku = inventory.find((i) => i.id === curr.skuId);
      return {
        skuId: curr.skuId,
        name: sku?.name || 'Item',
        orderedQty: Number(curr.orderedQty) || 10,
        unitCost: sku?.costPrice || 0,
        receivedQty: 0,
        batchNo: '',
        expiryDate: ''
      };
    });

    createPurchaseOrder({
      supplierId,
      supplierName: selectedSupplier?.name || 'Supplier Depot',
      expectedDelivery: futureDate.toISOString().split('T')[0],
      items: poItems,
      totalCost: calculateTotal(),
      notes
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-xl w-full overflow-hidden animate-in fade-in duration-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center gap-2">
            <Truck className="w-5 h-5 text-indigo-600" />
            <h3 className="font-bold text-slate-900">Create Purchase Order (PO)</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Select Supplier Depot *
              </label>
              <select
                value={supplierId}
                onChange={(e) => setSupplierId(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              >
                {SUPPLIERS.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.leadTimeDays}d lead)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Lead Time / Delivery In (Days)
              </label>
              <input
                type="number"
                min="1"
                max="14"
                value={expectedDays}
                onChange={(e) => setExpectedDays(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                SKUs to Procure
              </label>
              <button
                type="button"
                onClick={handleAddItem}
                className="text-xs text-indigo-600 hover:text-indigo-800 font-bold flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add SKU
              </button>
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {items.map((row, idx) => {
                const sku = inventory.find((i) => i.id === row.skuId);
                return (
                  <div key={idx} className="flex items-center gap-2">
                    <select
                      value={row.skuId}
                      onChange={(e) => handleItemChange(idx, 'skuId', e.target.value)}
                      className="flex-1 px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs bg-white focus:outline-none"
                    >
                      {inventory.map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.name} (Stock: {item.stock}) - Unit Cost: ₹{item.costPrice}
                        </option>
                      ))}
                    </select>

                    <div className="flex items-center gap-1">
                      <span className="text-[11px] text-slate-400">Qty:</span>
                      <input
                        type="number"
                        min="5"
                        value={row.orderedQty}
                        onChange={(e) => handleItemChange(idx, 'orderedQty', e.target.value)}
                        className="w-16 px-2 py-1.5 border border-slate-300 rounded-lg text-xs text-center font-bold"
                      />
                    </div>

                    {items.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(idx)}
                        className="p-1 text-slate-400 hover:text-rose-600 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Special Handling / Dock Instructions
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <div className="pt-2 flex items-center justify-between text-sm font-bold text-slate-800">
            <span>Total Purchase Valuation:</span>
            <span className="text-indigo-600 font-mono text-base">₹{calculateTotal().toLocaleString()}</span>
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
              className="px-5 py-2 text-sm font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-sm transition active:scale-95 cursor-pointer"
            >
              Issue Purchase Order
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
