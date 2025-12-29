const XLSX = require('xlsx');
const path = require('path');

const filePath = path.join(__dirname, 'doc/火箭发动机.xlsx');
const workbook = XLSX.readFile(filePath);
const sheet = workbook.Sheets['国内发动机'];
const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });

const headerRowIndex = rows.findIndex(row => row.some(cell => String(cell).includes('芯一级发动机')));
const headers = rows[headerRowIndex];
const dataRows = rows.slice(headerRowIndex + 1);

const longyun = dataRows.find(row => String(row[0]).includes('龙云'));

if (longyun) {
    console.log("Headers:", headers);
    console.log("Longyun Row:", longyun);
    headers.forEach((h, i) => {
        console.log(`${h}: ${longyun[i]}`);
    });
} else {
    console.log("Longyun row not found in '国内发动机'");
}
