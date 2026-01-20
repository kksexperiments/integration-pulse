document.addEventListener('DOMContentLoaded', () => {
    loadActionData();
});

async function loadActionData() {
    try {
        if (typeof RAW_DATA === 'undefined') {
            console.error('RAW_DATA not found.');
            return;
        }

        const talent = RAW_DATA.talent;
        const accounts = RAW_DATA.accounts;

        // Generate actions from data
        const actions = generateActions(talent, accounts);

        renderStats(actions);
        renderActions(actions);

    } catch (error) {
        console.error('Error loading data:', error);
    }
}

function generateActions(talent, accounts) {
    const actions = [];
    const today = new Date();

    // 1. High-risk, high-impact individuals need retention
    talent
        .filter(e => e.riskScore >= 75 && e.businessImpact >= 80)
        .slice(0, 5)
        .forEach((emp, i) => {
            actions.push({
                id: `ret-${emp.id}`,
                type: 'retention',
                priority: 'urgent',
                title: `Retention Package: ${emp.name}`,
                description: `${emp.role} at ${emp.account}`,
                tags: ['Retention', emp.account],
                impact: emp.revenueAtRisk,
                status: i === 0 ? 'progress' : 'priority',
                origin: emp.origin,
                daysAgo: Math.floor(Math.random() * 7)
            });
        });

    // 2. Compensation gaps
    talent
        .filter(e => e.signals && e.signals.includes('comp_gap'))
        .slice(0, 4)
        .forEach((emp, i) => {
            actions.push({
                id: `comp-${emp.id}`,
                type: 'compensation',
                priority: i < 2 ? 'high' : 'normal',
                title: `Comp Review: ${emp.name}`,
                description: `Address compensation gap - ${emp.role}`,
                tags: ['Compensation', emp.origin],
                impact: emp.revenueAtRisk * 0.5,
                status: i === 0 ? 'progress' : 'priority',
                origin: emp.origin,
                daysAgo: Math.floor(Math.random() * 10) + 1
            });
        });

    // 3. Grade mapping pending (high risk + pending)
    talent
        .filter(e => e.gradeMappingStatus === 'Pending' && e.riskScore > 70)
        .slice(0, 3)
        .forEach((emp, i) => {
            actions.push({
                id: `grade-${emp.id}`,
                type: 'culture',
                priority: 'high',
                title: `Grade Mapping: ${emp.name}`,
                description: `Expedite grade alignment - ${emp.role}`,
                tags: ['Culture', 'Integration'],
                impact: emp.revenueAtRisk * 0.3,
                status: 'priority',
                origin: emp.origin,
                daysAgo: Math.floor(Math.random() * 5)
            });
        });

    // 4. Account-level interventions (high-risk accounts)
    accounts
        .filter(a => a.peopleRiskScore > 48)
        .forEach((acc, i) => {
            actions.push({
                id: `acc-${acc.name}`,
                type: 'account',
                priority: i === 0 ? 'urgent' : 'high',
                title: `Account Review: ${acc.name}`,
                description: `$${(acc.revenueAtRisk / 1000000).toFixed(1)}M at risk - team stabilization needed`,
                tags: ['Account', 'Strategic'],
                impact: acc.revenueAtRisk,
                status: i < 2 ? 'progress' : 'priority',
                daysAgo: Math.floor(Math.random() * 14)
            });
        });

    // 5. Completed actions (simulated)
    const completed = [
        { id: 'c1', title: 'Day 1 Communications', description: 'Sent to all employees', daysAgo: 42, tags: ['Culture'] },
        { id: 'c2', title: 'Leadership Town Hall', description: 'Joint CEO address', daysAgo: 35, tags: ['Culture'] },
        { id: 'c3', title: 'Benefits Alignment', description: 'Unified benefits package', daysAgo: 28, tags: ['Compensation'] },
        { id: 'c4', title: 'Systems Access', description: 'Email and tools provisioned', daysAgo: 40, tags: ['Integration'] },
        { id: 'c5', title: 'Org Chart Published', description: 'New structure communicated', daysAgo: 21, tags: ['Integration'] },
    ];

    completed.forEach(c => {
        actions.push({ ...c, status: 'completed', priority: 'normal' });
    });

    return actions;
}

function renderStats(actions) {
    const priority = actions.filter(a => a.status === 'priority').length;
    const progress = actions.filter(a => a.status === 'progress').length;
    const completed = actions.filter(a => a.status === 'completed').length;
    const totalRevenue = actions
        .filter(a => a.status !== 'completed' && a.impact)
        .reduce((sum, a) => sum + a.impact, 0);

    const container = document.getElementById('action-stats');
    container.innerHTML = `
        <div class="action-stat">
            <div class="as-value" style="color: var(--status-danger);">${priority}</div>
            <div class="as-label">Priority Actions</div>
        </div>
        <div class="action-stat">
            <div class="as-value" style="color: var(--lv-accent-orange);">${progress}</div>
            <div class="as-label">In Progress</div>
        </div>
        <div class="action-stat">
            <div class="as-value" style="color: var(--status-success);">${completed}</div>
            <div class="as-label">Completed</div>
        </div>
        <div class="action-stat">
            <div class="as-value" style="color: var(--lv-blue-600);">$${(totalRevenue / 1000000).toFixed(1)}M</div>
            <div class="as-label">Revenue to Protect</div>
        </div>
    `;
}

function renderActions(actions) {
    const priorityContainer = document.getElementById('priority-actions');
    const progressContainer = document.getElementById('progress-actions');
    const completedContainer = document.getElementById('completed-actions');

    const priorityActions = actions.filter(a => a.status === 'priority').sort((a, b) => {
        const order = { urgent: 0, high: 1, normal: 2 };
        return order[a.priority] - order[b.priority];
    });
    const progressActions = actions.filter(a => a.status === 'progress');
    const completedActions = actions.filter(a => a.status === 'completed');

    // Update counts
    document.getElementById('priority-count').textContent = priorityActions.length;
    document.getElementById('progress-count').textContent = progressActions.length;
    document.getElementById('completed-count').textContent = completedActions.length;

    // Render Priority
    priorityContainer.innerHTML = priorityActions.length === 0
        ? '<div style="text-align:center; color:var(--text-tertiary); padding:2rem;">No priority actions</div>'
        : priorityActions.map(a => renderActionItem(a)).join('');

    // Render Progress
    progressContainer.innerHTML = progressActions.length === 0
        ? '<div style="text-align:center; color:var(--text-tertiary); padding:2rem;">No in-progress actions</div>'
        : progressActions.map(a => renderActionItem(a)).join('');

    // Render Completed
    completedContainer.innerHTML = completedActions.map(a => `
        <div class="completed-item">
            <div class="completed-check">✓</div>
            <div style="flex:1;">
                <div style="font-weight:600; font-size:0.875rem;">${a.title}</div>
                <div style="font-size:0.75rem; color:var(--text-tertiary);">${a.description}</div>
            </div>
            <div style="font-size:0.75rem; color:var(--text-tertiary);">${a.daysAgo}d ago</div>
        </div>
    `).join('');

    // Update progress bar
    const total = actions.length;
    const pct = Math.round((completedActions.length / total) * 100);
    document.getElementById('progress-pct').textContent = `${pct}%`;
    document.getElementById('progress-fill').style.width = `${pct}%`;
}

function renderActionItem(action) {
    const priorityClass = `priority-${action.priority}`;
    const itemClass = action.priority === 'urgent' ? 'urgent' : action.priority === 'high' ? 'high' : 'normal';

    const tagsHtml = (action.tags || []).map(tag => {
        let tagClass = 'tag-retention';
        if (tag.includes('Comp')) tagClass = 'tag-comp';
        if (tag.includes('Culture') || tag.includes('Integration')) tagClass = 'tag-culture';
        if (tag.includes('Account') || tag.includes('Strategic')) tagClass = 'tag-account';
        if (action.priority === 'urgent') tagClass = 'tag-urgent';
        return `<span class="action-tag ${tagClass}">${tag}</span>`;
    }).join('');

    const impactHtml = action.impact
        ? `<div class="action-impact">
               <div class="impact-value" style="color:${action.priority === 'urgent' ? 'var(--status-danger)' : 'var(--lv-navy-800)'}">$${(action.impact / 1000).toFixed(0)}K</div>
               <div class="impact-label">at risk</div>
           </div>`
        : '';

    return `
        <div class="action-item ${itemClass}">
            <div class="action-priority ${priorityClass}">
                ${action.priority === 'urgent' ? '!' : action.priority === 'high' ? '↑' : '•'}
            </div>
            <div class="action-info">
                <div class="action-title">${action.title}</div>
                <div class="action-meta">${action.description}</div>
                <div class="action-tags">${tagsHtml}</div>
            </div>
            ${impactHtml}
        </div>
    `;
}
