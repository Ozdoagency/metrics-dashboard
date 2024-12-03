interface SheetResponse {
  status: 'success' | 'error';
  data: any[];
  message?: string;
}

const APPS_SCRIPT_URL = import.meta.env.VITE_APPS_SCRIPT_URL;

// Удалите импорт google
// import { google } from 'googleapis';

export async function fetchSheetData() {
  try {
    const response = await fetch(APPS_SCRIPT_URL);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const result: SheetResponse = await response.json();
    
    if (result.status === 'error') {
      throw new Error(result.message || 'Failed to fetch data');
    }

    return result.data.map(row => ({
      date: row.date,
      actual: Number(row.actual),
      leads: Number(row.leads),
      leadCost: Number(row.leadCost),
      cr: Number(row.cr),
      quals: Number(row.quals),
      qualCost: Number(row.qualCost)
    }));

  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
}