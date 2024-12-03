import { google } from 'googleapis';

export async function fetchSheetData() {
  try {
    console.log('Starting fetchSheetData');
    const privateKey = import.meta.env.VITE_GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');
    const clientEmail = import.meta.env.VITE_GOOGLE_SERVICE_ACCOUNT_EMAIL;
    const spreadsheetId = import.meta.env.VITE_GOOGLE_SPREADSHEET_ID;

    if (!privateKey || !clientEmail || !spreadsheetId) {
      throw new Error('Missing required environment variables');
    }

    console.log('Environment variables loaded');
    
    const auth = new google.auth.GoogleAuth({
      credentials: {
        private_key: privateKey,
        client_email: clientEmail,
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    const sheets = google.sheets({ version: 'v4', auth });
    
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: spreadsheetId,
      range: 'Sheet1!A:G', // Adjust range as needed
    });

    const rows = response.data.values;
    if (!rows || rows.length === 0) {
      throw new Error('No data found.');
    }

    // Skip header row and parse data
    return rows.slice(1).map(row => ({
      date: row[0],
      leads: Number(row[1]),
      leadCost: Number(row[2]),
      cr: Number(row[3]),
      actual: Number(row[4]),
      quals: Number(row[5]),
      qualCost: Number(row[6])
    }));

  } catch (error) {
    console.error('Detailed error in fetchSheetData:', error);
    throw error;
  }
}