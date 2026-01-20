# SOP: Implement Talent Pulse

## Goal
Build the "Talent Pulse" module to visualize flight risk vs. business impact and provide a detailed watchlist of at-risk employees.

## Input
- `integration-pulse-prd.md` (Phase 2 specs)
- `.tmp/talent.json` (Data source)

## UI Component Specifications

### 1. Flight Risk Matrix (Scatter Plot)
- **Type**: 2x2 Quadrant Chart.
- **Axes**: X = Flight Risk (0-100), Y = Business Impact (0-100).
- **Quadrants**:
    - Top-Right (High Risk/High Impact): "ACT NOW" (Red tint).
    - Bottom-Left (Low Risk/Low Impact): "STABLE" (Green tint).
- **Data Points**:
    - Color: Blue (LV) vs Orange (DP).
    - Size: Proportional to Tenure.
    - Interaction: Hover shows name/role; Click filters Watchlist.

### 2. High-Priority Watchlist
- **Type**: Interactive Table.
- **Columns**: Risk Score, Name/Role, Account, Signals, Action.
- **Sorting**: Default by Risk Score (Desc).
- **Visuals**: Risk Badges (Red/Amber/Green), Signal Icons.

## Development Steps
1. **Structure**: Create `talent.html` with the same header/nav as `index.html` but "Talent Pulse" active.
2. **Matrix Logic**: In `talent.js`, implement a custom scatter plot using absolute positioning within a container.
3. **Table Logic**: Populate the watchlist dynamically from `talent.json`.
4. **Filtering**: Implement dropdown filters for Function and Geography.

## Edge Cases
- **Overlapping Points**: Use semi-transparent bubbles (rgba) to show density.
- **Empty Filters**: Show "No employees match these criteria".

## Summary
Focus on the "Know Who's At Risk" narrative. The Matrix provides the strategic view, while the Watchlist provides the tactical actions.
