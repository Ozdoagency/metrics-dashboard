import { google } from 'googleapis';

export async function fetchSheetData() {
  try {
    console.log('Env variables:', {
      hasPrivateKey: !!import.meta.env.VITE_GOOGLE_PRIVATE_KEY,
      hasEmail: !!import.meta.env.VITE_GOOGLE_SERVICE_ACCOUNT_EMAIL,
      hasSpreadsheetId: !!import.meta.env.VITE_GOOGLE_SPREADSHEET_ID
    });

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

    console.log('Auth created, fetching data...');
    const sheets = google.sheets({ version: 'v4', auth });
    
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: spreadsheetId,
      range: 'API_Data!A2:G', // Updated range to match new sheet
    });

    console.log('Data received, rows count:', response.data.values?.length);

    const rows = response.data.values;
    if (!rows || rows.length === 0) {
      throw new Error('No data found.');
    }

    // Parse data with proper formatting
    return rows.map(row => ({
      date: row[0],
      actual: parseFloat(row[1].replace('грн.', '').replace(',', '.').trim()),
      leads: parseInt(row[2]),
      leadCost: parseInt(row[3]),
      cr: parseInt(row[4].replace('%', '')),
      quals: parseInt(row[5]),
      qualCost: parseFloat(row[6].replace('грн.', '').replace(',', '.').trim())
    }));

  } catch (error) {
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      error
    });
    throw error;
  }
}