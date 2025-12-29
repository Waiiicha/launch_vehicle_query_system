const XLSX = require('xlsx');
const path = require('path');

function inspect(file) {
    const workbook = XLSX.readFile(path.join(__dirname, '../doc', file));
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });
    console.log(`--- ${file} ---`);
    console.log('Headers:', data[0]);
    console.log('Sample Row:', data[1]);
}

try {
    inspect('rocket_database_fy.xlsx');
    inspect('engine_database_fy.xlsx');
} catch (e) {
    console.error(e);
}
