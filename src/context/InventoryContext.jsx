import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_PRODUCTS, INITIAL_ORDERS, INITIAL_RESTOCK_LOGS } from '../types/constants';

const InventoryContext = createContext();

export const InventoryProvider = ({ children }) => {
  // Load products from localStorage or fallback to initial
  const [products, setProducts] = useState(() => {
    try {
      const saved = localStorage.getItem('qc_products');
      return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
    } catch {
      return INITIAL_PRODUCTS;
    }
  });

  // Load orders from localStorage or fallback
  const [orders, setOrders] = useState(() => {
    try {
      const saved = localStorage.getItem('qc_orders');
      return saved ? JSON.parse(saved) : INITIAL_ORDERS;
    } catch {
      return INITIAL_ORDERS;
    }
  });

  // Load restock history
  const [restockLogs, setRestockLogs] = useState(() => {
    try {
      const saved = localStorage.getItem('qc_restock');
      return saved ? JSON.parse(saved) : INITIAL_RESTOCK_LOGS;
    } catch {
      return INITIAL_RESTOCK_LOGS;
    }
  });

  const [toast, setToast] = useState(null);

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  // Save changes to localStorage automatically
  useEffect(() => {
    localStorage.setItem('qc_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('qc_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('qc_restock', JSON.stringify(restockLogs));
  }, [restockLogs]);

  // --- 1. Product Actions ---
  const addProduct = (newProduct) => {
    const item = {
      ...newProduct,
      id: Date.now(),
      stock: Number(newProduct.stock) || 0,
      minStock: Number(newProduct.minStock) || 5,
      price: Number(newProduct.price) || 0
    };
    setProducts((prev) => [item, ...prev]);
    showToast(`Added ${item.name} to inventory!`);
  };

  const adjustStock = (productId, diff) => {
    setProducts((prev) =>
      prev.map((item) => {
        if (item.id === productId) {
          const newStock = Math.max(0, item.stock + diff);
          return { ...item, stock: newStock };
        }
        return item;
      })
    );
  };

  const deleteProduct = (productId) => {
    setProducts((prev) => prev.filter((item) => item.id !== productId));
    showToast('Product removed from inventory');
  };

  // --- 2. Order Actions ---
  // Create a 1-click Quick Order
  const createQuickOrder = () => {
    const inStockItems = products.filter((p) => p.stock > 0);
    if (inStockItems.length === 0) {
      showToast('No products in stock to create an order!');
      return;
    }

    const randomItems = [...inStockItems].sort(() => 0.5 - Math.random()).slice(0, 2);
    const orderItems = randomItems.map((p) => ({
      id: p.id,
      name: p.name,
      qty: 1,
      price: p.price
    }));

    const total = orderItems.reduce((sum, item) => sum + item.price * item.qty, 0);
    const names = ['Amit Kumar', 'Sneha Sharma', 'Vikram Singh', 'Rhea Sen'];
    const randomCustomer = names[Math.floor(Math.random() * names.length)];

    const newOrder = {
      id: `ORD-${Math.floor(100 + Math.random() * 900)}`,
      customer: randomCustomer,
      address: 'Near Indiranagar Metro Station',
      status: 'Pending',
      time: 'Just now',
      items: orderItems,
      total
    };

    setOrders((prev) => [newOrder, ...prev]);
    showToast(`⚡ New Order ${newOrder.id} created!`);
  };

  // Change order status: Pending -> Packed -> Delivered
  const updateOrderStatus = (orderId, newStatus) => {
    const targetOrder = orders.find((o) => o.id === orderId);
    if (!targetOrder) return;

    // If marking as Delivered, automatically reduce product inventory!
    if (newStatus === 'Delivered' && targetOrder.status !== 'Delivered') {
      setProducts((prev) =>
        prev.map((prod) => {
          const orderItem = targetOrder.items.find((item) => item.id === prod.id);
          if (orderItem) {
            return {
              ...prod,
              stock: Math.max(0, prod.stock - orderItem.qty)
            };
          }
          return prod;
        })
      );
      showToast(`Order ${orderId} delivered! Stock reduced.`);
    } else {
      showToast(`Order ${orderId} marked as ${newStatus}!`);
    }

    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
  };

  // --- 3. Restock Actions ---
  const restockProduct = (productId, qtyToAdd, supplier = 'Main Supplier') => {
    const qty = Number(qtyToAdd);
    if (!qty || qty <= 0) return;

    let productName = '';
    setProducts((prev) =>
      prev.map((item) => {
        if (item.id === productId) {
          productName = item.name;
          return { ...item, stock: item.stock + qty };
        }
        return item;
      })
    );

    const newLog = {
      id: Date.now(),
      productName,
      qty,
      supplier,
      date: new Date().toISOString().split('T')[0]
    };

    setRestockLogs((prev) => [newLog, ...prev]);
    showToast(`Added +${qty} units to ${productName}!`);
  };

  // Reset to initial clean data
  const resetAll = () => {
    setProducts(INITIAL_PRODUCTS);
    setOrders(INITIAL_ORDERS);
    setRestockLogs(INITIAL_RESTOCK_LOGS);
    localStorage.clear();
    showToast('Reset data to initial default!');
  };

  return (
    <InventoryContext.Provider
      value={{
        products,
        orders,
        restockLogs,
        toast,
        showToast,
        addProduct,
        adjustStock,
        deleteProduct,
        createQuickOrder,
        updateOrderStatus,
        restockProduct,
        resetAll
      }}
    >
      {children}
    </InventoryContext.Provider>
  );
};

export const useInventory = () => useContext(InventoryContext);
