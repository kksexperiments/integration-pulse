# Integration Pulse Data Flow Architecture

## System Architecture Diagram

```mermaid
graph TB
    subgraph "Google Sheets Backend"
        A1[master_roster<br/>Employee Data]
        A2[account_projects<br/>Client Data]
        A3[attrition_logs<br/>Historical Data]
        A4[grade_mapping<br/>Lookup Table]
        A5[api_aggregator<br/>Pre-calculated Metrics]
        
        A1 --> A5
        A2 --> A5
        A3 --> A5
        A4 -.-> A1
    end
    
    subgraph "API Layer"
        B1[Google Sheets API<br/>or<br/>Apps Script Web App]
        B2[Data Fetcher<br/>GoogleSheetsDataFetcher]
        B3[Cache Layer<br/>localStorage + TTL]
    end
    
    subgraph "Data Normalization"
        C1[DataNormalizer]
        C2[Null Handler]
        C3[Type Converter]
        C4[Field Mapper]
    end
    
    subgraph "Front-End Dashboard"
        D1[Command Center<br/>index.html]
        D2[Talent Pulse<br/>talent.html]
        D3[Account Risk<br/>accounts.html]
        D4[Scenario Lab<br/>scenarios.html]
        D5[Action Hub<br/>actions.html]
    end
    
    A5 --> B1
    A1 --> B1
    A2 --> B1
    A3 --> B1
    
    B1 --> B2
    B2 --> B3
    B3 --> C1
    
    C1 --> C2
    C1 --> C3
    C1 --> C4
    
    C4 --> D1
    C4 --> D2
    C4 --> D3
    C4 --> D4
    C4 --> D5
    
    style A5 fill:#10B981,stroke:#059669,color:#fff
    style B2 fill:#3B82F6,stroke:#2563EB,color:#fff
    style C1 fill:#F59E0B,stroke:#D97706,color:#fff
```

---

## Data Flow Sequence

```mermaid
sequenceDiagram
    participant User
    participant Dashboard
    participant Cache
    participant Fetcher
    participant API
    participant Sheets
    
    User->>Dashboard: Load Command Center
    Dashboard->>Cache: Check cached data
    
    alt Cache Hit (< 5 min old)
        Cache-->>Dashboard: Return cached data
        Dashboard-->>User: Render dashboard (fast)
    else Cache Miss
        Dashboard->>Fetcher: fetchBatch(['api_aggregator', 'master_roster', ...])
        Fetcher->>API: Batch GET request
        API->>Sheets: Read ranges
        Sheets-->>API: Return raw data
        API-->>Fetcher: JSON response
        Fetcher->>Fetcher: parseSheetData()
        Fetcher->>Cache: Store with timestamp
        Fetcher-->>Dashboard: Normalized data
        Dashboard-->>User: Render dashboard
    end
    
    Note over Dashboard,Sheets: Lazy load detailed data on navigation
    
    User->>Dashboard: Navigate to Talent Pulse
    Dashboard->>Fetcher: fetchSheet('master_roster')
    Fetcher->>API: GET request
    API->>Sheets: Read master_roster
    Sheets-->>API: Employee data
    API-->>Fetcher: JSON response
    Fetcher-->>Dashboard: Normalized employees
    Dashboard-->>User: Render talent matrix
```

---

## Sheet Relationships (Entity-Relationship Diagram)

```mermaid
erDiagram
    MASTER_ROSTER ||--o{ ACCOUNT_PROJECTS : "works_on"
    MASTER_ROSTER ||--o| GRADE_MAPPING : "maps_to"
    MASTER_ROSTER ||--o{ ATTRITION_LOGS : "contributes_to"
    MASTER_ROSTER ||--o| MASTER_ROSTER : "reports_to"
    
    MASTER_ROSTER {
        string employee_id PK
        string employee_name
        string role
        string origin
        string function
        string geography
        number tenure_years
        string manager_id FK
        string account_name FK
        string grade_legacy
        string grade_unified FK
        number risk_score
        number business_impact
        number revenue_at_risk
    }
    
    ACCOUNT_PROJECTS {
        string account_name PK
        number total_revenue
        date renewal_date
        number team_size
        number people_risk_score
        number revenue_at_risk
        string primary_contact_id FK
    }
    
    ATTRITION_LOGS {
        string month PK
        string origin PK
        string function PK
        number headcount_start
        number voluntary_exits
        number attrition_rate
    }
    
    GRADE_MAPPING {
        string legacy_grade PK
        string unified_grade
        number salary_min
        number salary_max
    }
    
    API_AGGREGATOR {
        string metric_name PK
        number metric_value
        timestamp last_updated
    }
```

---

## Component Data Dependencies

```mermaid
graph LR
    subgraph "Command Center Components"
        CC1[Health Score Gauge]
        CC2[Revenue at Risk]
        CC3[Critical Alerts]
        CC4[Account Risk Chart]
        CC5[Attrition Chart]
    end
    
    subgraph "Talent Pulse Components"
        TP1[Flight Risk Matrix]
        TP2[Watchlist Table]
        TP3[Signal Intensity]
        TP4[Grade Mapping Pulse]
    end
    
    subgraph "Account Risk Components"
        AR1[Account Cards]
        AR2[Team at Risk]
        AR3[SOW Details]
    end
    
    subgraph "Data Sources"
        DS1[(api_aggregator)]
        DS2[(master_roster)]
        DS3[(account_projects)]
        DS4[(attrition_logs)]
    end
    
    DS1 --> CC1
    DS1 --> CC2
    DS2 --> CC3
    DS3 --> CC4
    DS4 --> CC5
    
    DS2 --> TP1
    DS2 --> TP2
    DS2 --> TP3
    DS2 --> TP4
    
    DS3 --> AR1
    DS2 --> AR2
    DS3 --> AR3
    
    style DS1 fill:#10B981,stroke:#059669,color:#fff
    style DS2 fill:#3B82F6,stroke:#2563EB,color:#fff
    style DS3 fill:#F59E0B,stroke:#D97706,color:#fff
    style DS4 fill:#8B5CF6,stroke:#7C3AED,color:#fff
```

---

## Calculated Fields Dependency Tree

```mermaid
graph TD
    A[Overall Health Score] --> B[Talent Sub-Score]
    A --> C[Culture Sub-Score]
    A --> D[Operations Sub-Score]
    A --> E[Cost Sub-Score]
    
    B --> F[AVG Risk Score]
    F --> G[master_roster.risk_score]
    
    H[Revenue at Risk] --> I[SUMIF Risk >= 70]
    I --> J[master_roster.revenue_at_risk]
    I --> G
    
    K[Attrition Rate] --> L[Voluntary Exits]
    K --> M[Involuntary Exits]
    K --> N[Headcount Start]
    
    L --> O[attrition_logs.voluntary_exits]
    M --> P[attrition_logs.involuntary_exits]
    N --> Q[attrition_logs.headcount_start]
    
    R[Grade Mapping %] --> S[Mapped Count]
    R --> T[Total Count]
    
    S --> U[master_roster.grade_mapping_status]
    T --> U
    
    style A fill:#EF4444,stroke:#DC2626,color:#fff
    style H fill:#F59E0B,stroke:#D97706,color:#fff
    style K fill:#3B82F6,stroke:#2563EB,color:#fff
    style R fill:#10B981,stroke:#059669,color:#fff
```

---

## API Request Optimization Strategy

```mermaid
graph LR
    subgraph "Initial Page Load"
        A1[Request 1:<br/>api_aggregator only]
        A2[Render Hero Metrics<br/>< 500ms]
    end
    
    subgraph "Lazy Load (500ms delay)"
        B1[Request 2:<br/>master_roster +<br/>account_projects]
        B2[Render Charts<br/>& Tables]
    end
    
    subgraph "On Navigation"
        C1[Request 3:<br/>Specific sheet only]
        C2[Render Module]
    end
    
    A1 --> A2
    A2 --> B1
    B1 --> B2
    B2 --> C1
    C1 --> C2
    
    style A1 fill:#10B981,stroke:#059669,color:#fff
    style B1 fill:#F59E0B,stroke:#D97706,color:#fff
    style C1 fill:#3B82F6,stroke:#2563EB,color:#fff
```

---

## Error Handling & Fallback Chain

```mermaid
graph TD
    A[User Loads Dashboard] --> B{API Request}
    
    B -->|Success| C[Parse & Normalize Data]
    B -->|Network Error| D{Check Cache}
    B -->|API Error| D
    
    C --> E[Update UI]
    
    D -->|Cache Hit| F[Load Cached Data]
    D -->|Cache Miss| G{Check Mock Data}
    
    F --> H[Show Warning:<br/>'Using cached data']
    H --> E
    
    G -->|Available| I[Load Mock Data]
    G -->|Not Available| J[Show Error Screen]
    
    I --> K[Show Warning:<br/>'Using sample data']
    K --> E
    
    J --> L[Retry Button]
    L --> A
    
    style C fill:#10B981,stroke:#059669,color:#fff
    style F fill:#F59E0B,stroke:#D97706,color:#fff
    style I fill:#EF4444,stroke:#DC2626,color:#fff
    style J fill:#DC2626,stroke:#B91C1C,color:#fff
```

---

## Data Normalization Pipeline

```mermaid
graph LR
    A[Raw Sheet Data] --> B[Parse CSV/JSON]
    B --> C[Normalize Headers]
    C --> D[Type Conversion]
    D --> E[Null Handling]
    E --> F[Field Mapping]
    F --> G[Validation]
    G --> H[Normalized Object]
    
    C -.-> C1[employee_name<br/>Full Name<br/>EmpName<br/>→ employee_name]
    D -.-> D1['TRUE' → true<br/>'123' → 123<br/>'2025-01-20' → Date]
    E -.-> E1[null → 'Unknown'<br/>'' → 0<br/>undefined → default]
    F -.-> F1[origin: 'DP'<br/>signals: ['manager_flag']<br/>tenure: 5.8]
    
    style A fill:#94A3B8,stroke:#64748B,color:#fff
    style H fill:#10B981,stroke:#059669,color:#fff
```

---

## Performance Metrics Target

| Metric | Target | Current (Mock) | With Sheets API |
|--------|--------|----------------|-----------------|
| Initial Load | < 1s | 0.3s | 0.8s |
| Dashboard Render | < 2s | 0.5s | 1.5s |
| Module Navigation | < 500ms | 0.2s | 0.4s |
| API Request | < 300ms | N/A | 200-400ms |
| Cache Hit Rate | > 80% | N/A | Target: 85% |

---

## Implementation Checklist

### Week 1: Data Setup
- [ ] Create Google Sheet with 5 tabs
- [ ] Define schemas for each sheet
- [ ] Set up Named Ranges (EmployeeRoster, AccountProjects, etc.)
- [ ] Populate sample data (20 employees, 6 accounts)
- [ ] Create `api_aggregator` formulas

### Week 2: API Integration
- [ ] Choose integration method (Apps Script vs Sheets API)
- [ ] Set up authentication (if using Sheets API)
- [ ] Implement `GoogleSheetsDataFetcher` class
- [ ] Test batch requests
- [ ] Implement caching layer

### Week 3: Front-End Wiring
- [ ] Replace `RAW_DATA` with API calls
- [ ] Implement `DataNormalizer` class
- [ ] Update `app.js`, `talent.js`, `accounts.js`
- [ ] Add loading states
- [ ] Add error handling

### Week 4: Testing & Optimization
- [ ] Load test with 350+ employees
- [ ] Optimize batch requests
- [ ] Implement lazy loading
- [ ] Performance profiling
- [ ] User acceptance testing

---

**Document Version**: 1.0  
**Last Updated**: January 20, 2025  
**Companion to**: `google_sheets_integration_strategy.md`
