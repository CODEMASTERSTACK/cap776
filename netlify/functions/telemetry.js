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

    console.log('[Telemetry] Received payload for:', name, regNo);

    const webhookUrl = process.env.GOOGLE_SHEET_WEBHOOK_URL || process.env.TELEMETRY_ENDPOINT;

    if (!webhookUrl) {
      console.warn('[Telemetry] No GOOGLE_SHEET_WEBHOOK_URL environment variable configured in Netlify.');
      return {
        statusCode: 200,
        body: JSON.stringify({ status: 'ok', warning: 'No webhook configured' })
      };
    }

    const payloadString = JSON.stringify({
      timestamp: timestamp || new Date().toLocaleString(),
      name: name || 'Unknown',
      regNo: regNo || 'N/A',
      section: section || 'N/A',
      fileName: fileName || 'dataset.xlsx'
    });

    // Google Apps Script requires redirect: 'follow' and accepts text/plain smoothly across 302 redirects
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8'
      },
      body: payloadString,
      redirect: 'follow'
    });

    const respText = await response.text().catch(() => '');
    console.log('[Telemetry] Webhook responded with status:', response.status, respText);

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'ok', forwarded: response.ok })
    };

  } catch (error) {
    console.error('[Telemetry] Error forwarding telemetry:', error);
    return {
      statusCode: 200,
      body: JSON.stringify({ status: 'ok' })
    };
  }
}
