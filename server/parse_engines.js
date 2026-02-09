const fs = require('fs');

console.log('=== 从 CSV 提取发动机-火箭关系 ===\n');

// 读取 CSV 文件
const csvPath = '../doc/20260208-火箭发动机.csv';
const content = fs.readFileSync(csvPath, 'utf-8');

const lines = content.split('\n');

// 打印头部，确定列索引
const headers = lines[0].split(',');
console.log('CSV 列：');
headers.forEach((h, i) => {
  console.log(`${i}: ${h.trim()}`);
});

console.log('\n=== 发动机和使用型号 ===\n');

// 发动机在第0列，使用型号在倒数第5列
for (let i = 1; i < lines.length; i++) {
  const line = lines[i].trim();
  if (!line) continue;
  
  const cols = line.split(',');
  const engineName = cols[0]?.trim();
  const usedBy = cols[12]?.trim();
  
  if (engineName && usedBy) {
    console.log(`${engineName}`);
    console.log(`  使用: ${usedBy}`);
  }
}
