function doGet() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const dataRange = sheet.getDataRange();
  const values = dataRange.getValues();
  
  const headers = values[0];
  const data = values.slice(1).map(row => {
    const obj = {};
    headers.forEach((header, index) => {
      obj[header] = row[index];
    });
    return obj;
  });

  return ContentService.createTextOutput(JSON.stringify({
    status: 'success',
    data: data
  }))
  .setMimeType(ContentService.MimeType.JSON)
  .setHeader('Access-Control-Allow-Origin', '*');
}
