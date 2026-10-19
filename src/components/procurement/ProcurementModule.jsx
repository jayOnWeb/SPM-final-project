import React, { useState } from 'react';
import {
  Truck,
  Plus,
  Zap,
  PackageCheck,
  Calendar,
  AlertCircle,
  Clock,
  ArrowRight,
  ShieldCheck,
  Building2
} from 'lucide-react';
import { useInventory } from '../../context/InventoryContext';
import { SUPPLIERS } from '../../types/constants';
import { POStatusBadge } from '../common/Badge';
import { NewPOModal } from './NewPOModal';
import { GRNReceiveModal } from './GRNReceiveModal';

export const ProcurementModule = () => {
  const {
    inventory,
    purchaseOrders,
    updatePOStatus,
    receiveGRN,
    generateAutoReplenishPO
  } = useInventory();

  const [activeTab, setActiveTab] = useState('POS'); // 'POS' or 'SUPPLIERS'
  const [isNewPOModalOpen, setIsNewPOModalOpen] = useState(false);
  const [selectedPOForGRN, setSelectedPOForGRN] = useState(null);

  // Compute metrics
  const pendingInbound = purchaseOrders.filter(
    (p) => p.status === 'ORDERED' || p.status === 'IN_TRANSIT'
  );
  const totalPOValue = purchaseOrders.reduce((sum, p) => sum + p.totalCost, 0);
  const lowStockCount = inventory.filter((i) => i.stock <= i.minSafetyStock).length;

  return (
    <div className="space-y-6">
      {/* Top Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Purchase Orders
            </span>
            <div className="text-2xl font-black text-slate-900 mt-1">
              {purchaseOrders.length} POs
            </div>
            <div className="text-xs text-slate-500 mt-0.5">
              Valued at ₹{totalPOValue.toLocaleString()}
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            <Truck className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Inbound Shipments
            </span>
            <div className="text-2xl font-black text-indigo-900 mt-1">
              {pendingInbound.length} Active
            </div>
            <div className="text-xs text-indigo-600 font-medium mt-0.5">
              En route to dark store dock
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Depot Suppliers
            </span>
            <div className="text-2xl font-black text-slate-900 mt-1">
              {SUPPLIERS.length} Partners
            </div>
            <div className="text-xs text-slate-500 mt-0.5">Avg lead time: 1.5 days</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold">
            <Building2 className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">
              Auto-Replenish Alert
            </span>
            <div className="text-2xl font-black text-amber-950 mt-1">
              {lowStockCount} SKUs Low
            </div>
            <button
              onClick={generateAutoReplenishPO}
              className="text-xs font-bold text-amber-700 underline mt-0.5 hover:text-amber-900 cursor-pointer"
            >
              Click to Auto-Draft PO →
            </button>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-200 text-amber-800 flex items-center justify-center font-bold">
            <Zap className="w-6 h-6 fill-current" />
          </div>
        </div>
      </div>

      {/* Main Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('POS')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === 'POS'
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Purchase Orders ({purchaseOrders.length})
          </button>
          <button
            onClick={() => setActiveTab('SUPPLIERS')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === 'SUPPLIERS'
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Supplier Depots Directory ({SUPPLIERS.length})
          </button>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={generateAutoReplenishPO}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-amber-50 text-amber-900 border border-amber-300 hover:bg-amber-100 transition cursor-pointer"
          >
            <Zap className="w-3.5 h-3.5 fill-current text-amber-600" />
            <span>1-Click Replenish Low Stock</span>
          </button>

          <button
            onClick={() => setIsNewPOModalOpen(true)}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ Raise PO</span>
          </button>
        </div>
      </div>

      {/* View 1: Purchase Orders List */}
      {activeTab === 'POS' && (
        <div className="space-y-3">
          {purchaseOrders.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400">
              <Truck className="w-10 h-10 mx-auto text-slate-300 mb-2" />
              <p className="font-bold text-slate-700">No Purchase Orders Created Yet</p>
              <p className="text-xs text-slate-400 mt-1">
                Click &quot;+ Raise PO&quot; or use the &quot;1-Click Replenish&quot; button.
              </p>
            </div>
          ) : (
            purchaseOrders.map((po) => {
              const totalItemsCount = po.items.reduce((s, it) => s + it.orderedQty, 0);

              return (
                <div
                  key={po.id}
                  className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition p-5 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4"
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className="font-mono font-black text-sm text-slate-900">{po.id}</span>
                      <POStatusBadge status={po.status} />
                      <span className="text-xs text-slate-500 font-medium">
                        Order Date: <strong>{po.orderDate}</strong>
                      </span>
                      <span className="text-xs text-indigo-600 font-medium bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                        Expected: {po.expectedDelivery}
                      </span>
                    </div>

                    <div className="text-xs text-slate-700">
                      Supplier: <strong className="text-slate-900 font-bold">{po.supplierName}</strong>
                    </div>

                    {/* PO Items */}
                    <div className="flex items-center gap-1.5 flex-wrap pt-1">
                      {po.items.map((it, idx) => (
                        <span
                          key={idx}
                          className="text-[11px] px-2.5 py-0.5 rounded-md font-medium bg-slate-50 border border-slate-200 text-slate-700 flex items-center gap-1"
                        >
                          <span className="font-bold text-slate-900">{it.orderedQty}x</span>
                          <span>{it.name}</span>
                          <span className="text-slate-400 font-mono">(@₹{it.unitCost})</span>
                        </span>
                      ))}
                    </div>

                    {po.notes && (
                      <p className="text-[11px] text-slate-400 italic">Note: {po.notes}</p>
                    )}
                  </div>

                  {/* Right Action Bay */}
                  <div className="flex items-center gap-4 w-full lg:w-auto justify-between lg:justify-end pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                    <div className="text-left lg:text-right">
                      <div className="text-xs text-slate-500">Total Purchase:</div>
                      <div className="font-mono text-base font-black text-slate-900">
                        ₹{po.totalCost.toLocaleString()}
                      </div>
                      <div className="text-[10px] text-slate-400">{totalItemsCount} units total</div>
                    </div>

                    <div>
                      {po.status === 'ORDERED' && (
                        <button
                          onClick={() => updatePOStatus(po.id, 'IN_TRANSIT')}
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition active:scale-95 cursor-pointer"
                        >
                          <Truck className="w-4 h-4" />
                          <span>Mark In Transit</span>
                        </button>
                      )}

                      {po.status === 'IN_TRANSIT' && (
                        <button
                          onClick={() => setSelectedPOForGRN(po)}
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition active:scale-95 cursor-pointer"
                        >
                          <PackageCheck className="w-4 h-4" />
                          <span>Dock Inwarding (GRN)</span>
                        </button>
                      )}

                      {po.status === 'RECEIVED' && (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-300">
                          <ShieldCheck className="w-4 h-4" /> Stock Inwarded
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* View 2: Suppliers Directory */}
      {activeTab === 'SUPPLIERS' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {SUPPLIERS.map((supplier) => (
            <div
              key={supplier.id}
              className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-3"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="font-mono text-xs font-bold text-slate-400">{supplier.id}</span>
                  <h4 className="font-bold text-slate-900 text-sm mt-0.5">{supplier.name}</h4>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-semibold inline-block mt-1">
                    {supplier.category}
                  </span>
                </div>
                <div className="text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200 px-2 py-1 rounded-lg">
                  ★ {supplier.rating}
                </div>
              </div>

              <div className="text-xs text-slate-600 space-y-1 pt-2 border-t border-slate-100">
                <div className="flex justify-between">
                  <span className="text-slate-400">Lead Time:</span>
                  <strong className="text-slate-900">{supplier.leadTimeDays} business day(s)</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Delivery Window:</span>
                  <strong className="text-slate-900">Morning 5:00 AM - 7:00 AM</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Contract Status:</span>
                  <span className="text-emerald-600 font-bold">Active SLA Partner</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* New PO Modal */}
      <NewPOModal
        isOpen={isNewPOModalOpen}
        onClose={() => setIsNewPOModalOpen(false)}
      />

      {/* GRN Receive Modal */}
      {selectedPOForGRN && (
        <GRNReceiveModal
          isOpen={!!selectedPOForGRN}
          onClose={() => setSelectedPOForGRN(null)}
          po={selectedPOForGRN}
          onReceive={receiveGRN}
        />
      )}
    </div>
  );
};
