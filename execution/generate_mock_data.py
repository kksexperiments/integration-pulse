import json
import random
import os
from datetime import datetime, timedelta

def generate_data():
    # Constants based on PRD
    ACCOUNTS = [
        {"name": "PepsiCo", "revenue": 2800000, "renewal": "2025-03-15", "base_team": 18},
        {"name": "Kellanova", "revenue": 1900000, "renewal": "2025-06-20", "base_team": 14},
        {"name": "Unilever", "revenue": 2200000, "renewal": "2025-09-10", "base_team": 16},
        {"name": "Coca-Cola", "revenue": 1800000, "renewal": "2025-12-05", "base_team": 12},
        {"name": "Coke Bottlers", "revenue": 1400000, "renewal": "2025-08-22", "base_team": 10},
        {"name": "Bimbo", "revenue": 900000, "renewal": "2025-11-30", "base_team": 8}
    ]
    
    FUNCTIONS = ["Delivery", "Technology", "RGM", "Product"]
    GEOS = ["India", "US", "LatAm", "Europe"]
    ORIGINS = ["LV", "DP"]
    
    # Specific individuals from PRD
    PRD_STARS = [
        {"name": "Priya S.", "role": "Engagement Lead", "account": "PepsiCo", "origin": "DP", "function": "Delivery", "geo": "India"},
        {"name": "Rahul M.", "role": "RGM Director", "account": "Kellanova", "origin": "DP", "function": "RGM", "geo": "US"},
        {"name": "Chen W.", "role": "Sr Consultant", "account": "Unilever", "origin": "DP", "function": "Delivery", "geo": "Europe"},
        {"name": "Maria L.", "role": "Data Engineer", "account": "Bimbo", "origin": "DP", "function": "Technology", "geo": "LatAm"},
        {"name": "James T.", "role": "PM Lead", "account": "Coca-Cola", "origin": "LV", "function": "Product", "geo": "US"}
    ]

    employees = []
    
    # Add PRD stars first
    for i, star in enumerate(PRD_STARS):
        risk = 85 + random.randint(0, 10) if star["origin"] == "DP" else 65 + random.randint(0, 10)
        impact = 90 + random.randint(0, 5)
        
        emp = {
            "id": f"emp-star-{i:03d}",
            "name": star["name"],
            "role": star["role"],
            "origin": star["origin"],
            "function": star["function"],
            "geography": star["geo"],
            "tenure": round(random.uniform(2, 6), 1),
            "riskScore": risk,
            "businessImpact": impact,
            "signals": ["manager_flag", "comp_gap"] if risk > 80 else ["comp_gap"],
            "account": star["account"],
            "revenueAtRisk": int(0.15 * [a["revenue"] for a in ACCOUNTS if a["name"] == star["account"]][0])
        }
        employees.append(emp)

    # Generate rest of the population
    total_needed = 350
    for i in range(len(employees), total_needed):
        origin = "LV" if random.random() < 0.75 else "DP"
        acc = random.choice(ACCOUNTS)
        risk = random.randint(20, 60) if origin == "LV" else random.randint(40, 85)
        impact = random.randint(30, 95)
        
        # Adjust risk based on random signals
        signals = []
        if risk > 70:
            signals.append("manager_flag")
            risk += 10
        if random.random() < 0.2:
            signals.append("comp_gap")
            risk += 5
            
        emp = {
            "id": f"emp-{i:03d}",
            "name": f"Employee {i}",
            "role": random.choice(["Associate", "Consultant", "Sr Consultant", "Manager", "Director"]),
            "origin": origin,
            "function": random.choice(FUNCTIONS),
            "geography": random.choice(GEOS),
            "tenure": round(random.uniform(0.5, 8), 1),
            "riskScore": min(risk, 100),
            "businessImpact": impact,
            "signals": signals,
            "account": acc["name"],
            "gradeMappingStatus": random.choices(["Mapped", "Pending"], weights=[0.2, 0.8])[0], # 80% Pending
            "revenueAtRisk": int(acc["revenue"] * (risk / 1000)) # Simple heuristic
        }
        employees.append(emp)

    # Summarize Accounts
    account_summary = []
    for acc in ACCOUNTS:
        team = [e for e in employees if e["account"] == acc["name"]]
        rev_at_risk = sum(e["revenueAtRisk"] for e in team)
        avg_risk = sum(e["riskScore"] for e in team) / len(team) if team else 0
        
        account_summary.append({
            "name": acc["name"],
            "totalRevenue": acc["revenue"],
            "renewalDate": acc["renewal"],
            "teamSize": len(team),
            "peopleRiskScore": int(avg_risk),
            "revenueAtRisk": rev_at_risk
        })

    # Global Health Score components
    health = {
        "overallScore": 72,
        "talent": int(sum(e["riskScore"] for e in employees) / len(employees)),
        "culture": 71,
        "operations": 78,
        "cost": 74,
        "totalEmployees": len(employees),
        "totalRevenueAtRisk": sum(a["revenueAtRisk"] for a in account_summary)
    }

    # Output to .tmp/
    os.makedirs(".tmp", exist_ok=True)
    with open(".tmp/talent.json", "w") as f:
        json.dump({"employees": employees}, f, indent=2)
    with open(".tmp/accounts.json", "w") as f:
        json.dump({"accounts": account_summary}, f, indent=2)
    with open(".tmp/health.json", "w") as f:
        json.dump(health, f, indent=2)

    print(f"Generated data for {len(employees)} employees and {len(account_summary)} accounts.")
    print("Files saved to .tmp/: talent.json, accounts.json, health.json")

if __name__ == "__main__":
    generate_data()
