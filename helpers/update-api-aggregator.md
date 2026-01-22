# API Aggregator Sheet - Updated Formulas

## Instructions
Copy these formulas into your `api_aggregator` sheet in Google Sheets.

---

## Current Structure

| metric_name | metric_value | formula | notes |
|-------------|--------------|---------|-------|
| overall_health_score | [formula] | | Calculated from sub-scores |
| total_revenue_at_risk | [formula] | | Sum from employees |
| high_risk_count | [formula] | | Count of high-risk employees |
| grade_mapping_pct | [formula] | | Percentage mapped |
| talent_score | [formula] | | NEW: From employee data |
| culture_score | [formula] | | NEW: From employee data |
| operations_score | [formula] | | NEW: From employee data |
| cost_score | [formula] | | NEW: From employee data |

---

## Updated Formulas

### Row 2: overall_health_score
```
=ROUND(AVERAGE(A6:A9), 0)
```
**Notes**: Average of the 4 sub-scores (talent, culture, operations, cost)

---

### Row 3: total_revenue_at_risk
```
=SUMIF(EmployeeRoster!N:N, ">70", EmployeeRoster!R:R)
```
**Notes**: Sum revenue_at_risk (column R) where risk_score (column N) > 70

**Column References**:
- Column N = risk_score
- Column R = revenue_at_risk

---

### Row 4: high_risk_count
```
=COUNTIF(EmployeeRoster!N:N, ">85")
```
**Notes**: Count employees with risk_score > 85

---

### Row 5: grade_mapping_pct
```
=ROUND(COUNTIF(EmployeeRoster!L:L, "Mapped") / COUNTA(EmployeeRoster!L:L) * 100, 0)
```
**Notes**: Percentage of employees with grade_mapping_status = "Mapped"

**Column References**:
- Column L = grade_mapping_status

---

### Row 6: talent_score (NEW)
```
=ROUND((AVERAGE(EmployeeRoster!U:U) / 5 * 100) * 0.6 + (100 - AVERAGE(EmployeeRoster!N:N)) * 0.4, 0)
```
**Notes**: 
- 60% weight on performance rating (column U, scaled to 100)
- 40% weight on inverse of risk score (column N)

**Column References**:
- Column U = performance_rating (1-5)
- Column N = risk_score (0-100)

---

### Row 7: culture_score (NEW)
```
=ROUND(AVERAGE(EmployeeRoster!V:V) * 0.7 + (COUNTIF(EmployeeRoster!G:G, ">=3") / COUNTA(EmployeeRoster!G:G) * 100) * 0.3, 0)
```
**Notes**:
- 70% weight on engagement score (column V)
- 30% weight on retention (% with tenure >= 3 years, column G)

**Column References**:
- Column V = engagement_score (0-100)
- Column G = tenure_years

---

### Row 8: operations_score (NEW)
```
=ROUND((COUNTIF(EmployeeRoster!L:L, "Mapped") / COUNTA(EmployeeRoster!L:L) * 100) * 0.5 + (100 - (COUNTIF(EmployeeRoster!O:O, ">0") / COUNTA(EmployeeRoster!O:O) * 100)) * 0.5, 0)
```
**Notes**:
- 50% weight on grade mapping completion (column L)
- 50% weight on stability (inverse of employees with signals)

**Column References**:
- Column L = grade_mapping_status
- Column O = business_impact (using as proxy for signal count)

---

### Row 9: cost_score (NEW)
```
=ROUND((COUNTIF(EmployeeRoster!X:X, "Below") + COUNTIF(EmployeeRoster!X:X, "At")) / COUNTA(EmployeeRoster!X:X) * 100, 0)
```
**Notes**: Percentage of employees at or below market rate

**Column References**:
- Column X = cost_efficiency (Below, At, Above)

---

## Column Mapping Reference

After adding new columns, your `master_roster` should have:

| Col | Field | Col | Field |
|-----|-------|-----|-------|
| A | employee_id | N | risk_score |
| B | employee_name | O | business_impact |
| C | role | P | signal_manager_flag |
| D | origin | Q | signal_comp_gap |
| E | function | R | revenue_at_risk |
| F | geography | S | hire_date |
| G | tenure_years | T | status |
| H | manager_id | U | performance_rating (NEW) |
| I | account_name | V | engagement_score (NEW) |
| J | grade_legacy | W | tenure_bucket (NEW) |
| K | grade_unified | X | cost_efficiency (NEW) |
| L | grade_mapping_status | | |
| M | base_salary | | |

---

## Steps to Update

1. **Add new columns** to `master_roster` (U, V, W, X)
2. **Paste enhanced employee data** from helper script
3. **Add 4 new rows** to `api_aggregator` (rows 6-9)
4. **Copy formulas** from above into respective cells
5. **Verify calculations** - all should show numeric values
6. **Test API** - Run testAPI() in Apps Script

---

## Expected Results

After updating, your `api_aggregator` should show:

| metric_name | metric_value |
|-------------|--------------|
| overall_health_score | ~70 |
| total_revenue_at_risk | ~6,453,098 |
| high_risk_count | 34 |
| grade_mapping_pct | 21 |
| talent_score | ~72 |
| culture_score | ~68 |
| operations_score | ~81 |
| cost_score | ~74 |
