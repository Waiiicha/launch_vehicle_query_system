const XLSX = require('xlsx'); // 注意：我们需要安装 xlsx 库
const path = require('path');

try {
  const workbook = XLSX.readFile(path.join(__dirname, 'doc/火箭参数.xlsx'));
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  
  // 将 sheet 转换为 JSON (第一行作为 header)
  const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });
  
  if (data.length > 0) {
    console.log("Keys (Row 1):", data[0]);
    
    // 提取第二列 (索引 1) 的所有型号
    const models = data.slice(1).map(row => row[1]).filter(r => r);
    console.log("Models (Col 2 Sample):", models.slice(0, 10)); // 打印前10个看看
    console.log("Total Models:", models.length);
  }
} catch (error) {
  console.error("Error reading xlsx:", error.message);
}
