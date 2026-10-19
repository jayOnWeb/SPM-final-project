import React, { useState } from 'react';
import { InventoryProvider, useInventory } from './context/InventoryContext';
import { Header } from './components/layout/Header';
import { Navigation } from './components/layout/Sidebar';
import { InventoryModule } from './components/inventory/InventoryModule';
import { OrderFulfillmentModule } from './components/orders/OrderFulfillmentModule';
import { ProcurementModule } from './components/procurement/ProcurementModule';
import { AnalyticsModule } from './components/analytics/AnalyticsModule';
import { SpmInfoModal } from './components/common/SpmInfoModal';
import { Toast } from './components/common/Toast';

const MainLayout = () => {
  const [activeTab, setActiveTab] = useState('inventory');
  const [isSpmModalOpen, setIsSpmModalOpen] = useState(false);
  const { toast } = useInventory();

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      {/* Top Application Header */}
      <Header onOpenSpmModal={() => setIsSpmModalOpen(true)} />

      {/* Module Navigation Tabs */}
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Workspace Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'inventory' && <InventoryModule />}
        {activeTab === 'fulfillment' && <OrderFulfillmentModule />}
        {activeTab === 'procurement' && <ProcurementModule />}
        {activeTab === 'analytics' && <AnalyticsModule />}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 text-center text-xs text-slate-500 mt-auto">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-slate-800">FlashStock IMS</span>
            <span>•</span>
            <span>Quick Commerce Micro-Fulfillment & Inventory Management</span>
          </div>
          <div className="flex items-center gap-3 text-slate-400">
            <span>React 19 + LocalStorage</span>
            <span>•</span>
            <button
              onClick={() => setIsSpmModalOpen(true)}
              className="text-amber-600 hover:text-amber-700 font-semibold cursor-pointer underline"
            >
              SPM Project Documentation & Agile Sprints
            </button>
          </div>
        </div>
      </footer>

      {/* Floating Alerts & Modals */}
      <Toast toast={toast} />
      <SpmInfoModal isOpen={isSpmModalOpen} onClose={() => setIsSpmModalOpen(false)} />
    </div>
  );
};

export function App() {
  return (
    <InventoryProvider>
      <MainLayout />
    </InventoryProvider>
  );
}

export default App;
