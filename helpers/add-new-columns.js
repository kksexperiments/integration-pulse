/**
 * Helper Script: Add New Columns to Master Roster
 * 
 * This script generates sample data for the new columns needed to calculate sub-scores.
 * Run this in the browser console on the export-helper.html page.
 * 
 * New Columns:
 * - performance_rating (1-5)
 * - engagement_score (0-100)
 * - tenure_bucket (0-1yr, 1-3yr, 3-5yr, 5+yr)
 * - cost_efficiency (Below, At, Above)
 */

// Load existing employee data
const employees = RAW_DATA.talent;

// Generate new columns with realistic sample data
const enhancedEmployees = employees.map(emp => {
    // Performance rating (1-5) - inversely correlated with risk score
    const performanceRating = emp.riskScore > 80 ? Math.floor(Math.random() * 2) + 1 : // High risk = 1-2
        emp.riskScore > 50 ? Math.floor(Math.random() * 2) + 3 : // Medium risk = 3-4
            Math.floor(Math.random() * 2) + 4; // Low risk = 4-5

    // Engagement score (0-100) - also inversely correlated with risk
    const engagementScore = Math.max(0, Math.min(100,
        100 - emp.riskScore + (Math.random() * 20 - 10)
    ));

    // Tenure bucket based on tenure years
    const tenureBucket = emp.tenure < 1 ? '0-1yr' :
        emp.tenure < 3 ? '1-3yr' :
            emp.tenure < 5 ? '3-5yr' : '5+yr';

    // Cost efficiency - random distribution
    const costEfficiencyRand = Math.random();
    const costEfficiency = costEfficiencyRand < 0.4 ? 'Below' :
        costEfficiencyRand < 0.8 ? 'At' : 'Above';

    return {
        employee_id: emp.id,
        employee_name: emp.name,
        role: emp.role,
        origin: emp.origin,
        function: emp.function,
        geography: emp.geography,
        tenure_years: emp.tenure,
        manager_id: emp.managerId,
        account_name: emp.account,
        grade_legacy: emp.gradeLegacy,
        grade_unified: emp.gradeUnified,
        grade_mapping_status: emp.gradeMappingStatus,
        base_salary: emp.baseSalary,
        risk_score: emp.riskScore,
        business_impact: emp.businessImpact,
        signal_manager_flag: emp.signals.includes('manager_flag') ? 'TRUE' : 'FALSE',
        signal_comp_gap: emp.signals.includes('comp_gap') ? 'TRUE' : 'FALSE',
        signal_peer_departed: emp.signals.includes('peer_departed') ? 'TRUE' : 'FALSE',
        revenue_at_risk: emp.revenueAtRisk,
        hire_date: emp.hireDate ? emp.hireDate.toISOString().split('T')[0] : null,
        status: emp.status,
        // NEW COLUMNS
        performance_rating: performanceRating,
        engagement_score: Math.round(engagementScore),
        tenure_bucket: tenureBucket,
        cost_efficiency: costEfficiency
    };
});

// Convert to CSV
function arrayToCSV(data) {
    if (data.length === 0) return '';

    const headers = Object.keys(data[0]);
    const csvRows = [];

    // Add header row
    csvRows.push(headers.join(','));

    // Add data rows
    for (const row of data) {
        const values = headers.map(header => {
            const value = row[header];
            // Handle null/undefined
            if (value === null || value === undefined) return '';
            // Escape values with commas or quotes
            const stringValue = String(value);
            if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
                return `"${stringValue.replace(/"/g, '""')}"`;
            }
            return stringValue;
        });
        csvRows.push(values.join(','));
    }

    return csvRows.join('\n');
}

const csv = arrayToCSV(enhancedEmployees);

console.log('✅ Enhanced employee data generated!');
console.log(`📊 Total rows: ${enhancedEmployees.length}`);
console.log('\n📋 New columns added:');
console.log('- performance_rating (1-5)');
console.log('- engagement_score (0-100)');
console.log('- tenure_bucket (0-1yr, 1-3yr, 3-5yr, 5+yr)');
console.log('- cost_efficiency (Below, At, Above)');
console.log('\n📝 CSV ready to copy!');
console.log('Run: copy(csv) to copy to clipboard');

// Make csv available globally
window.enhancedEmployeeCSV = csv;
window.enhancedEmployees = enhancedEmployees;

// Helper function to copy to clipboard
window.copyEnhancedData = function () {
    navigator.clipboard.writeText(csv).then(() => {
        console.log('✅ Copied to clipboard! Paste into Google Sheets.');
    });
};

console.log('\n🚀 To copy: copyEnhancedData()');
