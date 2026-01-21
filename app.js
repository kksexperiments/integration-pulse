document.addEventListener('DOMContentLoaded', () => {
    loadData();
});

let attritionChartInstance = null;
let accountChartInstance = null;

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

        renderAccountChart(accountsData.accounts);
        renderAttritionChart(RAW_DATA.attritionTrend);

    } catch (error) {
        console.error('Error loading data:', error);
        document.getElementById('alerts-list').innerHTML = `<div class="alert-item warning">Failed to load live data: ${error.message}</div>`;
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
    document.getElementById('revenue-percentage').textContent = `${percentage}% of total revenue at risk`;
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

function renderAttritionChart(trends) {
    const ctx = document.getElementById('attritionChart').getContext('2d');

    if (attritionChartInstance) {
        attritionChartInstance.destroy();
    }

    // Labels for April to March fiscal year
    const labels = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'];

    attritionChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Apr 2024 - Mar 2025',
                    data: trends.previous,
                    borderColor: '#94a3b8', // Gray
                    borderDash: [5, 5],
                    tension: 0.4,
                    pointRadius: 0
                },
                {
                    label: 'Apr 2025 - Jan 2026',
                    data: trends.current,
                    borderColor: '#0f172a', // LatentView Navy/Blue
                    backgroundColor: 'rgba(15, 23, 42, 0.1)',
                    tension: 0.4,
                    fill: true
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'top' }
            },
            scales: {
                y: { beginAtZero: true, grid: { color: '#f1f5f9' } },
                x: { grid: { display: false } }
            }
        }
    });
}

function renderRiskTable(accounts) {
    const tbody = document.getElementById('risk-table-body');
    tbody.innerHTML = '';

    // Sort by Revenue at Risk
    const sorted = [...accounts].sort((a, b) => b.revenueAtRisk - a.revenueAtRisk);

    sorted.forEach(acc => {
        // Badge Colors
        let riskBg = 'var(--lv-blue-100)';
        let riskColor = 'var(--lv-blue-800)';
        if (acc.peopleRiskScore > 48) { riskBg = 'var(--lv-blue-200)'; riskColor = 'var(--lv-primary)'; }
        if (acc.peopleRiskScore > 50) { riskBg = 'var(--lv-blue-300)'; riskColor = 'var(--lv-navy-900)'; }

        const row = document.createElement('tr');
        row.innerHTML = `
            <td style="font-weight: 600;">${acc.name}</td>
            <td>$${(acc.totalRevenue / 1000000).toFixed(1)}M</td>
            <td style="color: var(--lv-primary); font-weight:600;">$${(acc.revenueAtRisk / 1000000).toFixed(2)}M</td>
            <td>${acc.margin}%</td>
            <td><span class="ac-risk-badge" style="background:${riskBg}; color:${riskColor}; padding: 2px 8px; border-radius: 12px; font-size: 0.75rem;">${acc.peopleRiskScore}</span></td>
            <td style="color: var(--text-tertiary); font-size: 0.875rem;">${new Date(acc.renewalDate).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}</td>
        `;
        tbody.appendChild(row);
    });
}

/* 
function updateAccountChart(accounts) {
    // Deprecated in favor of Full Table
} 
*/

function renderAccountChart(accounts) {
    const ctx = document.getElementById('accountRiskChart').getContext('2d');

    if (accountChartInstance) {
        accountChartInstance.destroy();
    }

    // Sort by Risk and take Top 5
    const topAccounts = [...accounts]
        .sort((a, b) => b.revenueAtRisk - a.revenueAtRisk)
        .slice(0, 5);

    const labels = topAccounts.map(a => a.name);
    const data = topAccounts.map(a => a.revenueAtRisk);

    accountChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Revenue at Risk',
                data: data,
                backgroundColor: '#0f172a', // LatentView Navy
                borderRadius: 4,
                barPercentage: 0.6
            }]
        },
        options: {
            indexAxis: 'y', // Horizontal bars
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            return '$' + (context.raw / 1000).toFixed(0) + 'k At Risk';
                        }
                    }
                }
            },
            scales: {
                x: {
                    beginAtZero: true,
                    grid: { color: '#f1f5f9' },
                    ticks: {
                        font: { size: 10 },
                        callback: function (value) {
                            return '$' + (value / 1000) + 'k';
                        }
                    }
                },
                y: {
                    grid: { display: false },
                    ticks: { font: { weight: '600' } }
                }
            }
        }
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

// Header Interactions
function toggleDropdown(id) {
    // Close other dropdowns first
    ['help-menu', 'apps-menu', 'profile-menu'].forEach(menuId => {
        if (menuId !== id) {
            const menu = document.getElementById(menuId);
            if (menu) menu.classList.remove('show');
        }
    });

    const dropdown = document.getElementById(id);
    if (dropdown) {
        dropdown.classList.toggle('show');
    }
}

// Close dropdowns when clicking outside
window.addEventListener('click', (e) => {
    if (!e.target.closest('.header-actions')) {
        ['help-menu', 'apps-menu', 'profile-menu'].forEach(menuId => {
            const menu = document.getElementById(menuId);
            if (menu) menu.classList.remove('show');
        });
    }
});
