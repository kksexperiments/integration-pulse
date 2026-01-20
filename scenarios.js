document.addEventListener('DOMContentLoaded', () => {
    loadScenarioData();
});

let highRiskEmployees = [];
let allEmployees = [];
let selectedIds = new Set();

async function loadScenarioData() {
    try {
        if (typeof RAW_DATA === 'undefined') {
            console.error('RAW_DATA not found.');
            return;
        }

        allEmployees = RAW_DATA.talent;
        // Filter for high-risk, high-impact employees (Risk > 60 OR Impact > 80)
        highRiskEmployees = allEmployees
            .filter(e => e.riskScore > 60 || e.businessImpact > 80)
            .sort((a, b) => (b.riskScore * b.businessImpact) - (a.riskScore * a.businessImpact));

        renderList(highRiskEmployees);
    } catch (error) {
        console.error('Error loading data:', error);
    }
}

function renderList(employees) {
    const container = document.getElementById('employee-list');
    container.innerHTML = '';

    employees.slice(0, 25).forEach(emp => {
        const riskColor = emp.riskScore > 80 ? 'var(--status-danger)' :
            emp.riskScore > 60 ? 'var(--lv-accent-orange)' : 'var(--text-secondary)';

        const item = document.createElement('div');
        item.className = 'emp-select-item';
        item.dataset.id = emp.id;
        item.onclick = () => toggleSelection(emp.id, item);

        item.innerHTML = `
            <div class="checkbox-custom">✓</div>
            <div style="flex: 1; min-width: 0;">
                <div style="font-weight: 600; font-size: 0.875rem;">${emp.name}</div>
                <div style="font-size: 0.75rem; color: var(--text-tertiary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${emp.role} • ${emp.account}</div>
            </div>
            <div style="text-align: right; flex-shrink: 0;">
                <div style="font-weight: 700; font-family: var(--font-mono); color: ${riskColor}; font-size: 0.875rem;">${emp.riskScore}</div>
                <div style="font-size: 0.65rem; color: var(--text-tertiary);">Risk</div>
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
    const selectedEmps = Array.from(selectedIds).map(id =>
        highRiskEmployees.find(e => e.id === id)
    ).filter(Boolean);

    // Calculate direct revenue impact
    const totalRevenue = selectedEmps.reduce((sum, e) => sum + (e.revenueAtRisk || 0), 0);

    // Identify impacted accounts
    const impactedAccounts = [...new Set(selectedEmps.map(e => e.account))];

    // Calculate retention cost (8% of revenue protected) and ROI
    const retentionCost = totalRevenue * 0.08;
    const savedRevenue = totalRevenue * 0.8; // 80% success assumption
    const roi = retentionCost > 0 ? (savedRevenue - retentionCost) / retentionCost : 0;

    // Find secondary risks (team members on same accounts who might follow)
    const secondaryRisks = allEmployees.filter(e =>
        impactedAccounts.includes(e.account) &&
        !selectedIds.has(e.id) &&
        e.riskScore > 50
    ).slice(0, 5);

    // Update displays
    document.getElementById('res-revenue').textContent = `$${(totalRevenue / 1000).toFixed(0)}K`;
    document.getElementById('res-accounts').textContent = impactedAccounts.length;
    document.getElementById('res-roi').textContent = `${roi.toFixed(1)}x`;

    // Render Cascade: Accounts
    const cascadeAccounts = document.getElementById('cascade-accounts');
    if (impactedAccounts.length > 0) {
        let accountsHtml = `<div class="cascade-title">🏢 Accounts at Risk</div>`;
        impactedAccounts.forEach(acc => {
            const accEmps = selectedEmps.filter(e => e.account === acc);
            const accRevenue = accEmps.reduce((s, e) => s + (e.revenueAtRisk || 0), 0);
            accountsHtml += `
                <div class="cascade-item critical">
                    <div class="cascade-icon" style="background:var(--status-danger); color:white;">⚠</div>
                    <div style="flex:1;">
                        <div style="font-weight:600; font-size:0.875rem;">${acc}</div>
                        <div style="font-size:0.75rem; color:var(--text-tertiary);">${accEmps.length} key departures</div>
                    </div>
                    <div style="text-align:right;">
                        <div style="font-weight:700; font-family:var(--font-mono); color:var(--status-danger);">$${(accRevenue / 1000).toFixed(0)}K</div>
                    </div>
                </div>
            `;
        });
        cascadeAccounts.innerHTML = accountsHtml;
    } else {
        cascadeAccounts.innerHTML = '';
    }

    // Render Cascade: Secondary Team Risks
    const cascadeTeam = document.getElementById('cascade-team');
    if (secondaryRisks.length > 0) {
        let teamHtml = `<div class="cascade-title">👥 Secondary Flight Risks</div>`;
        teamHtml += `<p style="font-size:0.75rem; color:var(--text-tertiary); margin-bottom:0.75rem;">Team members who may follow if key people leave:</p>`;
        secondaryRisks.forEach(emp => {
            teamHtml += `
                <div class="cascade-item warning">
                    <div class="cascade-icon" style="background:var(--lv-accent-orange); color:white;">👤</div>
                    <div style="flex:1;">
                        <div style="font-weight:600; font-size:0.875rem;">${emp.name}</div>
                        <div style="font-size:0.75rem; color:var(--text-tertiary);">${emp.role} • ${emp.account}</div>
                    </div>
                    <div style="text-align:right;">
                        <div style="font-weight:600; font-size:0.875rem; color:var(--lv-accent-orange);">${emp.riskScore}</div>
                    </div>
                </div>
            `;
        });
        cascadeTeam.innerHTML = teamHtml;
    } else {
        cascadeTeam.innerHTML = '';
    }

    // AI Recommendation
    const aiRec = document.getElementById('ai-rec');
    if (selectedIds.size === 0) {
        aiRec.innerHTML = "Select employees to model the departure scenario.";
    } else if (roi > 5) {
        aiRec.innerHTML = `
            <span style="color:var(--status-success); font-weight:700;">✓ HIGHLY RECOMMENDED</span><br>
            Invest $${(retentionCost / 1000).toFixed(0)}K in retention to protect $${(totalRevenue / 1000).toFixed(0)}K revenue across ${impactedAccounts.length} account(s). 
            ${secondaryRisks.length > 0 ? `<br><br>⚠️ Warning: ${secondaryRisks.length} additional team members may follow.` : ''}
        `;
    } else if (roi > 2) {
        aiRec.innerHTML = `
            <span style="color:var(--lv-accent-orange); font-weight:700;">⚡ MODERATE ROI</span><br>
            Consider targeted retention for highest-impact individuals. Full intervention may have diminishing returns.
        `;
    } else {
        aiRec.innerHTML = `
            <span style="color:var(--text-secondary); font-weight:700;">📊 REVIEW NEEDED</span><br>
            ROI is marginal. Focus on knowledge transfer and succession planning instead of costly retention.
        `;
    }

    // Update button
    const btn = document.getElementById('generate-btn');
    btn.disabled = selectedIds.size === 0;
    btn.textContent = selectedIds.size > 0
        ? `📄 Generate Business Case (${selectedIds.size} selected)`
        : '📄 Generate Business Case';
}
