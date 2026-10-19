import React, { useState } from 'react';
import { Search, Plus, Trash2, AlertCircle, CheckCircle2, X } from 'lucide-react';
import { useInventory } from '../context/InventoryContext';

export const ProductsTab = () => {
  const { products, addProduct, adjustStock, deleteProduct } = useInventory();

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New product form state
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Dairy');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [unit, setUnit] = useState('1 unit');
  const [expiry, setExpiry] = useState('');

  // Categories
  const categories = ['All', 'Dairy', 'Bakery', 'Fruits & Veg', 'Snacks', 'Beverages', 'Instant Food', 'Personal Care'];

  // Stats
  const totalProducts = products.length;
  const lowStockCount = products.filter((p) => p.stock <= p.minStock && p.stock > 0).length;
  const outOfStockCount = products.filter((p) => p.stock === 0).length;
  const totalUnits = products.reduce((acc, p) => acc + p.stock, 0);

  // Filtered list
  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    addProduct({
      name,
      category,
      price: Number(price) || 50,
      stock: Number(stock) || 10,
      minStock: 5,
      unit: unit || '1 unit',
      expiry: expiry || '2026-12-31'
    });

    setName('');
    setPrice('');
    setStock('');
    setExpiry('');
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-5">
      {/* 4 Simple Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs">
          <div className="text-xs text-gray-500 font-medium">Total Products</div>
          <div className="text-2xl font-bold text-gray-900 mt-1">{totalProducts}</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs">
          <div className="text-xs text-gray-500 font-medium">Total Stock on Shelf</div>
          <div className="text-2xl font-bold text-gray-900 mt-1">{totalUnits} units</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-amber-200 bg-amber-50/50 shadow-xs">
          <div className="text-xs text-amber-700 font-medium">Low Stock Warning</div>
          <div className="text-2xl font-bold text-amber-900 mt-1">{lowStockCount} items</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-red-200 bg-red-50/50 shadow-xs">
          <div className="text-xs text-red-700 font-medium">Out of Stock</div>
          <div className="text-2xl font-bold text-red-900 mt-1">{outOfStockCount} items</div>
        </div>
      </div>

      {/* Search, Filter & Add Button */}
      <div className="bg-white p-3 rounded-xl border border-gray-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1">
          {/* Search */}
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search product name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>

          {/* Category Dropdown */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 focus:bg-white focus:outline-none"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* Add Product Button */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-sm font-semibold transition shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Product</span>
        </button>
      </div>

      {/* Clean Products Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3">Product Name</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Stock Count</th>
                <th className="px-4 py-3">Expiry Date</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-8 text-gray-400">
                    No products found.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => {
                  let statusBadge = (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-50 text-green-700 border border-green-200">
                      In Stock
                    </span>
                  );
                  if (p.stock === 0) {
                    statusBadge = (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-50 text-red-700 border border-red-200 font-bold">
                        Out of Stock
                      </span>
                    );
                  } else if (p.stock <= p.minStock) {
                    statusBadge = (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-50 text-amber-800 border border-amber-200 font-bold">
                        Low Stock ({p.stock})
                      </span>
                    );
                  }

                  return (
                    <tr key={p.id} className="hover:bg-gray-50/80 transition">
                      {/* Name & Unit */}
                      <td className="px-4 py-3.5">
                        <div className="font-semibold text-gray-900">{p.name}</div>
                        <div className="text-xs text-gray-500">{p.unit}</div>
                      </td>

                      {/* Category */}
                      <td className="px-4 py-3.5 text-gray-600">
                        <span className="px-2 py-0.5 bg-gray-100 rounded text-xs font-medium text-gray-700">
                          {p.category}
                        </span>
                      </td>

                      {/* Price */}
                      <td className="px-4 py-3.5 font-semibold text-gray-900">
                        ₹{p.price}
                      </td>

                      {/* Stock with 1-click + and - buttons */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => adjustStock(p.id, -1)}
                            disabled={p.stock <= 0}
                            title="Decrease 1 unit"
                            className="w-7 h-7 rounded border border-gray-300 hover:bg-gray-100 flex items-center justify-center font-bold text-gray-700 disabled:opacity-30 cursor-pointer"
                          >
                            -
                          </button>

                          <span className="w-10 text-center font-bold text-gray-900">
                            {p.stock}
                          </span>

                          <button
                            onClick={() => adjustStock(p.id, 1)}
                            title="Increase 1 unit"
                            className="w-7 h-7 rounded border border-gray-300 hover:bg-gray-100 flex items-center justify-center font-bold text-gray-700 cursor-pointer"
                          >
                            +
                          </button>
                        </div>
                      </td>

                      {/* Expiry */}
                      <td className="px-4 py-3.5 text-gray-600 text-xs font-medium">
                        {p.expiry || 'N/A'}
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3.5">{statusBadge}</td>

                      {/* Delete */}
                      <td className="px-4 py-3.5 text-right">
                        <button
                          onClick={() => {
                            if (window.confirm(`Delete ${p.name}?`)) {
                              deleteProduct(p.id);
                            }
                          }}
                          className="p-1.5 text-gray-400 hover:text-red-600 rounded transition cursor-pointer"
                          title="Delete Product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Simple Add Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 max-w-md w-full p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="font-bold text-gray-900">Add New Product</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Amul Butter 100g"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none"
                  >
                    {categories.filter((c) => c !== 'All').map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Unit / Pack Size
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 500 ml / 1 kg"
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Price (₹)
                  </label>
                  <input
                    type="number"
                    min="1"
                    placeholder="e.g. 45"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Initial Stock
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="e.g. 25"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Expiry Date
                </label>
                <input
                  type="date"
                  value={expiry}
                  onChange={(e) => setExpiry(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-sm font-semibold transition"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
