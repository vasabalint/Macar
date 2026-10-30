# ADA UNIVERSITY
### School of Information Technologies and Engineering (SITE)
**Course:** CSCI 3509: Introduction to Software Engineering  
**Semester:** Fall 2026  
**Instructor:** Kamila Ismayilova  

---

# SOFTWARE PROJECT PROPOSAL
## **Macar: Restaurant Operations & Analytics Platform**

**Team Number:** Team 11  
**Team Members:**
- **Basam Abdulhakeem Ismaeel** — *Software Architect & Full-Stack Engineer*
- **Balint Vasa** — *Product Owner & Frontend Specialist*
- **Bilal Hasanov** — *DevOps, Data Modeler & Systems Integration Engineer*

**Date of Submission:** October 20, 2026  

---

## 1. Executive Summary & Problem Statement

### 1.1 Context & Background
In the competitive food service sector in Baku, Azerbaijan, restaurants operate on thin net profit margins (typically 5% to 12%). Most independent and multi-unit hospitality operators struggle with fragmented, manual processes: inventory is tracked on physical clipboards or disconnected Excel workbooks; sales are registered on isolated POS hardware; shift scheduling is handled via informal WhatsApp groups; and menu pricing rarely reflects real-time fluctuations in wholesale ingredient prices.

### 1.2 The Problem
This lack of operational cohesion leads to severe business failures:
1. **Unmonitored Food Waste and Shrinkage:** Without real-time recipe-level depletion, kitchen managers cannot detect over-portioning or inventory leakage until end-of-month audits.
2. **Delayed Cost Insight:** Menu items continue to be sold at fixed retail prices even as supplier costs surge, causing gross margins to drop below sustainable levels.
3. **Staffing Friction:** Manual shift coordination causes accidental double-bookings or understaffing during peak dining rushes.
4. **DevOps & System Vulnerabilities:** Independent restaurants lacking dedicated IT teams suffer from undetected database saturations, POS latency spikes, and stock-out emergencies during service hours.

### 1.3 The Solution: Macar
**Macar** is an integrated, agile, cloud-ready Restaurant Operations and Analytics Platform. It bridges front-of-house operations with back-of-house financial controls by synchronizing Point of Sale (POS) transactions with automated, atomic recipe-level inventory depletions, live food cost calculating, intelligent shift conflict detection, and an AI-driven operational consultant. Furthermore, it incorporates an automated DevOps monitoring center that routes critical operational and technical incidents directly to Telegram channels in real time.

---

## 2. Project Scope & Stakeholders

### 2.1 Target Stakeholders
- **Restaurant Owners & Executives:** Need high-level executive analytics (Recharts), P&L summaries, and margin optimization recommendations.
- **General Managers & Kitchen Leads:** Need daily recipe costing calculators, shift scheduling boards with conflict alerts, and inventory reordering notifications.
- **Service & Kitchen Staff:** Need an intuitive, streamlined POS terminal for rapid order entry with zero cognitive overhead.
- **DevOps / Technical Administrators:** Require continuous system health monitoring, latency tracking, and instant Telegram alert notifications.

---

## 3. Functional Requirements (FR-01 to FR-14)

| Req ID | Requirement Title | Detailed Description | Verification & Acceptance Criteria |
| :--- | :--- | :--- | :--- |
| **FR-01** | Role-Based Access Control | The platform shall enforce distinct user roles (Admin, Manager, Staff) with specific permission boundaries. Administrative settings, financial expenses, and system health are restricted from basic staff accounts. | Successfully switched between roles via Navbar; UI dynamically restricts view tabs and sensitive operations based on active role. |
| **FR-02** | Ingredient Record Management | The system shall maintain an inventory registry of raw ingredients with attributes for unit measurement (kg, g, L, ml, pcs), current quantity, minimum reorder threshold, and unit purchase cost in AZN (₼). | Ingredients can be created, updated, searched, and deleted; stock levels update dynamically. |
| **FR-03** | Supplier Directory & Association | The system shall track commercial food vendors and distributors, logging vendor name, phone number, email address, delivery terms, and assigned raw ingredients. | Suppliers can be cataloged and associated with ingredient supply chains. |
| **FR-04** | Menu Item & Recipe Linking | The platform shall allow managers to create menu items composed of specific quantities of cataloged ingredients per serving portion. | Dishes link to multiple ingredients (e.g. 250g Beef Ribeye + 20g Butter + 5g Rosemary). |
| **FR-05** | Real-Time Food Cost & Margin Computation | The system shall automatically compute total portion food cost based on component ingredient costs, calculate gross profit margin (₼), and flag any dish exceeding a 35% food-cost ratio. | Food cost % updates automatically when ingredient costs or menu prices change. |
| **FR-06** | Atomic POS Stock Depletion | When an order is placed through the Point of Sale terminal, the system shall atomically deduct the exact recipe quantities of all component ingredients from current inventory. | Selling 2 Ribeye Steaks immediately deducts 500g Ribeye and 40g Butter from inventory. |
| **FR-07** | Automated Low-Stock Alerts | The platform shall monitor inventory levels against minimum thresholds and surface prominent warning badges in the navigation bar and inventory view when stock is critically low. | Low-stock pill in Navbar updates in real-time with exact count of depleted items. |
| **FR-08** | Staff Shift Scheduling | The system shall provide an intuitive weekly scheduling interface to assign team members to morning, evening, or split shifts with defined start and end times. | Shifts can be scheduled, edited, and filtered across roles (Chef, Waiter, Bartender). |
| **FR-09** | Financial & Performance Analytics | The platform shall render responsive data visualizations: Daily Revenue vs Food Cost AreaChart, Operating Expense Breakdown PieChart, and Menu Item Profitability BarChart. | Recharts render dynamically with tooltips, legends, and responsive scaling. |
| **FR-10** | Plain-Language Trend Summaries | An AI-assisted module shall analyze recent operational datasets and generate concise, executive-level natural language summaries highlighting sales momentum and top-performing dishes. | AI Copilot generates actionable prose summaries without technical jargon. |
| **FR-11** | Cost-Reduction & Margin Recommendations | The AI module shall evaluate inventory and menu profitability data to provide specific, prioritized recommendations for renegotiating supplier rates or adjusting menu pricing. | AI surfaces flagged high-cost dishes with concrete operational mitigation steps. |
| **FR-12** | Shift Conflict & Overlap Detection | The scheduling engine shall automatically validate time slots to prevent double-booking any employee on overlapping shifts on the same calendar day. | System rejects overlapping shifts for the same worker and alerts the scheduler. |
| **FR-13** | Operating Expense Tracking | The system shall log recurring and ad-hoc overhead expenses (Rent, Utilities, Staff Payroll, Equipment Maintenance, Marketing) to evaluate net operational profit. | Expenses are categorized and juxtaposed against gross sales for net operating margin. |
| **FR-14** | DevOps Health & Telegram Incident Alerts | The platform shall monitor critical operational and system health metrics, providing 1-click incident simulations and automated dispatching to Telegram alert channels. | Section 4 alert rules trigger live Telegram messages and local incident log entries. |

---

## 4. DevOps & System Health Monitoring Rules (Section 4)

Macar incorporates a dedicated **DevOps & Incident Center** adhering strictly to the Section 4 operational monitoring requirements:

```
DevOps Incident Lifecycle
┌──────────────────────┐     Threshold Breach      ┌────────────────────────┐
│  Continuous Metric   │ ────────────────────────> │  Section 4 Rule Engine │
│  Collection Stream   │                           │  (5 Monitored Rules)   │
└──────────────────────┘                           └───────────┬────────────┘
                                                               │
                                         Alert Event Dispatched│
                                                               ▼
┌──────────────────────┐   Fallback Stream Log     ┌────────────────────────┐
│  In-App Incident     │ <──────────────────────── │  Telegram Bot API      │
│  Audit Trail Log     │                           │  (Live Push to Channel)│
└──────────────────────┘                           └────────────────────────┘
```

### The 5 Monitored Incident Rules:
1. **Rule 1: API Latency Degradation**
   - *Threshold:* P95 response latency exceeds 1,500 ms for longer than 2 minutes.
   - *Telegram Dispatch:* `🚨 HIGH LATENCY WARNING: P95 response time reached 1,850ms (Threshold: 1,500ms). Investigate network bottlenecks.`
2. **Rule 2: Database Connection Pool Saturation**
   - *Threshold:* Connection pool utilization exceeds 85% for 3 continuous minutes.
   - *Telegram Dispatch:* `⚠️ DB CONNECTION SATURATION: Active pool usage at 92% (Threshold: 85%). Potential connection leak detected.`
3. **Rule 3: Server Error Rate Surge (HTTP 5xx)**
   - *Threshold:* HTTP 5xx responses account for greater than 5% of total requests over a 5-minute sampling window.
   - *Telegram Dispatch:* `🔥 CRITICAL 5xx ERROR RATE SURGE: 8.4% failed requests detected (Threshold: 5%). Triggering on-call escalation.`
4. **Rule 4: Zero-Sales Service Anomaly**
   - *Threshold:* Zero POS transactions recorded for 30 consecutive minutes during active operational hours (12:00 – 22:00).
   - *Telegram Dispatch:* `⚠️ ZERO-SALES DETECTED: 0 transactions in the last 30 minutes during active service. Verify POS terminal connectivity.`
5. **Rule 5: Critical Stockout Incident**
   - *Threshold:* Real-time stock of any critical high-volume ingredient reaches 0.
   - *Telegram Dispatch:* `🚨 STOCKOUT CRITICAL: Fresh Salmon Fillet has reached 0 units. Immediate supplier reorder required to prevent 86'd dishes.`

---

## 5. Non-Functional Requirements (NFRs)

- **NFR-01: Performance & Response Time:** Standard user interactions (adding items to POS cart, filtering inventory, switching tabs) execute within 50 milliseconds. Data charts render under 200 milliseconds.
- **NFR-02: Usability & Mobile Responsiveness:** Built using Tailwind CSS with responsive layout grids, high contrast color coding, and accessible touch targets (minimum 44x44px) suitable for kitchen tablet mounts and mobile devices.
- **NFR-03: Security & Privacy:** Sensitive API keys (Telegram Bot Token, Gemini API Key) are configurable via environment variables and isolated client-side storage, with role-based restriction concealing administrative settings from basic staff accounts.
- **NFR-04: Maintainability & Agility:** Written entirely in modern TypeScript with strict type checking, modular component breakdown, and a centralized state store that enables frictionless updates when customer requirements evolve.
- **NFR-05: Offline Resilience & Availability:** Employs an intelligent dual-mode architecture: in the absence of internet connectivity or external API credentials, the platform smoothly falls back to an offline heuristic engine for AI recommendations and an in-app audit stream for Telegram alerts.

---

## 6. Software Architecture & Technology Stack

- **Client Framework:** React 18 with TypeScript 5
- **Build System & Dev Server:** Vite 5
- **Styling & Layout:** Tailwind CSS 3.4
- **Iconography:** Lucide React
- **Data Visualization Engine:** Recharts 2.12 (AreaChart, PieChart, BarChart)
- **State & Data Layer:** Reactive Observer Store (`store.ts`) with LocalStorage Persistence
- **AI Intelligence:** Dual-layer architecture:
  - Primary: Google Gemini 2.5 Flash API
  - Fallback: Offline Rule-Based Operational Heuristic Engine
- **Alert Dispatcher:** Official Telegram Bot API (`https://api.telegram.org/bot<token>/sendMessage`) with Sandbox Event Logging

---

## 7. Agile Development Methodology & Sprint Plan

The project follows an Agile Scrum framework with 2-week sprint cycles:
- **Sprint 1 (Architecture & Data Foundations):** TypeScript domain models, reactive store, Baku Bistro seed dataset, role switcher, and ingredient/supplier inventory management.
- **Sprint 2 (Core Operations):** Menu recipe costing calculator, POS sales terminal with atomic stock depletion, and shift schedule board with collision validation.
- **Sprint 3 (Analytics & Intelligence):** Recharts executive dashboard, operating expense tracking, and AI Copilot integration for summaries and margin optimizations.
- **Sprint 4 (DevOps Monitoring & Polish):** Section 4 Telegram monitoring center, 1-click incident simulators, cross-browser verification, and academic documentation.

---

## 8. Conclusion & Sign-Off

Macar provides a complete, modern, agile, and production-ready solution tailored to the operational realities of the hospitality industry. All 14 functional requirements and Section 4 DevOps alert rules are fully implemented, verified, and ready for immediate demonstration.

**Approved by Team 11:**
- *Basam Abdulhakeem Ismaeel*
- *Balint Vasa*
- *Bilal Hasanov*
