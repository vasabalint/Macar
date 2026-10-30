# Macar: Restaurant Operations & Analytics Platform

[![Vite](https://img.shields.io/badge/Vite-5.0+-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-18.0+-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4+-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Recharts](https://img.shields.io/badge/Recharts-2.12+-22c55e)](https://recharts.org/)
[![Telegram](https://img.shields.io/badge/Telegram-Alerts%20API-2CA5E0?logo=telegram&logoColor=white)](https://core.telegram.org/bots/api)
[![Gemini](https://img.shields.io/badge/Gemini-2.5%20Flash-4285F4?logo=google&logoColor=white)](https://ai.google.dev/)

**Course:** CSCI 3509: Intro to Software Engineering (Fall 2026)  
**Institution:** ADA University, School of Information Technologies and Engineering (SITE)  
**Instructor:** Kamila Ismayilova  
**Team 11:** 
- Basam Abdulhakeem Ismaeel
- Balint Vasa
- Bilal Hasanov

---

## 🍽️ Executive Summary

**Macar** is an all-in-one, agile restaurant operations and analytics platform engineered to bridge front-of-house service with back-of-house economics. Designed specifically for modern restaurant management in fast-paced markets like Baku, Azerbaijan, Macar eliminates disjointed spreadsheets and fragmented tools by combining:

1. **Role-Based Workspaces** (Admin, Manager, Staff) with strict permission guardrails.
2. **Point-of-Sale Terminal** with automated, atomic multi-ingredient recipe depletion.
3. **Live Inventory & Delivery Intake** with real-time unit costing and threshold reorder alerts.
4. **Recipe Costing & Gross Margin Analytics** calculating target food-cost percentages dynamically.
5. **Staff Shift Scheduling** with automated duplicate and overlap conflict detection.
6. **Executive Analytics Dashboard** powered by Recharts (Daily Revenue vs Food Cost, Expense Breakdown, Menu Item Profitability).
7. **AI Restaurant Consultant** powered by dual-layer intelligence (local operational heuristics + Google Gemini API) generating plain-language trend summaries and actionable margin optimizations.
8. **DevOps Health & Telegram Incident Center** monitoring all 5 Section 4 critical system health metrics with 1-click test simulation and live Telegram channel dispatching.

---

## 🚀 Quick Start

### Option 1: 1-Click Launch (Windows)
Double-click `start_macar.bat` in the project root. It will set up the path, start Vite, and open `http://localhost:5173` directly in your browser.

### Option 2: Command Line
```bash
# Navigate to the frontend directory
cd frontend

# Start the Vite development server
npm run dev
```

Open your browser at `http://localhost:5173`.

---

## 🧭 System Architecture & Agile Modularity

Macar is designed with an **Agile Architecture** that allows rapid iteration, customer-requested changes, and modular extensibility:

```
Macar Architecture Overview
┌────────────────────────────────────────────────────────────────────────┐
│                        User Interface (React + Tailwind)               │
│  ┌───────────────┬────────────────┬─────────────────┬────────────────┐ │
│  │ Dashboard     │ POS Terminal   │ Inventory & Stock│ Recipe Costing │ │
│  ├───────────────┼────────────────┼─────────────────┼────────────────┤ │
│  │ Shifts/Staff  │ Expenses/P&L   │ AI Consultant   │ Telegram Ops   │ │
│  └───────────────┴────────────────┴─────────────────┴────────────────┘ │
└────────────────────────────────────▲───────────────────────────────────┘
                                     │
┌────────────────────────────────────▼───────────────────────────────────┐
│                 Central Reactive Store (store.ts)                      │
│  - Atomic stock deductions on POS order completion                     │
│  - Dynamic Food Cost % and Profit Margin calculation                   │
│  - Real-time Shift Overlap & double-booking collision detection        │
│  - LocalStorage persistence with initial Baku Bistro seed dataset      │
└───────────────────▲────────────────────────────────▲───────────────────┘
                    │                                │
┌───────────────────▼─────────────┐    ┌─────────────▼───────────────────┐
│       AI Copilot Service        │    │    Telegram Dispatcher Service   │
│  - Gemini 2.5 Flash API client  │    │  - Real Telegram Bot API Client │
│  - Local Heuristics Fallback    │    │  - Mock Sandbox Event Stream    │
│  - Plain summaries (FR-10)      │    │  - 5 Section 4 Alert Thresholds │
│  - Cost recommendations (FR-11) │    │  - 1-Click Incident Simulator   │
└─────────────────────────────────┘    └─────────────────────────────────┘
```

### Why It's Agile:
- **Central Typed Store (`frontend/src/services/store.ts`):** All business logic (inventory depletion, margin math, shift collision checks) lives in a unified store. Modifying business rules requires zero database migrations or multi-repo sync.
- **Pluggable Data Models (`frontend/src/types/index.ts`):** Adding new ingredient attributes, menu categories, or expense classifications takes minutes with full TypeScript compiler safety.
- **Self-Contained Seed Data (`frontend/src/services/initialData.ts`):** Comes pre-loaded with an authentic Baku restaurant dataset (Shah Pilaf, Ribeye Steak, Zira Tomatoes, Caspian Prime Meats) that can be reset anytime with one click.
- **External Integrations with Safe Fallbacks:**
  - **Telegram:** Works with real Bot API credentials or automatically falls back to an in-app event log if credentials are not configured.
  - **Gemini AI:** Operates seamlessly via official API keys or utilizes an offline rule-based operational heuristic engine.

---

## 📋 Requirements Traceability Matrix

Every single functional requirement from the course proposal is implemented and testable in the UI:

| Req ID | Requirement Description | Implementation Location | Verified Feature |
| :--- | :--- | :--- | :--- |
| **FR-01** | Role-Based Access Control (Admin, Manager, Staff) | `Navbar.tsx`, `App.tsx`, `types/index.ts` | 1-click persona switcher in top navigation; dynamically hides/restricts administrative views (Monitoring, Expenses, AI Settings) for Staff roles. |
| **FR-02** | Ingredient Record Management | `InventoryView.tsx`, `store.ts` | Add, edit, delete ingredients with unit measurement, current stock, minimum threshold, and unit cost in AZN (₼). |
| **FR-03** | Supplier Record Management | `InventoryView.tsx`, `store.ts` | Supplier directory tab with contact name, phone, email, and supplied ingredient associations. |
| **FR-04** | Menu Item & Recipe Linking | `MenuRecipesView.tsx`, `store.ts` | Dish creation modal with multi-ingredient composition (e.g., 250g Beef Ribeye + 20g Butter + 5g Rosemary). |
| **FR-05** | Food Cost & Margin Computation | `MenuRecipesView.tsx`, `store.ts` | Dynamic calculation of portion food cost, gross margin (₼), and target Food Cost Percentage (flagged if > 35%). |
| **FR-06** | Order Processing & Stock Depletion | `PosSalesView.tsx`, `store.ts` | Interactive POS terminal. When a sale is confirmed, ingredient stock quantities are depleted atomically in real-time according to their recipe formulas. |
| **FR-07** | Low-Stock Notifications | `Navbar.tsx`, `InventoryView.tsx` | Real-time badge in header displaying the number of depleted items below threshold; highlighted with red warnings in the inventory table. |
| **FR-08** | Staff Shift Scheduling | `ShiftsView.tsx`, `store.ts` | Weekly schedule board with shift assignment, employee roles, start/end hours, and visual timeline bars. |
| **FR-09** | Financial & Performance Analytics | `DashboardView.tsx` | 3 interactive Recharts: Daily Revenue vs Food Cost AreaChart, Monthly Expense Breakdown PieChart, and Menu Profitability BarChart. |
| **FR-10** | Plain-Language Trend Summaries | `AICopilotView.tsx`, `aiService.ts` | AI Copilot analyzes sales velocity, highest grossing dishes, and cost spikes to produce human-readable executive summaries. |
| **FR-11** | Cost-Reduction & Actionable Recommendations | `AICopilotView.tsx`, `aiService.ts` | AI identifies dishes with excessive food cost ratios (>35%) and low-stock ingredients risking 86'd menu items, providing actionable steps. |
| **FR-12** | Shift Conflict / Overlap Detection | `ShiftsView.tsx`, `store.ts` | Automated scheduling validator that prevents double-booking staff on the same date with overlapping hours and displays an alert. |
| **FR-13** | Operating Expense Tracking | `ExpensesView.tsx`, `store.ts` | Record overhead expenses (Rent, Utilities, Payroll, Maintenance, Marketing) and compare against gross sales for net operating margin. |
| **FR-14** | Critical System Health & DevOps Telegram Alerts | `MonitoringView.tsx`, `telegramService.ts` | Section 4 monitoring dashboard with gauges for all 5 rules, 1-click incident simulator, and live Telegram notification dispatcher. |

---

## 🚨 Section 4: DevOps & System Health Monitoring Rules

Macar includes a dedicated DevOps Center (`MonitoringView.tsx`) tracking all 5 rules specified in Section 4 of the project proposal:

| Alert Rule | Metric Monitored | Trigger Threshold | Simulation Button | Telegram Action |
| :--- | :--- | :--- | :--- | :--- |
| **Rule 1** | API Latency Spike | P95 Latency > 1,500 ms for 2 min | "Simulate Latency Spike" | Dispatches `🚨 HIGH LATENCY WARNING` with current response time. |
| **Rule 2** | DB Connection Pool | Utilization > 85% for 3 min | "Simulate DB Connection Pool Exhaustion" | Dispatches `⚠️ DB POOL SATURATION ALERT` to engineering channel. |
| **Rule 3** | Server Error Rate (HTTP 5xx) | 5xx Errors > 5% of total requests | "Simulate 5xx Server Error Surge" | Dispatches `🔥 CRITICAL 5xx ERROR RATE SURGE` with incident ID. |
| **Rule 4** | Zero-Sales Anomaly | Active Hours (12:00-22:00) with 0 sales for 30m | "Simulate Zero-Sales Anomaly" | Dispatches `⚠️ ZERO SALES DETECTED` to restaurant manager. |
| **Rule 5** | Immediate Stock Depletion | Critical ingredient stock reaches 0 | "Simulate Zero-Stock Incident" | Dispatches `🚨 STOCKOUT CRITICAL: [Ingredient]` requiring immediate reorder. |

---

## 📁 File Structure

```
Software Engineering/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AICopilotView.tsx       # FR-10, FR-11: AI Copilot & recommendations
│   │   │   ├── DashboardView.tsx       # FR-09: Recharts Executive Analytics
│   │   │   ├── ExpensesView.tsx        # FR-13: Operating expense tracker & P&L
│   │   │   ├── InventoryView.tsx       # FR-02, FR-03, FR-07: Ingredients & Suppliers
│   │   │   ├── MenuRecipesView.tsx     # FR-04, FR-05: Dish recipes & margin calculator
│   │   │   ├── MonitoringView.tsx      # FR-14 & Section 4: DevOps Health & Telegram
│   │   │   ├── Navbar.tsx              # FR-01: Persona switcher & Low-Stock indicator
│   │   │   ├── PosSalesView.tsx        # FR-06: POS Terminal with atomic stock depletion
│   │   │   ├── ProposalView.tsx        # In-app full academic proposal viewer & print
│   │   │   └── ShiftsView.tsx          # FR-08, FR-12: Schedule board & conflict detector
│   │   ├── services/
│   │   │   ├── aiService.ts            # Gemini API client & Heuristic Ops engine
│   │   │   ├── initialData.ts          # Authentic Baku restaurant seed database
│   │   │   ├── store.ts                # Central reactive store & business logic
│   │   │   └── telegramService.ts      # Telegram Bot API client & event logger
│   │   ├── types/
│   │   │   └── index.ts                # Strict TypeScript models for all requirements
│   │   ├── App.tsx                     # Main layout & tab router
│   │   ├── index.css                   # Tailwind styles & theme variables
│   │   └── main.tsx                    # React DOM entrypoint
│   ├── index.html                      # HTML5 page template
│   ├── package.json                    # Dependencies & scripts
│   ├── tailwind.config.js              # Tailwind styling configuration
│   ├── tsconfig.json                   # Strict TypeScript compiler rules
│   └── vite.config.ts                  # Vite build configuration
├── PROJECT_PROPOSAL_FILLED.md          # Complete academic proposal document
├── PROJECT_PROPOSAL.html               # Printable / Exportable academic proposal
├── start_macar.bat                     # 1-Click launcher script
├── .gitignore                          # Git ignore definitions
└── README.md                           # This documentation file
```

---

## 🛠️ Technology Stack

- **Frontend Core:** React 18, TypeScript 5, Vite 5
- **Design & UI:** Tailwind CSS, Lucide React Icons
- **Data Visualization:** Recharts (AreaChart, PieChart, BarChart, ResponsiveContainer)
- **State Management:** Reactive Observer Store with LocalStorage Persistence
- **AI Integrations:** Google Gemini API (`gemini-2.5-flash`) + Offline Heuristic Rule Engine
- **DevOps Alerts:** Official Telegram Bot API (HTTPS webhook/sendMessage)

---

## 👥 Contributors & Academic Context

Developed for **CSCI 3509: Intro to Software Engineering**, ADA University, Fall 2026.
- **Instructor:** Kamila Ismayilova
- **Team 11 Members:**
  - Basam Abdulhakeem Ismaeel
  - Balint Vasa
  - Bilal Hasanov
