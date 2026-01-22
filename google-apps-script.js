/**
 * Google Apps Script - Integration Pulse API
 * 
 * This script exposes Google Sheets data as a JSON API endpoint.
 * Deploy as Web App with "Anyone" access to use with the dashboard.
 * 
 * Setup Instructions:
 * 1. Open your Google Sheet
 * 2. Extensions → Apps Script
 * 3. Paste this code
 * 4. Save (Ctrl+S)
 * 5. Deploy → New deployment
 * 6. Type: Web app
 * 7. Execute as: Me
 * 8. Who has access: Anyone
 * 9. Deploy
 * 10. Copy the Web App URL
 */

function doGet(e) {
    try {
        const ss = SpreadsheetApp.getActiveSpreadsheet();

        // Fetch all sheets
        const data = {
            metrics: sheetToJson(ss.getSheetByName('api_aggregator')),
            employees: sheetToJson(ss.getSheetByName('master_roster')),
            accounts: sheetToJson(ss.getSheetByName('account_projects')),
            attrition: sheetToJson(ss.getSheetByName('attrition_logs')),
            gradeMapping: sheetToJson(ss.getSheetByName('grade_mapping')),
            attritionTrends: sheetToJson(ss.getSheetByName('attrition_trends')), // NEW
            timestamp: new Date().toISOString(),
            status: 'success'
        };

        return ContentService
            .createTextOutput(JSON.stringify(data))
            .setMimeType(ContentService.MimeType.JSON);

    } catch (error) {
        // Return error as JSON
        const errorResponse = {
            status: 'error',
            message: error.message,
            timestamp: new Date().toISOString()
        };

        return ContentService
            .createTextOutput(JSON.stringify(errorResponse))
            .setMimeType(ContentService.MimeType.JSON);
    }
}

/**
 * Convert a Google Sheet to JSON array
 * @param {Sheet} sheet - The sheet to convert
 * @returns {Array} Array of objects with column headers as keys
 */
function sheetToJson(sheet) {
    if (!sheet) {
        Logger.log('Warning: Sheet not found');
        return [];
    }

    const data = sheet.getDataRange().getValues();

    if (data.length === 0) {
        Logger.log('Warning: Sheet is empty');
        return [];
    }

    // First row is headers
    const headers = data[0];

    // Convert remaining rows to objects
    return data.slice(1).map(row => {
        const obj = {};
        headers.forEach((header, i) => {
            // Convert empty cells to null
            obj[header] = row[i] === '' ? null : row[i];
        });
        return obj;
    });
}

/**
 * Test function - run this to verify your setup
 * View → Logs to see output
 */
function testAPI() {
    const result = doGet();
    const data = JSON.parse(result.getContent());

    Logger.log('API Test Results:');
    Logger.log('Status: ' + data.status);
    Logger.log('Employees: ' + (data.employees ? data.employees.length : 0));
    Logger.log('Accounts: ' + (data.accounts ? data.accounts.length : 0));
    Logger.log('Metrics: ' + (data.metrics ? data.metrics.length : 0));

    if (data.status === 'success') {
        Logger.log('✅ API is working correctly!');
    } else {
        Logger.log('❌ API error: ' + data.message);
    }
}
