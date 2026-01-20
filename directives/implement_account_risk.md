# SOP: Implement Account Risk

## Goal
Visualize the correlation between People Risk and Revenue Risk to prioritize client interventions.

## Input
- `integration-pulse-prd.md` (Phase 3 specs)
- `.tmp/accounts.json` (Account metrics)
- `.tmp/talent.json` (Personnel details)

## UI Component Specifications

### 1. Account Risk Matrix (Bubble Chart)
- **Type**: Scatter Plot with variable sizing.
- **Axes**: 
    - X = People Risk Score (0-100).
    - Y = Annual Revenue (0 - Max Revenue).
- **Bubbles**:
    - Size: Proportional to Team Size.
    - Color: Risk Level (Red > 80, Amber > 50, Green < 50).
    - Label: Account Name.
- **Interaction**: Click bubble -> Scroll to Detail Panel.

### 2. Account Summary Cards
- **Type**: Horizontal scrollable list.
- **Content**: Name, Total Revenue, Revenue At Risk (with badge), Renewal Date.
- **Interaction**: Click card -> Select Account.

### 3. Account Detail Panel
- **Visibility**: Hidden until an account is selected.
- **Sections**:
    - **Key Personnel**: Table of employees on that account, sorted by risk.
    - **Risk Factors**: Auto-generated insights (e.g., "2 of 3 key leads at risk").

## Development Steps
1. **Structure**: `accounts.html` with standard header/nav.
2. **Chart Logic**: `accounts.js` to render bubbles. Use `revenue` for Y position (scaled %).
3. **Data Linking**: Join `accounts.json` with `talent.json` to show correct personnel in the details view.

## Edge Cases
- **Metric Overlap**: If multiple accounts have similar risk/revenue, ensure bubbles are clickable (z-index hover).
- **Zero Risk**: Handle accounts with 0 risk gracefully (Green bubble).

## Summary
This view bridges the gap between HR data (Talent Pulse) and Business outcomes (Revenue).
