import json
import os

def bundle_data():
    data = {}
    
    # Read Health
    with open(".tmp/health.json", "r") as f:
        data["health"] = json.load(f)
        
    # Read Accounts
    with open(".tmp/accounts.json", "r") as f:
        data["accounts"] = json.load(f)["accounts"]
        
    # Read Talent
    with open(".tmp/talent.json", "r") as f:
        data["talent"] = json.load(f)["employees"]
        
    # Write to data.js
    js_content = f"const RAW_DATA = {json.dumps(data, indent=2)};"
    
    with open("data.js", "w") as f:
        f.write(js_content)
        
    print("Successfully bundled data into data.js")

if __name__ == "__main__":
    bundle_data()
