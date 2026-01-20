# Integration Pulse™
## Product Requirements Document (PRD)
### M&A People Analytics Control Tower

---

# Document Information

| Field | Value |
|-------|-------|
| **Product Name** | Integration Pulse™ |
| **Version** | 1.0 |
| **Created** | January 19, 2025 |
| **Author** | LatentView Analytics |
| **Status** | Ready for Development |
| **Target Platform** | Web Application |

---

# Executive Summary

Integration Pulse™ is a real-time decision intelligence platform that provides HR leaders and executives with unprecedented visibility into workforce integration health during M&A transitions. The application demonstrates LatentView's capabilities using the LatentView + Decision Point acquisition as a live case study.

**Primary Demo Objective:** Win the Mars + Kellanova workforce integration engagement by showing "we've lived through this."

---

# Brand Guidelines & Design System

## LatentView Color Palette

### Primary Colors
```css
/* Primary Brand Colors */
--lv-navy-900: #0A1628;      /* Darkest - Headers, Primary Text */
--lv-navy-800: #0F2744;      /* Dark backgrounds */
--lv-navy-700: #1A365D;      /* Secondary backgrounds */
--lv-blue-600: #2563EB;      /* Primary actions, links */
--lv-blue-500: #3B82F6;      /* Hover states */
--lv-blue-400: #60A5FA;      /* Active states */

/* Accent Colors - For Data Visualization */
--lv-accent-orange: #F97316; /* Acquired entity (Decision Point) */
--lv-accent-teal: #14B8A6;   /* Positive indicators */
--lv-accent-purple: #8B5CF6; /* Tertiary data series */
```

### Semantic Colors
```css
/* Status Colors */
--status-success: #10B981;   /* Green - On track, healthy */
--status-warning: #F59E0B;   /* Amber - Caution, attention needed */
--status-danger: #EF4444;    /* Red - Critical, action required */
--status-info: #3B82F6;      /* Blue - Informational */

/* Risk Levels */
--risk-high: #DC2626;        /* High risk (75-100) */
--risk-medium: #F59E0B;      /* Medium risk (50-74) */
--risk-low: #10B981;         /* Low risk (0-49) */
```

### Neutral Colors
```css
/* Backgrounds & Surfaces */
--bg-primary: #F8FAFC;       /* Main background */
--bg-secondary: #F1F5F9;     /* Card backgrounds */
--bg-tertiary: #E2E8F0;      /* Subtle highlights */
--surface-white: #FFFFFF;    /* Cards, modals */

/* Text Colors */
--text-primary: #0F172A;     /* Primary text */
--text-secondary: #475569;   /* Secondary text */
--text-tertiary: #94A3B8;    /* Muted text, placeholders */
--text-inverse: #FFFFFF;     /* Text on dark backgrounds */

/* Borders */
--border-light: #E2E8F0;     /* Light borders */
--border-default: #CBD5E1;   /* Default borders */
--border-focus: #3B82F6;     /* Focus states */
```

### Data Visualization Palette
```css
/* Chart Colors - 8 Color Sequence */
--chart-1: #2563EB;          /* Primary blue (Acquirer) */
--chart-2: #F97316;          /* Orange (Acquired) */
--chart-3: #10B981;          /* Teal */
--chart-4: #8B5CF6;          /* Purple */
--chart-5: #EC4899;          /* Pink */
--chart-6: #14B8A6;          /* Cyan */
--chart-7: #F59E0B;          /* Amber */
--chart-8: #6366F1;          /* Indigo */

/* Gradient for Gauges */
--gauge-gradient: linear-gradient(90deg, #EF4444 0%, #F59E0B 50%, #10B981 100%);
```

## Typography

### Font Family
```css
/* Primary Font - Inter (Google Fonts) */
--font-primary: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;

/* Monospace - For numbers and code */
--font-mono: 'JetBrains Mono', 'Fira Code', monospace;
```

### Type Scale
```css
/* Headings */
--text-h1: 2.25rem;    /* 36px - Page titles */
--text-h2: 1.5rem;     /* 24px - Section titles */
--text-h3: 1.25rem;    /* 20px - Card titles */
--text-h4: 1.125rem;   /* 18px - Subsection titles */

/* Body */
--text-body: 0.875rem; /* 14px - Default body text */
--text-small: 0.75rem; /* 12px - Captions, labels */

/* Metrics */
--text-metric-xl: 3rem;    /* 48px - Hero metrics */
--text-metric-lg: 2rem;    /* 32px - Large metrics */
--text-metric-md: 1.5rem;  /* 24px - Medium metrics */
--text-metric-sm: 1.25rem; /* 20px - Small metrics */

/* Font Weights */
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
```

## Spacing & Layout

```css
/* Base spacing unit: 4px */
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px */
--space-5: 1.25rem;   /* 20px */
--space-6: 1.5rem;    /* 24px */
--space-8: 2rem;      /* 32px */
--space-10: 2.5rem;   /* 40px */
--space-12: 3rem;     /* 48px */

/* Border Radius */
--radius-sm: 0.25rem;  /* 4px - Small elements */
--radius-md: 0.5rem;   /* 8px - Cards, buttons */
--radius-lg: 0.75rem;  /* 12px - Large cards */
--radius-xl: 1rem;     /* 16px - Modals */
--radius-full: 9999px; /* Pills, avatars */

/* Shadows */
--shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
--shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
```

## Design Principles

### 1. **Data-First Hierarchy**
- Hero metrics should be immediately visible and scannable
- Use size and color to create clear visual hierarchy
- Most important information at top-left (F-pattern reading)

### 2. **Minimal Chrome, Maximum Data**
- Reduce decorative elements
- Every pixel should serve a purpose
- White space is intentional, not empty

### 3. **Consistent Visual Language**
- Acquirer (LatentView) = Blue (#2563EB)
- Acquired (Decision Point) = Orange (#F97316)
- This color coding is consistent across ALL visualizations

### 4. **Accessible & Scannable**
- Minimum contrast ratio 4.5:1 for text
- Don't rely on color alone for meaning
- Clear labels on all data points

### 5. **Sophisticated Animations**
- Subtle transitions (200-300ms)
- Easing: ease-out for entrances, ease-in for exits
- Number animations: count up on page load
- Chart animations: draw lines, grow bars

---

# Application Architecture

## Navigation Structure

```
┌─────────────────────────────────────────────────────────────────────┐
│  ┌─────────┐                                                        │
│  │   LV    │  Integration Pulse™              Day 42 of 180        │
│  │  LOGO   │                                                        │
│  └─────────┘                                           🔔  👤       │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐       │
│  │Command  │ │ Talent  │ │ Account │ │Scenario │ │ Action  │       │
│  │ Center  │ │  Pulse  │ │  Risk   │ │   Lab   │ │   Hub   │       │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘ └─────────┘       │
│    ACTIVE                                                           │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│                     [ MODULE CONTENT ]                              │
│                                                                     │
├─────────────────────────────────────────────────────────────────────┤
│  🤖 Ask anything about your integration...                    ▲    │
└─────────────────────────────────────────────────────────────────────┘
```

## Module Overview

| # | Module | Route | Primary User | Core Question |
|---|--------|-------|--------------|---------------|
| 1 | Command Center | `/` | CHRO, CEO | "How healthy is our integration?" |
| 2 | Talent Pulse | `/talent` | HR Leaders | "Who's at risk and why?" |
| 3 | Account Risk | `/accounts` | CFO, CEO | "Which clients are at risk?" |
| 4 | Scenario Lab | `/scenarios` | Strategy, Finance | "What if X happens?" |
| 5 | Action Hub | `/actions` | All stakeholders | "What should we do now?" |

---

# Phase 1: Command Center
## "The 30-Second Health Check"

### Overview
The Command Center is the landing page — the executive dashboard that answers "Should I be worried?" in under 30 seconds.

### Layout Blueprint

```
┌─────────────────────────────────────────────────────────────────────────┐
│ COMMAND CENTER                                      Day 42 of 180      │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌─────────────────────────────┐  ┌─────────────────────────────────┐  │
│  │   INTEGRATION HEALTH        │  │       REVENUE AT RISK           │  │
│  │                             │  │                                 │  │
│  │         ╭──────╮            │  │         ╭──────╮               │  │
│  │        │  72  │            │  │        │ $2.1M │              │  │
│  │         ╰──────╯            │  │         ╰──────╯               │  │
│  │    ▲ +3 from last week      │  │    15% of $14M at risk         │  │
│  │                             │  │                                 │  │
│  │  Talent Culture Ops  Cost   │  │  By Account ►                  │  │
│  │   68     71    78    74     │  │                                 │  │
│  └─────────────────────────────┘  └─────────────────────────────────┘  │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                      CRITICAL ALERTS                             │   │
│  │                                                                  │   │
│  │  🔴 $890K at risk: Key consultants on PepsiCo at flight risk   │   │
│  │  🔴 Kellanova relationship: Primary contact showing signals     │   │
│  │  🟡 Grade harmonization: 42 employees pending (Day 60 target)   │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  ┌───────────────────────────────┐  ┌───────────────────────────────┐  │
│  │   REVENUE AT RISK BY ACCOUNT  │  │   ATTRITION COMPARISON        │  │
│  │                               │  │                               │  │
│  │  PepsiCo     ████████ $620K  │  │  25% ─                        │  │
│  │  Kellanova   ███████ $480K   │  │  20%    ·····  Acquired       │  │
│  │  Unilever    █████ $340K     │  │  15% ────────  Acquirer       │  │
│  │  Coca-Cola   ████ $280K      │  │  10%                          │  │
│  │  Coke Bottl  ███ $220K       │  │   5%                          │  │
│  │  Bimbo       ██ $140K        │  │      M1 M2 M3 M4 M5 M6        │  │
│  └───────────────────────────────┘  └───────────────────────────────┘  │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                    POPULATION OVERVIEW                           │   │
│  │                                                                  │   │
│  │   BY GEOGRAPHY              BY FUNCTION              BY ORIGIN  │   │
│  │  ┌───────────────┐        ┌───────────────┐        ┌─────────┐  │   │
│  │  │ India    250  │        │ Delivery  108 │        │ LV 1247 │  │   │
│  │  │ US        32  │        │ Tech       95 │        │ DP  312 │  │   │
│  │  │ LatAm     25  │        │ RGM        92 │        └─────────┘  │   │
│  │  │ Europe     5  │        │ Product    17 │                     │   │
│  │  └───────────────┘        └───────────────┘                     │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                    INTEGRATION MILESTONES                        │   │
│  │                                                                  │   │
│  │  Day 1    Day 30     Day 60     Day 90    Day 120    Day 180    │   │
│  │    ●────────●──────────◐──────────○──────────○──────────○       │   │
│  │  Close    Org       Grade      Culture    Synergy     Full      │   │
│  │           Announced  Harmonize  Survey    Targets    Integration│   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### Component Specifications

#### 1. Integration Health Score (Hero Metric)

**Visual Type:** Circular gauge with animated needle

**Specifications:**
- Size: 200px × 200px
- Score range: 0-100
- Number font: 48px, font-weight 700
- Color zones:
  - 0-50: Red gradient
  - 51-70: Amber gradient
  - 71-85: Light green
  - 86-100: Green
- Animation: Number counts up from 0 on page load (1.5s duration)
- Sub-scores displayed as pill badges below

**Data Required:**
```json
{
  "overallScore": 72,
  "trend": "+3",
  "trendPeriod": "vs last week",
  "subScores": {
    "talent": 68,
    "culture": 71,
    "operations": 78,
    "cost": 74
  }
}
```

#### 2. Revenue at Risk (Hero Metric)

**Visual Type:** Large number with context

**Specifications:**
- Primary number: 48px, font-weight 700, color: --status-danger
- Format: $X.XM
- Subtext: "X% of $14M at risk"
- Link: "By Account ►" navigates to Account Risk module

**Data Required:**
```json
{
  "totalAtRisk": 2100000,
  "totalRevenue": 14000000,
  "percentAtRisk": 15,
  "trend": "+400000",
  "trendPeriod": "vs last week"
}
```

#### 3. Critical Alerts Panel

**Visual Type:** Scrollable card list

**Specifications:**
- Max height: 200px with scroll
- Alert card height: ~60px
- Severity indicators:
  - 🔴 Critical: Red left border (4px)
  - 🟡 Warning: Amber left border
  - 🔵 Info: Blue left border
- Show max 5 alerts, "See all" link if more
- Click alert → expand for details or navigate

**Data Required:**
```json
{
  "alerts": [
    {
      "id": "alert-1",
      "severity": "critical",
      "title": "$890K at risk: Key consultants on PepsiCo at flight risk",
      "timestamp": "2 hours ago",
      "actionLink": "/accounts/pepsico"
    }
  ]
}
```

#### 4. Revenue at Risk by Account (Horizontal Bar Chart)

**Visual Type:** Horizontal bar chart with threshold line

**Specifications:**
- Bar height: 24px
- Gap between bars: 8px
- Color: Gradient based on risk level
- Threshold line: Dashed vertical at $300K (configurable)
- Labels: Account name (left), Amount (right)
- Sorted: Descending by amount

**Data Required:**
```json
{
  "accounts": [
    {"name": "PepsiCo", "atRisk": 620000, "total": 2800000},
    {"name": "Kellanova", "atRisk": 480000, "total": 1900000},
    {"name": "Unilever", "atRisk": 340000, "total": 2200000},
    {"name": "Coca-Cola", "atRisk": 280000, "total": 1800000},
    {"name": "Coke Bottlers", "atRisk": 220000, "total": 1400000},
    {"name": "Bimbo", "atRisk": 140000, "total": 900000}
  ],
  "threshold": 300000
}
```

#### 5. Attrition Comparison (Dual Line Chart)

**Visual Type:** Line chart with two series

**Specifications:**
- X-axis: Months (M1-M6, expandable to M12)
- Y-axis: Attrition % (0-30%)
- Series 1: Acquirer (solid blue line)
- Series 2: Acquired (dotted orange line)
- Point markers: 6px circles
- Tooltip on hover with exact values
- Legend below chart

**Data Required:**
```json
{
  "acquirer": [
    {"month": "M1", "rate": 11.2},
    {"month": "M2", "rate": 10.8},
    {"month": "M3", "rate": 11.5},
    {"month": "M4", "rate": 11.0},
    {"month": "M5", "rate": 10.5},
    {"month": "M6", "rate": 11.2}
  ],
  "acquired": [
    {"month": "M1", "rate": 12.5},
    {"month": "M2", "rate": 14.2},
    {"month": "M3", "rate": 16.8},
    {"month": "M4", "rate": 18.5},
    {"month": "M5", "rate": 17.2},
    {"month": "M6", "rate": 18.0}
  ]
}
```

#### 6. Population Overview (Multi-Panel Summary)

**Visual Type:** Three summary cards side by side

**Card 1: By Geography**
- List format with small horizontal bars
- Show headcount and mini bar proportional to total

**Card 2: By Function**
- Same format
- Functions: Delivery, Technology, RGM, Product

**Card 3: By Origin**
- Two large numbers
- "LV: 1,247" in blue
- "DP: 312" in orange
- Combined total below

#### 7. Integration Milestones (Timeline)

**Visual Type:** Horizontal timeline with nodes

**Specifications:**
- Node states:
  - Complete: Filled circle (--status-success)
  - In Progress: Half-filled circle
  - Upcoming: Empty circle
  - At Risk: Empty circle with red border
- Connecting line: 2px, --border-default
- Labels below each node
- Current day marker above timeline

**Data Required:**
```json
{
  "currentDay": 42,
  "milestones": [
    {"day": 1, "label": "Close", "status": "complete"},
    {"day": 30, "label": "Org Announced", "status": "complete"},
    {"day": 60, "label": "Grade Harmonize", "status": "in-progress"},
    {"day": 90, "label": "Culture Survey", "status": "upcoming"},
    {"day": 120, "label": "Synergy Targets", "status": "upcoming"},
    {"day": 180, "label": "Full Integration", "status": "upcoming"}
  ]
}
```

---

# Phase 2: Talent Pulse
## "Know Who's At Risk Before They Know"

### Layout Blueprint

```
┌─────────────────────────────────────────────────────────────────────────┐
│ TALENT PULSE                           Filter: [Function▼] [Geo▼]      │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌───────────────────────────────┐  ┌───────────────────────────────┐  │
│  │    FLIGHT RISK MATRIX         │  │    ATTRITION BY FUNCTION      │  │
│  │                               │  │                               │  │
│  │  Impact ▲                     │  │  RGM        ████████████ 18%  │  │
│  │    High │  ●    ●             │  │  Delivery   ███████ 14%       │  │
│  │         │    ●●               │  │  Tech       █████ 12%         │  │
│  │    Low  │  ●●●●●●             │  │  Product    ███ 6%            │  │
│  │         └─────────────────►   │  │                               │  │
│  │           Low    High         │  │  ── 12% Threshold             │  │
│  │           Flight Risk         │  │                               │  │
│  └───────────────────────────────┘  └───────────────────────────────┘  │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                    HIGH-PRIORITY WATCHLIST                       │   │
│  │                                                                  │   │
│  │  Risk│ Name        │ Role          │ Account   │ Signals │ Act  │   │
│  │  ────┼─────────────┼───────────────┼───────────┼─────────┼───── │   │
│  │   92 │ [Avatar] Priya S. │ Eng Lead      │ PepsiCo   │ 🔴🔴🟡 │  → │   │
│  │   88 │ [Avatar] Rahul M. │ RGM Director  │ Kellanova │ 🔴🟡🟡 │  → │   │
│  │   85 │ [Avatar] Chen W.  │ Sr Consultant │ Unilever  │ 🔴🟡🟡 │  → │   │
│  │   76 │ [Avatar] Maria L. │ Data Engineer │ Bimbo     │ 🟡🟡🟡 │  → │   │
│  │   72 │ [Avatar] James T. │ PM Lead       │ Coca-Cola │ 🟡🟡🔵 │  → │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  ┌───────────────────────────────┐  ┌───────────────────────────────┐  │
│  │    GRADE HARMONIZATION        │  │    ATTRITION DRIVERS          │  │
│  │                               │  │                               │  │
│  │  G1 ══════════════════► L1   │  │  Baseline         11%         │  │
│  │  G2 ══════════╦═══════► L2   │  │  + Comp concerns  +4.2%       │  │
│  │  G3 ══════════╝              │  │  + Role ambiguity +3.1%       │  │
│  │  G4 ══════════════════► L3   │  │  + Manager change +2.8%       │  │
│  │  G5 ══════════════════► L4   │  │  - Retention      -2.5%       │  │
│  │                               │  │  ───────────────────────      │  │
│  │  Mapped: 270 (87%)           │  │  Current          18.6%       │  │
│  │  Pending: 42 (13%)           │  │                               │  │
│  └───────────────────────────────┘  └───────────────────────────────┘  │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### Component Specifications

#### 1. Flight Risk Matrix (Scatter Plot)

**Visual Type:** 2×2 scatter plot with quadrants

**Specifications:**
- X-axis: Flight Risk Score (0-100)
- Y-axis: Business Impact (0-100)
- Quadrant labels:
  - Top-right: "ACT NOW" (red background tint)
  - Top-left: "MONITOR"
  - Bottom-right: "DEVELOP"
  - Bottom-left: "STABLE" (green background tint)
- Point size: Proportional to tenure (8-20px)
- Point color: By origin (blue/orange)
- Hover: Show name, role, account
- Click: Open detail panel

#### 2. High-Priority Watchlist (Data Table)

**Visual Type:** Interactive sortable table

**Specifications:**
- Columns: Risk Score, Avatar+Name, Role, Account, Signals, Action
- Risk Score: Color-coded badge (90+ red, 70-89 amber, <70 green)
- Signals: Icon array (max 3 visible)
  - 🔴 Manager flagged
  - 🟡 Comp gap
  - 🟡 Grade pending
  - 🔵 Peer departed
- Row hover: Subtle highlight
- Row click: Expand for full profile
- Action button: → opens detail panel

#### 3. Grade Harmonization (Sankey-style Flow)

**Visual Type:** Flow diagram

**Specifications:**
- Left column: DP grades (G1-G5) with counts
- Right column: LV grades (L1-L4) with counts
- Connecting flows: Width proportional to count
- Flow colors:
  - Mapped: Blue gradient
  - Pending: Orange with dashed border
- Summary stats below: "Mapped: X (Y%)" | "Pending: X (Y%)"

#### 4. Attrition Drivers (Waterfall Chart)

**Visual Type:** Horizontal waterfall

**Specifications:**
- Start: Baseline attrition (green)
- Positive contributors: Red bars (adding to attrition)
- Negative contributors: Green bars (reducing attrition)
- End: Current attrition (summary bar)
- Labels: Factor name + percentage

---

# Phase 3: Account Risk View
## "Which Clients Are At Risk?"

### Layout Blueprint

```
┌─────────────────────────────────────────────────────────────────────────┐
│ ACCOUNT RISK                                    Total DP Revenue: $14M │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                    ACCOUNT RISK MATRIX                           │   │
│  │                                                                  │   │
│  │     Revenue ▲                                                   │   │
│  │        $3M │              ● PepsiCo                             │   │
│  │            │                                                    │   │
│  │        $2M │     ● Kellanova    ● Unilever                      │   │
│  │            │                              ● Coca-Cola           │   │
│  │        $1M │  ● Coke Bottlers                                   │   │
│  │            │        ● Bimbo                                     │   │
│  │            └──────────────────────────────────────────────────► │   │
│  │                 Low            Medium            High           │   │
│  │                           People Risk                           │   │
│  │                                                                  │   │
│  │     ● Size = Team Size   Color: 🔴 High 🟡 Medium 🟢 Low        │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  ACCOUNT CARDS                                                   │   │
│  │                                                                  │   │
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌────────────┐ │   │
│  │  │  PEPSICO    │ │  KELLANOVA  │ │  UNILEVER   │ │ COCA-COLA  │ │   │
│  │  │  $2.8M      │ │  $1.9M      │ │  $2.2M      │ │ $1.8M      │ │   │
│  │  │  At Risk:   │ │  At Risk:   │ │  At Risk:   │ │ At Risk:   │ │   │
│  │  │  $620K 🔴   │ │  $480K 🔴   │ │  $340K 🟡   │ │ $280K 🟡   │ │   │
│  │  │  Team: 18   │ │  Team: 14   │ │  Team: 16   │ │ Team: 12   │ │   │
│  │  │  Renewal:   │ │  Renewal:   │ │  Renewal:   │ │ Renewal:   │ │   │
│  │  │  Mar 2025   │ │  Jun 2025   │ │  Sep 2025   │ │ Dec 2025   │ │   │
│  │  └─────────────┘ └─────────────┘ └─────────────┘ └────────────┘ │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  ACCOUNT DETAIL: PEPSICO (Click any card to expand)              │   │
│  │                                                                  │   │
│  │  Annual Revenue: $2.8M    Renewal: March 2025 (2 months)        │   │
│  │  Team Size: 18            Risk: 🔴 HIGH ($620K at risk)         │   │
│  │                                                                  │   │
│  │  KEY PERSONNEL                                                  │   │
│  │  ┌──────────────────────────────────────────────────────────┐   │   │
│  │  │ Role            │ Name      │ Risk │ Revenue │ Signals   │   │   │
│  │  │ Engagement Lead │ Priya S.  │  92  │ $420K   │ 🔴🔴🟡    │   │   │
│  │  │ Sr. Consultant  │ Rahul M.  │  88  │ $280K   │ 🔴🟡🟡    │   │   │
│  │  │ Data Engineer   │ Amit K.   │  45  │ $120K   │ 🟡        │   │   │
│  │  └──────────────────────────────────────────────────────────┘   │   │
│  │                                                                  │   │
│  │  ⚠️ RISK FACTORS:                                               │   │
│  │  • 2 of 3 key personnel are high flight risk                   │   │
│  │  • Contract renewal in 2 months - relationship continuity key  │   │
│  │  • No backup identified for Engagement Lead role               │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### Component Specifications

#### 1. Account Risk Matrix (Bubble Chart)

**Visual Type:** Scatter plot with sized bubbles

**Specifications:**
- X-axis: People Risk Score (0-100)
- Y-axis: Annual Revenue ($0-$3M+)
- Bubble size: Team size (8-40px radius)
- Bubble color: Risk level (red/amber/green)
- Labels: Account name next to each bubble
- Quadrant shading: Top-right (high risk, high value) = light red tint
- Hover: Show full details tooltip
- Click: Select account, scroll to detail view

#### 2. Account Summary Cards

**Visual Type:** Horizontal card row (scrollable if needed)

**Specifications:**
- Card size: 180px × 160px
- Card content:
  - Account name (header, bold)
  - Total revenue (large number)
  - At Risk amount + risk badge
  - Team size
  - Contract renewal date
- Selected card: Blue border, subtle shadow
- Hover: Slight lift effect

#### 3. Account Detail Panel

**Visual Type:** Expandable detail section

**Specifications:**
- Appears below cards when account selected
- Sections:
  - Header: Key metrics row
  - Key Personnel table
  - Risk Factors (bullet list)
  - Recommended Actions
- Personnel table: Sortable by risk score
- Revenue attribution per person shown

---

# Phase 4: Scenario Lab
## "What If This Happens?"

### Layout Blueprint

```
┌─────────────────────────────────────────────────────────────────────────┐
│ SCENARIO LAB                                   [Save] [Compare] [Reset]│
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                    SCENARIO BUILDER                              │   │
│  │                                                                  │   │
│  │  Select at-risk employees to model departure impact:            │   │
│  │                                                                  │   │
│  │  ☑ Priya S.    PepsiCo Lead       $420K revenue                │   │
│  │  ☑ Rahul M.    Kellanova Director $380K revenue                │   │
│  │  ☐ Chen W.     Unilever Consultant $280K revenue               │   │
│  │  ☐ Maria L.    Bimbo Engineer      $180K revenue               │   │
│  │                                                                  │   │
│  │  OR set attrition scenario:                                     │   │
│  │  Attrition Rate: [═══════════●═══] 25%  (Current: 18%)         │   │
│  │                                                                  │   │
│  │                                            [Run Scenario]        │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  ┌───────────────────────────────┐  ┌───────────────────────────────┐  │
│  │    REVENUE IMPACT             │  │    COST-BENEFIT ANALYSIS      │  │
│  │                               │  │                               │  │
│  │  Direct Revenue Loss:         │  │  Option A: No Intervention    │  │
│  │  $800K                        │  │  Expected loss: $1.2M         │  │
│  │                               │  │                               │  │
│  │  Potential Non-Renewal:       │  │  Option B: Retention Package  │  │
│  │  +$400K (ripple effect)       │  │  Cost: $80K                   │  │
│  │                               │  │  Expected saved: $720K        │  │
│  │  ─────────────────────────    │  │  ROI: 9x                      │  │
│  │  Total at Risk: $1.2M         │  │                               │  │
│  │                               │  │  ✓ RECOMMENDED                │  │
│  └───────────────────────────────┘  └───────────────────────────────┘  │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                    ACCOUNT IMPACT                                │   │
│  │                                                                  │   │
│  │  If selected employees leave:                                   │   │
│  │                                                                  │   │
│  │  Account     │ Impact    │ Renewal Risk │ Mitigation            │   │
│  │  ────────────┼───────────┼──────────────┼─────────────────────  │   │
│  │  PepsiCo     │ 🔴 HIGH   │ Elevated     │ No backup identified  │   │
│  │  Kellanova   │ 🔴 HIGH   │ Critical     │ Relationship at risk  │   │
│  │  Unilever    │ 🟢 LOW    │ Stable       │ Backup available      │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  [Generate Business Case PDF]    [Send to Action Hub]          │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

# Phase 5: Action Hub
## "What Should We Do Now?"

### Layout Blueprint

```
┌─────────────────────────────────────────────────────────────────────────┐
│ ACTION HUB                                        [+ New Action]       │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                    AI-RECOMMENDED ACTIONS                        │   │
│  │                                                                  │   │
│  │  ┌────────────────────────────────────────────────────────────┐ │   │
│  │  │ 1 │ 🔴 URGENT │ Retention conversation with Priya S.       │ │   │
│  │  │   │           │ PepsiCo Engagement Lead - Flight Risk: 92  │ │   │
│  │  │   │           │ Revenue at risk: $420K │ Recommended: $15K │ │   │
│  │  │   │           │ [Accept] [Modify] [Dismiss] [Why?]         │ │   │
│  │  └────────────────────────────────────────────────────────────┘ │   │
│  │                                                                  │   │
│  │  ┌────────────────────────────────────────────────────────────┐ │   │
│  │  │ 2 │ 🔴 URGENT │ Escalate Kellanova relationship risk       │ │   │
│  │  │   │           │ Primary contact Rahul M. at 88 flight risk │ │   │
│  │  │   │           │ Schedule leadership touchpoint this week   │ │   │
│  │  │   │           │ [Accept] [Modify] [Dismiss] [Why?]         │ │   │
│  │  └────────────────────────────────────────────────────────────┘ │   │
│  │                                                                  │   │
│  │  ┌────────────────────────────────────────────────────────────┐ │   │
│  │  │ 3 │ 🟡 HIGH   │ Complete grade harmonization (42 pending)  │ │   │
│  │  │   │           │ Day 60 target approaching - 18 days left   │ │   │
│  │  │   │           │ [Accept] [Modify] [Dismiss] [Why?]         │ │   │
│  │  └────────────────────────────────────────────────────────────┘ │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │  ACTION TRACKER                                                   │ │
│  │                                                                   │ │
│  │  Backlog (4)        In Progress (3)        Complete (8)          │ │
│  │  ┌─────────────┐    ┌─────────────┐       ┌─────────────┐        │ │
│  │  │ Grade map   │    │ Priya 1:1   │       │ HRIS sync   │        │ │
│  │  │ completion  │    │ scheduled   │       │ ✓           │        │ │
│  │  ├─────────────┤    ├─────────────┤       ├─────────────┤        │ │
│  │  │ LatAm town  │    │ Comp review │       │ Day 30 comms│        │ │
│  │  │ hall        │    │ pending     │       │ ✓           │        │ │
│  │  └─────────────┘    └─────────────┘       └─────────────┘        │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

# Global Components

## AI Assistant (Persistent)

```
┌─────────────────────────────────────────────────────────────────────────┐
│  🤖 Ask anything about your integration...                              │
│                                                                         │
│  Suggestions:                                                          │
│  "What's our biggest risk this week?"                                  │
│  "Show me flight risks in RGM"                                         │
│  "What happens if we lose Priya?"                                      │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ Type your question...                                    [Send] │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  [Expand ▲]                                                            │
└─────────────────────────────────────────────────────────────────────────┘
```

**Specifications:**
- Position: Fixed bottom of viewport
- Collapsed height: 60px (just input bar visible)
- Expanded height: 400px (chat history + suggestions)
- Animation: Smooth slide up/down
- Context aware: Knows which module user is viewing

## Header / Navigation

```
┌─────────────────────────────────────────────────────────────────────────┐
│  [LV Logo]  Integration Pulse™                                         │
│                                                                         │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐           │
│  │Command  │ │ Talent  │ │ Account │ │Scenario │ │ Action  │   Day 42  │
│  │ Center  │ │  Pulse  │ │  Risk   │ │   Lab   │ │   Hub   │  of 180   │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘ └─────────┘   🔔 👤   │
│   ═══════                                                               │
└─────────────────────────────────────────────────────────────────────────┘
```

**Specifications:**
- Height: 64px
- Background: White with subtle shadow
- Logo: LatentView logo (link to home)
- Nav items: Text buttons with active indicator (blue underline)
- Day counter: Right side, prominent
- Alerts badge: Red dot if unread alerts
- User menu: Avatar dropdown

---

# Technical Specifications

## Recommended Tech Stack

### Frontend
- **Framework:** React 18+ or Next.js 14+
- **Styling:** Tailwind CSS (utility-first, matches our design system)
- **Charts:** Recharts or Chart.js (React-friendly)
- **State:** React Context or Zustand (lightweight)
- **Animations:** Framer Motion

### Data Layer
- **Format:** JSON (mock data for demo)
- **Structure:** See data schemas below
- **Future:** REST API endpoints when productized

## Responsive Breakpoints

```css
/* Mobile First */
--breakpoint-sm: 640px;   /* Small tablets */
--breakpoint-md: 768px;   /* Tablets */
--breakpoint-lg: 1024px;  /* Laptops */
--breakpoint-xl: 1280px;  /* Desktops */
--breakpoint-2xl: 1536px; /* Large screens */
```

## Performance Targets

| Metric | Target |
|--------|--------|
| First Contentful Paint | < 1.5s |
| Largest Contentful Paint | < 2.5s |
| Time to Interactive | < 3.0s |
| Total Bundle Size | < 500KB gzipped |

---

# Data Schemas

## Master Employee Schema

```typescript
interface Employee {
  id: string;
  name: string;
  avatar?: string;
  origin: 'LV' | 'DP';
  
  // Role Info
  role: string;
  function: 'Technology' | 'RGM' | 'Delivery' | 'Product';
  geography: 'India' | 'US' | 'LatAm' | 'Europe';
  
  // Grade Info
  dpGrade?: 'G1' | 'G2' | 'G3' | 'G4' | 'G5';
  lvGrade?: 'L1' | 'L2' | 'L3' | 'L4';
  gradeMappingStatus: 'mapped' | 'pending';
  
  // Account Info
  accounts: AccountAssignment[];
  
  // Risk Info
  flightRiskScore: number; // 0-100
  businessImpactScore: number; // 0-100
  riskSignals: RiskSignal[];
  
  // Dates
  hireDate: string;
  tenure: number; // years
}

interface AccountAssignment {
  accountId: string;
  accountName: string;
  role: 'Lead' | 'Consultant' | 'Engineer' | 'Analyst';
  revenueAttribution: number;
  isPrimaryContact: boolean;
}

interface RiskSignal {
  type: 'manager_concern' | 'comp_gap' | 'grade_pending' | 
        'manager_changed' | 'single_point' | 'peer_departed' | 
        'linkedin_active' | 'external_offer';
  severity: 'high' | 'medium' | 'low';
  detectedDate: string;
}
```

## Account Schema

```typescript
interface Account {
  id: string;
  name: string;
  
  // Revenue
  annualRevenue: number;
  revenueAtRisk: number;
  
  // Team
  teamSize: number;
  keyPersonnel: string[]; // Employee IDs
  
  // Risk
  riskLevel: 'high' | 'medium' | 'low';
  peopleRiskScore: number; // 0-100
  
  // Contract
  contractRenewalDate: string;
  renewalRisk: 'critical' | 'elevated' | 'stable';
  
  // Geography
  primaryGeography: string;
}
```

---

# Development Phases

## Phase 1: Foundation (Days 1-2)
- [ ] Project setup (React/Next.js + Tailwind)
- [ ] Design system implementation (colors, typography, components)
- [ ] Navigation structure
- [ ] Mock data setup

## Phase 2: Command Center (Days 3-4)
- [ ] Health Score gauge component
- [ ] Revenue at Risk card
- [ ] Alerts panel
- [ ] Revenue by Account chart
- [ ] Attrition comparison chart
- [ ] Population overview cards
- [ ] Milestones timeline

## Phase 3: Talent Pulse (Days 5-6)
- [ ] Flight Risk Matrix scatter plot
- [ ] Watchlist table with sorting
- [ ] Grade Harmonization flow diagram
- [ ] Attrition Drivers waterfall
- [ ] Employee detail panel

## Phase 4: Account Risk (Day 7)
- [ ] Account Risk Matrix bubble chart
- [ ] Account summary cards
- [ ] Account detail panel with personnel table

## Phase 5: Scenario Lab (Day 8)
- [ ] Scenario builder with checkboxes/sliders
- [ ] Impact calculations
- [ ] Cost-benefit display
- [ ] Account impact table

## Phase 6: Action Hub (Day 9)
- [ ] AI recommendations cards
- [ ] Kanban board for action tracker
- [ ] Action detail modals

## Phase 7: Polish & AI (Day 10)
- [ ] AI chat interface (UI only for demo)
- [ ] Animations and transitions
- [ ] Responsive testing
- [ ] Demo script preparation

---

# Demo Script Outline

## Opening (30 seconds)
> "In March 2024, we acquired Decision Point — 312 people, $14M in revenue, different culture. What I'm about to show you is the control tower we built to manage that integration. Mars is at Day 40 of your Kellanova integration. Let me show you what we learned."

## Command Center (2 minutes)
- Show health score: "Overall we're at 72 — not bad, but not great"
- Revenue at risk: "More importantly, $2.1M of revenue is tied to people at risk"
- Alerts: "These are the fires we're watching"

## Account Risk (2 minutes)
- Show PepsiCo detail: "Our biggest account has 2 key people at flight risk"
- Kellanova connection: "And yes, we serve Kellanova too — you can imagine the sensitivity there"

## Scenario Lab (2 minutes)
- Run what-if: "What if we lose Priya and Rahul?"
- Show impact: "$1.2M at risk, but $80K in retention investment has 9x ROI"

## Close
> "This took us 10 months to figure out. You're at Day 40 of 180. We can help you see around corners."

---

# Appendix: Quick Reference

## Color Quick Reference
| Use Case | Color | Hex |
|----------|-------|-----|
| Acquirer (LV) | Blue | #2563EB |
| Acquired (DP) | Orange | #F97316 |
| Success | Green | #10B981 |
| Warning | Amber | #F59E0B |
| Danger | Red | #EF4444 |
| Background | Light gray | #F8FAFC |

## Icon Suggestions (Lucide or Heroicons)
- Health: `HeartPulse`
- Revenue: `DollarSign`
- Risk: `AlertTriangle`
- People: `Users`
- Account: `Building2`
- Scenario: `FlaskConical`
- Action: `CheckCircle`

---

*PRD Version: 1.0*
*Last Updated: January 19, 2025*
