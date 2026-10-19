import React, { useState } from 'react';
import {
  X,
  BookOpen,
  CheckCircle2,
  Calendar,
  Layers,
  ShieldAlert,
  Target,
  Zap,
  Cpu
} from 'lucide-react';

export const SpmInfoModal = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('OVERVIEW');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-900 text-white">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold tracking-tight">
                Software Project Management (SPM) Project Dossier
              </h3>
              <p className="text-xs text-slate-400">
                Project Scope, Agile Sprints, Architecture & Evaluation Criteria
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sub-navigation tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 gap-2 text-xs font-bold overflow-x-auto">
          {[
            { id: 'OVERVIEW', label: '1. Project Scope & Problem' },
            { id: 'MODULES', label: '2. The 4 Functional Modules' },
            { id: 'SPRINTS', label: '3. Agile Sprints & WBS' },
            { id: 'RISKS', label: '4. Risk Management & KPIs' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-3 px-3 border-b-2 transition whitespace-nowrap cursor-pointer ${
                activeTab === tab.id
                  ? 'border-amber-500 text-slate-950 font-extrabold'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm text-slate-700">
          {activeTab === 'OVERVIEW' && (
            <div className="space-y-4">
              <div className="bg-amber-50 rounded-xl p-4 border border-amber-200/80">
                <h4 className="font-extrabold text-amber-900 text-base mb-1">
                  Project Title: Quick Commerce Dark Store Inventory & Fulfillment System
                </h4>
                <p className="text-xs text-amber-800 leading-relaxed">
                  A high-velocity inventory management system purpose-built for micro-fulfillment centers (MFCs / dark stores) like Blinkit, Zepto, and Instamart. Unlike traditional ERPs with multi-day lead times, quick commerce requires real-time sub-minute stock synchronization, 2-minute picker routing, FEFO perishables management, and auto-replenishment.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                  <Target className="w-4 h-4 text-amber-500" /> Core SPM Objectives:
                </h4>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                  <li className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <strong>1. 10-Minute SLA Adherence:</strong> Minimize dark store dwell time to under 2.5 minutes using zone/rack pick routing.
                  </li>
                  <li className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <strong>2. Zero Stockout of Fast-Movers:</strong> Auto-calculate replenishment triggers based on daily burn rate and supplier lead time.
                  </li>
                  <li className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <strong>3. Perishables & FEFO Waste Reduction:</strong> Real-time expiration tracking to prioritize dispatch of earliest expiring batches.
                  </li>
                  <li className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <strong>4. End-to-End Traceability:</strong> Immutable audit trail of every picker action, cycle count adjustment, and dock inwarding.
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-indigo-500" /> Technical Implementation:
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Engineered using <strong>React 19 + Tailwind CSS + Web LocalStorage API</strong>. State mutations in order dispatch, picker completion, and purchase order inwarding reactively update stock counts and persist immediately in the browser without external server downtime.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'MODULES' && (
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <span className="text-xs font-mono font-bold text-amber-600">Module 1</span>
                <h4 className="font-bold text-slate-900">Dark Store Inventory & SKU Management (FEFO)</h4>
                <p className="text-xs text-slate-600">
                  Real-time catalog with rack/bin mapping (Zone A Chillers to Zone F Household), stock thresholds, cost/selling price margins, batch numbers, and dynamic First-Expired-First-Out (FEFO) urgency badges. Includes stock audit adjustment for damage/shrinkage.
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <span className="text-xs font-mono font-bold text-amber-600">Module 2</span>
                <h4 className="font-bold text-slate-900">10-Minute Micro-Fulfillment & Picker Station</h4>
                <p className="text-xs text-slate-600">
                  Live order queue with real-time countdown timer (10-min SLA). Generates aisle-optimized walking picklists for floor pickers. Features simulated barcode scan verification, bag sealing, and automated stock decrement upon rider dispatch.
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <span className="text-xs font-mono font-bold text-amber-600">Module 3</span>
                <h4 className="font-bold text-slate-900">Automated Procurement & GRN Inwarding</h4>
                <p className="text-xs text-slate-600">
                  Purchase Order (PO) lifecycle management with depot suppliers. Features a 1-click intelligent auto-replenishment algorithm for low-stock SKUs and dockside Goods Received Note (GRN) workflow that updates inventory batches and quantities upon arrival.
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <span className="text-xs font-mono font-bold text-amber-600">Module 4</span>
                <h4 className="font-bold text-slate-900">Dark Store SPM Analytics & Audit Logs</h4>
                <p className="text-xs text-slate-600">
                  Executive KPI dashboard tracking In-Stock rate, SLA compliance, FEFO wastage risk valuation, category distribution, and an immutable operational audit log tracking every user action with timestamps.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'SPRINTS' && (
            <div className="space-y-4">
              <h4 className="font-bold text-slate-900 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-500" /> Agile Scrum Sprint Plan & WBS
              </h4>

              <div className="space-y-3 text-xs">
                <div className="p-3 bg-blue-50/80 border border-blue-200 rounded-xl">
                  <div className="flex items-center justify-between font-bold text-blue-900 mb-1">
                    <span>Sprint 1: Architecture, Data Schema & Inventory Catalog</span>
                    <span className="text-[10px] bg-blue-200 px-2 py-0.5 rounded">Duration: 2 Weeks</span>
                  </div>
                  <p className="text-blue-800">
                    Defined Quick Commerce database schema, Dark store bin coordinates, React Context local storage persistence, and SKU CRUD operations with FEFO expiry logic.
                  </p>
                </div>

                <div className="p-3 bg-purple-50/80 border border-purple-200 rounded-xl">
                  <div className="flex items-center justify-between font-bold text-purple-900 mb-1">
                    <span>Sprint 2: 10-Min SLA Engine & Picker Station</span>
                    <span className="text-[10px] bg-purple-200 px-2 py-0.5 rounded">Duration: 2 Weeks</span>
                  </div>
                  <p className="text-purple-800">
                    Developed live order queue with countdown timer, aisle routing algorithm, interactive barcode scanning verification, and automated inventory deduction upon rider dispatch.
                  </p>
                </div>

                <div className="p-3 bg-emerald-50/80 border border-emerald-200 rounded-xl">
                  <div className="flex items-center justify-between font-bold text-emerald-900 mb-1">
                    <span>Sprint 3: Procurement, GRN Inwarding & SPM Analytics</span>
                    <span className="text-[10px] bg-emerald-200 px-2 py-0.5 rounded">Duration: 2 Weeks</span>
                  </div>
                  <p className="text-emerald-800">
                    Implemented auto-replenishment PO generator, GRN dock inwarding workflow, KPI telemetry dashboards, and system audit trail logging.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'RISKS' && (
            <div className="space-y-4">
              <h4 className="font-bold text-slate-900 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-500" /> SPM Risk Management & Mitigation Matrix
              </h4>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border border-slate-200 rounded-xl overflow-hidden">
                  <thead className="bg-slate-100 font-bold text-slate-700">
                    <tr>
                      <th className="p-2.5">Risk Description</th>
                      <th className="p-2.5">Severity</th>
                      <th className="p-2.5">Mitigation Strategy</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr>
                      <td className="p-2.5 font-medium">Stockout of high-velocity goods during peak flash hours</td>
                      <td className="p-2.5 text-rose-600 font-bold">High</td>
                      <td className="p-2.5">Dynamic safety stock buffers and 1-click automated PO generation.</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-medium">Perishable food spoilage & expiry revenue loss</td>
                      <td className="p-2.5 text-amber-600 font-bold">Medium</td>
                      <td className="p-2.5">Strict FEFO (First Expired First Out) tagging and 3-day expiry alerts.</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-medium">Picker SLA breach due to disorganized dark store layout</td>
                      <td className="p-2.5 text-rose-600 font-bold">High</td>
                      <td className="p-2.5">Aisle-sequenced pick lists (Zone A &rarr; Zone F) reducing footsteps.</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-medium">Inventory discrepancy / phantom inventory</td>
                      <td className="p-2.5 text-amber-600 font-bold">Medium</td>
                      <td className="p-2.5">Cycle count stock audit modal and real-time event audit trails.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="text-xs text-slate-500 font-medium">
            Software Project Management (SPM) Capstone Submission
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition cursor-pointer"
          >
            Close Documentation
          </button>
        </div>
      </div>
    </div>
  );
};
