# SOP: Data Management & Generation

## Goal
Ensure a consistent, realistic, and deterministic data foundation for the Integration Pulse™ platform.

## Input
- PRD specifications for Talent and Accounts.
- Reference names and roles from `integration-pulse-prd.md`.

## Data Schema

### Talent Data (`.tmp/talent.json`)
```json
{
  "employees": [
    {
      "id": "emp-001",
      "name": "Priya S.",
      "role": "Engagement Lead",
      "origin": "DP",
      "function": "Delivery",
      "geography": "India",
      "tenure": 4.5,
      "riskScore": 92,
      "businessImpact": 95,
      "signals": ["manager_flag", "comp_gap", "grade_pending"],
      "account": "PepsiCo",
      "revenueAtRisk": 420000
    }
  ]
}
```

### Account Data (`.tmp/accounts.json`)
```json
{
  "accounts": [
    {
      "name": "PepsiCo",
      "totalRevenue": 2800000,
      "renewalDate": "2025-03-15",
      "teamSize": 18,
      "peopleRiskScore": 85,
      "revenueAtRisk": 620000
    }
  ]
}
```

## Orchestration Flow
1. **Define Parameters**: Use the PRD to set the distribution of employees (75% LV, 25% DP).
2. **Calculate Risk**:
   - `base_risk` = random(20, 40)
   - If `origin == "DP"`, add 20.
   - If `signals` contains `manager_flag`, add 30.
   - If `signals` contains `comp_gap`, add 15.
3. **Execute Script**: Run `execution/generate_mock_data.py`.
4. **Refresh UI**: The web application reads from `.tmp/*.json`.

## Execution Tools
- `execution/generate_mock_data.py`

## Edge Cases
- **Inconsistent Totals**: Ensure the sum of individual `revenueAtRisk` in talent matches the account-level `revenueAtRisk`.
- **Duplicate IDs**: Ensure UUIDs or unique serial IDs are used for all entities.
