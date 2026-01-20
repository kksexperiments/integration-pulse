document.addEventListener('DOMContentLoaded', () => {
    loadAccountData();
});

let accountsData = [];
let talentData = [];

async function loadAccountData() {
    try {
        if (typeof RAW_DATA === 'undefined') {
            console.error('RAW_DATA not found.');
            return;
        }

        accountsData = RAW_DATA.accounts;
        talentData = RAW_DATA.talent;

        renderCards(accountsData);
        renderBubbles(accountsData);

    } catch (error) {
        console.error('Error loading data:', error);
    }
}

function renderCards(accounts) {
    const container = document.getElementById('accounts-row');
    container.innerHTML = '';

    // Sort by Revenue at Risk Desc
    accounts.sort((a, b) => b.revenueAtRisk - a.revenueAtRisk);

    accounts.forEach(acc => {
        const card = document.createElement('div');
        card.className = 'account-card';
        card.onclick = () => selectAccount(acc);
        card.innerHTML = `
            <div class="ac-header">${acc.name}</div>
            <div class="ac-metric">$${(acc.totalRevenue / 1000000).toFixed(1)}M</div>
            <div class="ac-risk" style="${acc.revenueAtRisk > 300000 ? 'color:var(--risk-high)' : 'color:var(--risk-medium)'}">
                $${(acc.revenueAtRisk / 1000).toFixed(0)}K at risk
            </div>
            <div style="font-size:0.75rem; color:var(--text-tertiary); margin-top:0.5rem;">
                Renew: ${new Date(acc.renewalDate).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
            </div>
        `;
        container.appendChild(card);
    });
}

function renderBubbles(accounts) {
    const container = document.getElementById('bubble-container');
    container.innerHTML = '';

    // Scales
    const maxRevenue = Math.max(...accounts.map(a => a.totalRevenue)) * 1.1; // 10% buffer

    accounts.forEach(acc => {
        const bubble = document.createElement('div');

        // Classes logic
        let riskClass = 'b-low';
        if (acc.peopleRiskScore > 48) riskClass = 'b-high';
        else if (acc.peopleRiskScore > 45) riskClass = 'b-med';

        bubble.className = `bubble ${riskClass}`;

        // Position
        // X = Risk Score (0-100)
        // Y = Revenue (0-max)

        const left = acc.peopleRiskScore; // Use raw score 0-100 as percentage for simplicity, or scale? 
        // Risk scores in data seem tight (44-50). Let's stretch them for viz if needed, but linear 0-100 is safer.
        // Actually, let's normalize risk for better spread in demo: (score - 40) * 5? No, stick to absolute.
        // Let's assume X axis is 40-60 for this specific dataset if clustered, OR standard 0-100.
        // Given data is 40-50, 0-100 will bunch them. Let's effectively zoom X to 40-60 range for demo visually?
        // No, keep it true 0-100 but maybe CSS leaves space.

        const bottom = (acc.totalRevenue / maxRevenue) * 100;

        bubble.style.left = `${left}%`; // 
        bubble.style.bottom = `${bottom}%`;
        bubble.setAttribute('data-label', acc.name);

        // Size
        const size = Math.max(40, acc.teamSize * 1.5); // Min 40px
        bubble.style.width = `${size}px`;
        bubble.style.height = `${size}px`;

        bubble.onclick = () => selectAccount(acc);

        // Tooltip
        bubble.title = `${acc.name}\nRev: $${(acc.totalRevenue / 1000000).toFixed(1)}M\nRisk: ${acc.peopleRiskScore}`;

        container.appendChild(bubble);
    });
}

function selectAccount(account) {
    // Highlight Card
    document.querySelectorAll('.account-card').forEach(c => c.classList.remove('active'));
    // (In real app, find specific card by ID, here simple viz trigger)

    // Show Panel
    const panel = document.getElementById('detail-panel');
    panel.classList.add('visible');

    document.getElementById('dp-title').textContent = account.name;
    document.getElementById('dp-meta').textContent = `Renewal: ${account.renewalDate} • Team Size: ${account.teamSize}`;

    // Filter Talent
    const team = talentData
        .filter(t => t.account === account.name)
        .sort((a, b) => b.riskScore - a.riskScore)
        .slice(0, 5); // Top 5 risky people

    let riskListHtml = '';
    if (team.length === 0) {
        riskListHtml = '<div style="color:var(--text-tertiary)">No personnel data linked.</div>';
    } else {
        team.forEach(emp => {
            let dot = 'rd-green';
            if (emp.riskScore > 80) dot = 'rd-red';
            else if (emp.riskScore > 50) dot = 'rd-amber';

            riskListHtml += `
                <div class="personnel-row">
                    <div class="risk-dot ${dot}"></div>
                    <div style="flex:1;">
                        <div style="font-weight:600; font-size:0.875rem;">${emp.name}</div>
                        <div style="font-size:0.75rem; color:var(--text-secondary);">${emp.role}</div>
                    </div>
                    <div style="text-align:right;">
                        <div style="font-weight:600; font-family:var(--font-mono); font-size:0.875rem;">${emp.riskScore}</div>
                        <div style="font-size:0.75rem; color:var(--text-tertiary);">RISK</div>
                    </div>
                </div>
            `;
        });
    }



    const detailContainer = document.getElementById('account-detail-content');

    // Clear previous content
    detailContainer.innerHTML = '';

    const headerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 1.5rem;">
            <div>
                <h3 style="font-size: 1.25rem; font-weight: 700; color: var(--lv-navy-900); margin-bottom: 0.25rem;">${account.name}</h3>
                <div style="color: var(--text-secondary); font-size: 0.875rem;">Renewal: ${new Date(account.renewalDate).toLocaleDateString()}</div>
            </div>
            <span class="risk-badge ${account.peopleRiskScore > 70 ? 'risk-high' : 'risk-medium'}">${account.peopleRiskScore}</span>
        </div>`;

    // 4. Leverage Pyramid Data
    // Mock hierarchy data based on the account's employees
    const accountEmployees = RAW_DATA.talent.filter(e => e.account === account.name);
    // Group by simple levels (Approximation)
    const levelCounts = { 'Directors': 0, 'Managers': 0, 'Associates': 0 };
    accountEmployees.forEach(e => {
        if (e.role.includes('Director')) levelCounts['Directors']++;
        else if (e.role.includes('Manager') || e.role.includes('Lead')) levelCounts['Managers']++;
        else levelCounts['Associates']++;
    });

    const pyramidHTML = `
        <div style="margin-top: 1.5rem; background: var(--bg-secondary); padding: 1rem; border-radius: var(--radius-md);">
            <h4 style="margin-bottom: 1rem; font-size: 0.875rem;">TEAM LEVERAGE PYRAMID</h4>
            <div style="display: flex; flex-direction: column; gap: 4px; align-items: center;">
                <div style="width: 40%; background: var(--lv-navy-800); color: white; text-align: center; padding: 4px; border-radius: 4px; font-size: 0.75rem;">
                    Directors (${levelCounts['Directors']})
                </div>
                <div style="width: 65%; background: var(--lv-blue-600); color: white; text-align: center; padding: 4px; border-radius: 4px; font-size: 0.75rem;">
                    Managers (${levelCounts['Managers']})
                </div>
                <div style="width: 90%; background: var(--lv-blue-400); color: white; text-align: center; padding: 4px; border-radius: 4px; font-size: 0.75rem;">
                    Associates/Cons (${levelCounts['Associates']})
                </div>
            </div>
            <div style="margin-top: 0.5rem; text-align: center; font-size: 0.75rem; color: var(--text-tertiary);">
                ${levelCounts['Directors'] > levelCounts['Associates'] ? '⚠️ High Top-Heavy Risk' : '✅ Healthy Leverage'}
            </div>
        </div>
    `;

    detailContainer.innerHTML = `
        ${headerHTML}

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.5rem;">
            <div style="background: var(--surface-white); padding: 1rem; border-radius: var(--radius-md); border: 1px solid var(--border-light);">
                <div style="font-size: 0.75rem; color: var(--text-tertiary); margin-bottom: 0.25rem;">Revenue at Risk</div>
                <div style="font-size: 1.125rem; font-weight: 700; color: var(--status-danger);">$${(account.revenueAtRisk / 1000000).toFixed(1)}M</div>
            </div>
            <div style="background: var(--surface-white); padding: 1rem; border-radius: var(--radius-md); border: 1px solid var(--border-light);">
                <div style="font-size: 0.75rem; color: var(--text-tertiary); margin-bottom: 0.25rem;">Team Size</div>
                <div style="font-size: 1.125rem; font-weight: 700; color: var(--lv-blue-600);">${account.teamSize}</div>
            </div>
        </div>
        
        ${pyramidHTML}

        <h4 style="font-size: 0.875rem; font-weight: 600; margin-bottom: 1rem; margin-top: 1.5rem;">Key Personnel Risks</h4>
        <div style="display: flex; flex-direction: column; gap: 0.75rem;">
            ${riskListHtml}
        </div>

        <div style="margin-top: auto; padding-top: 1.5rem; display: flex; gap: 1rem;">
            <button style="flex: 1; padding: 0.75rem; background: var(--lv-blue-600); color: white; border: none; border-radius: var(--radius-md); font-weight: 600; cursor: pointer;">View Recovery Plan</button>
            <button style="padding: 0.75rem; border: 1px solid var(--border-default); background: white; border-radius: var(--radius-md); cursor: pointer;">Export</button>
        </div>
    `;

    // Scroll to panel
    detailContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function closePanel() {
    document.getElementById('detail-panel').classList.remove('visible');
}
