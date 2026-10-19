import React from 'react';
import { CheckCircle2, AlertTriangle, Info, XCircle } from 'lucide-react';

export const Toast = ({ toast }) => {
  if (!toast) return null;

  const iconMap = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0" />,
    error: <XCircle className="w-5 h-5 text-rose-500 flex-shrink-0" />,
    info: <Info className="w-5 h-5 text-blue-500 flex-shrink-0" />
  };

  const bgMap = {
    success: 'bg-white border-emerald-300 text-slate-800 shadow-emerald-100',
    warning: 'bg-white border-amber-300 text-slate-800 shadow-amber-100',
    error: 'bg-white border-rose-300 text-slate-800 shadow-rose-100',
    info: 'bg-white border-blue-300 text-slate-800 shadow-blue-100'
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-bounce transition-all">
      <div
        className={`flex items-center gap-3 px-4 py-3 rounded-xl border shadow-xl max-w-md ${
          bgMap[toast.type] || bgMap.info
        }`}
      >
        {iconMap[toast.type] || iconMap.info}
        <span className="text-sm font-medium">{toast.message}</span>
      </div>
    </div>
  );
};
