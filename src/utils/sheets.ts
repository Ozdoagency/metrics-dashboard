export async function fetchSheetData() {
  try {
    const response = await fetch('/api/sheets');
    if (!response.ok) {
      throw new Error('Failed to fetch sheet data');
    }
    return response.json();
  } catch (error) {
    console.error('Error fetching sheet data:', error);
    throw error;
  }
}