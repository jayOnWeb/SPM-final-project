import React from 'react';

export const StockBadge = ({ stock, minSafetyStock }) => {
  if (stock === 0) {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 border border-rose-200">
        <span className="w-1.5 h-1.5 mr-1.5 rounded-full bg-rose-600 animate-pulse"></span>
        Out of Stock
      </span>
    );
  }
  if (stock <= minSafetyStock) {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">
        <span className="w-1.5 h-1.5 mr-1.5 rounded-full bg-amber-600"></span>
        Low Stock ({stock})
      </span>
    );
  }
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
      <span className="w-1.5 h-1.5 mr-1.5 rounded-full bg-emerald-600"></span>
      Optimal ({stock})
    </span>
  );
};

export const ExpiryBadge = ({ expiryDate }) => {
  if (!expiryDate) return <span className="text-xs text-slate-400">N/A</span>;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const exp = new Date(expiryDate);
  exp.setHours(0, 0, 0, 0);

  const diffTime = exp - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800 border border-red-300">
        Expired ({Math.abs(diffDays)}d ago)
      </span>
    );
  }
  if (diffDays <= 3) {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-orange-100 text-orange-800 border border-orange-300 animate-pulse">
        FEFO Alert: {diffDays}d left
      </span>
    );
  }
  if (diffDays <= 7) {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-800 border border-amber-200">
        Expiring in {diffDays}d
      </span>
    );
  }
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-normal text-slate-600 bg-slate-100 border border-slate-200">
      {diffDays} days
    </span>
  );
};

export const OrderStatusBadge = ({ status }) => {
  switch (status) {
    case 'RECEIVED':
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-blue-100 text-blue-800 border border-blue-300">
          <span className="w-2 h-2 mr-1.5 rounded-full bg-blue-500 animate-ping"></span>
          NEW ORDER
        </span>
      );
    case 'PICKING':
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-purple-100 text-purple-800 border border-purple-300">
          <span className="w-2 h-2 mr-1.5 rounded-full bg-purple-500"></span>
          IN PICKING
        </span>
      );
    case 'PACKED':
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
          <span className="w-2 h-2 mr-1.5 rounded-full bg-amber-500"></span>
          PACKED (BAG SEALED)
        </span>
      );
    case 'DISPATCHED':
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
          <span className="w-2 h-2 mr-1.5 rounded-full bg-emerald-500"></span>
          DISPATCHED 🛵
        </span>
      );
    default:
      return <span className="text-xs">{status}</span>;
  }
};

export const POStatusBadge = ({ status }) => {
  switch (status) {
    case 'DRAFT':
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-300">
          Draft
        </span>
      );
    case 'ORDERED':
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 border border-amber-300">
          Ordered (Awaiting Dispatch)
        </span>
      );
    case 'IN_TRANSIT':
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-800 border border-indigo-300">
          🚚 In Transit
        </span>
      );
    case 'RECEIVED':
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
          ✅ GRN Completed & Stocked
        </span>
      );
    default:
      return <span className="text-xs">{status}</span>;
  }
};
