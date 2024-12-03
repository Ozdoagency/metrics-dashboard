import { google } from 'googleapis';
import type { VercelRequest, VercelResponse } from '@vercel/node';

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];

async function getAuthClient() {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    },
    scopes: SCOPES,
  });
  return auth;
}

export default async function handler(_req: VercelRequest, res: VercelResponse) {
  try {
    const auth = await getAuthClient();
    const sheets = google.sheets({ version: 'v4', auth });
    
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SPREADSHEET_ID,
      range: 'A2:G', // Предполагаем, что данные начинаются со вто��ой строки
    });

    const rows = response.data.values || [];
    
    const data = rows.map(row => ({
      date: row[0],
      leads: Number(row[1]),
      leadCost: Number(row[2]),
      cr: Number(row[3]),
      actual: Number(row[4]),
      quals: Number(row[5]),
      qualCost: Number(row[6])
    }));

    res.status(200).json(data);
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'Failed to fetch data from Google Sheets' });
  }
}