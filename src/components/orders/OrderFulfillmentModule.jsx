import React, { useState, useEffect } from 'react';
import {
  Flame,
  Zap,
  Clock,
  CheckCircle,
  PackageCheck,
  Send,
  UserCheck,
  Plus,
  Play,
  Pause,
  AlertTriangle,
  ShoppingBag
} from 'lucide-react';
import { useInventory } from '../../context/InventoryContext';
import { OrderStatusBadge } from '../common/Badge';
import { PickerModal } from './PickerModal';
import { NewOrderModal } from './NewOrderModal';

// Live SLA Countdown Timer Component
const SlaTimer = ({ createdAt, targetSeconds = 600, status }) => {
  const [secondsRemaining, setSecondsRemaining] = useState(() => {
    const elapsed = (Date.now() - new Date(createdAt).getTime()) / 1000;
    return Math.max(0, targetSeconds - Math.floor(elapsed));
  });

  useEffect(() => {
    if (status === 'DISPATCHED') return;
    const interval = setInterval(() => {
      const elapsed = (Date.now() - new Date(createdAt).getTime()) / 1000;
      setSecondsRemaining(Math.max(0, targetSeconds - Math.floor(elapsed)));
    }, 1000);
    return () => clearInterval(interval);
  }, [createdAt, targetSeconds, status]);

  if (status === 'DISPATCHED') {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
        <CheckCircle className="w-3.5 h-3.5" /> Dispatched in SLA
      </span>
    );
  }

  const mins = Math.floor(secondsRemaining / 60);
  const secs = secondsRemaining % 60;
  const timeFormatted = `${mins}:${secs < 10 ? '0' : ''}${secs}`;

  let colorClass = 'text-emerald-700 bg-emerald-50 border-emerald-200';
  if (secondsRemaining <= 180 && secondsRemaining > 0) {
    colorClass = 'text-rose-700 bg-rose-50 border-rose-300 animate-pulse';
  } else if (secondsRemaining <= 360) {
    colorClass = 'text-amber-700 bg-amber-50 border-amber-200';
  } else if (secondsRemaining === 0) {
    colorClass = 'text-red-900 bg-red-100 border-red-400 font-extrabold';
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono font-bold border ${colorClass}`}
    >
      <Clock className="w-3.5 h-3.5" />
      <span>{secondsRemaining === 0 ? 'SLA BREACHED' : `${timeFormatted} SLA`}</span>
    </span>
  );
};

export const OrderFulfillmentModule = () => {
  const {
    orders,
    assignPicker,
    toggleItemPicked,
    packOrder,
    dispatchOrder,
    generateRandomOrder
  } = useInventory();

  const [activeStatusTab, setActiveStatusTab] = useState('ALL');
  const [selectedOrderForPick, setSelectedOrderForPick] = useState(null);
  const [isNewOrderModalOpen, setIsNewOrderModalOpen] = useState(false);
  const [autoSimulation, setAutoSimulation] = useState(false);

  // Auto simulation timer
  useEffect(() => {
    let timer = null;
    if (autoSimulation) {
      timer = setInterval(() => {
        generateRandomOrder();
      }, 30000); // generate every 30 seconds
    }
    return () => clearInterval(timer);
  }, [autoSimulation, generateRandomOrder]);

  // Keep modal in sync with order updates
  const activeModalOrder = selectedOrderForPick
    ? orders.find((o) => o.id === selectedOrderForPick.id) || null
    : null;

  // Filtered orders
  const filteredOrders = orders.filter((order) => {
    if (activeStatusTab === 'ALL') return true;
    return order.status === activeStatusTab;
  });

  const countByStatus = {
    ALL: orders.length,
    RECEIVED: orders.filter((o) => o.status === 'RECEIVED').length,
    PICKING: orders.filter((o) => o.status === 'PICKING').length,
    PACKED: orders.filter((o) => o.status === 'PACKED').length,
    DISPATCHED: orders.filter((o) => o.status === 'DISPATCHED').length
  };

  return (
    <div className="space-y-6">
      {/* Module Banner / Quick Controls */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white p-6 rounded-2xl shadow-md border border-slate-700/60 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-lg bg-amber-500 text-slate-950 font-black">
              <Flame className="w-5 h-5 fill-current" />
            </span>
            <h2 className="text-xl font-black tracking-tight">
              10-Minute Micro-Fulfillment & Dispatch Station
            </h2>
          </div>
          <p className="text-xs text-slate-300 mt-1 max-w-xl">
            Optimized picker routing across dark store aisles. Average target picking window: <strong>2.5 mins</strong>. Barcode verification and tamper-evident bag sealing.
          </p>
        </div>

        {/* Live Simulation Controls */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
          <button
            onClick={() => setAutoSimulation(!autoSimulation)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition border ${
              autoSimulation
                ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-md shadow-amber-400/20'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
            }`}
          >
            {autoSimulation ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>Auto-Stream Orders {autoSimulation ? '(ON 30s)' : '(OFF)'}</span>
          </button>

          <button
            onClick={generateRandomOrder}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 transition active:scale-95"
          >
            <Zap className="w-3.5 h-3.5 fill-current" />
            <span>Simulate Order</span>
          </button>

          <button
            onClick={() => setIsNewOrderModalOpen(true)}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-700 hover:bg-slate-600 text-white transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Custom Order</span>
          </button>
        </div>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs">
        {[
          { id: 'ALL', label: 'All Orders' },
          { id: 'RECEIVED', label: 'Received (Awaiting Picker)' },
          { id: 'PICKING', label: 'In Picking' },
          { id: 'PACKED', label: 'Packed & Bagged' },
          { id: 'DISPATCHED', label: 'Dispatched to Rider' }
        ].map((tab) => {
          const isActive = activeStatusTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveStatusTab(tab.id)}
              className={`px-3.5 py-2 rounded-xl whitespace-nowrap transition cursor-pointer font-bold flex items-center gap-2 ${
                isActive
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${
                  isActive
                    ? 'bg-amber-500 text-slate-950'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                {countByStatus[tab.id]}
              </span>
            </button>
          );
        })}
      </div>

      {/* Orders List / Cards */}
      <div className="space-y-3">
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400">
            <ShoppingBag className="w-10 h-10 mx-auto text-slate-300 mb-2" />
            <p className="font-bold text-slate-700">No orders in this queue</p>
            <p className="text-xs text-slate-400 mt-1">
              Click &quot;Simulate Order&quot; above to trigger a live quick-commerce checkout.
            </p>
          </div>
        ) : (
          filteredOrders.map((order) => {
            const pickedCount = order.items.filter((it) => it.picked).length;
            const totalCount = order.items.length;
            const isCompleted = order.status === 'DISPATCHED';

            return (
              <div
                key={order.id}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition p-5 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4"
              >
                {/* Order Details & SLA */}
                <div className="flex-1 space-y-2">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="font-mono font-black text-sm text-slate-900">
                      {order.id}
                    </span>
                    <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                      Bag: {order.bagId}
                    </span>
                    <OrderStatusBadge status={order.status} />
                    <SlaTimer
                      createdAt={order.createdAt}
                      targetSeconds={order.targetSlaSeconds}
                      status={order.status}
                    />
                  </div>

                  {/* Customer Info */}
                  <div className="text-xs text-slate-600">
                    <span className="font-bold text-slate-900">{order.customerName}</span> •{' '}
                    <span className="text-slate-500">{order.customerAddress}</span>
                  </div>

                  {/* Item Pills Preview */}
                  <div className="flex items-center gap-1.5 flex-wrap pt-1">
                    {order.items.map((item) => (
                      <span
                        key={item.skuId}
                        className={`text-[11px] px-2 py-0.5 rounded-md font-medium border flex items-center gap-1 ${
                          item.picked
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : 'bg-slate-50 text-slate-700 border-slate-200'
                        }`}
                      >
                        <span>
                          {item.qty}x {item.name}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">({item.rack.split('-')[1] || item.rack})</span>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Fulfillment Station Status & Action Button */}
                <div className="flex items-center gap-4 w-full lg:w-auto justify-between lg:justify-end pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                  <div className="text-left lg:text-right">
                    <div className="text-xs font-semibold text-slate-500">
                      Picker: <strong className="text-slate-900">{order.pickerName || 'Unassigned'}</strong>
                    </div>
                    <div className="text-xs text-slate-500">
                      Rider: <strong className="text-slate-900">{order.deliveryExecutive}</strong>
                    </div>
                    <div className="text-xs font-bold text-slate-900 mt-0.5 font-mono">
                      ₹{order.totalAmount}
                    </div>
                  </div>

                  {/* Action Workflow Button */}
                  <div>
                    {order.status === 'RECEIVED' && (
                      <button
                        onClick={() => setSelectedOrderForPick(order)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-sm transition active:scale-95 cursor-pointer"
                      >
                        <UserCheck className="w-4 h-4" />
                        <span>Assign & Pick</span>
                      </button>
                    )}

                    {order.status === 'PICKING' && (
                      <button
                        onClick={() => setSelectedOrderForPick(order)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-purple-600 hover:bg-purple-700 text-white shadow-sm transition active:scale-95 cursor-pointer"
                      >
                        <PackageCheck className="w-4 h-4" />
                        <span>
                          Pick Station ({pickedCount}/{totalCount})
                        </span>
                      </button>
                    )}

                    {order.status === 'PACKED' && (
                      <button
                        onClick={() => dispatchOrder(order.id)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition active:scale-95 cursor-pointer"
                      >
                        <Send className="w-4 h-4" />
                        <span>Dispatch (Decrements Stock)</span>
                      </button>
                    )}

                    {order.status === 'DISPATCHED' && (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1.5 rounded-xl border border-emerald-300">
                        <CheckCircle className="w-4 h-4" /> Out For Delivery
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Picker Modal */}
      {activeModalOrder && (
        <PickerModal
          isOpen={!!activeModalOrder}
          onClose={() => setSelectedOrderForPick(null)}
          order={activeModalOrder}
          onAssignPicker={assignPicker}
          onToggleItem={toggleItemPicked}
          onPackOrder={packOrder}
          onDispatchOrder={dispatchOrder}
        />
      )}

      {/* Custom Order Modal */}
      <NewOrderModal
        isOpen={isNewOrderModalOpen}
        onClose={() => setIsNewOrderModalOpen(false)}
      />
    </div>
  );
};
