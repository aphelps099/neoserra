// Neoserra API Configuration with Proxy Support
const NEOSERRA_CONFIG = {
  // Use Netlify serverless function (works when deployed to Netlify)
  useNetlifyFunction: true,

  // Original API
  apiUrl: 'https://norcal.neoserra.com/api/v1/',
  apiToken: 'b4afa19f-c2f5-45c5-89b0-82ce7bc79145'
};

// State
let lastResults = [];

/**
 * Make authenticated request to Neoserra API
 */
async function neoserraRequest(endpoint, method = 'GET', data = null) {
  let url;
  let options = {
    method: method,
    headers: {
      'Content-Type': 'application/json'
    }
  };

  if (NEOSERRA_CONFIG.useNetlifyFunction) {
    // Use Netlify serverless function
    url = '/.netlify/functions/api-proxy?endpoint=' + encodeURIComponent(endpoint);
    if (method === 'POST' && data) {
      options.body = JSON.stringify(data);
    }
  } else {
    // Direct API call (for local testing)
    url = NEOSERRA_CONFIG.apiUrl + endpoint;
    options.headers['Authorization'] = 'Bearer ' + NEOSERRA_CONFIG.apiToken;
    if (method === 'POST' && data) {
      options.body = JSON.stringify(data);
    }
  }

  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API Error ${response.status}: ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API Request Error:', error);
    throw error;
  }
}

/**
 * Parse natural language query into filters
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

  const today = new Date();

  // Date parsing
  if (query.includes('this week')) {
    filters.startDate = formatDate(today);
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);
    filters.endDate = formatDate(nextWeek);
  } else if (query.includes('this month')) {
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    filters.startDate = formatDate(firstDay);
    filters.endDate = formatDate(lastDay);
  } else if (query.includes('next month')) {
    const firstDay = new Date(today.getFullYear(), today.getMonth() + 1, 1);
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 2, 0);
    filters.startDate = formatDate(firstDay);
    filters.endDate = formatDate(lastDay);
  } else if (query.includes('today')) {
    filters.startDate = formatDate(today);
    filters.endDate = formatDate(today);
  } else if (query.includes('tomorrow')) {
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    filters.startDate = formatDate(tomorrow);
    filters.endDate = formatDate(tomorrow);
  } else {
    // Default: next 30 days
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

  // Extract keywords
  const words = query.split(' ');
  filters.keywords = words.filter(w => w.length > 3);

  return filters;
}

/**
 * Format date as YYYY-MM-DD
 */
function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Search for training events
 */
async function searchTrainings(query) {
  try {
    const filters = parseQuery(query);

    // Build API endpoint
    let endpoint = 'events?';
    if (filters.startDate) endpoint += 'startDate=' + encodeURIComponent(filters.startDate) + '&';
    if (filters.endDate) endpoint += 'endDate=' + encodeURIComponent(filters.endDate) + '&';

    const response = await neoserraRequest(endpoint, 'GET');

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

    // Filter by keywords
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
 * Format event data for display
 */
function formatEventForChat(event) {
  const startDate = event.startDate ? new Date(event.startDate) : null;
  const formattedDate = startDate ?
    startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) :
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
 * Truncate text
 */
function truncateText(text, maxLength) {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

/**
 * Add message to chat
 */
function addMessage(text, type = 'bot') {
  const chatMessages = document.getElementById('chatMessages');
  const message = document.createElement('div');
  message.className = 'message ' + type;
  message.textContent = text;
  chatMessages.appendChild(message);
  scrollToBottom();
}

/**
 * Add event cards to chat
 */
function addEventCards(events) {
  const chatMessages = document.getElementById('chatMessages');

  if (events.length > 0) {
    const countDiv = document.createElement('div');
    countDiv.className = 'results-count';
    countDiv.textContent = `Found ${events.length} training event${events.length === 1 ? '' : 's'}`;
    chatMessages.appendChild(countDiv);
  }

  events.forEach(event => {
    const card = document.createElement('div');
    card.className = 'event-card';

    let html = `<h3>${event.title}</h3>`;

    html += '<div class="event-meta">';
    if (event.date) {
      html += `<span class="event-badge date">📅 ${event.date}</span>`;
    }
    if (event.location) {
      html += `<span class="event-badge location">📍 ${event.location}</span>`;
    }
    if (event.status) {
      html += `<span class="event-badge status">${event.status}</span>`;
    }
    if (event.format) {
      html += `<span class="event-badge format">${event.format}</span>`;
    }
    if (event.hours) {
      html += `<span class="event-badge">${event.hours} hours</span>`;
    }
    html += '</div>';

    if (event.description) {
      html += `<div class="event-description">${event.description}</div>`;
    }

    if (event.signupUrl) {
      html += `<a class="event-link" href="${event.signupUrl}" target="_blank">Register →</a>`;
    }

    card.innerHTML = html;
    chatMessages.appendChild(card);
  });

  if (events.length > 0) {
    const exportBtn = document.createElement('button');
    exportBtn.className = 'export-btn';
    exportBtn.textContent = '📊 Download Results (CSV)';
    exportBtn.onclick = downloadResults;
    chatMessages.appendChild(exportBtn);
  }

  scrollToBottom();
}

/**
 * Show typing indicator
 */
function showTyping() {
  const chatMessages = document.getElementById('chatMessages');
  const typing = document.createElement('div');
  typing.className = 'message bot typing-indicator';
  typing.id = 'typingIndicator';
  typing.innerHTML = '<span></span><span></span><span></span>';
  chatMessages.appendChild(typing);
  scrollToBottom();
}

/**
 * Hide typing indicator
 */
function hideTyping() {
  const typing = document.getElementById('typingIndicator');
  if (typing) typing.remove();
}

/**
 * Scroll chat to bottom
 */
function scrollToBottom() {
  const chatMessages = document.getElementById('chatMessages');
  setTimeout(() => {
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }, 100);
}

/**
 * Send message
 */
async function sendMessage() {
  const input = document.getElementById('chatInput');
  const query = input.value.trim();

  if (!query) return;

  await sendQuery(query);
  input.value = '';
}

/**
 * Send query
 */
async function sendQuery(query) {
  const sendBtn = document.querySelector('.send-btn');
  const chatInput = document.getElementById('chatInput');

  // Add user message
  addMessage(query, 'user');

  // Disable input
  sendBtn.disabled = true;
  chatInput.disabled = true;

  // Show typing indicator
  showTyping();

  try {
    const result = await searchTrainings(query);

    hideTyping();
    sendBtn.disabled = false;
    chatInput.disabled = false;

    if (result.success) {
      if (result.count > 0) {
        lastResults = result.events;
        addEventCards(result.events);
      } else {
        addMessage(result.message, 'bot');
        addMessage('Try adjusting your search criteria or date range.', 'bot');
      }
    } else {
      addMessage(result.message, 'bot');
    }
  } catch (error) {
    hideTyping();
    sendBtn.disabled = false;
    chatInput.disabled = false;
    addMessage('Sorry, I encountered an error: ' + error.message, 'bot');
  }

  chatInput.focus();
}

/**
 * Handle Enter key
 */
function handleKeyPress(event) {
  if (event.key === 'Enter') {
    sendMessage();
  }
}

/**
 * Download results as CSV
 */
function downloadResults() {
  if (lastResults.length === 0) {
    addMessage('No results to download.', 'system');
    return;
  }

  // Create CSV
  const headers = ['Title', 'Date', 'Time', 'Hours', 'Format', 'Location', 'Status', 'Description', 'Signup URL'];
  const rows = lastResults.map(event => [
    event.title,
    event.date,
    event.time,
    event.hours,
    event.format,
    event.location,
    event.status,
    event.description.replace(/,/g, ';'), // Escape commas
    event.signupUrl
  ]);

  let csv = headers.join(',') + '\n';
  rows.forEach(row => {
    csv += row.map(cell => `"${cell}"`).join(',') + '\n';
  });

  // Download
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'neoserra-training-events-' + new Date().toISOString().split('T')[0] + '.csv';
  a.click();
  window.URL.revokeObjectURL(url);

  addMessage('✓ Downloaded ' + lastResults.length + ' events as CSV', 'system');
}

/**
 * Scroll to search section
 */
function scrollToSearch() {
  document.getElementById('search').scrollIntoView({ behavior: 'smooth' });
  setTimeout(() => {
    document.getElementById('chatInput').focus();
  }, 500);
}

/**
 * Load total events count
 */
async function loadTotalEventsCount() {
  try {
    const today = new Date();
    const futureDate = new Date(today);
    futureDate.setMonth(today.getMonth() + 6); // Next 6 months

    const endpoint = `events?startDate=${formatDate(today)}&endDate=${formatDate(futureDate)}`;
    const response = await neoserraRequest(endpoint, 'GET');

    if (response && response.rows) {
      const totalElement = document.getElementById('totalEvents');
      if (totalElement) {
        totalElement.textContent = response.rows.length;
      }
    }
  } catch (error) {
    console.error('Error loading events count:', error);
  }
}

/**
 * Initialize navigation
 */
function initNavigation() {
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (scrollY >= sectionTop - 100) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) {
        link.classList.add('active');
      }
    });
  });
}

/**
 * Initialize app
 */
document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  loadTotalEventsCount();

  // Focus input when search section is visible
  const searchSection = document.getElementById('search');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        document.getElementById('chatInput').focus();
      }
    });
  }, { threshold: 0.5 });

  observer.observe(searchSection);
});
