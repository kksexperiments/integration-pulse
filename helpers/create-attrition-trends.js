/**
 * Helper Script: Create Attrition Trends Data
 * 
 * This script generates attrition trends data for the past 2 fiscal years.
 * Run this in the browser console on the export-helper.html page.
 */

// Generate attrition trends for 2 fiscal years (Apr-Mar)
function generateAttritionTrends() {
    const trends = [];
    const months = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'];

    // Previous year (2024-2025): Apr 2024 - Mar 2025
    const previousYearData = [2, 3, 2, 4, 3, 5, 4, 6, 5, 7, 6, 8];
    let headcount = 320;

    previousYearData.forEach((count, index) => {
        const month = months[index];
        const fiscalYear = '2024-2025';
        const monthDate = index < 9 ? `2024-${String(index + 4).padStart(2, '0')}` :
            `2025-${String(index - 8).padStart(2, '0')}`;

        trends.push({
            fiscal_year: fiscalYear,
            month: month,
            month_date: `${monthDate}-01`,
            attrition_count: count,
            headcount: headcount,
            attrition_rate: ((count / headcount) * 100).toFixed(2)
        });

        headcount += Math.floor(Math.random() * 3) - 1; // Slight variation
    });

    // Current year (2025-2026): Apr 2025 - Jan 2026 (partial)
    const currentYearData = [3, 4, 3, 5, 4, 6, 5, 7, 6, 8, 7]; // Jan is latest
    headcount = 340;

    currentYearData.forEach((count, index) => {
        const month = months[index];
        const fiscalYear = '2025-2026';
        const monthDate = index < 9 ? `2025-${String(index + 4).padStart(2, '0')}` :
            `2026-${String(index - 8).padStart(2, '0')}`;

        trends.push({
            fiscal_year: fiscalYear,
            month: month,
            month_date: `${monthDate}-01`,
            attrition_count: count,
            headcount: headcount,
            attrition_rate: ((count / headcount) * 100).toFixed(2)
        });

        headcount += Math.floor(Math.random() * 4); // Growing headcount
    });

    return trends;
}

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
            if (value === null || value === undefined) return '';
            return String(value);
        });
        csvRows.push(values.join(','));
    }

    return csvRows.join('\n');
}

const attritionTrends = generateAttritionTrends();
const csv = arrayToCSV(attritionTrends);

console.log('✅ Attrition trends data generated!');
console.log(`📊 Total rows: ${attritionTrends.length}`);
console.log('\n📋 Columns:');
console.log('- fiscal_year (2024-2025, 2025-2026)');
console.log('- month (Apr-Mar)');
console.log('- month_date (YYYY-MM-01)');
console.log('- attrition_count (departures)');
console.log('- headcount (total employees)');
console.log('- attrition_rate (percentage)');
console.log('\n📝 CSV ready to copy!');

// Make csv available globally
window.attritionTrendsCSV = csv;
window.attritionTrends = attritionTrends;

// Helper function to copy to clipboard
window.copyAttritionData = function () {
    navigator.clipboard.writeText(csv).then(() => {
        console.log('✅ Copied to clipboard! Paste into Google Sheets.');
    });
};

console.log('\n🚀 To copy: copyAttritionData()');

// Also log sample data
console.log('\n📊 Sample data:');
console.table(attritionTrends.slice(0, 5));
