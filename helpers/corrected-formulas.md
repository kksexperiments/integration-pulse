# Corrected api_aggregator Formulas

## ⚠️ Important: Enter formulas in this ORDER

The formulas must be entered **bottom-up** because Row 2 depends on Rows 6-9.

---

## Step 1: Enter Sub-Score Formulas FIRST (Rows 6-9)

### Row 6 - Cell B6 (talent_score):
```
=ROUND((AVERAGE(master_roster!U:U) / 5 * 100) * 0.6 + (100 - AVERAGE(master_roster!N:N)) * 0.4, 0)
```

### Row 7 - Cell B7 (culture_score):
```
=ROUND(AVERAGE(master_roster!V:V) * 0.7 + (COUNTIF(master_roster!G:G, ">=3") / COUNTA(master_roster!G:G) * 100) * 0.3, 0)
```

### Row 8 - Cell B8 (operations_score):
```
=ROUND((COUNTIF(master_roster!L:L, "Mapped") / COUNTA(master_roster!L:L) * 100) * 0.5 + (100 - (COUNTIF(master_roster!O:O, ">0") / COUNTA(master_roster!O:O) * 100)) * 0.5, 0)
```

### Row 9 - Cell B9 (cost_score):
```
=ROUND((COUNTIF(master_roster!X:X, "Below") + COUNTIF(master_roster!X:X, "At")) / COUNTA(master_roster!X:X) * 100, 0)
```

---

## Step 2: Update Existing Formulas (Rows 2-3)

### Row 2 - Cell B2 (overall_health_score):
```
=ROUND(AVERAGE(B6:B9), 0)
```
**Note**: This will work now because B6:B9 have values

### Row 3 - Cell B3 (total_revenue_at_risk):
```
=SUMIF(master_roster!N:N, ">70", master_roster!R:R)
```

---

## Step 3: Keep Existing Formulas (Rows 4-5)

### Row 4 - Cell B4 (high_risk_count):
```
=COUNTIF(master_roster!N:N, ">85")
```

### Row 5 - Cell B5 (grade_mapping_pct):
```
=ROUND(COUNTIF(master_roster!L:L, "Mapped") / COUNTA(master_roster!L:L) * 100, 0)
```

---

## Column Reference Guide

Make sure your `master_roster` sheet has these columns:

| Column | Field Name | Used In Formula |
|--------|------------|-----------------|
| G | tenure_years | culture_score |
| L | grade_mapping_status | operations_score, grade_mapping_pct |
| N | risk_score | talent_score, total_revenue_at_risk, high_risk_count |
| O | business_impact | operations_score |
| R | revenue_at_risk | total_revenue_at_risk |
| U | performance_rating | talent_score |
| V | engagement_score | culture_score |
| X | cost_efficiency | cost_score |

---

## Expected Results After Entering Formulas

| Row | Metric | Expected Value |
|-----|--------|----------------|
| 2 | overall_health_score | ~70-75 |
| 3 | total_revenue_at_risk | ~6,453,098 |
| 4 | high_risk_count | 34 |
| 5 | grade_mapping_pct | 21 |
| 6 | talent_score | ~72-78 |
| 7 | culture_score | ~65-72 |
| 8 | operations_score | ~75-85 |
| 9 | cost_score | ~70-80 |

---

## Troubleshooting

### If you see #REF! errors:
- Check that `master_roster` sheet name is spelled correctly
- Verify the sheet exists and has data

### If you see #DIV/0! errors:
- Make sure you entered formulas in the correct order (Rows 6-9 FIRST, then Row 2)
- Verify `master_roster` has data in the referenced columns

### If you see #N/A errors:
- Check that columns U, V, W, X exist in `master_roster`
- Verify you pasted the enhanced employee data (not the original data)

### If values seem wrong:
- Verify `master_roster` has 350 rows of data
- Check that columns U, V, W, X have numeric/text values (not empty)
