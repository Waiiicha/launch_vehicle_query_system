const fs = require('fs');
const path = require('path');
const csv = require('csv-parse/lib/sync');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// 读取 CSV 文件
const csvPath = path.join(__dirname, '../doc/20260208-火箭发动机.csv');
const csvContent = fs.readFileSync(csvPath, 'utf-8');

// 解析 CSV - 中文不需要特殊处理，使用标准解析
const records = csv(csvContent, {
  columns: true,
  skip_empty_lines: true,
});

// 火箭名称映射：从 CSV 中的火箭名称映射到数据库中的火箭名称
const rocketNameMap = {
  '星舰': 'Starship',
  '猎鹰9': 'Falcon 9',
  '猎鹰9号': 'Falcon 9',
  '长征二号': ['CZ-2C', 'CZ-2D'],
  '长征三号': ['CZ-3A', 'CZ-3B', 'CZ-3C'],
  '长征四号': ['CZ-4B', 'CZ-4C'],
  '长征二/三/四号': ['CZ-2C', 'CZ-2D', 'CZ-3A', 'CZ-3B', 'CZ-3C', 'CZ-4B', 'CZ-4C'],
  '长征五号': 'CZ-5',
  '长征五号B': 'CZ-5B',
  '长征五': ['CZ-5', 'CZ-5B'],
  '长征五助推器': ['CZ-5', 'CZ-5B'],
  '长征六': 'CZ-6',
  '长征六A': 'CZ-6A',
  '长征六C': 'CZ-6C',
  '长征六/七/八': ['CZ-6', 'CZ-6A', 'CZ-6C', 'CZ-7', 'CZ-7A', 'CZ-8'],
  '长征七': 'CZ-7',
  '长征七A': 'CZ-7A',
  '长征八': 'CZ-8',
  '长征九号': 'CZ-9',
  '长征十号': 'CZ-10',
  '长征十号甲': 'CZ-10',
  '长征十号乙': 'CZ-10',
  '长征十': ['CZ-10', 'CZ-11', 'CZ-12'],
  '长征十一号': 'CZ-11',
  '长征十二号': 'CZ-12',
  '长征十二号甲': 'CZ-12',
  '力箭二号': '力箭一号',
  '天龙二号': '天龙二号',
  '天龙三号': '天龙三号',
  '朱雀二号': '朱雀二号',
  '朱雀三号': '朱雀三号',
  '双曲线三号': '智神星一号', // 暂时映射
  '智神星一号': '智神星一号',
  '元行者一号': '智神星一号', // 暂时映射
};

// 创建发动机使用的火箭列表
const engineRocketRelations = {};

// 处理每个发动机记录
records.forEach(record => {
  const engineName = record['芯一级发动机'] || record['发动机名称'];
  const usedRockets = record['使用型号'] || record['使用型号 '];

  if (engineName && usedRockets && usedRockets.trim()) {
    // 清理引擎名称
    const cleanEngineName = engineName.trim();
    
    // 分割火箭名称（可能有多个，用换行或斜杠分隔）
    const rocketNames = usedRockets
      .split(/[/\/\n，,；;]/)
      .map(n => n.trim())
      .filter(n => n);

    if (!engineRocketRelations[cleanEngineName]) {
      engineRocketRelations[cleanEngineName] = [];
    }

    rocketNames.forEach(rocketName => {
      // 查找映射的火箭名称
      if (rocketNameMap[rocketName]) {
        const mappedNames = rocketNameMap[rocketName];
        if (Array.isArray(mappedNames)) {
          engineRocketRelations[cleanEngineName] = [
            ...engineRocketRelations[cleanEngineName],
            ...mappedNames
          ];
        } else {
          engineRocketRelations[cleanEngineName].push(mappedNames);
        }
      } else {
        console.log(`⚠️  未找到火箭名称映射: ${rocketName}`);
      }
    });

    // 去重
    engineRocketRelations[cleanEngineName] = [
      ...new Set(engineRocketRelations[cleanEngineName])
    ];
  }
});

console.log('发动机-火箭关系映射：');
console.log(JSON.stringify(engineRocketRelations, null, 2));

async function updateRockets() {
  console.log('\n开始更新火箭数据...');
  
  // 对于每个火箭，查找使用的发动机
  const rockets = await prisma.rocket.findMany();
  
  for (const rocket of rockets) {
    console.log(`\n处理火箭: ${rocket.name}`);
    
    // 查找所有使用这个火箭的发动机
    let updates = {};
    
    for (const [engineName, rocketList] of Object.entries(engineRocketRelations)) {
      if (rocketList.includes(rocket.name)) {
        // 根据发动机在火箭中的位置，更新相应的字段
        // 这是一个简化的方法，可能需要手动调整
        
        // 检查当前字段是否已包含这个发动机
        if (rocket.firstStageEngine && !rocket.firstStageEngine.includes(engineName)) {
          console.log(`  - 一级发动机: 添加 ${engineName}`);
          updates.firstStageEngine = `${rocket.firstStageEngine} / ${engineName}`;
        } else if (!updates.firstStageEngine && !rocket.firstStageEngine) {
          console.log(`  - 一级发动机: ${engineName}`);
          updates.firstStageEngine = engineName;
        }
      }
    }
    
    if (Object.keys(updates).length > 0) {
      await prisma.rocket.update({
        where: { id: rocket.id },
        data: updates
      });
    }
  }
  
  console.log('\n✅ 更新完成！');
}

updateRockets()
  .catch(e => console.error('错误:', e))
  .finally(async () => {
    await prisma.$disconnect();
  });
