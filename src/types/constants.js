// Constants and Initial Seed Data for Quick Commerce Dark Store Inventory Management

export const DARK_STORES = [
  { id: 'DS-BLR-01', name: 'Dark Store #104 - Indiranagar', city: 'Bengaluru', coverage: '2.5 km radius', avgSla: '7.8 mins' },
  { id: 'DS-BLR-02', name: 'Dark Store #208 - Koramangala', city: 'Bengaluru', coverage: '3.0 km radius', avgSla: '8.4 mins' },
  { id: 'DS-MUM-01', name: 'Dark Store #305 - Andheri West', city: 'Mumbai', coverage: '2.2 km radius', avgSla: '9.1 mins' },
];

export const CATEGORIES = [
  'All Categories',
  'Dairy & Eggs',
  'Fruits & Vegetables',
  'Snacks & Munchies',
  'Beverages & Cold Drinks',
  'Instant & Frozen Food',
  'Personal Care & Cleaning'
];

export const SUPPLIERS = [
  { id: 'SUP-01', name: 'Amul Dairy Central Depot', leadTimeDays: 1, rating: 4.9, category: 'Dairy & Eggs' },
  { id: 'SUP-02', name: 'FreshRoots Agritech Hub', leadTimeDays: 1, rating: 4.8, category: 'Fruits & Vegetables' },
  { id: 'SUP-03', name: 'PepsiCo & Snack Corp', leadTimeDays: 2, rating: 4.7, category: 'Snacks & Munchies' },
  { id: 'SUP-04', name: 'Hindustan Beverages Supply', leadTimeDays: 2, rating: 4.6, category: 'Beverages & Cold Drinks' },
  { id: 'SUP-05', name: 'Nestle Distribution Center', leadTimeDays: 3, rating: 4.9, category: 'Instant & Frozen Food' },
  { id: 'SUP-06', name: 'ITC & FMCG Wholesale', leadTimeDays: 2, rating: 4.5, category: 'Personal Care & Cleaning' }
];

export const PICKERS = [
  { id: 'PK-01', name: 'Ramesh Kumar', speed: '1.8 mins/order', avatar: '👨‍💼', activeOrders: 1 },
  { id: 'PK-02', name: 'Sneha Sharma', speed: '1.5 mins/order', avatar: '👩‍💼', activeOrders: 1 },
  { id: 'PK-03', name: 'Arjun Verma', speed: '2.1 mins/order', avatar: '👨‍🔧', activeOrders: 0 },
  { id: 'PK-04', name: 'Priya Nair', speed: '1.9 mins/order', avatar: '👩‍🔧', activeOrders: 0 }
];

// Helper to generate dynamic dates based on current day
const getFutureDate = (days) => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
};

export const INITIAL_INVENTORY = [
  {
    id: 'SKU-1001',
    name: 'Amul Taaza Fresh Toned Milk',
    unit: '500 ml',
    category: 'Dairy & Eggs',
    rack: 'Zone A - Chiller A-01-A',
    stock: 32,
    minSafetyStock: 20,
    reorderQty: 60,
    costPrice: 25,
    sellingPrice: 28,
    batchNo: 'AM-TON-982',
    expiryDate: getFutureDate(2), // Expiring in 2 days (FEFO trigger)
    dailyBurnRate: 28,
    barcode: '8901262010014',
    isPerishable: true
  },
  {
    id: 'SKU-1002',
    name: 'Nandini GoodLife Cow Milk (UHT)',
    unit: '1 Litre',
    category: 'Dairy & Eggs',
    rack: 'Zone A - Shelf A-02-B',
    stock: 45,
    minSafetyStock: 15,
    reorderQty: 40,
    costPrice: 52,
    sellingPrice: 58,
    batchNo: 'ND-UHT-441',
    expiryDate: getFutureDate(60),
    dailyBurnRate: 12,
    barcode: '8901262010021',
    isPerishable: false
  },
  {
    id: 'SKU-1003',
    name: 'Farm Fresh Brown Eggs (Pack of 6)',
    unit: '6 pcs',
    category: 'Dairy & Eggs',
    rack: 'Zone A - Shelf A-03-C',
    stock: 8, // Low Stock Alert!
    minSafetyStock: 15,
    reorderQty: 30,
    costPrice: 55,
    sellingPrice: 72,
    batchNo: 'EG-FARM-108',
    expiryDate: getFutureDate(10),
    dailyBurnRate: 9,
    barcode: '8901262010038',
    isPerishable: true
  },
  {
    id: 'SKU-1004',
    name: 'Fresh Robusta Bananas',
    unit: '500 g',
    category: 'Fruits & Vegetables',
    rack: 'Zone B - Crate B-01-A',
    stock: 14,
    minSafetyStock: 10,
    reorderQty: 25,
    costPrice: 22,
    sellingPrice: 35,
    batchNo: 'AG-BAN-201',
    expiryDate: getFutureDate(3), // Expiring soon
    dailyBurnRate: 15,
    barcode: '8901262010045',
    isPerishable: true
  },
  {
    id: 'SKU-1005',
    name: 'Fresh Red Onions',
    unit: '1 kg',
    category: 'Fruits & Vegetables',
    rack: 'Zone B - Bin B-02-B',
    stock: 50,
    minSafetyStock: 25,
    reorderQty: 80,
    costPrice: 32,
    sellingPrice: 45,
    batchNo: 'AG-ONI-554',
    expiryDate: getFutureDate(20),
    dailyBurnRate: 20,
    barcode: '8901262010052',
    isPerishable: false
  },
  {
    id: 'SKU-1006',
    name: 'Fresh Hybrid Tomatoes',
    unit: '500 g',
    category: 'Fruits & Vegetables',
    rack: 'Zone B - Bin B-02-C',
    stock: 4, // Critical Low Stock!
    minSafetyStock: 15,
    reorderQty: 40,
    costPrice: 18,
    sellingPrice: 26,
    batchNo: 'AG-TOM-901',
    expiryDate: getFutureDate(4),
    dailyBurnRate: 18,
    barcode: '8901262010069',
    isPerishable: true
  },
  {
    id: 'SKU-1007',
    name: "Lay's India's Magic Masala Chips",
    unit: '50 g',
    category: 'Snacks & Munchies',
    rack: 'Zone C - Aisle C-01-A',
    stock: 65,
    minSafetyStock: 20,
    reorderQty: 50,
    costPrice: 16,
    sellingPrice: 20,
    batchNo: 'PS-LAY-302',
    expiryDate: getFutureDate(90),
    dailyBurnRate: 22,
    barcode: '8901491101884',
    isPerishable: false
  },
  {
    id: 'SKU-1008',
    name: 'Haldiram Bhujia Sev',
    unit: '200 g',
    category: 'Snacks & Munchies',
    rack: 'Zone C - Aisle C-01-D',
    stock: 28,
    minSafetyStock: 15,
    reorderQty: 30,
    costPrice: 45,
    sellingPrice: 55,
    batchNo: 'HL-BHU-678',
    expiryDate: getFutureDate(120),
    dailyBurnRate: 10,
    barcode: '8904004400112',
    isPerishable: false
  },
  {
    id: 'SKU-1009',
    name: 'Coca-Cola Can Chill Pack',
    unit: '300 ml',
    category: 'Beverages & Cold Drinks',
    rack: 'Zone D - Chiller D-01-A',
    stock: 42,
    minSafetyStock: 20,
    reorderQty: 60,
    costPrice: 31,
    sellingPrice: 40,
    batchNo: 'CC-CAN-119',
    expiryDate: getFutureDate(180),
    dailyBurnRate: 25,
    barcode: '8901764012211',
    isPerishable: false
  },
  {
    id: 'SKU-1010',
    name: 'Red Bull Energy Drink',
    unit: '250 ml',
    category: 'Beverages & Cold Drinks',
    rack: 'Zone D - Chiller D-01-C',
    stock: 3, // Critical Low Stock!
    minSafetyStock: 12,
    reorderQty: 24,
    costPrice: 105,
    sellingPrice: 125,
    batchNo: 'RB-ENG-882',
    expiryDate: getFutureDate(150),
    dailyBurnRate: 8,
    barcode: '9002490100070',
    isPerishable: false
  },
  {
    id: 'SKU-1011',
    name: 'Maggi 2-Minute Masala Noodles',
    unit: 'Pack of 4 (280g)',
    category: 'Instant & Frozen Food',
    rack: 'Zone E - Rack E-01-A',
    stock: 58,
    minSafetyStock: 25,
    reorderQty: 50,
    costPrice: 52,
    sellingPrice: 60,
    batchNo: 'MG-NOO-410',
    expiryDate: getFutureDate(110),
    dailyBurnRate: 26,
    barcode: '8901058852319',
    isPerishable: false
  },
  {
    id: 'SKU-1012',
    name: 'Modern 100% Whole Wheat Bread',
    unit: '400 g',
    category: 'Dairy & Eggs',
    rack: 'Zone A - Shelf A-02-A',
    stock: 18,
    minSafetyStock: 12,
    reorderQty: 30,
    costPrice: 38,
    sellingPrice: 48,
    batchNo: 'MD-BRD-771',
    expiryDate: getFutureDate(3), // Expiring soon
    dailyBurnRate: 14,
    barcode: '8901262010120',
    isPerishable: true
  },
  {
    id: 'SKU-1013',
    name: 'Dettol Instant Liquid Handwash Refill',
    unit: '675 ml',
    category: 'Personal Care & Cleaning',
    rack: 'Zone F - Rack F-01-B',
    stock: 22,
    minSafetyStock: 10,
    reorderQty: 20,
    costPrice: 85,
    sellingPrice: 109,
    batchNo: 'DT-HW-990',
    expiryDate: getFutureDate(360),
    dailyBurnRate: 5,
    barcode: '8901396120150',
    isPerishable: false
  },
  {
    id: 'SKU-1014',
    name: 'Cadbury Dairy Milk Silk Chocolate',
    unit: '60 g',
    category: 'Snacks & Munchies',
    rack: 'Zone A - Chiller A-04-A',
    stock: 35,
    minSafetyStock: 15,
    reorderQty: 30,
    costPrice: 68,
    sellingPrice: 85,
    batchNo: 'CB-SLK-442',
    expiryDate: getFutureDate(95),
    dailyBurnRate: 16,
    barcode: '7622201402281',
    isPerishable: false
  }
];

export const INITIAL_ORDERS = [
  {
    id: 'QC-ORD-8921',
    customerName: 'Ananya Deshmukh',
    customerAddress: 'Flat 402, Green Glen Layout, Indiranagar',
    createdAt: new Date(Date.now() - 3.5 * 60 * 1000).toISOString(), // 3.5 mins ago
    targetSlaSeconds: 600, // 10 minutes SLA
    status: 'PICKING', // 'RECEIVED', 'PICKING', 'PACKED', 'DISPATCHED'
    pickerId: 'PK-01',
    pickerName: 'Ramesh Kumar',
    items: [
      { skuId: 'SKU-1001', name: 'Amul Taaza Fresh Toned Milk', qty: 2, rack: 'Zone A - Chiller A-01-A', picked: true, unitPrice: 28 },
      { skuId: 'SKU-1012', name: 'Modern 100% Whole Wheat Bread', qty: 1, rack: 'Zone A - Shelf A-02-A', picked: true, unitPrice: 48 },
      { skuId: 'SKU-1007', name: "Lay's India's Magic Masala Chips", qty: 2, rack: 'Zone C - Aisle C-01-A', picked: false, unitPrice: 20 }
    ],
    totalAmount: 144,
    deliveryExecutive: 'Karthik R. (Hero Electric)',
    bagId: 'BAG-IND-901'
  },
  {
    id: 'QC-ORD-8922',
    customerName: 'Rahul Mehta',
    customerAddress: 'Villa 12, Palm Meadows, Indiranagar 100ft Rd',
    createdAt: new Date(Date.now() - 1.2 * 60 * 1000).toISOString(), // 1.2 mins ago
    targetSlaSeconds: 600,
    status: 'RECEIVED',
    pickerId: null,
    pickerName: null,
    items: [
      { skuId: 'SKU-1009', name: 'Coca-Cola Can Chill Pack', qty: 3, rack: 'Zone D - Chiller D-01-A', picked: false, unitPrice: 40 },
      { skuId: 'SKU-1014', name: 'Cadbury Dairy Milk Silk Chocolate', qty: 1, rack: 'Zone A - Chiller A-04-A', picked: false, unitPrice: 85 },
      { skuId: 'SKU-1011', name: 'Maggi 2-Minute Masala Noodles', qty: 1, rack: 'Zone E - Rack E-01-A', picked: false, unitPrice: 60 }
    ],
    totalAmount: 265,
    deliveryExecutive: 'Unassigned',
    bagId: 'BAG-IND-902'
  },
  {
    id: 'QC-ORD-8920',
    customerName: 'Snehal Patil',
    customerAddress: 'Tower B - 1204, Prestige Heights',
    createdAt: new Date(Date.now() - 7.8 * 60 * 1000).toISOString(), // 7.8 mins ago
    targetSlaSeconds: 600,
    status: 'PACKED',
    pickerId: 'PK-02',
    pickerName: 'Sneha Sharma',
    items: [
      { skuId: 'SKU-1004', name: 'Fresh Robusta Bananas', qty: 1, rack: 'Zone B - Crate B-01-A', picked: true, unitPrice: 35 },
      { skuId: 'SKU-1005', name: 'Fresh Red Onions', qty: 1, rack: 'Zone B - Bin B-02-B', picked: true, unitPrice: 45 }
    ],
    totalAmount: 80,
    deliveryExecutive: 'Imran Khan (Ather 450X)',
    bagId: 'BAG-IND-899'
  },
  {
    id: 'QC-ORD-8919',
    customerName: 'Kavita Sundaram',
    customerAddress: '2nd Cross, Domlur 2nd Stage',
    createdAt: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
    targetSlaSeconds: 600,
    status: 'DISPATCHED',
    pickerId: 'PK-01',
    pickerName: 'Ramesh Kumar',
    items: [
      { skuId: 'SKU-1013', name: 'Dettol Instant Liquid Handwash Refill', qty: 1, rack: 'Zone F - Rack F-01-B', picked: true, unitPrice: 109 }
    ],
    totalAmount: 109,
    deliveryExecutive: 'Suresh Gowda (TVS iQube)',
    bagId: 'BAG-IND-898'
  }
];

export const INITIAL_PURCHASE_ORDERS = [
  {
    id: 'PO-2026-081',
    supplierId: 'SUP-01',
    supplierName: 'Amul Dairy Central Depot',
    orderDate: getFutureDate(-2),
    expectedDelivery: getFutureDate(0), // Today
    status: 'IN_TRANSIT', // 'DRAFT', 'ORDERED', 'IN_TRANSIT', 'RECEIVED'
    items: [
      { skuId: 'SKU-1001', name: 'Amul Taaza Fresh Toned Milk', orderedQty: 60, unitCost: 25, receivedQty: 0, batchNo: 'AM-TON-990', expiryDate: getFutureDate(3) }
    ],
    totalCost: 1500,
    notes: 'Morning priority delivery for Dark Store cold vault.'
  },
  {
    id: 'PO-2026-082',
    supplierId: 'SUP-02',
    supplierName: 'FreshRoots Agritech Hub',
    orderDate: getFutureDate(-1),
    expectedDelivery: getFutureDate(0),
    status: 'ORDERED',
    items: [
      { skuId: 'SKU-1006', name: 'Fresh Hybrid Tomatoes', orderedQty: 40, unitCost: 18, receivedQty: 0, batchNo: '', expiryDate: '' },
      { skuId: 'SKU-1003', name: 'Farm Fresh Brown Eggs (Pack of 6)', orderedQty: 30, unitCost: 55, receivedQty: 0, batchNo: '', expiryDate: '' }
    ],
    totalCost: 2370,
    notes: 'Urgent restocking: Tomatoes & Eggs reached safety threshold.'
  },
  {
    id: 'PO-2026-080',
    supplierId: 'SUP-04',
    supplierName: 'Hindustan Beverages Supply',
    orderDate: getFutureDate(-4),
    expectedDelivery: getFutureDate(-1),
    status: 'RECEIVED',
    items: [
      { skuId: 'SKU-1009', name: 'Coca-Cola Can Chill Pack', orderedQty: 60, unitCost: 31, receivedQty: 60, batchNo: 'CC-CAN-119', expiryDate: getFutureDate(180) },
      { skuId: 'SKU-1010', name: 'Red Bull Energy Drink', orderedQty: 24, unitCost: 105, receivedQty: 24, batchNo: 'RB-ENG-882', expiryDate: getFutureDate(150) }
    ],
    totalCost: 4380,
    notes: 'GRN Completed. Stock merged into Zone D cold shelves.'
  }
];

export const INITIAL_AUDIT_LOGS = [
  {
    id: 'LOG-301',
    timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    action: 'DISPATCH_CONFIRMED',
    description: 'Order QC-ORD-8919 dispatched with rider Suresh Gowda.',
    user: 'Dispatcher Station 01',
    tag: 'fulfillment'
  },
  {
    id: 'LOG-302',
    timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    action: 'PICK_STARTED',
    description: 'Picker Ramesh Kumar assigned to Order QC-ORD-8921.',
    user: 'Picker Ramesh K.',
    tag: 'picking'
  },
  {
    id: 'LOG-303',
    timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    action: 'GRN_INWARDED',
    description: 'Received 60x Coca-Cola & 24x Red Bull from PO-2026-080.',
    user: 'Inwarding Officer',
    tag: 'inwarding'
  },
  {
    id: 'LOG-304',
    timestamp: new Date(Date.now() - 90 * 60 * 1000).toISOString(),
    action: 'CYCLE_COUNT_AUDIT',
    description: 'Zone A Chiller cycle count completed with 99.8% accuracy.',
    user: 'Store Manager',
    tag: 'audit'
  }
];
