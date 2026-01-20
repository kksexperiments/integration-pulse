# SOP: Implement Command Center

## Goal
Create the "30-Second Health Check" dashboard for executives, featuring hero metrics and critical alerts as specified in the PRD.

## Input
- `integration-pulse-prd.md` (Design guidelines, Phase 1 specs)
- `.tmp/health.json` and `.tmp/accounts.json` (Data source)

## UI Component Specifications

### 1. Integration Health Score
- **Type**: Circular Gauge.
- **Data**: `health.json -> overallScore`.
- **Logic**: Use CSS transitions for the "count up" animation (1.5s).

### 2. Revenue at Risk
- **Type**: Hero Metric.
- **Data**: `health.json -> totalRevenueAtRisk`.
- **Format**: Large currency string ($X.XM).

### 3. Critical Alerts
- **Type**: Scrollable List.
- **Logic**: Pull top 3 high-risk employees from `talent.json` where `riskScore > 90`.

### 4. Account Risk Chart
- **Type**: Horizontal Bar Chart.
- **Data**: `accounts.json`.
- **Color**: Orange for "Acquired" logic (Decision Point).

## Development Steps
1. **Layout**: Create `index.html` with a grid layout matching the blueprint in the PRD.
2. **Styles**: Implement `styles.css` using the LatentView color palette (Navy 900, Blue 600, etc.).
3. **Scripts**: Create `app.js` to fetch JSON from `.tmp/` and populate the components.
4. **Animation**: Add micro-animations for card entrances and gauge filling.

## Edge Cases
- **Missing Data**: Show "Loading..." or "Data Unavailable" if JSON files are not found.
- **Mobile View**: Ensure cards stack vertically on smaller screens.

## Summary
The Command Center should prioritize visual impact and scannability. Use bold typography and consistent color coding for Acquirer vs. Acquired data.
