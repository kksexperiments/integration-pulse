document.addEventListener('DOMContentLoaded', () => {
    loadTalentData();

    document.getElementById('filter-function').addEventListener('change', filterData);
    document.getElementById('filter-geo').addEventListener('change', filterData);
});

let allEmployees = [];

async function loadTalentData() {
    try {
        if (typeof RAW_DATA === 'undefined') {
            console.error('RAW_DATA not found.');
            return;
        }
        allEmployees = RAW_DATA.talent;

        populateFilters(allEmployees);
        renderView(allEmployees);
    } catch (error) {
        console.error('Error loading talent data:', error);
    }
}

function filterData() {
    const filtered = allEmployees.filter(emp => {
        const fn = document.getElementById('filter-function').value;
        const geo = document.getElementById('filter-geo').value;
        const role = document.getElementById('filter-designation').value;
        const account = document.getElementById('filter-account').value;

        const matchesFn = fn === 'all' || emp.function === fn;
        const matchesGeo = geo === 'all' || emp.geography === geo;
        const matchesRole = role === 'all' || emp.role === role;
        const matchesAccount = account === 'all' || emp.account === account;
        return matchesFn && matchesGeo && matchesRole && matchesAccount;
    });

    renderView(filtered);
}

function populateFilters(employees) {
    // Unique Roles (Designation)
    const roles = [...new Set(employees.map(e => e.role))].sort();
    const roleSelect = document.getElementById('filter-designation');
    roles.forEach(role => {
        const option = document.createElement('option');
        option.value = role;
        option.textContent = role;
        roleSelect.appendChild(option);
    });
    roleSelect.addEventListener('change', filterData);

    // Unique Accounts
    const accounts = [...new Set(employees.map(e => e.account))].sort();
    const accSelect = document.getElementById('filter-account');
    accounts.forEach(acc => {
        const option = document.createElement('option');
        option.value = acc;
        option.textContent = acc;
        accSelect.appendChild(option);
    });
    accSelect.addEventListener('change', filterData);
}

function renderView(employees) {
    renderMatrix(employees);
    renderWatchlist(employees);
    renderSignalIntensity(employees);
    renderRegrettableLoss(employees);
    renderGradeMappingPulse(employees);
    renderSeniorityPyramid(employees);
}

function renderMatrix(employees) {
    const container = document.getElementById('matrix-container');
    // Keep background elements
    const staticElements = Array.from(container.children).filter(el =>
        el.classList.contains('quadrant-bg') ||
        el.classList.contains('quadrant-label') ||
        el.classList.contains('matrix-axis-label')
    );
    container.innerHTML = '';
    staticElements.forEach(el => container.appendChild(el));

    // Event Listener for Toggle
    const mappingToggle = document.getElementById('toggle-mapping-risk');
    if (mappingToggle) {
        mappingToggle.addEventListener('change', () => filterData());
    }

    employees.forEach(emp => {
        const point = document.createElement('div');

        // Determine coloring class
        let colorClass = `matrix-point ${emp.origin.toLowerCase()}`; // Default origin based

        if (document.getElementById('toggle-mapping-risk') && document.getElementById('toggle-mapping-risk').checked) {
            // Override with Mapping Status
            if (emp.gradeMappingStatus === 'Pending') {
                point.style.backgroundColor = 'var(--status-danger)';
                point.style.borderColor = 'white';
            } else {
                point.style.backgroundColor = 'var(--status-success)';
                point.style.borderColor = 'white';
            }
            point.className = 'matrix-point'; // clear origin classes
        } else {
            point.className = `matrix-point ${emp.origin.toLowerCase()}`;
        }

        const x = emp.riskScore;
        const y = 100 - emp.businessImpact;

        point.style.left = `${x}%`;
        point.style.top = `${y}%`;

        // Size based on tenure (0-10 years -> 8-20px)
        const size = 8 + (emp.tenure * 1.5);
        point.style.width = `${size}px`;
        point.style.height = `${size}px`;

        // Tooltip title
        point.title = `${emp.name} (${emp.role})\nRisk: ${emp.riskScore} | Impact: ${emp.businessImpact}`;

        container.appendChild(point);
    });
}

function renderWatchlist(employees) {
    const tbody = document.getElementById('watchlist-body');
    tbody.innerHTML = '';

    // Sort by Risk Descending
    const sorted = [...employees].sort((a, b) => b.riskScore - a.riskScore);

    sorted.slice(0, 50).forEach(emp => {
        const tr = document.createElement('tr');

        // Risk Badge Logic
        let riskClass = 'risk-low';
        let riskLabel = 'LOW';
        if (emp.riskScore >= 90) { riskClass = 'risk-high'; riskLabel = 'CRITICAL'; }
        else if (emp.riskScore >= 70) { riskClass = 'risk-medium'; riskLabel = 'HIGH'; }
        else if (emp.riskScore >= 50) { riskClass = 'risk-medium'; riskLabel = 'MED'; }

        // Signals Logic
        let signalsHtml = '';
        if (emp.signals.includes('manager_flag')) signalsHtml += '<span class="signal-dot sig-red" title="Manager Flag"></span>';
        if (emp.signals.includes('comp_gap')) signalsHtml += '<span class="signal-dot sig-amber" title="Compensation Gap"></span>';
        if (emp.signals.includes('grade_pending')) signalsHtml += '<span class="signal-dot sig-amber" title="Grade Pending"></span>';

        tr.innerHTML = `
            <td><span class="risk-badge ${riskClass}">${emp.riskScore}</span></td>
            <td>
                <div style="font-weight: 500; color: var(--text-primary);">${emp.name}</div>
                <div style="font-size: 0.75rem; color: var(--text-tertiary);">${emp.role}</div>
            </td>
            <td>${emp.account}</td>
            <td>${signalsHtml}</td>
        `;
        tbody.appendChild(tr);
    });
}

// 1. Signal Intensity Dashboard
function renderSignalIntensity(employees) {
    const container = document.getElementById('signal-intensity-container');
    if (!container) return;

    const signalCounts = {
        'manager_flag': { count: 0, label: 'Manager Issues', color: 'var(--status-danger)' },
        'comp_gap': { count: 0, label: 'Compensation Gap', color: 'var(--lv-accent-orange)' },
        'grade_pending': { count: 0, label: 'Grade Pending', color: '#fbbf24' }
    };

    employees.forEach(emp => {
        (emp.signals || []).forEach(sig => {
            if (signalCounts[sig]) signalCounts[sig].count++;
        });
    });

    const maxCount = Math.max(...Object.values(signalCounts).map(s => s.count), 1);

    let html = '<div style="display:flex; flex-direction:column; gap:1rem;">';
    Object.entries(signalCounts).forEach(([key, data]) => {
        const pct = (data.count / maxCount) * 100;
        html += `
            <div>
                <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
                    <span style="font-weight:600; font-size:0.875rem;">${data.label}</span>
                    <span style="font-weight:700; font-family:var(--font-mono);">${data.count}</span>
                </div>
                <div style="width:100%; height:24px; background:var(--bg-secondary); border-radius:4px; overflow:hidden;">
                    <div style="width:${pct}%; height:100%; background:${data.color}; border-radius:4px; transition:width 0.3s;"></div>
                </div>
            </div>
        `;
    });
    html += '</div>';

    // Actionable insight
    const topSignal = Object.entries(signalCounts).sort((a, b) => b[1].count - a[1].count)[0];
    html += `<div style="margin-top:1rem; padding:0.75rem; background:var(--bg-secondary); border-radius:var(--radius-md); font-size:0.875rem;">
        <strong>Priority Action:</strong> ${topSignal[1].count > 0 ? `Address <strong style="color:${topSignal[1].color}">${topSignal[1].label}</strong> — affecting ${topSignal[1].count} employees` : 'No signals detected'}
    </div>`;

    container.innerHTML = html;
}

// 2. Regrettable Loss Index
function renderRegrettableLoss(employees) {
    const container = document.getElementById('regrettable-loss-container');
    if (!container) return;

    // Filter: High risk (>=75) AND high impact (>=80)
    const criticalList = employees
        .filter(e => e.riskScore >= 75 && e.businessImpact >= 80)
        .map(e => ({ ...e, regretScore: Math.round((e.riskScore * e.businessImpact) / 100) }))
        .sort((a, b) => b.regretScore - a.regretScore)
        .slice(0, 10);

    if (criticalList.length === 0) {
        container.innerHTML = '<div style="text-align:center; color:var(--text-tertiary); padding:2rem;">No critical regrettable loss risks detected</div>';
        return;
    }

    let html = '<div style="display:flex; flex-direction:column; gap:0.75rem;">';
    criticalList.forEach((emp, i) => {
        html += `
            <div style="display:flex; align-items:center; gap:1rem; padding:0.75rem; background:${i === 0 ? 'rgba(220,38,38,0.1)' : 'var(--bg-secondary)'}; border-radius:var(--radius-md); ${i === 0 ? 'border:2px solid var(--status-danger);' : ''}">
                <div style="width:32px; height:32px; background:var(--status-danger); color:white; border-radius:50%; display:flex; align-items:center; justify-content:center; font-weight:700; font-size:0.875rem;">${emp.regretScore}</div>
                <div style="flex:1;">
                    <div style="font-weight:600;">${emp.name}</div>
                    <div style="font-size:0.75rem; color:var(--text-tertiary);">${emp.role} • ${emp.account}</div>
                </div>
                <div style="text-align:right; font-size:0.75rem;">
                    <div>Risk: <strong>${emp.riskScore}</strong></div>
                    <div>Impact: <strong>${emp.businessImpact}</strong></div>
                </div>
            </div>
        `;
    });
    html += '</div>';

    container.innerHTML = html;
}

// 3. Grade Mapping Pulse
function renderGradeMappingPulse(employees) {
    const container = document.getElementById('grade-mapping-container');
    if (!container) return;

    const mapped = employees.filter(e => e.gradeMappingStatus === 'Mapped').length;
    const pending = employees.filter(e => e.gradeMappingStatus === 'Pending').length;
    const total = employees.length;
    const mappedPct = Math.round((mapped / total) * 100);
    const pendingPct = 100 - mappedPct;

    // By origin
    const lvMapped = employees.filter(e => e.origin === 'LV' && e.gradeMappingStatus === 'Mapped').length;
    const lvTotal = employees.filter(e => e.origin === 'LV').length;
    const dpMapped = employees.filter(e => e.origin === 'DP' && e.gradeMappingStatus === 'Mapped').length;
    const dpTotal = employees.filter(e => e.origin === 'DP').length;

    let html = `
        <div style="margin-bottom:1.5rem;">
            <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
                <span style="font-weight:600;">Overall Progress</span>
                <span style="font-weight:700; font-family:var(--font-mono);">${mappedPct}% Mapped</span>
            </div>
            <div style="width:100%; height:32px; background:var(--status-danger); border-radius:8px; overflow:hidden; display:flex;">
                <div style="width:${mappedPct}%; background:var(--status-success); display:flex; align-items:center; justify-content:center; color:white; font-weight:600; font-size:0.75rem;">
                    ${mapped} Mapped
                </div>
                <div style="flex:1; display:flex; align-items:center; justify-content:center; color:white; font-weight:600; font-size:0.75rem;">
                    ${pending} Pending
                </div>
            </div>
        </div>

        <div style="display:grid; grid-template-columns:1fr 1fr; gap:1rem;">
            <div style="padding:1rem; background:var(--bg-secondary); border-radius:var(--radius-md); text-align:center;">
                <div style="font-size:0.75rem; color:var(--text-tertiary); margin-bottom:4px;">LatentView</div>
                <div style="font-size:1.5rem; font-weight:700; color:var(--lv-blue-600);">${Math.round((lvMapped / lvTotal) * 100)}%</div>
                <div style="font-size:0.75rem;">${lvMapped}/${lvTotal} mapped</div>
            </div>
            <div style="padding:1rem; background:var(--bg-secondary); border-radius:var(--radius-md); text-align:center;">
                <div style="font-size:0.75rem; color:var(--text-tertiary); margin-bottom:4px;">Decision Point</div>
                <div style="font-size:1.5rem; font-weight:700; color:var(--lv-accent-orange);">${Math.round((dpMapped / dpTotal) * 100)}%</div>
                <div style="font-size:0.75rem;">${dpMapped}/${dpTotal} mapped</div>
            </div>
        </div>

        <div style="margin-top:1rem; padding:0.75rem; background:${pendingPct > 50 ? 'rgba(220,38,38,0.1)' : 'rgba(16,185,129,0.1)'}; border-radius:var(--radius-md); font-size:0.875rem;">
            ${pendingPct > 50 ? '<strong>High uncertainty</strong> — ' + pending + ' employees await grade mapping. Prioritize HR completion.' : 'Grade mapping on track.'}
        </div>
    `;

    container.innerHTML = html;
}

// 4. Seniority Risk Pyramid
function renderSeniorityPyramid(employees) {
    const container = document.getElementById('seniority-pyramid-container');
    if (!container) return;

    const levels = {
        'Director': { count: 0, totalRisk: 0, color: 'var(--lv-navy-800)' },
        'Manager': { count: 0, totalRisk: 0, color: 'var(--lv-blue-600)' },
        'Sr Consultant': { count: 0, totalRisk: 0, color: 'var(--lv-blue-400)' },
        'Consultant': { count: 0, totalRisk: 0, color: '#93c5fd' },
        'Associate': { count: 0, totalRisk: 0, color: '#bfdbfe' }
    };

    employees.forEach(emp => {
        if (levels[emp.role]) {
            levels[emp.role].count++;
            levels[emp.role].totalRisk += emp.riskScore;
        }
    });

    // Calculate averages
    Object.values(levels).forEach(l => {
        l.avgRisk = l.count > 0 ? Math.round(l.totalRisk / l.count) : 0;
    });

    const maxCount = Math.max(...Object.values(levels).map(l => l.count), 1);
    const roleOrder = ['Director', 'Manager', 'Sr Consultant', 'Consultant', 'Associate'];

    let html = '<div style="display:flex; flex-direction:column; gap:8px; align-items:center;">';
    roleOrder.forEach((role, i) => {
        const data = levels[role];
        const widthPct = 30 + (i * 15); // Pyramid shape
        const riskColor = data.avgRisk >= 70 ? 'var(--status-danger)' : data.avgRisk >= 50 ? 'var(--lv-accent-orange)' : 'var(--status-success)';

        html += `
            <div style="width:${widthPct}%; background:${data.color}; color:white; padding:8px 12px; border-radius:4px; display:flex; justify-content:space-between; align-items:center;">
                <span style="font-weight:600; font-size:0.75rem;">${role}</span>
                <span style="font-size:0.75rem;">${data.count} <span style="background:${riskColor}; padding:2px 6px; border-radius:4px; font-weight:700;">Avg: ${data.avgRisk}</span></span>
            </div>
        `;
    });
    html += '</div>';

    // Find highest risk level
    const highestRiskLevel = roleOrder.reduce((prev, curr) =>
        levels[curr].avgRisk > levels[prev].avgRisk ? curr : prev
        , roleOrder[0]);

    html += `<div style="margin-top:1rem; padding:0.75rem; background:var(--bg-secondary); border-radius:var(--radius-md); font-size:0.875rem;">
        <strong>${highestRiskLevel}</strong> level shows highest avg risk (${levels[highestRiskLevel].avgRisk}) — focus retention efforts here.
    </div>`;

    container.innerHTML = html;
}
