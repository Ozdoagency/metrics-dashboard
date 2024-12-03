import { google } from 'googleapis';

const SPREADSHEET_ID = '1lI-QI5IZYJmDqojWxIEieKeBFo06UUOx0MV3_n4KaUM';
const RANGE = 'API_Data!A2:G'; // Обновили на новый лист

export async function fetchSheetData() {
  const auth = new google.auth.GoogleAuth({
    keyFile: 'credentials.json',
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
  });

  const sheets = google.sheets({ version: 'v4', auth });
  
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: RANGE,
    });

    return response.data.values?.map(row => ({
      date: row[0],
      actual: parseFloat(row[1].replace('грн.', '').replace(',', '.').trim()),
      leads: parseInt(row[2]),
      leadCost: parseInt(row[3]),
      cr: parseInt(row[4].replace('%', '')),
      quals: parseInt(row[5]),            
      qualCost: parseFloat(row[6].replace('грн.', '').replace(',', '.').trim())
    })) || [];
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
}