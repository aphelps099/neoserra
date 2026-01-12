/**
 * Neoserra Training Chat Interface
 *
 * Interactive chat-style interface for querying training events
 * Ask questions in natural language and get filtered results
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
 * Parse natural language query and extract filters
 */
function parseQuery(query) {
  query = query.toLowerCase();

  const filters = {
    startDate: null,
    endDate: null,
    city: null,
    state: null,
    topic: null,
    format: null,
    status: null,
    keywords: []
  };

  // Date parsing
  const today = new Date();

  // This week
  if (query.includes('this week')) {
    filters.startDate = formatDate(today);
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);
    filters.endDate = formatDate(nextWeek);
  }

  // This month
  else if (query.includes('this month')) {
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    filters.startDate = formatDate(firstDay);
    filters.endDate = formatDate(lastDay);
  }

  // Next month
  else if (query.includes('next month')) {
    const firstDay = new Date(today.getFullYear(), today.getMonth() + 1, 1);
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 2, 0);
    filters.startDate = formatDate(firstDay);
    filters.endDate = formatDate(lastDay);
  }

  // Today
  else if (query.includes('today')) {
    filters.startDate = formatDate(today);
    filters.endDate = formatDate(today);
  }

  // Tomorrow
  else if (query.includes('tomorrow')) {
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    filters.startDate = formatDate(tomorrow);
    filters.endDate = formatDate(tomorrow);
  }

  // Default: next 30 days
  else {
    filters.startDate = formatDate(today);
    const futureDate = new Date(today);
    futureDate.setDate(today.getDate() + 30);
    filters.endDate = formatDate(futureDate);
  }

  // City detection
  const cities = [
    'oakland', 'san francisco', 'berkeley', 'sacramento', 'san jose',
    'fresno', 'san diego', 'los angeles', 'concord', 'antioch',
    'richmond', 'hayward', 'fremont', 'santa rosa', 'stockton'
  ];

  cities.forEach(city => {
    if (query.includes(city)) {
      filters.city = city;
    }
  });

  // State detection
  if (query.match(/\bca\b/) || query.includes('california')) {
    filters.state = 'CA';
  }

  // Topic detection
  const topicMap = {
    'business plan': 'C',
    'business planning': 'C',
    'marketing': 'MA',
    'accounting': 'G',
    'budget': 'G',
    'start up': 'A',
    'startup': 'A',
    'financing': 'U',
    'business financing': 'U',
    'government contract': 'K',
    'legal': 'J',
    'tax': 'I',
    'ecommerce': 'T',
    'e-commerce': 'T',
    'social media': 'DS',
    'digital marketing': 'DS',
    'export': 'L',
    'international': 'L'
  };

  Object.keys(topicMap).forEach(keyword => {
    if (query.includes(keyword)) {
      filters.topic = topicMap[keyword];
    }
  });

  // Format detection
  if (query.includes('online') || query.includes('virtual') || query.includes('webinar')) {
    filters.format = 'O';
  } else if (query.includes('in person') || query.includes('in-person')) {
    filters.format = 'B';
  }

  // Status detection
  if (query.includes('open') || query.includes('registration open')) {
    filters.status = 'OP';
  }

  // Extract other keywords
  const words = query.split(' ');
  filters.keywords = words.filter(w => w.length > 3);

  return filters;
}

/**
 * Format date as YYYY-MM-DD
 */
function formatDate(date) {
  return Utilities.formatDate(date, 'America/Los_Angeles', 'yyyy-MM-dd');
}

/**
 * Search for training events based on query
 */
function searchTrainings(query) {
  try {
    const filters = parseQuery(query);

    // Build API endpoint
    let endpoint = 'events?';
    if (filters.startDate) endpoint += 'startDate=' + encodeURIComponent(filters.startDate) + '&';
    if (filters.endDate) endpoint += 'endDate=' + encodeURIComponent(filters.endDate) + '&';

    const response = neoserraRequest(endpoint, 'GET', null);

    if (!response || !response.rows || response.rows.length === 0) {
      return {
        success: true,
        message: "I couldn't find any training events matching your query.",
        count: 0,
        events: []
      };
    }

    // Filter results based on parsed criteria
    let events = response.rows;

    // Filter by city
    if (filters.city) {
      events = events.filter(e =>
        e.locCity && e.locCity.toLowerCase().includes(filters.city)
      );
    }

    // Filter by state
    if (filters.state) {
      events = events.filter(e => e.locState === filters.state);
    }

    // Filter by topic
    if (filters.topic) {
      events = events.filter(e =>
        e.topic === filters.topic ||
        (e.topics && e.topics.includes(filters.topic))
      );
    }

    // Filter by format
    if (filters.format) {
      events = events.filter(e => e.format === filters.format);
    }

    // Filter by status
    if (filters.status) {
      events = events.filter(e => e.confstatus === filters.status);
    }

    // Filter by keywords (search in title and description)
    if (filters.keywords.length > 0) {
      events = events.filter(e => {
        const searchText = (e.title + ' ' + (e.text || '')).toLowerCase();
        return filters.keywords.some(keyword => searchText.includes(keyword));
      });
    }

    // Sort by start date
    events.sort((a, b) => {
      const dateA = new Date(a.startDate || '');
      const dateB = new Date(b.startDate || '');
      return dateA - dateB;
    });

    // Limit to top 20 results
    events = events.slice(0, 20);

    return {
      success: true,
      message: `Found ${events.length} training event${events.length === 1 ? '' : 's'}`,
      count: events.length,
      events: events.map(formatEventForChat),
      filters: filters
    };

  } catch (error) {
    return {
      success: false,
      message: 'Error searching trainings: ' + error.message,
      count: 0,
      events: []
    };
  }
}

/**
 * Format event data for chat display
 */
function formatEventForChat(event) {
  const startDate = event.startDate ? new Date(event.startDate) : null;
  const formattedDate = startDate ?
    Utilities.formatDate(startDate, 'America/Los_Angeles', 'MMM d, yyyy') :
    'Date TBD';

  return {
    id: event.conference || '',
    title: event.title || 'Untitled Event',
    date: formattedDate,
    rawDate: event.startDate || '',
    time: event.timeSpan || '',
    hours: event.hours || '',
    format: formatFormatCode(event.format),
    location: formatLocation(event),
    status: formatStatusCode(event.confstatus),
    topics: event.topics || [],
    description: truncateText(event.text || '', 150),
    maxAttendees: event.maxAttendees || '',
    signupUrl: event.signupUrl || '',
    onlineUrl: event.onlineUrl || ''
  };
}

/**
 * Format location string
 */
function formatLocation(event) {
  const parts = [];
  if (event.locCity) parts.push(event.locCity);
  if (event.locState) parts.push(event.locState);

  if (parts.length > 0) {
    return parts.join(', ');
  }

  return event.format === 'O' ? 'Online' : 'Location TBD';
}

/**
 * Format format code to readable text
 */
function formatFormatCode(code) {
  const formats = {
    'B': 'Workshop/Seminar',
    'C': 'Multi-session Course',
    'O': 'Online (Live)',
    'W': 'Online (Prerecorded)'
  };
  return formats[code] || 'TBD';
}

/**
 * Format status code to readable text
 */
function formatStatusCode(code) {
  const statuses = {
    'OP': 'Open',
    'CL': 'Closed',
    'FU': 'Full',
    'CA': 'Canceled',
    'PO': 'Postponed',
    'PH': 'Phone Registration Required',
    'NA': 'No eCenter Signup'
  };
  return statuses[code] || 'Unknown';
}

/**
 * Truncate text to specified length
 */
function truncateText(text, maxLength) {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

/**
 * Get quick filter suggestions
 */
function getQuickFilters() {
  return [
    { label: 'This Week', query: 'trainings this week' },
    { label: 'This Month', query: 'trainings this month' },
    { label: 'Next Month', query: 'trainings next month' },
    { label: 'Online Only', query: 'online trainings' },
    { label: 'Business Planning', query: 'business planning trainings' },
    { label: 'Marketing', query: 'marketing trainings' },
    { label: 'Start-up', query: 'startup trainings' },
    { label: 'Open Registration', query: 'open trainings' }
  ];
}

/**
 * Get topic suggestions
 */
function getTopicSuggestions() {
  return [
    { code: 'A', label: 'Business Start-up' },
    { code: 'C', label: 'Business Plan' },
    { code: 'MA', label: 'Marketing' },
    { code: 'U', label: 'Business Financing' },
    { code: 'G', label: 'Accounting/Budget' },
    { code: 'DS', label: 'Digital/Social Media' },
    { code: 'K', label: 'Government Contracting' },
    { code: 'L', label: 'International Trade' },
    { code: 'T', label: 'eCommerce' },
    { code: 'J', label: 'Legal Issues' },
    { code: 'I', label: 'Tax Planning' },
    { code: 'Q', label: 'Technology' }
  ];
}

/**
 * Show chat sidebar
 */
function showTrainingChat() {
  const html = HtmlService.createHtmlOutputFromFile('ChatSidebar')
    .setTitle('Training Search Chat')
    .setWidth(350);
  SpreadsheetApp.getUi().showSidebar(html);
}

/**
 * Creates custom menu
 */
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('Neoserra')
    .addItem('💬 Training Search Chat', 'showTrainingChat')
    .addSeparator()
    .addItem('📅 Export Results to Sheet', 'exportLastResultsToSheet')
    .addToUi();
}

/**
 * Export last search results to sheet
 */
function exportLastResultsToSheet() {
  // This will be called from the sidebar with the results
  SpreadsheetApp.getUi().alert(
    'Export from Chat',
    'Use the "Export to Sheet" button in the chat interface to export results.',
    SpreadsheetApp.getUi().ButtonSet.OK
  );
}

/**
 * Export events to sheet
 */
function exportEventsToSheet(events) {
  try {
    let sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Training Results');
    if (!sheet) {
      sheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet('Training Results');
    } else {
      sheet.clear();
    }

    // Set headers
    const headers = [
      'Event ID', 'Title', 'Date', 'Time', 'Hours', 'Format',
      'Location', 'Status', 'Topics', 'Description', 'Signup URL', 'Online URL'
    ];
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
    sheet.getRange(1, 1, 1, headers.length).setBackground('#4285f4');
    sheet.getRange(1, 1, 1, headers.length).setFontColor('#ffffff');

    if (events && events.length > 0) {
      const rows = events.map(event => [
        event.id,
        event.title,
        event.date,
        event.time,
        event.hours,
        event.format,
        event.location,
        event.status,
        Array.isArray(event.topics) ? event.topics.join(', ') : event.topics,
        event.description,
        event.signupUrl,
        event.onlineUrl
      ]);

      sheet.getRange(2, 1, rows.length, headers.length).setValues(rows);

      // Auto-resize columns
      for (let i = 1; i <= headers.length; i++) {
        sheet.autoResizeColumn(i);
      }
    }

    SpreadsheetApp.setActiveSheet(sheet);

    return {
      success: true,
      message: 'Exported ' + events.length + ' events to "Training Results" sheet'
    };

  } catch (error) {
    return {
      success: false,
      message: 'Error exporting: ' + error.message
    };
  }
}
