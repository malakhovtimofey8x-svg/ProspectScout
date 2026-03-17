exports.handler = async function(event) {
  const YELP_KEY = process.env.YELP_KEY;

  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  const params = event.queryStringParameters || {};
  const location = params.location || '';
  const term     = params.term || 'business';
  const limit    = parseInt(params.limit) || 10;

  if (!location) {
    return { statusCode: 400, headers, body: JSON.stringify({ error: 'location required' }) };
  }

  if (!YELP_KEY) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'YELP_KEY not configured in Netlify' }) };
  }

  try {
    const url = `https://api.yelp.com/v3/businesses/search?location=${encodeURIComponent(location)}&term=${encodeURIComponent(term)}&limit=${limit}&sort_by=best_match`;

    const res = await fetch(url, {
      headers: { 'Authorization': `Bearer ${YELP_KEY}`, 'Accept': 'application/json' }
    });

    const data = await res.json();

    if (!res.ok) {
      return { statusCode: res.status, headers, body: JSON.stringify({ error: data.error || 'Yelp error' }) };
    }

    return { statusCode: 200, headers, body: JSON.stringify(data) };

  } catch (err) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: err.message }) };
  }
};
