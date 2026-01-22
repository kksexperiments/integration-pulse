# Integration Pulse™ → Google Sheets Backend Integration Strategy
## Technical Integration Roadmap for M&A People Analytics

---

## Executive Summary

This document provides a comprehensive backend integration strategy to connect the **Integration Pulse** front-end dashboard to a **Google Sheets** data backend. The strategy includes:

1. **Data Mapping Logic**: Complete mapping of UI elements to Google Sheets structures
2. **API & Integration Architecture**: Efficient data fetching and normalization patterns
3. **Calculated Fields Logic**: Backend formulas for derived metrics
4. **Engineering Quick Wins**: Named ranges, aggregation sheets, and optimization patterns

---

## 1. Google Sheets Data Architecture

### Recommended Sheet Structure

Based on your dashboard requirements, I recommend **FIVE** Google Sheets:

#### Sheet 1: `master_roster`
**Purpose**: Single source of truth for all employee data

| Column | Data Type | Example | Notes |
|--------|-----------|---------|-------|
| `employee_id` | String | `emp-001` | Primary key |
| `employee_name` | String | `Priya S.` | Full name |
| `role` | String | `Engagement Lead` | Job title/designation |
| `origin` | String | `DP` or `LV` | Company origin (Decision Point or LatentView) |
| `function` | String | `Delivery` | Department (Delivery, Technology, RGM, Product) |
| `geography` | String | `India` | Location (India, US, Europe, LatAm) |
| `tenure_years` | Number | `5.8` | Years of service |
| `manager_id` | String | `emp-050` | Reports to (for org hierarchy) |
| `account_name` | String | `PepsiCo` | Primary client account |
| `grade_legacy` | String | `G3` | Original grade from acquired company |
| `grade_unified` | String | `L2` | Mapped grade in new system |
| `grade_mapping_status` | String | `Mapped` or `Pending` | Harmonization status |
| `base_salary` | Number | `85000` | Annual base compensation |
| `risk_score` | Number | `87` | Flight risk score (0-100) |
| `business_impact` | Number | `91` | Business impact score (0-100) |
| `signal_manager_flag` | Boolean | `TRUE` | Manager has flagged concern |
| `signal_comp_gap` | Boolean | `TRUE` | Compensation below market |
| `signal_peer_departed` | Boolean | `FALSE` | Peer recently left |
| `revenue_at_risk` | Number | `420000` | Revenue attributed to this employee |
| `hire_date` | Date | `2019-03-15` | Original hire date |
| `status` | String | `Active` | Employment status |

**Named Range**: `EmployeeRoster`

---

#### Sheet 2: `account_projects`
**Purpose**: Client account details and project assignments

| Column | Data Type | Example | Notes |
|--------|-----------|---------|-------|
| `account_name` | String | `PepsiCo` | Primary key |
| `total_revenue` | Number | `2800000` | Annual contract value |
| `renewal_date` | Date | `2025-03-15` | Contract renewal date |
| `team_size` | Number | `53` | Total headcount on account |
| `people_risk_score` | Number | `51` | Aggregated team flight risk |
| `revenue_at_risk` | Number | `420000` | Calculated at-risk revenue |
| `margin_percent` | Number | `15` | Profit margin % |
| `primary_contact_id` | String | `emp-000` | Key relationship owner |
| `sow_1_name` | String | `RGM Optimization` | Statement of Work 1 |
| `sow_1_value` | Number | `1200000` | SOW 1 contract value |
| `sow_1_headcount` | Number | `8` | SOW 1 team size |
| `sow_1_at_risk` | Boolean | `TRUE` | SOW 1 risk flag |
| `sow_2_name` | String | `Data Platform Build` | Statement of Work 2 |
| `sow_2_value` | Number | `900000` | SOW 2 contract value |
| `sow_2_headcount` | Number | `6` | SOW 2 team size |
| `sow_2_at_risk` | Boolean | `FALSE` | SOW 2 risk flag |

**Named Range**: `AccountProjects`

> **Note**: For accounts with >2 SOWs, create additional columns (sow_3_*, sow_4_*, etc.) or use a separate `sow_details` sheet with account_name as foreign key.

---

#### Sheet 3: `attrition_logs`
**Purpose**: Historical attrition tracking by month and cohort

| Column | Data Type | Example | Notes |
|--------|-----------|---------|-------|
| `month` | String | `2025-01` | YYYY-MM format |
| `origin` | String | `DP` | Company cohort |
| `function` | String | `Delivery` | Department |
| `geography` | String | `India` | Location |
| `headcount_start` | Number | `120` | Headcount at month start |
| `voluntary_exits` | Number | `3` | Voluntary departures |
| `involuntary_exits` | Number | `1` | Terminations |
| `headcount_end` | Number | `116` | Headcount at month end |
| `attrition_rate` | Number | `3.33` | Calculated: (exits/headcount_start)*100 |

**Named Range**: `AttritionHistory`

**Calculated Field Formula** (in Google Sheets):
```excel
=((C2+D2)/E2)*100
```
Where C2=voluntary_exits, D2=involuntary_exits, E2=headcount_start

---

#### Sheet 4: `grade_mapping`
**Purpose**: Grade harmonization lookup table

| Column | Data Type | Example | Notes |
|--------|-----------|---------|-------|
| `legacy_grade` | String | `G1` | Original grade from acquired company |
| `unified_grade` | String | `L1` | Mapped grade in new system |
| `salary_min` | Number | `45000` | Minimum salary for unified grade |
| `salary_max` | Number | `65000` | Maximum salary for unified grade |
| `level_description` | String | `Associate` | Role level descriptor |

**Named Range**: `GradeMapping`

**Usage**: VLOOKUP or INDEX/MATCH to map legacy grades to unified system

---

#### Sheet 5: `api_aggregator` (HIDDEN SHEET)
**Purpose**: Pre-calculated aggregations for dashboard performance

This is your **"Quick Win"** sheet. Instead of calculating complex metrics in JavaScript, do the heavy lifting here using Google Sheets formulas.

| Column | Data Type | Example | Formula/Notes |
|--------|-----------|---------|---------------|
| `metric_name` | String | `overall_health_score` | Metric identifier |
| `metric_value` | Number | `72` | Calculated value |
| `last_updated` | Timestamp | `2025-01-20 19:45:00` | Auto-updated |

**Example Metrics to Pre-Calculate**:

```excel
// Overall Health Score (weighted average)
=ROUND(
  (COUNTIF(EmployeeRoster[risk_score], "<50")/COUNTA(EmployeeRoster[risk_score])*100*0.4) +
  (AVERAGE(AccountProjects[people_risk_score])*0.3) +
  (IF(AVERAGE(AttritionHistory[attrition_rate])<12, 100, 100-(AVERAGE(AttritionHistory[attrition_rate])-12)*5)*0.3)
, 0)

// Total Revenue at Risk
=SUMIF(EmployeeRoster[risk_score], ">70", EmployeeRoster[revenue_at_risk])

// Talent Sub-Score
=100 - AVERAGE(EmployeeRoster[risk_score])

// Grade Mapping Completion %
=COUNTIF(EmployeeRoster[grade_mapping_status], "Mapped") / COUNTA(EmployeeRoster[grade_mapping_status]) * 100

// High-Risk Employee Count
=COUNTIF(EmployeeRoster[risk_score], ">=75")
```

**Named Range**: `AggregatedMetrics`

---

## 2. UI-to-Sheet Mapping Table

### Command Center (index.html)

| UI Element | Data Source | Calculation Logic |
|------------|-------------|-------------------|
| **Integration Health Score** | `api_aggregator!overall_health_score` | Weighted formula (see above) |
| **Talent Sub-Score** | `api_aggregator!talent_score` | `100 - AVERAGE(master_roster[risk_score])` |
| **Culture Sub-Score** | Manual input or survey data | Not in current dataset - placeholder |
| **Operations Sub-Score** | Manual input | Not in current dataset - placeholder |
| **Cost Sub-Score** | Manual input | Not in current dataset - placeholder |
| **Revenue at Risk** | `api_aggregator!total_revenue_at_risk` | `SUMIF(master_roster[risk_score], ">70", master_roster[revenue_at_risk])` |
| **Revenue % at Risk** | Calculated in JS | `(revenue_at_risk / SUM(account_projects[total_revenue])) * 100` |
| **Critical Alerts** | `master_roster` filtered | `WHERE risk_score >= 85 ORDER BY risk_score DESC LIMIT 3` |
| **Account Risk Chart** | `account_projects` | Top 5 by `revenue_at_risk` DESC |
| **Attrition Chart** | `attrition_logs` | Filter by origin, group by month |

---

### Talent Pulse (talent.html)

| UI Element | Data Source | Calculation Logic |
|------------|-------------|-------------------|
| **Flight Risk Matrix** | `master_roster` | X-axis: `risk_score`, Y-axis: `business_impact` |
| **Watchlist Table** | `master_roster` | `WHERE risk_score >= 50 ORDER BY risk_score DESC` |
| **Signal Intensity** | `master_roster` | Count TRUE values for each signal column |
| **Regrettable Loss Index** | `master_roster` | `WHERE risk_score >= 75 AND business_impact >= 80` |
| **Grade Mapping Pulse** | `master_roster` + `grade_mapping` | Count by `grade_mapping_status` |
| **Seniority Pyramid** | `master_roster` | Group by `role`, calculate AVG(risk_score) |

---

### Account Risk (accounts.html)

| UI Element | Data Source | Calculation Logic |
|------------|-------------|-------------------|
| **Account Cards** | `account_projects` | All accounts, sorted by `revenue_at_risk` DESC |
| **Risk Bars** | `account_projects` | Horizontal bars scaled to max `revenue_at_risk` |
| **Renewal Timeline** | `account_projects` | Sorted by `renewal_date` ASC |
| **Team at Risk** | `master_roster` | `WHERE account_name = [selected] ORDER BY risk_score DESC` |
| **SOW Details** | `account_projects` | Columns `sow_1_*`, `sow_2_*`, etc. |
| **Team Leverage Pyramid** | `master_roster` | Count by role level for selected account |

---

## 3. API & Integration Architecture

### Option A: Google Sheets API (Recommended)

**Pros**:
- Official Google API with robust authentication
- Supports batch requests (fetch multiple ranges in one call)
- Real-time data updates
- Fine-grained access control

**Cons**:
- Requires OAuth 2.0 setup
- API quota limits (100 requests/100 seconds per user)

**Implementation Pattern**:

```javascript
// 1. Single Batch Request for Dashboard Load
const SPREADSHEET_ID = 'your-sheet-id';
const ranges = [
  'api_aggregator!A:C',           // Pre-calculated metrics
  'master_roster!A:T',            // All employee data
  'account_projects!A:P',         // All account data
  'attrition_logs!A:I',           // Attrition history
  'grade_mapping!A:E'             // Grade lookup
];

async function fetchDashboardData() {
  const response = await gapi.client.sheets.spreadsheets.values.batchGet({
    spreadsheetId: SPREADSHEET_ID,
    ranges: ranges
  });
  
  return {
    metrics: parseSheet(response.result.valueRanges[0]),
    employees: parseSheet(response.result.valueRanges[1]),
    accounts: parseSheet(response.result.valueRanges[2]),
    attrition: parseSheet(response.result.valueRanges[3]),
    gradeMapping: parseSheet(response.result.valueRanges[4])
  };
}

// 2. Parse Sheet Data to JSON
function parseSheet(range) {
  const [headers, ...rows] = range.values;
  return rows.map(row => {
    const obj = {};
    headers.forEach((header, i) => {
      obj[header] = row[i];
    });
    return obj;
  });
}
```

---

### Option B: Google Apps Script Web App (Simpler Alternative)

**Pros**:
- No OAuth required (public endpoint)
- Can run server-side logic in Google Sheets
- Easier for non-technical users to maintain

**Cons**:
- Slower response times
- Less control over caching

**Implementation**:

1. **Create Apps Script** (Tools → Script Editor in Google Sheets):

```javascript
function doGet(e) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // Fetch all data
  const data = {
    metrics: sheetToJson(ss.getSheetByName('api_aggregator')),
    employees: sheetToJson(ss.getSheetByName('master_roster')),
    accounts: sheetToJson(ss.getSheetByName('account_projects')),
    attrition: sheetToJson(ss.getSheetByName('attrition_logs')),
    gradeMapping: sheetToJson(ss.getSheetByName('grade_mapping'))
  };
  
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

function sheetToJson(sheet) {
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  return data.slice(1).map(row => {
    const obj = {};
    headers.forEach((header, i) => {
      obj[header] = row[i];
    });
    return obj;
  });
}
```

2. **Deploy as Web App** → Get URL → Use in front-end:

```javascript
async function loadData() {
  const response = await fetch('https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec');
  const data = await response.json();
  return data;
}
```

---

### Recommended Approach: **Hybrid Strategy**

1. **Initial Load**: Fetch `api_aggregator` sheet only (fast, <1KB)
2. **On-Demand**: Fetch detailed sheets when user navigates to specific modules
3. **Caching**: Store fetched data in `localStorage` with 5-minute TTL

```javascript
async function loadCommandCenter() {
  // Fast initial load
  const metrics = await fetchSheet('api_aggregator');
  updateHealthScore(metrics.overall_health_score);
  updateRevenueAtRisk(metrics.total_revenue_at_risk);
  
  // Lazy load details
  setTimeout(async () => {
    const employees = await fetchSheet('master_roster');
    const accounts = await fetchSheet('account_projects');
    renderCharts(employees, accounts);
  }, 500);
}
```

---

## 4. Data Normalization Layer

### Handling Null Values

```javascript
function normalizeEmployee(raw) {
  return {
    id: raw.employee_id || `emp-${Date.now()}`,
    name: raw.employee_name || 'Unknown',
    role: raw.role || 'Unassigned',
    origin: raw.origin || 'LV',
    function: raw.function || 'Other',
    geography: raw.geography || 'Unknown',
    tenure: parseFloat(raw.tenure_years) || 0,
    riskScore: parseInt(raw.risk_score) || 0,
    businessImpact: parseInt(raw.business_impact) || 50,
    signals: [
      raw.signal_manager_flag === 'TRUE' && 'manager_flag',
      raw.signal_comp_gap === 'TRUE' && 'comp_gap',
      raw.signal_peer_departed === 'TRUE' && 'peer_departed'
    ].filter(Boolean),
    account: raw.account_name || 'Unassigned',
    gradeMappingStatus: raw.grade_mapping_status || 'Pending',
    revenueAtRisk: parseFloat(raw.revenue_at_risk) || 0
  };
}
```

### Handling Naming Conventions

```javascript
const FIELD_MAPPING = {
  // Handle variations between Company A and Company B data
  'Employee Name': 'employee_name',
  'Full Name': 'employee_name',
  'EmpName': 'employee_name',
  'Risk': 'risk_score',
  'Flight Risk': 'risk_score',
  'RiskScore': 'risk_score'
};

function normalizeHeaders(headers) {
  return headers.map(h => FIELD_MAPPING[h] || h.toLowerCase().replace(/\s+/g, '_'));
}
```

---

## 5. Calculated Fields Logic

### Employee View: Org Hierarchy (Manager → Reportee)

**Sheet Setup**:
- `master_roster` has `manager_id` column
- Use recursive lookup to build tree

**JavaScript Logic**:

```javascript
function buildOrgTree(employees) {
  const employeeMap = new Map(employees.map(e => [e.id, { ...e, reportees: [] }]));
  
  employees.forEach(emp => {
    if (emp.manager_id && employeeMap.has(emp.manager_id)) {
      employeeMap.get(emp.manager_id).reportees.push(emp.id);
    }
  });
  
  return employeeMap;
}

// Render Org Map
function renderOrgMap(rootId, orgTree) {
  const root = orgTree.get(rootId);
  return {
    name: root.name,
    role: root.role,
    riskScore: root.riskScore,
    children: root.reportees.map(id => renderOrgMap(id, orgTree))
  };
}
```

---

### Project View: Revenue per Employee

**Google Sheets Formula** (in `account_projects`):

```excel
// Column: revenue_per_employee
=total_revenue / team_size
```

**JavaScript Logic**:

```javascript
function calculateRevenuePerEmployee(account, employees) {
  const teamMembers = employees.filter(e => e.account === account.name);
  const totalRevenue = account.total_revenue;
  const headcount = teamMembers.length;
  
  return {
    account: account.name,
    revenuePerEmployee: totalRevenue / headcount,
    teamSize: headcount,
    avgRiskScore: teamMembers.reduce((sum, e) => sum + e.riskScore, 0) / headcount
  };
}
```

---

### Grade Mapping: Legacy → Unified

**Google Sheets VLOOKUP** (in `master_roster`):

```excel
// Column: grade_unified
=IFERROR(VLOOKUP(grade_legacy, grade_mapping!A:B, 2, FALSE), "Pending")
```

**JavaScript Function**:

```javascript
function mapGrade(legacyGrade, gradeMapping) {
  const mapping = gradeMapping.find(m => m.legacy_grade === legacyGrade);
  return mapping ? mapping.unified_grade : 'Pending';
}

// Validate salary against unified grade
function validateSalary(employee, gradeMapping) {
  const mapping = gradeMapping.find(m => m.unified_grade === employee.grade_unified);
  if (!mapping) return { valid: false, reason: 'Grade not mapped' };
  
  const salary = employee.base_salary;
  if (salary < mapping.salary_min) {
    return { valid: false, reason: 'Below minimum', gap: mapping.salary_min - salary };
  }
  if (salary > mapping.salary_max) {
    return { valid: false, reason: 'Above maximum', gap: salary - mapping.salary_max };
  }
  return { valid: true };
}
```

---

## 6. Engineering Quick Wins

### Quick Win #1: Named Ranges

**Setup in Google Sheets**:
1. Select `master_roster!A1:T500`
2. Data → Named Ranges → Create "EmployeeRoster"
3. Repeat for all sheets

**Benefits**:
- Formulas use `EmployeeRoster[risk_score]` instead of `A2:A500`
- Adding columns doesn't break formulas
- More readable and maintainable

**Example Formula**:
```excel
// Before (fragile)
=AVERAGE(master_roster!N2:N500)

// After (robust)
=AVERAGE(EmployeeRoster[risk_score])
```

---

### Quick Win #2: The `api_aggregator` Sheet

**Why This Matters**:
- Browser calculations are slow for 350+ employees
- Google Sheets can handle complex aggregations instantly
- Reduces dashboard load time from 3s → 0.5s

**Example Aggregations**:

```excel
// Row 1: Overall Health Score
A1: overall_health_score
B1: =ROUND((100-AVERAGE(EmployeeRoster[risk_score]))*0.4 + 
           (100-AVERAGE(AccountProjects[people_risk_score]))*0.3 + 
           (IF(AVERAGE(AttritionHistory[attrition_rate])<12,100,100-(AVERAGE(AttritionHistory[attrition_rate])-12)*5))*0.3, 0)

// Row 2: Total Revenue at Risk
A2: total_revenue_at_risk
B2: =SUMIF(EmployeeRoster[risk_score], ">=70", EmployeeRoster[revenue_at_risk])

// Row 3: High-Risk Employee Count
A3: high_risk_count
B3: =COUNTIF(EmployeeRoster[risk_score], ">=75")

// Row 4: Avg Attrition Rate (Last 6 Months)
A4: avg_attrition_6mo
B4: =AVERAGE(QUERY(AttritionHistory, "SELECT I ORDER BY A DESC LIMIT 6"))

// Row 5: Grade Mapping Completion %
A5: grade_mapping_pct
B5: =COUNTIF(EmployeeRoster[grade_mapping_status], "Mapped") / COUNTA(EmployeeRoster[grade_mapping_status]) * 100
```

**Front-End Usage**:

```javascript
async function loadMetrics() {
  const metrics = await fetchSheet('api_aggregator');
  const metricsMap = new Map(metrics.map(m => [m.metric_name, m.metric_value]));
  
  return {
    overallScore: metricsMap.get('overall_health_score'),
    totalRevenueAtRisk: metricsMap.get('total_revenue_at_risk'),
    highRiskCount: metricsMap.get('high_risk_count'),
    avgAttrition: metricsMap.get('avg_attrition_6mo'),
    gradeMappingPct: metricsMap.get('grade_mapping_pct')
  };
}
```

---

### Quick Win #3: QUERY Function for Complex Filters

**Use Case**: Talent Pulse "Regrettable Loss Index"

**Google Sheets Formula**:
```excel
=QUERY(EmployeeRoster, 
  "SELECT A, B, C, N, O WHERE N >= 75 AND O >= 80 ORDER BY N DESC LIMIT 10", 1)
```

**Benefits**:
- SQL-like syntax for complex filtering
- Runs server-side (fast)
- Returns pre-filtered dataset to front-end

---

## 7. Implementation Roadmap

### Phase 1: Data Setup (Week 1)
- [ ] Create 5 Google Sheets with defined schemas
- [ ] Set up Named Ranges for all sheets
- [ ] Populate `master_roster` with employee data
- [ ] Populate `account_projects` with client data
- [ ] Create `api_aggregator` with formulas

### Phase 2: API Integration (Week 2)
- [ ] Set up Google Apps Script Web App OR Google Sheets API
- [ ] Implement `fetchSheet()` function in front-end
- [ ] Create data normalization layer
- [ ] Add error handling and retry logic
- [ ] Implement localStorage caching

### Phase 3: Dashboard Wiring (Week 3)
- [ ] Replace `RAW_DATA` in `data.js` with API calls
- [ ] Update `app.js` to use normalized data
- [ ] Update `talent.js` to use normalized data
- [ ] Update `accounts.js` to use normalized data
- [ ] Add loading states and error messages

### Phase 4: Testing & Optimization (Week 4)
- [ ] Test with real data (350+ employees, 6 accounts)
- [ ] Optimize batch requests (reduce API calls)
- [ ] Add data validation and error handling
- [ ] Performance testing (target <2s dashboard load)
- [ ] User acceptance testing

---

## 8. Pseudo-Code: Data Fetcher

```javascript
// ============================================
// GOOGLE SHEETS DATA FETCHER
// ============================================

class GoogleSheetsDataFetcher {
  constructor(spreadsheetId, apiKey) {
    this.spreadsheetId = spreadsheetId;
    this.apiKey = apiKey;
    this.cache = new Map();
    this.cacheTTL = 5 * 60 * 1000; // 5 minutes
  }

  // Fetch single sheet with caching
  async fetchSheet(sheetName) {
    const cacheKey = `sheet_${sheetName}`;
    const cached = this.cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < this.cacheTTL) {
      console.log(`[CACHE HIT] ${sheetName}`);
      return cached.data;
    }

    console.log(`[FETCH] ${sheetName}`);
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${this.spreadsheetId}/values/${sheetName}?key=${this.apiKey}`;
    
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      
      const json = await response.json();
      const data = this.parseSheetData(json.values);
      
      this.cache.set(cacheKey, { data, timestamp: Date.now() });
      return data;
      
    } catch (error) {
      console.error(`[ERROR] Failed to fetch ${sheetName}:`, error);
      throw error;
    }
  }

  // Batch fetch multiple sheets
  async fetchBatch(sheetNames) {
    const ranges = sheetNames.join('&ranges=');
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${this.spreadsheetId}/values:batchGet?ranges=${ranges}&key=${this.apiKey}`;
    
    try {
      const response = await fetch(url);
      const json = await response.json();
      
      const result = {};
      json.valueRanges.forEach((range, i) => {
        const sheetName = sheetNames[i];
        result[sheetName] = this.parseSheetData(range.values);
      });
      
      return result;
      
    } catch (error) {
      console.error('[ERROR] Batch fetch failed:', error);
      throw error;
    }
  }

  // Parse sheet data to JSON
  parseSheetData(values) {
    if (!values || values.length === 0) return [];
    
    const [headers, ...rows] = values;
    const normalizedHeaders = this.normalizeHeaders(headers);
    
    return rows.map(row => {
      const obj = {};
      normalizedHeaders.forEach((header, i) => {
        obj[header] = this.parseValue(row[i]);
      });
      return obj;
    });
  }

  // Normalize header names
  normalizeHeaders(headers) {
    return headers.map(h => 
      h.toLowerCase()
        .replace(/\s+/g, '_')
        .replace(/[^a-z0-9_]/g, '')
    );
  }

  // Parse cell values with type inference
  parseValue(value) {
    if (value === undefined || value === null || value === '') return null;
    
    // Boolean
    if (value === 'TRUE') return true;
    if (value === 'FALSE') return false;
    
    // Number
    if (!isNaN(value) && value.trim() !== '') {
      return parseFloat(value);
    }
    
    // Date (YYYY-MM-DD)
    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
      return new Date(value);
    }
    
    // String
    return value.toString().trim();
  }

  // Clear cache
  clearCache() {
    this.cache.clear();
  }
}

// ============================================
// DATA NORMALIZATION LAYER
// ============================================

class DataNormalizer {
  
  // Normalize employee data
  static normalizeEmployee(raw) {
    return {
      id: raw.employee_id || `emp-${Date.now()}`,
      name: raw.employee_name || 'Unknown',
      role: raw.role || 'Unassigned',
      origin: raw.origin || 'LV',
      function: raw.function || 'Other',
      geography: raw.geography || 'Unknown',
      tenure: parseFloat(raw.tenure_years) || 0,
      managerId: raw.manager_id || null,
      account: raw.account_name || 'Unassigned',
      gradeLegacy: raw.grade_legacy || null,
      gradeUnified: raw.grade_unified || 'Pending',
      gradeMappingStatus: raw.grade_mapping_status || 'Pending',
      baseSalary: parseFloat(raw.base_salary) || 0,
      riskScore: parseInt(raw.risk_score) || 0,
      businessImpact: parseInt(raw.business_impact) || 50,
      signals: this.extractSignals(raw),
      revenueAtRisk: parseFloat(raw.revenue_at_risk) || 0,
      hireDate: raw.hire_date ? new Date(raw.hire_date) : null,
      status: raw.status || 'Active'
    };
  }

  // Extract signal flags
  static extractSignals(raw) {
    const signals = [];
    if (raw.signal_manager_flag === true) signals.push('manager_flag');
    if (raw.signal_comp_gap === true) signals.push('comp_gap');
    if (raw.signal_peer_departed === true) signals.push('peer_departed');
    return signals;
  }

  // Normalize account data
  static normalizeAccount(raw) {
    return {
      name: raw.account_name || 'Unknown',
      totalRevenue: parseFloat(raw.total_revenue) || 0,
      renewalDate: raw.renewal_date ? new Date(raw.renewal_date) : null,
      teamSize: parseInt(raw.team_size) || 0,
      peopleRiskScore: parseInt(raw.people_risk_score) || 0,
      revenueAtRisk: parseFloat(raw.revenue_at_risk) || 0,
      margin: parseFloat(raw.margin_percent) || 0,
      primaryContactId: raw.primary_contact_id || null,
      sows: this.extractSOWs(raw)
    };
  }

  // Extract SOW data
  static extractSOWs(raw) {
    const sows = [];
    for (let i = 1; i <= 5; i++) {
      const name = raw[`sow_${i}_name`];
      if (name) {
        sows.push({
          name: name,
          value: parseFloat(raw[`sow_${i}_value`]) || 0,
          headcount: parseInt(raw[`sow_${i}_headcount`]) || 0,
          atRisk: raw[`sow_${i}_at_risk`] === true
        });
      }
    }
    return sows;
  }

  // Normalize attrition data
  static normalizeAttrition(raw) {
    return {
      month: raw.month || null,
      origin: raw.origin || 'All',
      function: raw.function || 'All',
      geography: raw.geography || 'All',
      headcountStart: parseInt(raw.headcount_start) || 0,
      voluntaryExits: parseInt(raw.voluntary_exits) || 0,
      involuntaryExits: parseInt(raw.involuntary_exits) || 0,
      headcountEnd: parseInt(raw.headcount_end) || 0,
      attritionRate: parseFloat(raw.attrition_rate) || 0
    };
  }
}

// ============================================
// USAGE EXAMPLE
// ============================================

const fetcher = new GoogleSheetsDataFetcher(
  'YOUR_SPREADSHEET_ID',
  'YOUR_API_KEY'
);

async function loadDashboardData() {
  try {
    // Fetch all sheets in one batch request
    const rawData = await fetcher.fetchBatch([
      'api_aggregator',
      'master_roster',
      'account_projects',
      'attrition_logs',
      'grade_mapping'
    ]);

    // Normalize data
    const data = {
      metrics: rawData.api_aggregator.reduce((acc, row) => {
        acc[row.metric_name] = row.metric_value;
        return acc;
      }, {}),
      employees: rawData.master_roster.map(DataNormalizer.normalizeEmployee),
      accounts: rawData.account_projects.map(DataNormalizer.normalizeAccount),
      attrition: rawData.attrition_logs.map(DataNormalizer.normalizeAttrition),
      gradeMapping: rawData.grade_mapping
    };

    return data;

  } catch (error) {
    console.error('Failed to load dashboard data:', error);
    throw error;
  }
}

// Initialize dashboard
loadDashboardData().then(data => {
  console.log('Dashboard data loaded:', data);
  // Update UI with data
  updateHealthScore(data.metrics.overall_health_score);
  renderEmployeeMatrix(data.employees);
  renderAccountCards(data.accounts);
});
```

---

## 9. Table-to-UI Mapping Document

### Complete Mapping Reference

| UI Component | Sheet | Columns | Filter/Sort | Calculation |
|--------------|-------|---------|-------------|-------------|
| **Command Center** |
| Health Score Gauge | `api_aggregator` | `overall_health_score` | - | Pre-calculated |
| Talent Sub-Score | `api_aggregator` | `talent_score` | - | `100 - AVG(risk_score)` |
| Revenue at Risk | `api_aggregator` | `total_revenue_at_risk` | - | `SUMIF(risk_score>=70, revenue_at_risk)` |
| Critical Alerts | `master_roster` | All | `risk_score >= 85` | Top 3 by risk_score DESC |
| Account Risk Chart | `account_projects` | `account_name`, `revenue_at_risk` | - | Top 5 by revenue_at_risk DESC |
| Attrition Chart | `attrition_logs` | `month`, `origin`, `attrition_rate` | Last 12 months | Group by month, origin |
| **Talent Pulse** |
| Flight Risk Matrix | `master_roster` | `risk_score`, `business_impact`, `tenure`, `origin` | Active employees | Scatter plot |
| Watchlist Table | `master_roster` | All | `risk_score >= 50` | Sort by risk_score DESC |
| Signal Intensity | `master_roster` | `signal_*` columns | - | Count TRUE values per signal |
| Regrettable Loss | `master_roster` | All | `risk_score>=75 AND business_impact>=80` | Top 10 by (risk*impact) |
| Grade Mapping | `master_roster` | `grade_mapping_status`, `origin` | - | Count by status, group by origin |
| Seniority Pyramid | `master_roster` | `role`, `risk_score` | - | AVG(risk_score) by role |
| **Account Risk** |
| Account Cards | `account_projects` | All | - | Sort by revenue_at_risk DESC |
| Risk Bars | `account_projects` | `account_name`, `revenue_at_risk`, `team_size` | - | Horizontal bars |
| Renewal Timeline | `account_projects` | `account_name`, `renewal_date`, `people_risk_score` | - | Sort by renewal_date ASC |
| Team at Risk | `master_roster` | All | `account_name = [selected]` | Sort by risk_score DESC |
| SOW Details | `account_projects` | `sow_*` columns | - | Parse SOW columns |

---

## 10. Next Steps & Recommendations

### Immediate Actions (This Week)
1. **Create Google Sheet**: Set up the 5 sheets with schemas defined above
2. **Populate Sample Data**: Add 10-20 rows to each sheet for testing
3. **Set Up Named Ranges**: Define named ranges for all sheets
4. **Create `api_aggregator`**: Add formulas for key metrics

### Short-Term (Next 2 Weeks)
1. **Choose Integration Method**: Google Apps Script (easier) vs. Sheets API (more robust)
2. **Implement Data Fetcher**: Build the `GoogleSheetsDataFetcher` class
3. **Test with Live Data**: Replace `RAW_DATA` in `data.js` with API calls
4. **Add Error Handling**: Graceful degradation if API fails

### Long-Term (Next Month)
1. **Optimize Performance**: Implement caching, lazy loading, batch requests
2. **Add Data Validation**: Ensure data quality in Google Sheets
3. **Set Up Automation**: Auto-refresh data on schedule (Google Apps Script triggers)
4. **Build Admin Panel**: UI for HR to update data without touching sheets

---

## Appendix A: Sample Google Sheets Formulas

### Overall Health Score
```excel
=ROUND(
  (100 - AVERAGE(EmployeeRoster[risk_score])) * 0.4 +
  (100 - AVERAGE(AccountProjects[people_risk_score])) * 0.3 +
  (IF(AVERAGE(AttritionHistory[attrition_rate]) < 12, 100, 100 - (AVERAGE(AttritionHistory[attrition_rate]) - 12) * 5)) * 0.3,
  0
)
```

### Revenue at Risk by Account
```excel
=SUMIF(EmployeeRoster[account_name], A2, EmployeeRoster[revenue_at_risk])
```
Where A2 = account name

### Attrition Rate Calculation
```excel
=((voluntary_exits + involuntary_exits) / headcount_start) * 100
```

### Grade Mapping Lookup
```excel
=IFERROR(VLOOKUP(grade_legacy, GradeMapping!A:B, 2, FALSE), "Pending")
```

---

## Appendix B: Error Handling Patterns

```javascript
async function safeLoadData() {
  try {
    const data = await loadDashboardData();
    return data;
  } catch (error) {
    console.error('Data load failed:', error);
    
    // Fallback to cached data
    const cached = localStorage.getItem('dashboard_data');
    if (cached) {
      console.warn('Using cached data');
      return JSON.parse(cached);
    }
    
    // Fallback to mock data
    console.warn('Using mock data');
    return RAW_DATA;
  }
}
```

---

**Document Version**: 1.0  
**Last Updated**: January 20, 2025  
**Author**: Senior Backend Architect & Integration Specialist  
**Status**: Ready for Implementation
