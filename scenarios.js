document.addEventListener('DOMContentLoaded', () => {
    loadScenarioData();
});

let highRiskEmployees = [];
let selectedIds = new Set();

async function loadScenarioData() {
    try {
        if (typeof RAW_DATA === 'undefined') {
            console.error('RAW_DATA not found.');
            return;
        }

        // Filter for relevant folks to model (Risk > 60)
        highRiskEmployees = RAW_DATA.talent.filter(e => e.riskScore > 60);

        renderList(highRiskEmployees);
    } catch (error) {
        console.error('Error loading data:', error);
    }
}

function renderList(employees) {
    const container = document.getElementById('employee-list');
    container.innerHTML = '';

    employees.sort((a, b) => b.revenueAtRisk - a.revenueAtRisk);

    employees.forEach(emp => {
        const item = document.createElement('div');
        item.className = 'emp-select-item';
        item.dataset.id = emp.id;
        item.onclick = () => toggleSelection(emp.id, item);

        item.innerHTML = `
            <div class="checkbox-custom">✓</div>
            <div style="flex: 1;">
                <div style="font-weight: 600;">${emp.name}</div>
                <div style="font-size: 0.75rem; color: var(--text-secondary);">${emp.role} • ${emp.account}</div>
            </div>
            <div style="text-align: right;">
                <div style="font-weight: 600; font-family: var(--font-mono); color: var(--risk-high);">$${(emp.revenueAtRisk / 1000).toFixed(0)}K</div>
                <div style="font-size: 0.75rem; color: var(--text-tertiary);">Risk: ${emp.riskScore}</div>
            </div>
        `;

        container.appendChild(item);
    });
}

function toggleSelection(id, element) {
    if (selectedIds.has(id)) {
        selectedIds.delete(id);
        element.classList.remove('selected');
    } else {
        selectedIds.add(id);
        element.classList.add('selected');
    }
    calculateImpact();
}

function resetSelection() {
    selectedIds.clear();
    document.querySelectorAll('.emp-select-item').forEach(el => el.classList.remove('selected'));
    calculateImpact();
}

function calculateImpact() {
    let totalRevenue = 0;

    selectedIds.forEach(id => {
        const emp = highRiskEmployees.find(e => e.id === id);
        if (emp) totalRevenue += emp.revenueAtRisk;
    });

    // Heuristics
    // Cost of intervention ~ 5% of their revenue impact (proxy for salary/bonus)
    const interventionCost = totalRevenue * 0.08;
    const savedRevenue = totalRevenue * 0.8; // Assume 80% success rate
    const roi = interventionCost > 0 ? (savedRevenue - interventionCost) / interventionCost : 0;

    // Render
    document.getElementById('res-revenue').textContent = `$${(totalRevenue / 1000).toFixed(0)}K`;
    document.getElementById('res-cost').textContent = `$${(interventionCost / 1000).toFixed(0)}K`;
    document.getElementById('res-roi').textContent = `${roi.toFixed(1)}x`;

    // AI Rec
    const rec = document.getElementById('ai-rec');
    if (selectedIds.size === 0) {
        rec.textContent = "Select employees to generate a business case.";
    } else if (roi > 5) {
        rec.innerHTML = `<span style="color:var(--status-success); font-weight:700;">✓ HIGHLY RECOMMENDED</span><br>Proceed with retention packages. The revenue protection significantly outweighs the cost.`;
    } else {
        rec.textContent = "Review individual cases. ROI is marginal.";
    }
}
