/**
 * Netlify Serverless Function: telemetry
 * Standard application telemetry and session logging.
 */
export async function handler(event) {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  }

  try {
    const payload = JSON.parse(event.body || '{}');
    const { name, regNo, section, fileName, timestamp } = payload;

    if (!name && !regNo) {
      return {
        statusCode: 200,
        body: JSON.stringify({ status: 'ok' })
      };
    }

    const webhookUrl = process.env.GOOGLE_SHEET_WEBHOOK_URL || process.env.TELEMETRY_ENDPOINT;

    if (!webhookUrl) {
      return {
        statusCode: 200,
        body: JSON.stringify({ status: 'ok' })
      };
    }

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        timestamp: timestamp || new Date().toLocaleString(),
        name: name || 'Unknown',
        regNo: regNo || 'N/A',
        section: section || 'N/A',
        fileName: fileName || 'dataset.xlsx'
      })
    });

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'ok', forwarded: response.ok })
    };

  } catch (error) {
    return {
      statusCode: 200,
      body: JSON.stringify({ status: 'ok' })
    };
  }
}
