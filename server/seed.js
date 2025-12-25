const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function parseMarkdownAndSeed() {
  const docPath = path.join(__dirname, '../doc/20251225-运载火箭信息表.md');
  
  if (!fs.existsSync(docPath)) {
    console.error('Data file not found:', docPath);
    return;
  }

  const content = fs.readFileSync(docPath, 'utf-8');
  const lines = content.split('\n');

  console.log('Starting seed process...');
  
  // 清空现有数据
  await prisma.rocket.deleteMany({});
  console.log('Cleared existing data.');

  let currentSection = '';
  let tableHeader = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // 识别章节标题
    if (line.startsWith('## ')) {
      currentSection = line.replace('## ', '').trim();
      continue;
    }

    // 识别表格行
    if (line.startsWith('|')) {
      const cols = line.split('|').map(c => c.trim()).filter(c => c !== '');
      
      // 跳过分隔线行 (---|---|...)
      if (cols.length > 0 && cols[0].includes('---')) continue;

      // 识别表头
      if (line.includes('**型号**') || line.includes('**系列**')) {
        // 简单处理：我们主要靠列的位置或者关键词来映射，因为表头不太一样
        continue; 
      }

      // 处理数据行
      // 长征系列表格结构:
      // 系列|型号|国家|研制单位|首发时间|发射历史|状态|高度|直径|起飞质量|LEO|GTO|一级燃料|一级发动机|特征
      
      // 商业航天表格结构:
      // 系列|型号|国家|研制单位|首发时间|燃料|LEO|核心特征|是否可回收
      
      // 国际主流表格结构:
      // 系列|型号|国家|研制单位|状态|LEO|GTO|推力|是否可回收|回收方案

      let rocketData = {};

      // 简单映射逻辑
      if (currentSection.includes('长征系列')) {
        if (cols.length < 14) continue;
        rocketData = {
          series: cols[0],
          name: cols[1],
          country: cols[2],
          manufacturer: cols[3],
          firstFlight: cols[4],
          status: cols[6],
          height: cols[7],
          diameter: cols[8],
          mass: cols[9],
          leoCapacity: cols[10],
          gtoCapacity: cols[11],
          fuel: cols[12],
          engines: cols[13],
          description: cols[14],
          isReusable: false
        };
      } else if (currentSection.includes('中国商业航天')) {
        if (cols.length < 8) continue;
         rocketData = {
          series: '中国商业航天',
          name: cols[1],
          country: cols[2],
          manufacturer: cols[3],
          firstFlight: cols[4],
          fuel: cols[5],
          leoCapacity: cols[6],
          description: cols[7],
          isReusable: cols[8].includes('是') || cols[8].includes('回收')
        };
      } else if (currentSection.includes('国际主流')) {
        if (cols.length < 9) continue;
        rocketData = {
          series: cols[0],
          name: cols[1],
          country: cols[2],
          manufacturer: cols[3],
          status: cols[4],
          leoCapacity: cols[5],
          gtoCapacity: cols[6],
          description: `芯一级推力: ${cols[7]}`,
          isReusable: cols[8].includes('是')
        };
      }

      if (rocketData.name) {
        try {
          await prisma.rocket.create({
            data: rocketData
          });
          console.log(`Imported: ${rocketData.name}`);
        } catch (e) {
          console.log(`Skipped (duplicate or error): ${rocketData.name}`);
        }
      }
    }
  }
  
  console.log('Seeding completed.');
}

parseMarkdownAndSeed()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
