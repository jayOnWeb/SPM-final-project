import React, { useState } from 'react';
import { X, Plus, Trash2, ShoppingCart } from 'lucide-react';
import { useInventory } from '../../context/InventoryContext';

export const NewOrderModal = ({ isOpen, onClose }) => {
  const { inventory, createOrder } = useInventory();

  const [customerName, setCustomerName] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [selectedItems, setSelectedItems] = useState([
    { skuId: inventory[0]?.id || '', qty: 1 }
  ]);

  if (!isOpen) return null;

  const handleAddItemRow = () => {
    setSelectedItems([...selectedItems, { skuId: inventory[0]?.id || '', qty: 1 }]);
  };

  const handleRemoveItemRow = (index) => {
    setSelectedItems(selectedItems.filter((_, i) => i !== index));
  };

  const handleItemChange = (index, field, value) => {
    const updated = [...selectedItems];
    updated[index][field] = value;
    setSelectedItems(updated);
  };

  const calculateTotal = () => {
    return selectedItems.reduce((acc, curr) => {
      const sku = inventory.find((i) => i.id === curr.skuId);
      return acc + (sku ? sku.sellingPrice * Number(curr.qty || 1) : 0);
    }, 0);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!customerName || selectedItems.length === 0) return;

    const items = selectedItems.map((curr) => {
      const sku = inventory.find((i) => i.id === curr.skuId);
      return {
        skuId: curr.skuId,
        name: sku?.name || 'Item',
        qty: Number(curr.qty) || 1,
        rack: sku?.rack || 'Zone A',
        picked: false,
        unitPrice: sku?.sellingPrice || 0
      };
    });

    createOrder({
      customerName,
      customerAddress: customerAddress || 'Customer Address (Indiranagar 560038)',
      items,
      totalAmount: calculateTotal()
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden animate-in fade-in duration-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-amber-500" />
            <h3 className="font-bold text-slate-900">Create Custom Customer Order</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Customer Name *
            </label>
            <input
              type="text"
              required
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="e.g. Priya Sharma"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Delivery Address
            </label>
            <input
              type="text"
              value={customerAddress}
              onChange={(e) => setCustomerAddress(e.target.value)}
              placeholder="e.g. 504, Sunrise Apts, 100ft Road"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Cart Items
              </label>
              <button
                type="button"
                onClick={handleAddItemRow}
                className="text-xs text-amber-600 hover:text-amber-700 font-bold flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add Item
              </button>
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {selectedItems.map((row, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <select
                    value={row.skuId}
                    onChange={(e) => handleItemChange(idx, 'skuId', e.target.value)}
                    className="flex-1 px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs bg-white focus:outline-none"
                  >
                    {inventory.map((sku) => (
                      <option key={sku.id} value={sku.id}>
                        {sku.name} ({sku.unit}) - ₹{sku.sellingPrice} [Stock: {sku.stock}]
                      </option>
                    ))}
                  </select>

                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={row.qty}
                    onChange={(e) => handleItemChange(idx, 'qty', e.target.value)}
                    className="w-16 px-2 py-1.5 border border-slate-300 rounded-lg text-xs text-center font-bold"
                  />

                  {selectedItems.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveItemRow(idx)}
                      className="p-1 text-slate-400 hover:text-rose-600 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between text-sm font-bold text-slate-800">
            <span>Estimated Cart Total:</span>
            <span className="text-amber-600 font-mono text-base">₹{calculateTotal()}</span>
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
              className="px-5 py-2 text-sm font-bold bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-lg shadow-sm transition active:scale-95 cursor-pointer"
            >
              Place Flash Order
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
