/**
 * Netlify Function - API Proxy for Neoserra
 * Bypasses CORS by proxying requests server-side
 */

const fetch = require('node-fetch');

exports.handler = async (event, context) => {
  // Enable CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };

  // Handle preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  const NEOSERRA_API_URL = 'https://norcal.neoserra.com/api/v1/';
  const NEOSERRA_TOKEN = 'b4afa19f-c2f5-45c5-89b0-82ce7bc79145';

  try {
    // Get endpoint from query parameter
    const endpoint = event.queryStringParameters.endpoint || '';
    const url = NEOSERRA_API_URL + endpoint;

    console.log('Proxying request to:', url);

    // Make request to Neoserra
    const response = await fetch(url, {
      method: event.httpMethod,
      headers: {
        'Authorization': 'Bearer ' + NEOSERRA_TOKEN,
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0'
      },
      body: event.httpMethod === 'POST' ? event.body : undefined
    });

    const data = await response.text();

    return {
      statusCode: response.status,
      headers,
      body: data
    };

  } catch (error) {
    console.error('Proxy Error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Proxy error',
        message: error.message
      })
    };
  }
};
