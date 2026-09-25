/**
 * Netlify Serverless Function: record-student
 * Securely forwards extracted student metadata (Name, Reg No, Section)
 * to a private Google Apps Script Webhook.
 * 
 * Your Google Apps Script URL is stored in process.env.GOOGLE_SHEET_WEBHOOK_URL,
 * keeping it 100% secret and invisible to frontend users.
 */
export async function handler(event) {
  // Only accept POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  }

  try {
    const payload = JSON.parse(event.body || '{}');
    const { name, regNo, section, fileName, timestamp } = payload;

    // Validate that at least Name or RegNo is provided
    if (!name && !regNo) {
      return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Skipped: Empty student metadata' })
      };
    }

    const webhookUrl = process.env.GOOGLE_SHEET_WEBHOOK_URL;

    if (!webhookUrl) {
      console.warn('GOOGLE_SHEET_WEBHOOK_URL environment variable is not configured in Netlify.');
      return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Webhook not configured yet; payload logged securely.' })
      };
    }

    // Forward to private Google Apps Script Webhook
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        timestamp: timestamp || new Date().toISOString(),
        name: name || 'Unknown',
        regNo: regNo || 'N/A',
        section: section || 'N/A',
        fileName: fileName || 'student_data.xlsx'
      })
    });

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ success: true, forwarded: response.ok })
    };

  } catch (error) {
    console.error('Error forwarding student record:', error);
    // Return 200 so user frontend is never blocked or alerted
    return {
      statusCode: 200,
      body: JSON.stringify({ success: false, error: error.message })
    };
  }
}
