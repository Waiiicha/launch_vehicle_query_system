const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// 辅助函数：提取字符串中的数字 (取最大值)
// 例如: "100-150" -> 150, "22.8 (耗尽)" -> 22.8, "~6" -> 6
function parseNumber(str) {
  if (!str || str === 'N/A') return null;
  const matches = str.match(/[\d\.]+/g);
  if (!matches) return null;
  // 取最大的那个数字 (针对 "100-150" 这种情况，取上限通常更能代表能力)
  return Math.max(...matches.map(parseFloat));
}

// 辅助函数：解析发射历史 "18发18中"
function parseHistory(str) {
  if (!str) return { launches: 0, failures: 0 };
  const launchMatch = str.match(/(\d+)发/);
  const successMatch = str.match(/(\d+)中/);
  
  if (launchMatch && successMatch) {
    const total = parseInt(launchMatch[1]);
    const success = parseInt(successMatch[1]);
    return { launches: total, failures: total - success };
  }
  return { launches: 0, failures: 0 };
}

async function seed() {
  const docPath = path.join(__dirname, '../doc/20251225-运载火箭信息表-v2.md');
  const content = fs.readFileSync(docPath, 'utf-8');
  const lines = content.split('\n');

  console.log('Seeding V2 Data...');
  await prisma.rocket.deleteMany({});

  let currentSection = '';
  
  // 临时存储所有解析到的火箭数据
  const rockets = {};

  // 1. 先扫一遍核心参数对比表 (通常在文档末尾，第8节)
  // 表头: |型号|国家/厂商|一级燃料|一级发动机|推力|二级燃料|LEO|GTO|火星|冥王星|回收|
  let inCoreTable = false;

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('## ')) {
      currentSection = trimmed;
      if (trimmed.includes('核心参数对比表')) inCoreTable = true;
      else inCoreTable = false;
      continue;
    }

    if (inCoreTable && trimmed.startsWith('|')) {
      const cols = trimmed.split('|').map(c => c.trim()).filter(c => c !== '');
      if (cols[0].includes('---') || cols[0].includes('型号')) continue;

      // 解析行
      // 0:型号, 1:国家/厂商, 2:一级燃料, 3:一级引擎, 4:推力, 5:二级燃料, 6:LEO, 7:GTO, 8:Mars, 9:Pluto, 10:回收
      if (cols.length >= 10) {
        const name = cols[0].replace(/\*\*/g, '').trim(); // 去掉 **加粗**
        rockets[name] = {
          name: name,
          manufacturer: cols[1], // "中国/CASC" -> 需要简单处理
          firstStageFuel: cols[2],
          firstStageEngine: cols[3],
          liftoffThrust: parseNumber(cols[4]),
          secondStageFuel: cols[5],
          leoCapacity: parseNumber(cols[6]),
          gtoCapacity: parseNumber(cols[7]),
          marsCapacity: parseNumber(cols[8]),
          isReusable: cols[10].includes('是') || cols[10].includes('复用') || cols[10].includes('回收'),
          description: `基于核心参数表：深空探测能力分析。${cols[9] !== 'N/A' ? '具备冥王星探测潜力。' : ''}`
        };
      }
    }
  }

  // 2. 补充扫描其他章节的详细信息 (如高度、直径、首飞时间)
  // 这部分比较难通用化，我们针对 V2 文档的特定格式做一些简单的关键词匹配补充
  // 或者如果核心表已经够用，就先用核心表。
  // 鉴于 V2 文档非常详细，我们可以尝试提取第一章到第七章的表格数据来丰富 rockets 对象
  
  let currentSeries = '';
  
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('## ')) currentSeries = trimmed;
    
    // 识别各章节的小表格 (如长征系列)
    // 假设之前的表格行解析逻辑仍然部分适用
    if (trimmed.startsWith('|') && !trimmed.includes('核心参数')) {
       const cols = trimmed.split('|').map(c => c.trim()).filter(c => c !== '');
       if (cols.length > 5 && !cols[0].includes('---') && !cols[0].includes('系列')) {
          // 尝试匹配已有的 rocket
          // 这里的逻辑比较脆弱，因为不同表格列数不同。
          // 策略：如果名字匹配上了 rockets 中的 key，就更新；否则新建。
          
          let nameCandidate = cols[1]; // 通常第二列是型号
          // 特殊处理：有些表格第一列就是型号
          if (cols[0].startsWith('CZ-') || cols[0].startsWith('Falcon')) nameCandidate = cols[0];

          if (nameCandidate) {
             nameCandidate = nameCandidate.replace(/\*\*/g, '');
             
             // 如果核心表中已有该火箭，尝试补充 info
             if (rockets[nameCandidate]) {
                // 可以在这里补充 firstFlight, status 等字段，如果表格里有的话
             } else {
               // 新增一些核心表没涵盖的火箭 (如 CZ-2F, CZ-7A 等可能不在核心表前10名)
               // 我们需要根据列数猜测结构，或者根据 currentSeries 决定
               if (currentSeries.includes('长征系列') && cols.length >= 14) {
                 // 复用 V1 的逻辑
                 rockets[nameCandidate] = {
                   name: nameCandidate,
                   series: cols[0],
                   country: '中国',
                   manufacturer: cols[3],
                   firstFlight: cols[4],
                   status: cols[6],
                   height: parseNumber(cols[7]),
                   diameter: parseNumber(cols[8]),
                   liftoffMass: parseNumber(cols[9]),
                   leoCapacity: parseNumber(cols[10]),
                   gtoCapacity: parseNumber(cols[11]),
                   description: cols[14],
                   isReusable: false
                 };
               }
             }
          }
       }
    }
  }

  // 3. 写入数据库
  for (const key in rockets) {
    const r = rockets[key];
    // 清洗数据
    if (r.manufacturer && r.manufacturer.includes('/')) {
        const parts = r.manufacturer.split('/');
        r.country = parts[0];
        r.manufacturer = parts[1];
    }
    
    // 默认值
    if (!r.country && r.name.startsWith('CZ')) r.country = '中国';
    if (!r.series) {
        if (r.name.includes('CZ') || r.name.includes('长征')) r.series = '长征系列';
        else if (r.name.includes('Falcon') || r.name.includes('Starship')) r.series = 'SpaceX';
        else r.series = '其他';
    }

    try {
      await prisma.rocket.create({ data: r });
      console.log(`Imported: ${r.name}`);
    } catch (e) {
      console.error(`Error importing ${r.name}: ${e.message}`);
    }
  }
}

seed()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });