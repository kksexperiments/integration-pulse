document.addEventListener('DOMContentLoaded', () => {
    loadAccountData();
});

let accountsData = [];
let talentData = [];

// Mock SOW data (would come from backend in real app)
const SOW_DATA = {
    'PepsiCo': [
        { name: 'RGM Optimization', value: 1200000, headcount: 8, atRisk: true },
        { name: 'Data Platform Build', value: 900000, headcount: 6, atRisk: false },
        { name: 'Analytics CoE Setup', value: 700000, headcount: 4, atRisk: true }
    ],
    'Kellanova': [
        { name: 'Trade Promo Analytics', value: 1100000, headcount: 7, atRisk: true },
        { name: 'Supply Chain Viz', value: 800000, headcount: 5, atRisk: false }
    ],
    'Unilever': [
        { name: 'Consumer Insights Hub', value: 1400000, headcount: 9, atRisk: false },
        { name: 'D2C Analytics', value: 800000, headcount: 5, atRisk: true }
    ],
    'Coca-Cola': [
        { name: 'Marketing Mix Model', value: 1000000, headcount: 6, atRisk: true },
        { name: 'Route-to-Market', value: 800000, headcount: 4, atRisk: false }
    ],
    'Coke Bottlers': [
        { name: 'Distribution Analytics', value: 900000, headcount: 5, atRisk: false },
        { name: 'Demand Forecasting', value: 500000, headcount: 3, atRisk: true }
    ],
    'Bimbo': [
        { name: 'Retail Execution', value: 600000, headcount: 4, atRisk: true },
        { name: 'Pricing Analytics', value: 300000, headcount: 2, atRisk: false }
    ]
};

async function loadAccountData() {
    try {
        if (typeof RAW_DATA === 'undefined') {
            console.error('RAW_DATA not found.');
            return;
        }

        accountsData = RAW_DATA.accounts;
        talentData = RAW_DATA.talent;

        renderCards(accountsData);
        renderRiskBars(accountsData);
        renderRenewalTimeline(accountsData);

    } catch (error) {
        console.error('Error loading data:', error);
    }
}

function renderCards(accounts) {
    const container = document.getElementById('accounts-row');
    container.innerHTML = '';

    // Sort by Revenue at Risk Desc
    const sorted = [...accounts].sort((a, b) => b.revenueAtRisk - a.revenueAtRisk);

    sorted.forEach(acc => {
        const riskColor = acc.peopleRiskScore > 50 ? 'var(--status-danger)' :
            acc.peopleRiskScore > 45 ? 'var(--lv-accent-orange)' : 'var(--status-success)';
        const riskBg = acc.peopleRiskScore > 50 ? 'rgba(220,38,38,0.1)' :
            acc.peopleRiskScore > 45 ? 'rgba(245,158,11,0.1)' : 'rgba(16,185,129,0.1)';

        const card = document.createElement('div');
        card.className = 'account-card';
        card.id = `card-${acc.name.replace(/\s+/g, '-')}`;
        card.onclick = () => selectAccount(acc);
        card.innerHTML = `
            <div class="ac-header">
                <span>${acc.name}</span>
                <span class="ac-risk-badge" style="background:${riskBg}; color:${riskColor}">${acc.peopleRiskScore}</span>
            </div>
            <div class="ac-metric">$${(acc.totalRevenue / 1000000).toFixed(1)}M</div>
            <div class="ac-risk" style="color:${acc.revenueAtRisk > 50000 ? 'var(--status-danger)' : 'var(--text-secondary)'}">
                $${(acc.revenueAtRisk / 1000000).toFixed(2)}M at risk
            </div>
            <div style="font-size:0.75rem; color:var(--text-tertiary); margin-top:0.5rem;">
                ${acc.teamSize} people • Renew ${new Date(acc.renewalDate).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
            </div>
        `;
        container.appendChild(card);
    });
}

function renderRiskBars(accounts) {
    const container = document.getElementById('risk-bars');
    container.innerHTML = '';

    // Sort by revenue at risk
    const sorted = [...accounts].sort((a, b) => b.revenueAtRisk - a.revenueAtRisk);
    const maxRisk = Math.max(...sorted.map(a => a.revenueAtRisk));

    sorted.forEach(acc => {
        const pct = (acc.revenueAtRisk / maxRisk) * 100;
        const color = acc.peopleRiskScore > 50 ? 'var(--status-danger)' :
            acc.peopleRiskScore > 45 ? 'var(--lv-accent-orange)' : 'var(--status-success)';

        const row = document.createElement('div');
        row.className = 'risk-bar-row';
        row.id = `bar-${acc.name.replace(/\s+/g, '-')}`;
        row.onclick = () => selectAccount(acc);
        row.innerHTML = `
            <div class="risk-bar-label">${acc.name}</div>
            <div class="risk-bar-track">
                <div class="risk-bar-fill" style="width:${pct}%; background:${color};">
                    ${acc.teamSize} people
                </div>
            </div>
            <div class="risk-bar-value" style="color:${color}">$${(acc.revenueAtRisk / 1000000).toFixed(2)}M</div>
        `;
        container.appendChild(row);
    });
}

function renderRenewalTimeline(accounts) {
    const container = document.getElementById('renewal-timeline');
    container.innerHTML = '';

    // Sort by renewal date
    const sorted = [...accounts].sort((a, b) => new Date(a.renewalDate) - new Date(b.renewalDate));
    const today = new Date();

    sorted.forEach(acc => {
        const renewalDate = new Date(acc.renewalDate);
        const daysUntil = Math.ceil((renewalDate - today) / (1000 * 60 * 60 * 24));
        const isUrgent = daysUntil < 90 && acc.peopleRiskScore > 45;

        const item = document.createElement('div');
        item.className = `timeline-item ${isUrgent ? 'urgent' : ''}`;
        item.onclick = () => selectAccount(acc);
        item.innerHTML = `
            <div class="timeline-month">${renewalDate.toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}</div>
            <div class="timeline-name">${acc.name}</div>
            <div class="timeline-days" style="color:${isUrgent ? 'var(--status-danger)' : 'var(--text-tertiary)'}">
                ${daysUntil > 0 ? daysUntil + ' days' : 'OVERDUE'}
            </div>
        `;
        container.appendChild(item);
    });
}

function selectAccount(account) {
    // Highlight Card and Bar
    document.querySelectorAll('.account-card').forEach(c => c.classList.remove('active'));
    document.querySelectorAll('.risk-bar-row').forEach(r => r.classList.remove('active'));

    const cardId = `card-${account.name.replace(/\s+/g, '-')}`;
    const barId = `bar-${account.name.replace(/\s+/g, '-')}`;
    document.getElementById(cardId)?.classList.add('active');
    document.getElementById(barId)?.classList.add('active');

    // Show Panel
    const panel = document.getElementById('detail-panel');
    panel.classList.add('visible');

    document.getElementById('dp-title').textContent = account.name;
    document.getElementById('dp-meta').textContent = `Renewal: ${new Date(account.renewalDate).toLocaleDateString()} • Team Size: ${account.teamSize}`;

    // Filter Talent
    const team = talentData
        .filter(t => t.account === account.name)
        .sort((a, b) => b.riskScore - a.riskScore);

    // Build Personnel List
    let personnelHtml = '';
    if (team.length === 0) {
        personnelHtml = '<div style="color:var(--text-tertiary); text-align:center; padding:2rem;">No personnel data linked.</div>';
    } else {
        team.slice(0, 8).forEach(emp => {
            let dot = 'rd-green';
            if (emp.riskScore > 80) dot = 'rd-red';
            else if (emp.riskScore > 50) dot = 'rd-amber';

            personnelHtml += `
                <div class="personnel-row">
                    <div class="risk-dot ${dot}"></div>
                    <div style="flex:1;">
                        <div style="font-weight:600; font-size:0.875rem;">${emp.name}</div>
                        <div style="font-size:0.75rem; color:var(--text-secondary);">${emp.role} • ${emp.origin}</div>
                    </div>
                    <div style="text-align:right;">
                        <div style="font-weight:600; font-family:var(--font-mono); font-size:0.875rem;">${emp.riskScore}</div>
                        <div style="font-size:0.75rem; color:var(--text-tertiary);">Risk</div>
                    </div>
                </div>
            `;
        });

        if (team.length > 8) {
            personnelHtml += `<div style="text-align:center; padding:0.5rem; color:var(--text-tertiary); font-size:0.75rem;">+ ${team.length - 8} more</div>`;
        }
    }

    // Build SOW List
    const sows = SOW_DATA[account.name] || [];
    let sowHtml = '';
    if (sows.length === 0) {
        sowHtml = '<div style="color:var(--text-tertiary); text-align:center; padding:2rem;">No SOW data available.</div>';
    } else {
        sows.forEach(sow => {
            sowHtml += `
                <div class="sow-card ${sow.atRisk ? 'at-risk' : ''}">
                    <div class="sow-header">
                        <span class="sow-name">${sow.name}</span>
                        <span class="sow-value" style="color:${sow.atRisk ? 'var(--status-danger)' : 'var(--lv-navy-800)'}">$${(sow.value / 1000).toFixed(0)}K</span>
                    </div>
                    <div class="sow-meta">
                        ${sow.headcount} people assigned ${sow.atRisk ? '• Key person at risk' : ''}
                    </div>
                </div>
            `;
        });
    }

    // Calculate Leverage Pyramid
    const levelCounts = { 'Directors': 0, 'Managers': 0, 'Associates': 0 };
    team.forEach(e => {
        if (e.role.includes('Director')) levelCounts['Directors']++;
        else if (e.role.includes('Manager') || e.role.includes('Lead')) levelCounts['Managers']++;
        else levelCounts['Associates']++;
    });

    // Render Detail Content
    const detailContainer = document.getElementById('account-detail-content');
    detailContainer.innerHTML = `
        <!-- Left Column: Key Metrics & Personnel -->
        <div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.5rem;">
                <div style="background: var(--bg-secondary); padding: 1rem; border-radius: var(--radius-md);">
                    <div style="font-size: 0.75rem; color: var(--text-tertiary); margin-bottom: 0.25rem;">Revenue at Risk</div>
                    <div style="font-size: 1.25rem; font-weight: 700; color: var(--status-danger);">$${(account.revenueAtRisk / 1000000).toFixed(2)}M</div>
                </div>
                <div style="background: var(--bg-secondary); padding: 1rem; border-radius: var(--radius-md);">
                    <div style="font-size: 0.75rem; color: var(--text-tertiary); margin-bottom: 0.25rem;">People Risk Score</div>
                    <div style="font-size: 1.25rem; font-weight: 700; color: var(--lv-blue-600);">${account.peopleRiskScore}/100</div>
                </div>
            </div>

            <h4 style="font-size: 0.875rem; font-weight: 600; margin-bottom: 1rem;">Team at Risk (${team.length} total)</h4>
            <div style="max-height: 300px; overflow-y: auto;">
                ${personnelHtml}
            </div>
        </div>

        <!-- Right Column: SOWs & Pyramid -->
        <div>
            <h4 style="font-size: 0.875rem; font-weight: 600; margin-bottom: 1rem;">Active SOWs / Projects</h4>
            <div style="max-height: 200px; overflow-y: auto; margin-bottom: 1.5rem;">
                ${sowHtml}
            </div>

            <div style="background: var(--bg-secondary); padding: 1rem; border-radius: var(--radius-md);">
                <h4 style="margin-bottom: 0.75rem; font-size: 0.75rem; text-transform: uppercase; color: var(--text-tertiary);">Team Leverage Pyramid</h4>
                <div style="display: flex; flex-direction: column; gap: 4px; align-items: center;">
                    <div style="width: 40%; background: var(--lv-navy-800); color: white; text-align: center; padding: 6px; border-radius: 4px; font-size: 0.75rem;">
                        Directors (${levelCounts['Directors']})
                    </div>
                    <div style="width: 65%; background: var(--lv-blue-600); color: white; text-align: center; padding: 6px; border-radius: 4px; font-size: 0.75rem;">
                        Managers (${levelCounts['Managers']})
                    </div>
                    <div style="width: 90%; background: var(--lv-blue-400); color: white; text-align: center; padding: 6px; border-radius: 4px; font-size: 0.75rem;">
                        Associates/Cons (${levelCounts['Associates']})
                    </div>
                </div>
                <div style="margin-top: 0.5rem; text-align: center; font-size: 0.75rem; color: var(--text-tertiary);">
                    ${levelCounts['Directors'] > levelCounts['Associates'] ? 'Top-Heavy Risk' : 'Healthy Leverage'}
                </div>
            </div>
        </div>
    `;

    // Scroll to panel
    panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function closePanel() {
    document.getElementById('detail-panel').classList.remove('visible');
    document.querySelectorAll('.account-card').forEach(c => c.classList.remove('active'));
    document.querySelectorAll('.risk-bar-row').forEach(r => r.classList.remove('active'));
}
