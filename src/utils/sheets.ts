export async function fetchSheetData() {
  try {
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
    throw new Error('Failed to load data from server. Please try again later.');
  }
}