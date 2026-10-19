import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  Circle,
  MapPin,
  Barcode,
  PackageCheck,
  UserCheck,
  Send,
  Zap,
  ShoppingBag
} from 'lucide-react';
import { PICKERS } from '../../types/constants';

export const PickerModal = ({
  isOpen,
  onClose,
  order,
  onAssignPicker,
  onToggleItem,
  onPackOrder,
  onDispatchOrder
}) => {
  const [scannedBarcode, setScannedBarcode] = useState('');
  const [scanMessage, setScanMessage] = useState(null);

  if (!isOpen || !order) return null;

  const totalItemsCount = order.items.reduce((s, it) => s + it.qty, 0);
  const pickedItemsCount = order.items.filter((it) => it.picked).reduce((s, it) => s + it.qty, 0);
  const allPicked = order.items.every((it) => it.picked);

  // Simulated barcode scanner verification
  const handleBarcodeScan = (e) => {
    e.preventDefault();
    if (!scannedBarcode.trim()) return;

    // Check if entered barcode or sku matches any unpicked item
    const targetItem = order.items.find(
      (it) =>
        (!it.picked && it.skuId.toLowerCase() === scannedBarcode.toLowerCase()) ||
        (!it.picked && scannedBarcode.includes(it.skuId.split('-')[1]))
    );

    if (targetItem) {
      onToggleItem(order.id, targetItem.skuId);
      setScanMessage({ text: `Matched & Picked: ${targetItem.name}`, type: 'success' });
      setScannedBarcode('');
    } else {
      setScanMessage({ text: `Barcode ${scannedBarcode} not found in this order!`, type: 'error' });
    }

    setTimeout(() => setScanMessage(null), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-900 text-white">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-amber-400 font-mono">{order.id}</span>
              <span className="text-xs bg-slate-800 px-2 py-0.5 rounded text-slate-300 font-medium">
                Bag: {order.bagId}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Customer: <strong className="text-slate-200">{order.customerName}</strong> ({order.customerAddress})
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Picker Assignment & Progress */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Picker Assignment */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Assigned Dark Store Picker
              </span>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-lg">🏃</span>
                <span className="font-bold text-slate-900">
                  {order.pickerName || 'No picker assigned yet'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <select
                value={order.pickerId || ''}
                onChange={(e) => onAssignPicker(order.id, e.target.value)}
                className="px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-amber-500 focus:outline-none"
              >
                <option value="">-- Assign Picker --</option>
                {PICKERS.map((picker) => (
                  <option key={picker.id} value={picker.id}>
                    {picker.avatar} {picker.name} ({picker.speed})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Pick Progress Bar */}
          <div>
            <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1.5">
              <span>Pick-List Progress</span>
              <span className="text-amber-600 font-mono">
                {pickedItemsCount} / {totalItemsCount} Units Verified
              </span>
            </div>
            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-amber-500 h-full rounded-full transition-all duration-300"
                style={{ width: `${(pickedItemsCount / totalItemsCount) * 100}%` }}
              />
            </div>
          </div>

          {/* Barcode Quick Scan Input */}
          <form onSubmit={handleBarcodeScan} className="flex gap-2">
            <div className="relative flex-1">
              <Barcode className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Scan or type SKU ID (e.g. SKU-1001 or 1001)..."
                value={scannedBarcode}
                onChange={(e) => setScannedBarcode(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-mono focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-bold transition"
            >
              Scan Verify
            </button>
          </form>

          {scanMessage && (
            <div
              className={`p-2 rounded-lg text-xs font-medium ${
                scanMessage.type === 'success'
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-rose-50 text-rose-800 border border-rose-200'
              }`}
            >
              {scanMessage.text}
            </div>
          )}

          {/* Pick-List Items by Route Order */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Aisle-Optimized Pick Sequence
              </span>
              <button
                type="button"
                onClick={() => {
                  order.items.forEach((it) => {
                    if (!it.picked) onToggleItem(order.id, it.skuId);
                  });
                }}
                className="text-xs text-amber-600 hover:text-amber-800 font-semibold cursor-pointer"
              >
                ✓ Pick All Shortcut
              </button>
            </div>

            <div className="space-y-2">
              {order.items.map((item, idx) => (
                <div
                  key={item.skuId}
                  onClick={() => onToggleItem(order.id, item.skuId)}
                  className={`p-3 rounded-xl border transition cursor-pointer flex items-center justify-between ${
                    item.picked
                      ? 'bg-emerald-50/70 border-emerald-300 text-emerald-950'
                      : 'bg-white border-slate-200 hover:border-amber-400'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0">
                      {item.picked ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      ) : (
                        <Circle className="w-5 h-5 text-slate-300" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700">
                          Step #{idx + 1}
                        </span>
                        <span className="font-bold text-sm text-slate-900">{item.name}</span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                        <span className="font-mono text-amber-700 font-bold bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200">
                          📍 {item.rack}
                        </span>
                        <span className="font-mono text-slate-500">{item.skuId}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-sm font-black text-slate-900">Qty: {item.qty}</span>
                    <div className="text-xs text-slate-500">₹{item.unitPrice * item.qty}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="text-xs text-slate-500">
            Total: <strong className="text-slate-900 text-sm">₹{order.totalAmount}</strong>
          </div>

          <div className="flex items-center gap-2">
            {order.status !== 'PACKED' && order.status !== 'DISPATCHED' && (
              <button
                type="button"
                disabled={!allPicked}
                onClick={() => {
                  onPackOrder(order.id);
                  onClose();
                }}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
                  allPicked
                    ? 'bg-amber-500 hover:bg-amber-600 text-slate-950 cursor-pointer shadow-sm'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                <PackageCheck className="w-4 h-4" />
                <span>Seal Bag & Pack Order</span>
              </button>
            )}

            {order.status === 'PACKED' && (
              <button
                type="button"
                onClick={() => {
                  onDispatchOrder(order.id);
                  onClose();
                }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer shadow-sm active:scale-95 transition"
              >
                <Send className="w-4 h-4" />
                <span>Dispatch with Delivery Rider</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
