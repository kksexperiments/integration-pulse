/**
 * Data Migration Helper
 * 
 * This script helps convert the mock data from data.js
 * into a format ready for Google Sheets.
 * 
 * Usage:
 * 1. Open browser console on your dashboard
 * 2. Copy and paste this entire script
 * 3. Run: exportToCSV('employees') or exportToCSV('accounts')
 * 4. Copy the output
 * 5. Paste into Google Sheets
 */

function exportToCSV(dataType) {
    let data, headers;

    if (dataType === 'employees') {
        data = RAW_DATA.employees;
        headers = [
            'employee_id',
            'employee_name',
            'role',
            'origin',
            'function',
            'geography',
            'tenure_years',
            'manager_id',
            'account_name',
            'grade_legacy',
            'grade_unified',
            'grade_mapping_status',
            'base_salary',
            'risk_score',
            'business_impact',
            'signal_manager_flag',
            'signal_comp_gap',
            'signal_peer_departed',
            'revenue_at_risk',
            'hire_date',
            'status'
        ];
    } else if (dataType === 'accounts') {
        data = RAW_DATA.accounts;
        headers = [
            'account_name',
            'total_revenue',
            'renewal_date',
            'team_size',
            'people_risk_score',
            'revenue_at_risk',
            'margin_percent',
            'primary_contact_id',
            'sow_1_name',
            'sow_1_value',
            'sow_1_headcount',
            'sow_1_at_risk',
            'sow_2_name',
            'sow_2_value',
            'sow_2_headcount',
            'sow_2_at_risk'
        ];
    } else {
        console.error('Invalid data type. Use "employees" or "accounts"');
        return;
    }

    // Create CSV
    const rows = [headers.join('\t')];

    data.forEach(item => {
        const row = headers.map(header => {
            let value = item[header];

            // Handle special cases
            if (value === undefined || value === null) {
                return '';
            }

            // Convert arrays to comma-separated
            if (Array.isArray(value)) {
                return value.join(', ');
            }

            // Convert booleans to TRUE/FALSE
            if (typeof value === 'boolean') {
                return value ? 'TRUE' : 'FALSE';
            }

            return value;
        });

        rows.push(row.join('\t'));
    });

    const csv = rows.join('\n');

    console.log('=== COPY BELOW THIS LINE ===');
    console.log(csv);
    console.log('=== COPY ABOVE THIS LINE ===');
    console.log(`\n✅ ${data.length} ${dataType} exported`);
    console.log('📋 Copy the output above and paste into Google Sheets');

    return csv;
}

/**
 * Generate sample api_aggregator data
 */
function generateAggregatorData() {
    const metrics = [
        { metric_name: 'overall_health_score', metric_value: 72, last_updated: new Date().toISOString() },
        { metric_name: 'total_revenue_at_risk', metric_value: 2800000, last_updated: new Date().toISOString() },
        { metric_name: 'high_risk_count', metric_value: 15, last_updated: new Date().toISOString() },
        { metric_name: 'grade_mapping_pct', metric_value: 65, last_updated: new Date().toISOString() },
        { metric_name: 'avg_attrition_6mo', metric_value: 8.5, last_updated: new Date().toISOString() }
    ];

    const headers = ['metric_name', 'metric_value', 'last_updated'];
    const rows = [headers.join('\t')];

    metrics.forEach(m => {
        rows.push([m.metric_name, m.metric_value, m.last_updated].join('\t'));
    });

    const csv = rows.join('\n');

    console.log('=== API AGGREGATOR DATA ===');
    console.log(csv);
    console.log('=== END ===');

    return csv;
}

/**
 * Quick test to verify data structure
 */
function testDataStructure() {
    console.log('Testing data structure...');

    if (!window.RAW_DATA) {
        console.error('❌ RAW_DATA not found. Make sure data.js is loaded.');
        return;
    }

    console.log('✅ RAW_DATA found');
    console.log(`   Employees: ${RAW_DATA.employees?.length || 0}`);
    console.log(`   Accounts: ${RAW_DATA.accounts?.length || 0}`);

    if (RAW_DATA.employees?.length > 0) {
        console.log('\n📊 Sample employee:', RAW_DATA.employees[0]);
    }

    if (RAW_DATA.accounts?.length > 0) {
        console.log('\n📊 Sample account:', RAW_DATA.accounts[0]);
    }

    console.log('\n✅ Ready to export!');
    console.log('   Run: exportToCSV("employees")');
    console.log('   Run: exportToCSV("accounts")');
}

// Auto-run test on load
console.log('📦 Data Migration Helper loaded');
console.log('   Run: testDataStructure()');
console.log('   Run: exportToCSV("employees")');
console.log('   Run: exportToCSV("accounts")');
console.log('   Run: generateAggregatorData()');
