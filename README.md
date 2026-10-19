# ⚡ FlashStock IMS — Quick Commerce Dark Store Inventory & Fulfillment System
> **Software Project Management (SPM) Capstone System**  
> Built with **React 19 + Tailwind CSS + Client-Side LocalStorage Persistence** (Zero backend setup required)

---

## 🎯 Project Overview & Quick Commerce Context
In modern **Quick Commerce (Q-Commerce)** like Blinkit, Zepto, and Swiggy Instamart, orders must be delivered within **10 minutes**. This necessitates a **Dark Store (Micro-Fulfillment Center / MFC)** model located within a 2-3 km customer radius.

Traditional ERP and warehouse inventory systems fail in Q-Commerce due to:
1. **Strict 2.5-Minute Picking Window:** Pickers need aisle-optimized walking routes.
2. **High-Velocity Perishables:** Milk, bread, and produce require strict **FEFO (First Expired, First Out)** stock rotation.
3. **Automated Replenishment:** Real-time stockout prevention via burn-rate based safety stock calculation.

---

## 🚀 The 4 Working Modules

### 📦 Module 1: Dark Store Inventory & SKU Catalog (FEFO Expiry & Bin Locations)
- **SKU Catalog & Rack Mapping:** Every SKU has a designated micro-fulfillment coordinate (`Zone A - Chiller A-01-A`, `Zone B - Bin B-02-B`, etc.).
- **FEFO (First Expired, First Out) Alert Badges:** Automatically flags products expiring within 3 days or expired goods.
- **Stock Level Gauges & Alerts:** Visual indicators for Optimal, Low Stock (below safety threshold), and Out of Stock.
- **Cycle Count & Stock Audit Adjustments:** Record damage, leakage, theft shrinkage, and audit discrepancies with instant stock deduction.
- **CRUD Operations:** Add new SKUs, edit parameters, delete SKUs, filter by category and search by barcode/name.

### ⚡ Module 2: 10-Minute Micro-Fulfillment & Picker Station
- **Live Order Feed with SLA Countdown:** 10-minute dynamic countdown timer with visual urgency alerts (Green &rarr; Amber &rarr; Red &rarr; Breached).
- **Aisle-Optimized Picker Route:** Displays items sorted by dark store walking sequence (`Zone A &rarr; Zone F`).
- **Scan & Verify Picker Station:** Interactive barcode scanner simulator or 1-click step verification.
- **Tamper-Evident Bag Packing:** Generates unique Bag ID and seals items.
- **Rider Dispatch & Real-Time Stock Deduction:** Immediately decrements the inventory stock counts in `localStorage` upon dispatch!
- **Simulation Suite:** Toggle "Auto-Stream Orders (30s)" or click "+ Sim Order" for dynamic live evaluation.

### 🚚 Module 3: Procurement & Auto-Replenishment (PO & GRN Inwarding)
- **1-Click Auto-Replenishment:** Evaluates daily burn rates against safety stock to auto-compose Purchase Orders (POs) for all low-stock items.
- **Supplier Depots Directory:** Track lead times (1-2 days) and delivery schedules for partners like Amul, PepsiCo, FreshRoots.
- **Goods Received Note (GRN) Dock Inwarding:** When shipment arrives, verify received quantities, enter manufacturer batch numbers and expiry dates.
- **Auto-Shelving:** Completing GRN immediately increases on-shelf inventory in `localStorage`.

### 📊 Module 4: SPM Dark Store Health, Analytics & Traceability
- **Real-Time Q-Commerce KPIs:**
  - In-Stock Availability Rate (Target > 98.5%)
  - 10-Minute SLA Adherence Rate
  - Total Depot Valuation (₹)
  - FEFO Spoilage & Wastage Exposure (₹)
- **Dark Store Floor Heatmap & Category Distribution:** Zone-wise velocity and pick duration telemetry.
- **Traceability Audit Trail:** Immutable log recording all picker actions, cycle count adjustments, and dock inwarding with timestamps and actor identities.

---

## 🛠️ SPM Documentation Features Built into the App
Click the **"SPM Docs"** button in the top navigation bar to open the built-in presentation dossier containing:
- **Problem Statement & Scope**
- **Agile Scrum Framework (Sprint 1, 2, and 3 Breakdown & WBS)**
- **Risk Management & Mitigation Matrix**
- **Evaluation Criteria Highlights**

---

## 💻 Tech Stack & Architecture
- **Framework:** React 19 (Hooks, Context API)
- **Build Tool:** Vite 8
- **Styling:** Tailwind CSS v4
- **Icons:** Lucide React
- **Data Persistence:** Browser `localStorage` (offline ready, instant reactive updates, export/import JSON backups, and pristine 1-click reset button)

---

## 🏃 Quick Start Instructions

```bash
# 1. Install dependencies
npm install

# 2. Run local development server
npm run dev

# 3. Open in browser:
# http://localhost:5173
```

---

## 🎬 Suggested Demonstration Script for Viva / Evaluators

1. **Start on Module 1 (Dark Store Inventory):**
   - Point out the **Rack / Bin locations** (`Zone A Chiller`) and **FEFO Badges** (e.g. Amul Milk expiring in 2 days).
   - Click the **Scale icon (Audit)** on any item to log a damaged packet. Show how the stock updates instantly.
2. **Move to Module 2 (10-Min Fulfillment):**
   - Click **"+ Sim Order"** in the top bar to show a customer order coming in.
   - Point to the **SLA Countdown Timer**.
   - Click **"Assign & Pick"**, assign a picker (e.g., Ramesh Kumar), check off the items, click **"Seal Bag & Pack"**, and finally click **"Dispatch with Delivery Rider"**.
   - Return to Module 1 to show that the stock was automatically deducted!
3. **Move to Module 3 (Procurement):**
   - Click **"1-Click Replenish Low Stock"** to show automated Purchase Order generation.
   - Click **"Mark In Transit"** &rarr; **"Dock Inwarding (GRN)"** &rarr; **"Complete Inwarding"**.
   - Show how stock is re-filled on the shelves with the new batch number and expiry date.
4. **Move to Module 4 (Analytics) & Click "SPM Docs":**
   - Highlight the **In-stock Availability %, Wastage Exposure, Category breakdown**, and the **System Audit Trail**.
   - Show the **SPM Project Dossier** with Agile Sprints and Risk Matrix.
