import { mockData } from './mock-data';

export async function fetchSheetData() {
  try {
    // В режиме разработки используем моковые данные
    if (import.meta.env.DEV) {
      return Promise.resolve(mockData);
    }

    const response = await fetch('/api/sheets', {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const text = await response.text();
      console.error('Server response:', text);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    if (!Array.isArray(data)) {
      console.error('Unexpected data format:', data);
      throw new Error('Invalid data format received from server');
    }

    return data;
  } catch (error) {
    console.error('Error fetching sheet data:', error);
    // В случае ошибки в production возвраща��м моковые данные
    if (import.meta.env.PROD) {
      console.log('Falling back to mock data');
      return mockData;
    }
    throw new Error('Failed to load data from server. Please try again later.');
  }
}