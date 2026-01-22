/**
 * Google Sheets Setup Script
 * Run this once to set up all named ranges and api_aggregator formulas
 * 
 * Instructions:
 * 1. In Google Sheets, go to Extensions → Apps Script
 * 2. Delete any existing code
 * 3. Paste this entire script
 * 4. Click the disk icon to save
 * 5. Click "Run" button (select setupPhase1 function)
 * 6. Authorize the script when prompted
 * 7. Check the execution log for confirmation
 */

function setupPhase1() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  Logger.log('Starting Phase 1 setup...');
  
  // Step 1: Create Named Ranges
  createNamedRanges(ss);
  
  // Step 2: Set up api_aggregator formulas
  setupApiAggregator(ss);
  
  Logger.log('✅ Phase 1 setup complete!');
  Logger.log('Check the api_aggregator tab to verify formulas are working.');
  
  // Show success message
  SpreadsheetApp.getUi().alert(
    'Phase 1 Setup Complete!',
    '✅ Created 4 named ranges\n' +
    '✅ Added 4 api_aggregator formulas\n\n' +
    'Check the api_aggregator tab to see the calculated metrics.',
    SpreadsheetApp.getUi().ButtonSet.OK
  );
}

function createNamedRanges(ss) {
  Logger.log('Creating named ranges...');
  
  // Remove existing named ranges if they exist
  const existingRanges = ss.getNamedRanges();
  existingRanges.forEach(range => {
    const name = range.getName();
    if (['EmployeeRoster', 'AccountProjects', 'AttritionHistory', 'GradeMapping'].includes(name)) {
      range.remove();
      Logger.log('Removed existing range: ' + name);
    }
  });
  
  // Create EmployeeRoster
  const masterRoster = ss.getSheetByName('master_roster');
  if (masterRoster) {
    const lastRow = masterRoster.getLastRow();
    const range1 = masterRoster.getRange('A1:U' + lastRow);
    ss.setNamedRange('EmployeeRoster', range1);
    Logger.log('✅ Created EmployeeRoster (A1:U' + lastRow + ')');
  } else {
    Logger.log('⚠️ master_roster sheet not found');
  }
  
  // Create AccountProjects
  const accountProjects = ss.getSheetByName('account_projects');
  if (accountProjects) {
    const lastRow = accountProjects.getLastRow();
    const range2 = accountProjects.getRange('A1:P' + lastRow);
    ss.setNamedRange('AccountProjects', range2);
    Logger.log('✅ Created AccountProjects (A1:P' + lastRow + ')');
  } else {
    Logger.log('⚠️ account_projects sheet not found');
  }
  
  // Create AttritionHistory
  const attritionLogs = ss.getSheetByName('attrition_logs');
  if (attritionLogs) {
    const lastRow = Math.max(attritionLogs.getLastRow(), 10);
    const range3 = attritionLogs.getRange('A1:I' + lastRow);
    ss.setNamedRange('AttritionHistory', range3);
    Logger.log('✅ Created AttritionHistory (A1:I' + lastRow + ')');
  } else {
    Logger.log('⚠️ attrition_logs sheet not found');
  }
  
  // Create GradeMapping
  const gradeMapping = ss.getSheetByName('grade_mapping');
  if (gradeMapping) {
    const lastRow = Math.max(gradeMapping.getLastRow(), 10);
    const range4 = gradeMapping.getRange('A1:E' + lastRow);
    ss.setNamedRange('GradeMapping', range4);
    Logger.log('✅ Created GradeMapping (A1:E' + lastRow + ')');
  } else {
    Logger.log('⚠️ grade_mapping sheet not found');
  }
}

function setupApiAggregator(ss) {
  Logger.log('Setting up api_aggregator formulas...');
  
  const apiSheet = ss.getSheetByName('api_aggregator');
  if (!apiSheet) {
    Logger.log('⚠️ api_aggregator sheet not found');
    return;
  }
  
  // Clear existing data (except headers)
  const lastRow = apiSheet.getLastRow();
  if (lastRow > 1) {
    apiSheet.getRange(2, 1, lastRow - 1, 3).clear();
  }
  
  // Add formulas
  const formulas = [
    ['overall_health_score', '=ROUND(100-AVERAGE(master_roster!N:N),0)', '=NOW()'],
    ['total_revenue_at_risk', '=SUMIF(master_roster!N:N,">=70",master_roster!S:S)', '=NOW()'],
    ['high_risk_count', '=COUNTIF(master_roster!N:N,">=75")', '=NOW()'],
    ['grade_mapping_pct', '=COUNTIF(master_roster!L:L,"Mapped")/COUNTA(master_roster!L:L)*100', '=NOW()']
  ];
  
  // Write formulas to sheet
  apiSheet.getRange(2, 1, formulas.length, 3).setValues(formulas);
  
  Logger.log('✅ Added 4 formulas to api_aggregator');
  
  // Format the sheet
  apiSheet.getRange('B2:B5').setNumberFormat('0');
  apiSheet.getRange('C2:C5').setNumberFormat('yyyy-mm-dd hh:mm:ss');
  
  Logger.log('✅ Formatted cells');
}

/**
 * Test function to verify named ranges
 */
function testNamedRanges() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const ranges = ss.getNamedRanges();
  
  Logger.log('Named Ranges:');
  ranges.forEach(range => {
    Logger.log('- ' + range.getName() + ': ' + range.getRange().getA1Notation());
  });
}
