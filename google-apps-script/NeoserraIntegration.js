/**
 * Neoserra API Integration for Google Sheets
 *
 * This script enables Google Sheets to:
 * 1. Create new client records in Neoserra
 * 2. Fetch training events for the current month
 */

// Configuration
const NEOSERRA_CONFIG = {
  apiUrl: 'https://norcal.neoserra.com/api/v1/',
  apiToken: 'b4afa19f-c2f5-45c5-89b0-82ce7bc79145'
};

/**
 * Makes an authenticated request to the Neoserra API
 *
 * @param {string} endpoint - API endpoint (e.g., 'clients/new')
 * @param {string} method - HTTP method (GET or POST)
 * @param {object} data - Data to send (for POST requests)
 * @return {object} Parsed JSON response
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
 *
 * Sheet columns expected:
 * A: Client ID (unique identifier)
 * B: Company Name
 * C: Client Type (AC, IC, PC, PI, 10)
 * D: Physical Address
 * E: City
 * F: State (2-letter code)
 * G: ZIP Code
 * H: Phone Number (optional)
 * I: Email Address (optional)
 * J: Website URL (optional)
 *
 * @param {number} row - Row number to process (starting from 2, assuming row 1 is headers)
 * @return {object} Response from Neoserra API
 */
function createClientFromRow(row) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Clients');
  const data = sheet.getRange(row, 1, 1, 10).getValues()[0];

  const clientData = {
    client: data[0],              // Client ID
    company: data[1],             // Company Name
    type2: data[2] || 'AC',       // Client Type (default: Active Client)
    physaddr: data[3],            // Physical Address
    physcity: data[4],            // City
    physst: data[5],              // State
    physzip: data[6],             // ZIP Code
    emailingLists: true           // Subscribe to emails
  };

  // Optional fields
  if (data[7]) clientData.busphone = data[7];   // Phone
  if (data[8]) clientData.busemail = data[8];   // Email
  if (data[9]) clientData.url = data[9];        // Website

  try {
    const response = neoserraRequest('clients/new', 'POST', clientData);

    // Mark as processed in column K
    sheet.getRange(row, 11).setValue('Success: ' + new Date().toISOString());

    return response;
  } catch (error) {
    // Mark error in column K
    sheet.getRange(row, 11).setValue('Error: ' + error.message);
    throw error;
  }
}

/**
 * Processes all new clients in the sheet
 * Looks for rows where column K (Status) is empty
 */
function createAllNewClients() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Clients');
  const lastRow = sheet.getLastRow();
  let successCount = 0;
  let errorCount = 0;

  for (let row = 2; row <= lastRow; row++) {
    const status = sheet.getRange(row, 11).getValue();

    // Only process rows without a status
    if (!status) {
      try {
        createClientFromRow(row);
        successCount++;
        SpreadsheetApp.flush(); // Update sheet immediately
        Utilities.sleep(500); // Rate limiting - wait 500ms between requests
      } catch (error) {
        errorCount++;
        Logger.log('Error processing row ' + row + ': ' + error.toString());
      }
    }
  }

  SpreadsheetApp.getUi().alert(
    'Processing Complete',
    'Successfully created ' + successCount + ' clients.\n' +
    'Errors: ' + errorCount,
    SpreadsheetApp.getUi().ButtonSet.OK
  );
}

/**
 * Fetches training events for the current month
 * Populates the "Training Events" sheet
 */
function fetchTrainingEventsThisMonth() {
  const now = new Date();
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  const startDate = Utilities.formatDate(firstDay, 'America/Los_Angeles', 'yyyy-MM-dd');
  const endDate = Utilities.formatDate(lastDay, 'America/Los_Angeles', 'yyyy-MM-dd');

  // Build query string
  const endpoint = 'events?startDate=' + encodeURIComponent(startDate) +
                   '&endDate=' + encodeURIComponent(endDate);

  try {
    const response = neoserraRequest(endpoint, 'GET', null);

    // Get or create the Training Events sheet
    let sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Training Events');
    if (!sheet) {
      sheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet('Training Events');
    } else {
      sheet.clear(); // Clear existing data
    }

    // Set headers
    const headers = [
      'Event ID',
      'Title',
      'Start Date',
      'End Date',
      'Format',
      'Status',
      'Total Hours',
      'Location City',
      'Location State',
      'Max Attendees',
      'Topics',
      'Description'
    ];
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');

    // Process events
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
    } else {
      SpreadsheetApp.getUi().alert(
        'No Events',
        'No training events found for ' +
        Utilities.formatDate(firstDay, 'America/Los_Angeles', 'MMMM yyyy'),
        SpreadsheetApp.getUi().ButtonSet.OK
      );
    }

  } catch (error) {
    SpreadsheetApp.getUi().alert(
      'Error',
      'Failed to fetch training events: ' + error.message,
      SpreadsheetApp.getUi().ButtonSet.OK
    );
    Logger.log('Error fetching events: ' + error.toString());
  }
}

/**
 * Creates a custom menu in the Google Sheet
 */
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('Neoserra')
    .addItem('Create All New Clients', 'createAllNewClients')
    .addItem('Fetch Training Events (This Month)', 'fetchTrainingEventsThisMonth')
    .addSeparator()
    .addItem('Test API Connection', 'testApiConnection')
    .addToUi();
}

/**
 * Tests the API connection
 */
function testApiConnection() {
  try {
    // Try to fetch centers (lightweight endpoint)
    const response = neoserraRequest('centers', 'GET', null);

    SpreadsheetApp.getUi().alert(
      'API Connection Successful',
      'Successfully connected to Neoserra API!',
      SpreadsheetApp.getUi().ButtonSet.OK
    );
  } catch (error) {
    SpreadsheetApp.getUi().alert(
      'API Connection Failed',
      'Error: ' + error.message,
      SpreadsheetApp.getUi().ButtonSet.OK
    );
  }
}
