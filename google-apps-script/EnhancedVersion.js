/**
 * ENHANCED VERSION with Custom Sidebar UI
 *
 * This version includes all the functionality from NeoserraIntegration.js
 * PLUS a custom sidebar for easier interaction
 *
 * To use: Replace the entire code in your Apps Script with this file
 */

// Configuration
const NEOSERRA_CONFIG = {
  apiUrl: 'https://norcal.neoserra.com/api/v1/',
  apiToken: 'b4afa19f-c2f5-45c5-89b0-82ce7bc79145'
};

/**
 * Makes an authenticated request to the Neoserra API
 */
function neoserraRequest(endpoint, method, data) {
  const url = NEOSERRA_CONFIG.apiUrl + endpoint;

  const options = {
    'method': method,
    'headers': {
      'Authorization': 'Bearer ' + NEOSERRA_CONFIG.apiToken,
      'Content-Type': 'application/json',
      'User-Agent': 'Google-Apps-Script'
    },
    'muteHttpExceptions': true
  };

  if (method === 'POST' && data) {
    options.payload = JSON.stringify(data);
  }

  try {
    const response = UrlFetchApp.fetch(url, options);
    const responseCode = response.getResponseCode();
    const responseBody = response.getContentText();

    if (responseCode === 200 || responseCode === 201) {
      return JSON.parse(responseBody);
    } else {
      throw new Error('API Error ' + responseCode + ': ' + responseBody);
    }
  } catch (error) {
    Logger.log('Error: ' + error.toString());
    throw error;
  }
}

/**
 * Creates a new client record in Neoserra from sheet data
 */
function createClientFromRow(row) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Clients');
  const data = sheet.getRange(row, 1, 1, 10).getValues()[0];

  const clientData = {
    client: data[0],
    company: data[1],
    type2: data[2] || 'AC',
    physaddr: data[3],
    physcity: data[4],
    physst: data[5],
    physzip: data[6],
    emailingLists: true
  };

  if (data[7]) clientData.busphone = data[7];
  if (data[8]) clientData.busemail = data[8];
  if (data[9]) clientData.url = data[9];

  try {
    const response = neoserraRequest('clients/new', 'POST', clientData);
    sheet.getRange(row, 11).setValue('Success: ' + new Date().toISOString());
    return response;
  } catch (error) {
    sheet.getRange(row, 11).setValue('Error: ' + error.message);
    throw error;
  }
}

/**
 * Processes all new clients in the sheet
 */
function createAllNewClients() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Clients');
  if (!sheet) {
    SpreadsheetApp.getUi().alert('Error', 'Please create a "Clients" sheet first.', SpreadsheetApp.getUi().ButtonSet.OK);
    return { success: 0, errors: 0 };
  }

  const lastRow = sheet.getLastRow();
  let successCount = 0;
  let errorCount = 0;

  for (let row = 2; row <= lastRow; row++) {
    const status = sheet.getRange(row, 11).getValue();

    if (!status) {
      try {
        createClientFromRow(row);
        successCount++;
        SpreadsheetApp.flush();
        Utilities.sleep(500);
      } catch (error) {
        errorCount++;
        Logger.log('Error processing row ' + row + ': ' + error.toString());
      }
    }
  }

  SpreadsheetApp.getUi().alert(
    'Processing Complete',
    'Successfully created ' + successCount + ' clients.\nErrors: ' + errorCount,
    SpreadsheetApp.getUi().ButtonSet.OK
  );

  return { success: successCount, errors: errorCount };
}

/**
 * Fetches training events for the current month
 */
function fetchTrainingEventsThisMonth() {
  const now = new Date();
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  const startDate = Utilities.formatDate(firstDay, 'America/Los_Angeles', 'yyyy-MM-dd');
  const endDate = Utilities.formatDate(lastDay, 'America/Los_Angeles', 'yyyy-MM-dd');

  const endpoint = 'events?startDate=' + encodeURIComponent(startDate) +
                   '&endDate=' + encodeURIComponent(endDate);

  try {
    const response = neoserraRequest(endpoint, 'GET', null);

    let sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Training Events');
    if (!sheet) {
      sheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet('Training Events');
    } else {
      sheet.clear();
    }

    const headers = [
      'Event ID', 'Title', 'Start Date', 'End Date', 'Format', 'Status',
      'Total Hours', 'Location City', 'Location State', 'Max Attendees',
      'Topics', 'Description'
    ];
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');

    if (response && response.rows && response.rows.length > 0) {
      const rows = [];

      response.rows.forEach(function(event) {
        rows.push([
          event.conference || '',
          event.title || '',
          event.startDate || '',
          event.endDate || '',
          event.format || '',
          event.confstatus || '',
          event.hours || '',
          event.locCity || '',
          event.locState || '',
          event.maxAttendees || '',
          event.topics ? event.topics.join(', ') : '',
          event.text || ''
        ]);
      });

      sheet.getRange(2, 1, rows.length, headers.length).setValues(rows);

      SpreadsheetApp.getUi().alert(
        'Success',
        'Fetched ' + rows.length + ' training events for ' +
        Utilities.formatDate(firstDay, 'America/Los_Angeles', 'MMMM yyyy'),
        SpreadsheetApp.getUi().ButtonSet.OK
      );

      return { count: rows.length, month: Utilities.formatDate(firstDay, 'America/Los_Angeles', 'MMMM yyyy') };
    } else {
      SpreadsheetApp.getUi().alert(
        'No Events',
        'No training events found for ' +
        Utilities.formatDate(firstDay, 'America/Los_Angeles', 'MMMM yyyy'),
        SpreadsheetApp.getUi().ButtonSet.OK
      );
      return { count: 0, month: Utilities.formatDate(firstDay, 'America/Los_Angeles', 'MMMM yyyy') };
    }

  } catch (error) {
    SpreadsheetApp.getUi().alert(
      'Error',
      'Failed to fetch training events: ' + error.message,
      SpreadsheetApp.getUi().ButtonSet.OK
    );
    Logger.log('Error fetching events: ' + error.toString());
    throw error;
  }
}

/**
 * Fetches training events for a custom date range
 */
function fetchTrainingEventsCustom(startDate, endDate) {
  const endpoint = 'events?startDate=' + encodeURIComponent(startDate) +
                   '&endDate=' + encodeURIComponent(endDate);

  try {
    const response = neoserraRequest(endpoint, 'GET', null);

    let sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Training Events');
    if (!sheet) {
      sheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet('Training Events');
    } else {
      sheet.clear();
    }

    const headers = [
      'Event ID', 'Title', 'Start Date', 'End Date', 'Format', 'Status',
      'Total Hours', 'Location City', 'Location State', 'Max Attendees',
      'Topics', 'Description'
    ];
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');

    if (response && response.rows && response.rows.length > 0) {
      const rows = [];

      response.rows.forEach(function(event) {
        rows.push([
          event.conference || '',
          event.title || '',
          event.startDate || '',
          event.endDate || '',
          event.format || '',
          event.confstatus || '',
          event.hours || '',
          event.locCity || '',
          event.locState || '',
          event.maxAttendees || '',
          event.topics ? event.topics.join(', ') : '',
          event.text || ''
        ]);
      });

      sheet.getRange(2, 1, rows.length, headers.length).setValues(rows);
      return { success: true, count: rows.length };
    } else {
      return { success: true, count: 0 };
    }

  } catch (error) {
    Logger.log('Error fetching events: ' + error.toString());
    return { success: false, error: error.message };
  }
}

/**
 * Creates custom menu
 */
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('Neoserra')
    .addItem('📊 Open Control Panel', 'showSidebar')
    .addSeparator()
    .addItem('➕ Create All New Clients', 'createAllNewClients')
    .addItem('📅 Fetch Training Events (This Month)', 'fetchTrainingEventsThisMonth')
    .addSeparator()
    .addItem('🔌 Test API Connection', 'testApiConnection')
    .addToUi();
}

/**
 * Shows custom sidebar
 */
function showSidebar() {
  const html = HtmlService.createHtmlOutputFromFile('Sidebar')
    .setTitle('Neoserra Control Panel')
    .setWidth(300);
  SpreadsheetApp.getUi().showSidebar(html);
}

/**
 * Tests API connection
 */
function testApiConnection() {
  try {
    const response = neoserraRequest('centers', 'GET', null);
    SpreadsheetApp.getUi().alert(
      'API Connection Successful',
      'Successfully connected to Neoserra API!',
      SpreadsheetApp.getUi().ButtonSet.OK
    );
    return { success: true };
  } catch (error) {
    SpreadsheetApp.getUi().alert(
      'API Connection Failed',
      'Error: ' + error.message,
      SpreadsheetApp.getUi().ButtonSet.OK
    );
    return { success: false, error: error.message };
  }
}

/**
 * Gets count of pending clients
 */
function getPendingClientCount() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Clients');
  if (!sheet) return 0;

  const lastRow = sheet.getLastRow();
  let count = 0;

  for (let row = 2; row <= lastRow; row++) {
    const status = sheet.getRange(row, 11).getValue();
    if (!status) count++;
  }

  return count;
}
