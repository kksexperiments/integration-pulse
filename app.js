document.addEventListener('DOMContentLoaded', () => {
    loadData();
});

// Manual Refresh Function
async function manualRefresh() {
    const btn = document.getElementById('refresh-btn');
    if (!btn) return;

    // Disable button and show loading state
    btn.disabled = true;
    btn.style.opacity = '0.6';
    btn.style.cursor = 'not-allowed';
    const originalHTML = btn.innerHTML;
    btn.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="animation: spin 1s linear infinite;">
            <polyline points="23 4 23 10 17 10"></polyline>
            <polyline points="1 20 1 14 7 14"></polyline>
            <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
        </svg>
        Refreshing...
    `;

    // Add spin animation if not already present
    if (!document.getElementById('spin-animation')) {
        const style = document.createElement('style');
        style.id = 'spin-animation';
        style.textContent = '@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }';
        document.head.appendChild(style);
    }

    try {
        // Clear cache and reload data
        if (typeof dataFetcher !== 'undefined') {
            dataFetcher.clearCache();
            console.log('[REFRESH] Cache cleared, fetching fresh data...');
        }

        await loadData();

        // Show success feedback
        btn.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            Refreshed!
        `;
        btn.style.background = 'var(--status-success)';

        // Reset after 2 seconds
        setTimeout(() => {
            btn.innerHTML = originalHTML;
            btn.style.background = 'var(--lv-primary)';
            btn.style.opacity = '1';
            btn.style.cursor = 'pointer';
            btn.disabled = false;
        }, 2000);

    } catch (error) {
        console.error('[REFRESH] Failed:', error);
        btn.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            Failed
        `;
        btn.style.background = 'var(--status-danger)';

        // Reset after 2 seconds
        setTimeout(() => {
            btn.innerHTML = originalHTML;
            btn.style.background = 'var(--lv-primary)';
            btn.style.opacity = '1';
            btn.style.cursor = 'pointer';
            btn.disabled = false;
        }, 2000);
    }
}


// Utility: Get time ago string
function getTimeAgo(timestamp) {
    const now = new Date();
    const updated = new Date(timestamp);
    const diffMs = now - updated;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

    if (diffHours < 1) return 'Updated just now';
    if (diffHours === 1) return 'Updated 1 hour ago';
    if (diffHours < 24) return `Updated ${diffHours} hours ago`;
    return `Updated ${Math.floor(diffHours / 24)} days ago`;
}

// Utility: Get metric color based on thresholds
function getMetricColor(value, type) {
    if (type === 'revenue') {
        if (value >= 5000000) return 'var(--danger)';      // >$5M = Critical
        if (value >= 2000000) return 'var(--warning)';     // >$2M = Warning
        return 'var(--text-primary)';                       // <$2M = Normal
    }
    return 'var(--text-primary)';
}

// Colorblind-safe palette (IBM Carbon)
const chartColors = {
    high: '#d73027',    // Red-orange (not pure red)
    medium: '#fee090',  // Yellow
    low: '#4575b4',     // Blue
    primary: '#1c56ab', // LatentView Blue
    success: '#10b981',
    warning: '#f59e0b',
    danger: '#ef4444'
};

// Configure Chart.js defaults for consistent tooltips
if (typeof Chart !== 'undefined') {
    Chart.defaults.plugins.tooltip = {
        backgroundColor: '#ffffff',
        titleColor: '#1e293b',
        bodyColor: '#334155',
        borderColor: '#d1dbe8',
        borderWidth: 1,
        cornerRadius: 8,
        padding: 12,
        displayColors: true,
        boxWidth: 12,
        boxHeight: 12
    };
}

let attritionChartInstance = null;
let accountChartInstance = null;

async function loadData() {
    try {
        // Show loading state
        document.getElementById('health-score').textContent = '...';
        document.getElementById('revenue-at-risk').textContent = 'Loading...';
        document.getElementById('alerts-list').innerHTML = '<div class="alert-item">Loading data from Google Sheets...</div>';

        // Try to fetch live data from Google Sheets
        let liveData;
        let usingLiveData = false;

        if (typeof dataFetcher !== 'undefined') {
            try {
                console.log('[INTEGRATION] Fetching live data from Google Sheets...');
                liveData = await dataFetcher.fetchAll();
                usingLiveData = true;
                console.log('[INTEGRATION] ✅ Live data loaded successfully');
            } catch (apiError) {
                console.warn('[INTEGRATION] ⚠️ Failed to fetch live data, falling back to mock data:', apiError);
            }
        }

        // Fallback to mock data if live data unavailable
        if (!usingLiveData) {
            if (typeof RAW_DATA === 'undefined') {
                throw new Error('No data source available (neither live nor mock)');
            }
            console.log('[INTEGRATION] Using mock data from data.js');
        }

        // Transform live data to match existing structure
        let health, accountsData, talent;

        if (usingLiveData) {
            // Map live data from Google Sheets to expected format
            const metrics = liveData.metrics;

            // Calculate sub-scores from metrics (now from api_aggregator formulas)
            const talentScore = metrics.get('talent_score') || 72;
            const cultureScore = metrics.get('culture_score') || 68;
            const operationsScore = metrics.get('operations_score') || 81;
            const costScore = metrics.get('cost_score') || 74;

            health = {
                overallScore: Math.round(metrics.get('overall_health_score') || 0),
                totalRevenueAtRisk: metrics.get('total_revenue_at_risk') || 0,
                talent: talentScore,
                culture: cultureScore,
                operations: operationsScore,
                cost: costScore
            };

            accountsData = { accounts: liveData.accounts };
            talent = { employees: liveData.employees };

            // Add success indicator
            const statusIndicator = document.querySelector('.last-updated');
            if (statusIndicator) {
                statusIndicator.textContent = '🟢 Live data from Google Sheets';
                statusIndicator.style.color = 'var(--status-success)';
            }
        } else {
            // Use mock data
            health = RAW_DATA.health;
            accountsData = { accounts: RAW_DATA.accounts };
            talent = { employees: RAW_DATA.talent };
        }

        // Update UI with data (same for both live and mock)
        updateHealthScore(health);
        updateRevenueAtRisk(health);
        updateAlerts(talent.employees);

        renderAccountChart(accountsData.accounts);

        // Use live attrition trends if available
        if (usingLiveData && liveData.attritionTrends && liveData.attritionTrends.length > 0) {
            renderAttritionChart(transformAttritionTrends(liveData.attritionTrends));
        } else {
            renderAttritionChart(RAW_DATA.attritionTrend);
        }

    } catch (error) {
        console.error('[INTEGRATION] ❌ Error loading data:', error);
        document.getElementById('alerts-list').innerHTML = `<div class="alert-item warning">Failed to load data: ${error.message}</div>`;
    }
}

// Transform attrition trends from Google Sheets format to chart format
function transformAttritionTrends(trends) {
    // Separate by fiscal year
    const previous = trends.filter(t => t.fiscal_year === '2024-2025').map(t => t.attrition_count);
    const current = trends.filter(t => t.fiscal_year === '2025-2026').map(t => t.attrition_count);

    return {
        previous: previous,
        current: current
    };
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

    // Dynamic color based on threshold
    const color = getMetricColor(data.totalRevenueAtRisk, 'revenue');
    revElem.textContent = `$${mValue}M`;
    revElem.style.color = color;

    // Assuming total rev is roughly 31.4M based on data
    const percentage = ((data.totalRevenueAtRisk / 31403390) * 100).toFixed(0);
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
            <div class="alert-actions">
                <button class="btn-ghost btn-sm" onclick="alert('View details for ${emp.name}')">View</button>
                <button class="btn-ghost btn-sm" onclick="alert('Assign owner for ${emp.name}')">Assign</button>
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
