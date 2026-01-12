/**
 * Simple API Proxy Server for Neoserra
 * This bypasses CORS issues by proxying requests server-side
 *
 * Deploy to Vercel, Netlify Functions, or any Node.js host
 */

// For Vercel Serverless Function
module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const NEOSERRA_API_URL = 'https://norcal.neoserra.com/api/v1/';
  const NEOSERRA_TOKEN = 'b4afa19f-c2f5-45c5-89b0-82ce7bc79145';

  try {
    // Get endpoint from query parameter
    const endpoint = req.query.endpoint || '';
    const url = NEOSERRA_API_URL + endpoint;

    // Make request to Neoserra
    const response = await fetch(url, {
      method: req.method,
      headers: {
        'Authorization': 'Bearer ' + NEOSERRA_TOKEN,
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0'
      },
      body: req.method === 'POST' ? JSON.stringify(req.body) : undefined
    });

    const data = await response.json();

    // Return response
    res.status(response.status).json(data);

  } catch (error) {
    console.error('Proxy Error:', error);
    res.status(500).json({
      error: 'Proxy error',
      message: error.message
    });
  }
};
