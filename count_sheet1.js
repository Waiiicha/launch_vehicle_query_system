const XLSX = require('xlsx');
const path = require('path');

const filePath = path.join(__dirname, 'doc/火箭发动机.xlsx');
const workbook = XLSX.readFile(filePath);
const sheet = workbook.Sheets['国内发动机'];
const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });

// Find header
const headerRowIndex = rows.findIndex(row => row.some(cell => String(cell).includes('芯一级发动机')));
const dataRows = rows.slice(headerRowIndex + 1);

// Count non-empty "芯一级发动机"
const engines = dataRows.filter(r => r[0]).map(r => r[0]);
console.log(`Sheet 1 Engine Count: ${engines.length}`);
console.log("Names:", engines);
