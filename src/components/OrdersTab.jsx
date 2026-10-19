import React from 'react';
import { Zap, CheckCircle2, Clock, PackageCheck, Send, ShoppingBag } from 'lucide-react';
import { useInventory } from '../context/InventoryContext';

export const OrdersTab = () => {
  const { orders, createQuickOrder, updateOrderStatus } = useInventory();

  return (
    <div className="space-y-5">
      {/* Action Banner */}
      <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded bg-amber-100 text-amber-800 font-bold">
              <Zap className="w-4 h-4 fill-current" />
            </span>
            <h2 className="text-base font-bold text-gray-900">
              10-Minute Delivery Orders
            </h2>
          </div>
          <p className="text-xs text-gray-500 mt-1 max-w-lg">
            Flow: <strong>Pending</strong> &rarr; <strong>Packed</strong> &rarr; <strong>Delivered</strong>. When an order is delivered, the items are automatically deducted from stock!
          </p>
        </div>

        {/* 1-Click Order Generator */}
        <button
          onClick={createQuickOrder}
          className="flex items-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-sm font-semibold transition active:scale-95 shadow-xs cursor-pointer"
        >
          <Zap className="w-4 h-4 fill-current" />
          <span>+ Create Instant Order</span>
        </button>
      </div>

      {/* Orders List */}
      <div className="space-y-3">
        {orders.length === 0 ? (
          <div className="bg-white p-10 rounded-xl border border-gray-200 text-center text-gray-400">
            <ShoppingBag className="w-8 h-8 mx-auto mb-2 text-gray-300" />
            <p className="font-semibold text-gray-700">No active orders</p>
            <p className="text-xs text-gray-400 mt-1">
              Click &quot;+ Create Instant Order&quot; above to simulate an incoming customer order.
            </p>
          </div>
        ) : (
          orders.map((order) => {
            let statusBadge = (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                <Clock className="w-3 h-3" /> Pending
              </span>
            );

            if (order.status === 'Packed') {
              statusBadge = (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-xs font-semibold bg-blue-50 text-blue-800 border border-blue-200">
                  <PackageCheck className="w-3 h-3" /> Packed
                </span>
              );
            } else if (order.status === 'Delivered') {
              statusBadge = (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-xs font-semibold bg-green-50 text-green-800 border border-green-200">
                  <CheckCircle2 className="w-3 h-3" /> Delivered
                </span>
              );
            }

            return (
              <div
                key={order.id}
                className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                {/* Order Information */}
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-gray-900 text-sm">
                      {order.id}
                    </span>
                    {statusBadge}
                    <span className="text-xs text-gray-400">{order.time}</span>
                  </div>

                  <div className="text-xs text-gray-600">
                    Customer: <strong className="text-gray-900">{order.customer}</strong> •{' '}
                    <span className="text-gray-500">{order.address}</span>
                  </div>

                  {/* Items List */}
                  <div className="flex items-center gap-1.5 flex-wrap pt-1">
                    {order.items.map((item, idx) => (
                      <span
                        key={idx}
                        className="text-xs bg-gray-50 border border-gray-200 px-2 py-0.5 rounded text-gray-700 font-medium"
                      >
                        {item.qty}x {item.name} (₹{item.price})
                      </span>
                    ))}
                  </div>
                </div>

                {/* Amount & Status Action Button */}
                <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100">
                  <div className="text-left sm:text-right">
                    <div className="text-xs text-gray-400">Total:</div>
                    <div className="text-base font-bold text-gray-900">
                      ₹{order.total}
                    </div>
                  </div>

                  {/* Actions */}
                  <div>
                    {order.status === 'Pending' && (
                      <button
                        onClick={() => updateOrderStatus(order.id, 'Packed')}
                        className="flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition cursor-pointer"
                      >
                        <PackageCheck className="w-3.5 h-3.5" />
                        <span>Pack Order</span>
                      </button>
                    )}

                    {order.status === 'Packed' && (
                      <button
                        onClick={() => updateOrderStatus(order.id, 'Delivered')}
                        className="flex items-center gap-1.5 px-3.5 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-xs font-semibold transition shadow-xs cursor-pointer"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Deliver (Reduces Stock)</span>
                      </button>
                    )}

                    {order.status === 'Delivered' && (
                      <span className="text-xs font-medium text-gray-400 px-3 py-1.5 bg-gray-50 rounded-lg border border-gray-200">
                        Order Completed
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
