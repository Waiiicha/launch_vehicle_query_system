const XLSX = require('xlsx');
const path = require('path');

try {
  const filePath = path.join(__dirname, 'doc/火箭发动机.xlsx');
  console.log(`Reading file: ${filePath}`);
  const workbook = XLSX.readFile(filePath);
  
  // Iterate through all sheets
  workbook.SheetNames.forEach(sheetName => {
    console.log(`\n--- Sheet: ${sheetName} ---`);
    const sheet = workbook.Sheets[sheetName];
    // Get JSON with header
    const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });
    
    if (data.length > 0) {
      console.log("Headers:", data[0]);
      // Find index of '推进剂'
      const header = data[0];
      const propIndex = header.findIndex(h => h && h.includes('推进剂'));
      
      if (propIndex !== -1) {
          console.log("--- Propellant Samples ---");
          data.slice(1, 15).forEach(row => {
              console.log(`Row: ${row[0]} | Prop: ${row[propIndex]}`);
          });
      } else {
          console.log("No '推进剂' column found.");
      }
    } else {
      console.log("Sheet is empty.");
    }
  });

} catch (error) {
  console.error("Error reading xlsx:", error);
}

