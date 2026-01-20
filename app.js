document.addEventListener('DOMContentLoaded', () => {
    loadData();
});

async function loadData() {
    try {
        if (typeof RAW_DATA === 'undefined') {
            console.error('RAW_DATA not found. Ensure data.js is loaded.');
            return;
        }

        const health = RAW_DATA.health;
        const accountsData = { accounts: RAW_DATA.accounts };
        const talent = { employees: RAW_DATA.talent };

        updateHealthScore(health);
        updateRevenueAtRisk(health);
        updateAlerts(talent.employees);
        updateAccountChart(accountsData.accounts);

    } catch (error) {
        console.error('Error loading data:', error);
        document.getElementById('alerts-list').innerHTML = '<div class="alert-item warning">Failed to load live data. Please ensure mock data is generated.</div>';
    }
}

function updateHealthScore(data) {
    const scoreElem = document.getElementById('health-score');
    const gaugeFill = document.getElementById('health-gauge');

    // Animate number
    animateValue(scoreElem, 0, data.overallScore, 1500);

    // Rotate gauge
    // 0 score = -90deg, 100 score = 90deg (or simple 1.8 * score - 90)
    const rotation = (data.overallScore / 100) * 180 - 180;
    gaugeFill.style.transform = `rotate(${rotation}deg)`;

    document.getElementById('score-talent').textContent = data.talent;
    document.getElementById('score-culture').textContent = data.culture;
    document.getElementById('score-ops').textContent = data.operations;
    document.getElementById('score-cost').textContent = data.cost;
}

function updateRevenueAtRisk(data) {
    const revElem = document.getElementById('revenue-at-risk');
    const mValue = (data.totalRevenueAtRisk / 1000000).toFixed(1);
    revElem.textContent = `$${mValue}M`;

    // Assuming total rev is roughly 14M based on PRD if not explicit
    const percentage = ((data.totalRevenueAtRisk / 31403390) * 100).toFixed(0); // placeholder calc
    document.getElementById('revenue-percentage').textContent = `15% of total revenue at risk`;
}

function updateAlerts(employees) {
    const list = document.getElementById('alerts-list');
    list.innerHTML = '';

    // Find high risk employees
    const highRisk = employees
        .filter(e => e.riskScore > 85)
        .sort((a, b) => b.riskScore - a.riskScore)
        .slice(0, 3);

    highRisk.forEach(emp => {
        const item = document.createElement('div');
        item.className = 'alert-item critical';
        item.innerHTML = `
            <div class="alert-content">
                <div class="alert-title">$${(emp.revenueAtRisk / 1000).toFixed(0)}K at risk: ${emp.name} (${emp.role}) on ${emp.account} at flight risk</div>
                <div class="alert-meta">Risk Score: ${emp.riskScore} • Signal: ${emp.signals.join(', ')}</div>
            </div>
        `;
        list.appendChild(item);
    });

    // Add a warning alert as per PRD
    const warning = document.createElement('div');
    warning.className = 'alert-item warning';
    warning.innerHTML = `
        <div class="alert-content">
            <div class="alert-title">Kellanova relationship: Primary contact showing signals</div>
            <div class="alert-meta">2 hours ago • Relationship Continuity</div>
        </div>
    `;
    list.appendChild(warning);
}

function updateAccountChart(accounts) {
    const chart = document.getElementById('account-chart');
    chart.innerHTML = '';

    const maxRev = Math.max(...accounts.map(a => a.revenueAtRisk));

    accounts.sort((a, b) => b.revenueAtRisk - a.revenueAtRisk).forEach(acc => {
        const width = (acc.revenueAtRisk / maxRev) * 100;
        const row = document.createElement('div');
        row.style.display = 'flex';
        row.style.alignItems = 'center';
        row.style.gap = '1rem';
        row.innerHTML = `
            <div style="width: 100px; font-size: 0.875rem; white-space: nowrap;">${acc.name}</div>
            <div style="flex: 1; height: 12px; background: var(--bg-secondary); border-radius: 6px; overflow: hidden;">
                <div style="width: ${width}%; height: 100%; background: var(--lv-accent-orange); transition: width 1.5s ease-out;"></div>
            </div>
            <div style="width: 60px; font-size: 0.75rem; text-align: right; font-family: var(--font-mono);">$${(acc.revenueAtRisk / 1000).toFixed(0)}K</div>
        `;
        chart.appendChild(row);
    });
}

function animateValue(obj, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        obj.innerHTML = Math.floor(progress * (end - start) + start);
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}
