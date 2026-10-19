import React, { useState } from 'react';
import { InventoryProvider, useInventory } from './context/InventoryContext';
import { Header } from './components/Header';
import { Tabs } from './components/Tabs';
import { ProductsTab } from './components/ProductsTab';
import { OrdersTab } from './components/OrdersTab';
import { RestockTab } from './components/RestockTab';
import { SummaryTab } from './components/SummaryTab';

const SimpleDashboard = () => {
  const [activeTab, setActiveTab] = useState('products');
  const { toast } = useInventory();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* Clean Navbar */}
      <Header />

      {/* 4 Clean Tabs */}
      <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-6">
        {activeTab === 'products' && <ProductsTab />}
        {activeTab === 'orders' && <OrdersTab />}
        {activeTab === 'restock' && <RestockTab />}
        {activeTab === 'summary' && <SummaryTab />}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-3 text-center text-xs text-gray-500">
        <div className="max-w-6xl mx-auto px-4 flex items-center justify-between">
          <span>Quick Commerce Inventory Management System (SPM Project)</span>
          <span>React.js + LocalStorage</span>
        </div>
      </footer>

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 bg-gray-900 text-white px-4 py-2.5 rounded-lg shadow-lg text-xs font-semibold animate-fade-in flex items-center gap-2">
          <span>{toast}</span>
        </div>
      )}
    </div>
  );
};

export function App() {
  return (
    <InventoryProvider>
      <SimpleDashboard />
    </InventoryProvider>
  );
}

export default App;
