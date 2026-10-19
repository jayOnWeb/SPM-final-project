import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  DARK_STORES,
  INITIAL_INVENTORY,
  INITIAL_ORDERS,
  INITIAL_PURCHASE_ORDERS,
  INITIAL_AUDIT_LOGS,
  PICKERS
} from '../types/constants';

const InventoryContext = createContext();

const STORAGE_KEYS = {
  INVENTORY: 'flashstock_inventory_v1',
  ORDERS: 'flashstock_orders_v1',
  PURCHASE_ORDERS: 'flashstock_po_v1',
  AUDIT_LOGS: 'flashstock_audit_v1',
  ACTIVE_STORE: 'flashstock_store_v1',
};

export const InventoryProvider = ({ children }) => {
  // Load from localStorage with fallbacks to initial constants
  const [inventory, setInventory] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.INVENTORY);
      return saved ? JSON.parse(saved) : INITIAL_INVENTORY;
    } catch (e) {
      console.error('Error loading inventory from storage', e);
      return INITIAL_INVENTORY;
    }
  });

  const [orders, setOrders] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ORDERS);
      return saved ? JSON.parse(saved) : INITIAL_ORDERS;
    } catch (e) {
      console.error('Error loading orders from storage', e);
      return INITIAL_ORDERS;
    }
  });

  const [purchaseOrders, setPurchaseOrders] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PURCHASE_ORDERS);
      return saved ? JSON.parse(saved) : INITIAL_PURCHASE_ORDERS;
    } catch (e) {
      console.error('Error loading POs from storage', e);
      return INITIAL_PURCHASE_ORDERS;
    }
  });

  const [auditLogs, setAuditLogs] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS);
      return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
    } catch (e) {
      console.error('Error loading audit logs from storage', e);
      return INITIAL_AUDIT_LOGS;
    }
  });

  const [activeStore, setActiveStore] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ACTIVE_STORE);
      return saved ? JSON.parse(saved) : DARK_STORES[0];
    } catch (e) {
      return DARK_STORES[0];
    }
  });

  const [toast, setToast] = useState(null);
  const [isSimulatingOrders, setIsSimulatingOrders] = useState(false);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.INVENTORY, JSON.stringify(inventory));
  }, [inventory]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PURCHASE_ORDERS, JSON.stringify(purchaseOrders));
  }, [purchaseOrders]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(auditLogs));
  }, [auditLogs]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_STORE, JSON.stringify(activeStore));
  }, [activeStore]);

  // Toast notification helper
  const showToast = (message, type = 'info') => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // Helper to append audit log
  const logAction = (action, description, user = 'Dark Store Admin', tag = 'system') => {
    const newLog = {
      id: `LOG-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toISOString(),
      action,
      description,
      user,
      tag
    };
    setAuditLogs((prev) => [newLog, ...prev.slice(0, 49)]); // keep latest 50
  };

  // --- MODULE 1: INVENTORY ACTIONS ---
  const addSKU = (skuData) => {
    const newId = `SKU-${1000 + inventory.length + 1}`;
    const newSku = {
      ...skuData,
      id: newId,
      stock: Number(skuData.stock) || 0,
      minSafetyStock: Number(skuData.minSafetyStock) || 10,
      reorderQty: Number(skuData.reorderQty) || 30,
      costPrice: Number(skuData.costPrice) || 0,
      sellingPrice: Number(skuData.sellingPrice) || 0,
      dailyBurnRate: Number(skuData.dailyBurnRate) || 10
    };
    setInventory((prev) => [newSku, ...prev]);
    logAction('SKU_CREATED', `Added new SKU: ${newSku.name} (${newId}) with stock ${newSku.stock}`, 'Inventory Lead', 'inventory');
    showToast(`Added SKU ${newSku.name} successfully`, 'success');
  };

  const updateSKU = (id, updatedData) => {
    setInventory((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updatedData } : item))
    );
    logAction('SKU_UPDATED', `Updated SKU details for ${id}`, 'Inventory Lead', 'inventory');
    showToast('SKU updated successfully', 'success');
  };

  const deleteSKU = (id) => {
    const target = inventory.find((i) => i.id === id);
    setInventory((prev) => prev.filter((item) => item.id !== id));
    logAction('SKU_DELETED', `Deleted SKU ${target?.name || id}`, 'Inventory Lead', 'inventory');
    showToast(`Deleted SKU ${id}`, 'warning');
  };

  const adjustStock = (skuId, qtyDiff, reason, notes = '') => {
    let affectedItem = null;
    setInventory((prev) =>
      prev.map((item) => {
        if (item.id === skuId) {
          const newStock = Math.max(0, item.stock + Number(qtyDiff));
          affectedItem = { ...item, stock: newStock };
          return affectedItem;
        }
        return item;
      })
    );

    const sign = qtyDiff > 0 ? `+${qtyDiff}` : `${qtyDiff}`;
    logAction(
      'STOCK_ADJUSTMENT',
      `Stock adjusted by ${sign} for ${affectedItem?.name || skuId}. Reason: ${reason} (${notes})`,
      'Quality/Audit Auditor',
      'audit'
    );
    showToast(`Stock adjusted by ${sign} units`, 'info');
  };

  // --- MODULE 2: ORDER FULFILLMENT ACTIONS ---
  const createOrder = (orderData) => {
    const newOrder = {
      ...orderData,
      id: `QC-ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date().toISOString(),
      targetSlaSeconds: 600,
      status: 'RECEIVED',
      pickerId: null,
      pickerName: null,
      deliveryExecutive: 'Unassigned',
      bagId: `BAG-${Math.floor(100 + Math.random() * 900)}`
    };
    setOrders((prev) => [newOrder, ...prev]);
    logAction('NEW_ORDER_RECEIVED', `Received order ${newOrder.id} with ${newOrder.items.length} items. Total: ₹${newOrder.totalAmount}`, 'Q-Commerce Engine', 'fulfillment');
    showToast(`⚡ New Flash Order ${newOrder.id} Received!`, 'success');
    return newOrder;
  };

  const assignPicker = (orderId, pickerId) => {
    const picker = PICKERS.find((p) => p.id === pickerId);
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id === orderId) {
          return {
            ...order,
            status: 'PICKING',
            pickerId,
            pickerName: picker?.name || 'Assigned Picker'
          };
        }
        return order;
      })
    );
    logAction('PICKER_ASSIGNED', `Picker ${picker?.name} assigned to Order ${orderId}`, 'Store Floor Lead', 'picking');
    showToast(`Assigned ${picker?.name} to ${orderId}`, 'info');
  };

  const toggleItemPicked = (orderId, skuId) => {
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id === orderId) {
          const updatedItems = order.items.map((item) =>
            item.skuId === skuId ? { ...item, picked: !item.picked } : item
          );
          return { ...order, items: updatedItems };
        }
        return order;
      })
    );
  };

  const packOrder = (orderId) => {
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id === orderId) {
          // ensure all items marked picked
          const itemsPicked = order.items.map((it) => ({ ...it, picked: true }));
          return { ...order, status: 'PACKED', items: itemsPicked };
        }
        return order;
      })
    );
    logAction('ORDER_PACKED', `Order ${orderId} packed into security tamper bag. Ready for handover.`, 'Packing Station', 'fulfillment');
    showToast(`Order ${orderId} Packed! Ready for rider dispatch`, 'success');
  };

  const dispatchOrder = (orderId) => {
    const orderToDispatch = orders.find((o) => o.id === orderId);
    if (!orderToDispatch) return;

    // Deduct stock from inventory for this order
    const itemQtyMap = {};
    orderToDispatch.items.forEach((item) => {
      itemQtyMap[item.skuId] = (itemQtyMap[item.skuId] || 0) + item.qty;
    });

    setInventory((prev) =>
      prev.map((sku) => {
        if (itemQtyMap[sku.id]) {
          const updatedStock = Math.max(0, sku.stock - itemQtyMap[sku.id]);
          return { ...sku, stock: updatedStock };
        }
        return sku;
      })
    );

    const riders = ['Suresh Gowda (TVS iQube)', 'Karthik R. (Hero Electric)', 'Imran Khan (Ather 450X)', 'Arif Pasha (Bajaj Chetak)'];
    const randomRider = riders[Math.floor(Math.random() * riders.length)];

    setOrders((prev) =>
      prev.map((order) => {
        if (order.id === orderId) {
          return {
            ...order,
            status: 'DISPATCHED',
            deliveryExecutive: randomRider,
            dispatchedAt: new Date().toISOString()
          };
        }
        return order;
      })
    );

    logAction('ORDER_DISPATCHED', `Order ${orderId} dispatched with rider ${randomRider}. Stock decremented.`, 'Dispatch Bay', 'fulfillment');
    showToast(`🚀 Order ${orderId} Dispatched! Inventory updated.`, 'success');
  };

  const generateRandomOrder = () => {
    if (inventory.length === 0) return;
    const availableSkus = inventory.filter((item) => item.stock > 0);
    if (availableSkus.length === 0) {
      showToast('No items currently in stock to generate order!', 'warning');
      return;
    }

    const itemCount = Math.min(availableSkus.length, Math.floor(Math.random() * 3) + 1);
    const shuffled = [...availableSkus].sort(() => 0.5 - Math.random());
    const selectedSkus = shuffled.slice(0, itemCount);

    const customerNames = [
      'Pooja Nair', 'Rohan Gupta', 'Kavya S.', 'Aditya Rao', 'Neha Singhania', 'Gaurav Chopra', 'Meera Iyer'
    ];
    const customerAddresses = [
      'Flat 301, Brigade Gateway, Malleshwaram',
      'Plot 45, 12th Main Road, HAL 2nd Stage',
      'Apartment 5B, Sobha Iris, Outer Ring Road',
      'Villa 9, Palm Grove Residences, Indiranagar',
      'Flat 804, Godrej Woodsman, Bellary Rd'
    ];

    let totalAmount = 0;
    const items = selectedSkus.map((sku) => {
      const qty = Math.min(sku.stock, Math.floor(Math.random() * 2) + 1);
      totalAmount += qty * sku.sellingPrice;
      return {
        skuId: sku.id,
        name: sku.name,
        qty,
        rack: sku.rack,
        picked: false,
        unitPrice: sku.sellingPrice
      };
    });

    const randomName = customerNames[Math.floor(Math.random() * customerNames.length)];
    const randomAddress = customerAddresses[Math.floor(Math.random() * customerAddresses.length)];

    createOrder({
      customerName: randomName,
      customerAddress: randomAddress,
      items,
      totalAmount
    });
  };

  // --- MODULE 3: PROCUREMENT & PO ACTIONS ---
  const createPurchaseOrder = (poData) => {
    const newPO = {
      ...poData,
      id: `PO-2026-${Math.floor(100 + Math.random() * 900)}`,
      orderDate: new Date().toISOString().split('T')[0],
      status: 'ORDERED'
    };
    setPurchaseOrders((prev) => [newPO, ...prev]);
    logAction('PO_CREATED', `Raised PO ${newPO.id} to supplier ${newPO.supplierName} for ₹${newPO.totalCost}`, 'Procurement Lead', 'procurement');
    showToast(`Created Purchase Order ${newPO.id}`, 'success');
  };

  const updatePOStatus = (poId, status) => {
    setPurchaseOrders((prev) =>
      prev.map((po) => (po.id === poId ? { ...po, status } : po))
    );
    logAction('PO_STATUS_CHANGED', `PO ${poId} status marked as ${status}`, 'Supply Chain Manager', 'procurement');
    showToast(`PO ${poId} status updated to ${status}`, 'info');
  };

  const receiveGRN = (poId, receivedData) => {
    // receivedData: array of { skuId, receivedQty, batchNo, expiryDate }
    const po = purchaseOrders.find((p) => p.id === poId);
    if (!po) return;

    // Update inventory with received quantities and batch/expiry info
    setInventory((prev) =>
      prev.map((item) => {
        const receivedItem = receivedData.find((r) => r.skuId === item.id);
        if (receivedItem && Number(receivedItem.receivedQty) > 0) {
          return {
            ...item,
            stock: item.stock + Number(receivedItem.receivedQty),
            batchNo: receivedItem.batchNo || item.batchNo,
            expiryDate: receivedItem.expiryDate || item.expiryDate
          };
        }
        return item;
      })
    );

    // Update PO status to RECEIVED
    setPurchaseOrders((prev) =>
      prev.map((p) => {
        if (p.id === poId) {
          const updatedItems = p.items.map((it) => {
            const match = receivedData.find((r) => r.skuId === it.skuId);
            return match
              ? {
                  ...it,
                  receivedQty: Number(match.receivedQty),
                  batchNo: match.batchNo,
                  expiryDate: match.expiryDate
                }
              : it;
          });
          return {
            ...p,
            status: 'RECEIVED',
            items: updatedItems,
            receivedAt: new Date().toISOString()
          };
        }
        return p;
      })
    );

    logAction('GRN_INWARDED', `Goods Received Note (GRN) processed for PO ${poId}. Stock added to shelves.`, 'Dock Master', 'inwarding');
    showToast(`✅ Inwarded PO ${poId}! Stock successfully updated on dark store shelves.`, 'success');
  };

  // Auto-generate reorder PO from low stock items
  const generateAutoReplenishPO = () => {
    const lowStockItems = inventory.filter((item) => item.stock <= item.minSafetyStock);
    if (lowStockItems.length === 0) {
      showToast('All items are sufficiently stocked! No reorders needed.', 'info');
      return null;
    }

    const items = lowStockItems.map((item) => ({
      skuId: item.id,
      name: item.name,
      orderedQty: item.reorderQty,
      unitCost: item.costPrice,
      receivedQty: 0,
      batchNo: '',
      expiryDate: ''
    }));

    const totalCost = items.reduce((acc, curr) => acc + curr.orderedQty * curr.unitCost, 0);

    const po = {
      supplierId: 'SUP-01',
      supplierName: 'Amul & Multi-FMCG Depot',
      expectedDelivery: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      items,
      totalCost,
      notes: `Automated replenishment algorithm triggered for ${lowStockItems.length} low-stock SKUs.`
    };

    createPurchaseOrder(po);
    return po;
  };

  // Reset to default seed data
  const resetToDefault = () => {
    setInventory(INITIAL_INVENTORY);
    setOrders(INITIAL_ORDERS);
    setPurchaseOrders(INITIAL_PURCHASE_ORDERS);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    localStorage.clear();
    showToast('Reset system to pristine Quick Commerce seed data!', 'success');
  };

  // Export and Import JSON
  const exportData = () => {
    const data = {
      inventory,
      orders,
      purchaseOrders,
      auditLogs,
      activeStore,
      exportedAt: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `flashstock-qcommerce-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Exported system data backup as JSON', 'info');
  };

  const importData = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(e.target.result);
        if (parsed.inventory) setInventory(parsed.inventory);
        if (parsed.orders) setOrders(parsed.orders);
        if (parsed.purchaseOrders) setPurchaseOrders(parsed.purchaseOrders);
        if (parsed.auditLogs) setAuditLogs(parsed.auditLogs);
        if (parsed.activeStore) setActiveStore(parsed.activeStore);
        showToast('Successfully imported database backup!', 'success');
      } catch (err) {
        showToast('Invalid JSON file format!', 'error');
      }
    };
    reader.readAsText(file);
  };

  return (
    <InventoryContext.Provider
      value={{
        inventory,
        orders,
        purchaseOrders,
        auditLogs,
        activeStore,
        setActiveStore,
        toast,
        showToast,
        // Module 1
        addSKU,
        updateSKU,
        deleteSKU,
        adjustStock,
        // Module 2
        createOrder,
        assignPicker,
        toggleItemPicked,
        packOrder,
        dispatchOrder,
        generateRandomOrder,
        isSimulatingOrders,
        setIsSimulatingOrders,
        // Module 3
        createPurchaseOrder,
        updatePOStatus,
        receiveGRN,
        generateAutoReplenishPO,
        // Utility
        resetToDefault,
        exportData,
        importData,
        logAction
      }}
    >
      {children}
    </InventoryContext.Provider>
  );
};

export const useInventory = () => useContext(InventoryContext);
