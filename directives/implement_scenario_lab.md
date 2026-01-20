# SOP: Implement Scenario Lab

## Goal
Provide a "What-If" modeling tool to calculate the financial impact of employee retention strategies.

## Input
- `integration-pulse-prd.md` (Phase 4 specs)
- `.tmp/talent.json` (Source of at-risk employees)

## UI Component Specifications

### 1. Scenario Builder (Left Panel)
- **Type**: Form/List Input.
- **Content**: List of high-risk employees (Risk > 70) with checkboxes.
- **Controls**: "Attrition Rate" slider (Current vs Projected).

### 2. Impact Analysis (Right Panel)
- **Type**: Interactive Metrics Cards.
- **Metrics**:
    - **Revenue at Risk**: Sum of `revenueAtRisk` for selected employees.
    - **Cost of Intervention**: Auto-calc (15% of salary, approximated as 5% of their revenue contribution for simplicity in this demo model).
    - **ROI**: `(Revenue Saved - Cost) / Cost`.
- **Visuals**: Green/Red indicators for ROI.

## Development Steps
1. **Structure**: `scenarios.html` with split layout.
2. **Logic**: `scenarios.js` to handle state (Set of selected IDs) and recalculate on change.
3. **Data**: Filter `talent.json` for relevant candidates (Risk > 50).

## Edge Cases
- **No Selection**: Show empty state or "Select employees to model impact".
- **Negative ROI**: Highlight in red if cost exceeds saved revenue.

## Summary
This module shifts from "Observation" to "Active Planning".
