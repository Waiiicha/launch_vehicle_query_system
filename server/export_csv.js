const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const OUTPUT_FILE = path.join(__dirname, '../doc/rocket_database_export.csv');

async function exportCSV() {
  console.log('Exporting database to CSV...');

  const rockets = await prisma.rocket.findMany({
    orderBy: { id: 'asc' }
  });

  if (rockets.length === 0) {
    console.log('No data found in database.');
    return;
  }

  // 获取所有列名 (排除 updatedAt, createdAt 等内部字段可选，但这里全导以供参考)
  const headers = Object.keys(rockets[0]);
  
  // 转换成 CSV 格式
  // 处理逗号和引号：如果字段包含逗号、换行或引号，需要用双引号包裹并转义内部引号
  const escapeCSV = (val) => {
    if (val === null || val === undefined) return '';
    let str = String(val);
    if (str.includes(',') || str.includes('\n') || str.includes('"')) {
      str = '"' + str.replace(/"/g, '""') + '"';
    }
    return str;
  };

  const csvRows = [];
  csvRows.push(headers.join(','));

  for (const rocket of rockets) {
    const values = headers.map(header => escapeCSV(rocket[header]));
    csvRows.push(values.join(','));
  }

  // 使用 UTF-8 带 BOM 格式写入，确保 Excel 能正确识别中文
  const bom = Buffer.from('\uFEFF');
  const csvContent = csvRows.join('\n');
  fs.writeFileSync(OUTPUT_FILE, Buffer.concat([bom, Buffer.from(csvContent)]));

  console.log(`Successfully exported ${rockets.length} rockets to ${OUTPUT_FILE}`);
}

exportCSV()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
