// Simple Quick Commerce Initial Data

export const INITIAL_PRODUCTS = [
  {
    id: 1,
    name: 'Amul Taaza Fresh Milk',
    category: 'Dairy',
    stock: 24,
    minStock: 10,
    price: 28,
    unit: '500 ml',
    expiry: '2026-10-22'
  },
  {
    id: 2,
    name: 'Modern Brown Bread',
    category: 'Bakery',
    stock: 15,
    minStock: 8,
    price: 45,
    unit: '400 g',
    expiry: '2026-10-23'
  },
  {
    id: 3,
    name: 'Fresh Farm Bananas',
    category: 'Fruits & Veg',
    stock: 6, // Low stock
    minStock: 10,
    price: 35,
    unit: '500 g',
    expiry: '2026-10-22'
  },
  {
    id: 4,
    name: 'Fresh Tomatoes',
    category: 'Fruits & Veg',
    stock: 0, // Out of stock
    minStock: 12,
    price: 30,
    unit: '1 kg',
    expiry: '2026-10-24'
  },
  {
    id: 5,
    name: "Lay's Magic Masala Chips",
    category: 'Snacks',
    stock: 45,
    minStock: 15,
    price: 20,
    unit: '50 g',
    expiry: '2026-12-30'
  },
  {
    id: 6,
    name: 'Coca-Cola Can',
    category: 'Beverages',
    stock: 30,
    minStock: 12,
    price: 40,
    unit: '300 ml',
    expiry: '2027-02-15'
  },
  {
    id: 7,
    name: 'Maggi 2-Minute Noodles',
    category: 'Instant Food',
    stock: 50,
    minStock: 20,
    price: 60,
    unit: 'Pack of 4',
    expiry: '2026-11-20'
  },
  {
    id: 8,
    name: 'Dettol Handwash',
    category: 'Personal Care',
    stock: 18,
    minStock: 10,
    price: 99,
    unit: '200 ml',
    expiry: '2027-05-10'
  }
];

export const INITIAL_ORDERS = [
  {
    id: 'ORD-101',
    customer: 'Rahul Sharma',
    address: 'Indiranagar, Bangalore',
    status: 'Pending', // Pending -> Packed -> Delivered
    time: '2 mins ago',
    items: [
      { id: 1, name: 'Amul Taaza Fresh Milk', qty: 2, price: 28 },
      { id: 2, name: 'Modern Brown Bread', qty: 1, price: 45 }
    ],
    total: 101
  },
  {
    id: 'ORD-102',
    customer: 'Priya Patel',
    address: 'Koramangala, Bangalore',
    status: 'Packed',
    time: '5 mins ago',
    items: [
      { id: 5, name: "Lay's Magic Masala Chips", qty: 2, price: 20 },
      { id: 6, name: 'Coca-Cola Can', qty: 2, price: 40 }
    ],
    total: 120
  },
  {
    id: 'ORD-100',
    customer: 'Ananya Verma',
    address: 'HSR Layout, Bangalore',
    status: 'Delivered',
    time: '15 mins ago',
    items: [
      { id: 7, name: 'Maggi 2-Minute Noodles', qty: 1, price: 60 }
    ],
    total: 60
  }
];

export const INITIAL_RESTOCK_LOGS = [
  {
    id: 1,
    productName: 'Coca-Cola Can',
    qty: 25,
    supplier: 'Beverage Distributors Ltd',
    date: '2026-10-18'
  },
  {
    id: 2,
    productName: 'Amul Taaza Fresh Milk',
    qty: 50,
    supplier: 'Amul Dairy Depot',
    date: '2026-10-19'
  }
];
