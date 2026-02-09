// 根据 CSV 提交的映射关系来更新发动机配置
// 这是手动生成的映射表
const engineRocketRelations = {
  'Raptor 2': ['Starship'],
  'Merlin 1D++': ['Falcon 9'],
  'YF-21C': ['CZ-2C', 'CZ-2D', 'CZ-3A', 'CZ-3B', 'CZ-3C', 'CZ-4B', 'CZ-4C'],
  'YF-77': ['CZ-5'],
  'YF-100': ['CZ-5', 'CZ-5B', 'CZ-6', 'CZ-6A', 'CZ-6C', 'CZ-7', 'CZ-7A', 'CZ-8'],
  'YF-102': ['力箭一号', '天龙二号'],
  'YF-130': ['CZ-9'],
  'YF-209': ['CZ-12'], // 跃迁一号在数据库中没有，所以先跳过
  'YF-215': ['CZ-9'],
  'YF-100K': ['CZ-10'],
  'YF-100N': ['CZ-10'],
  'TQ-12A': ['朱雀三号'],
  'TQ-12B': ['朱雀三号'],
  'TH-12': ['天龙二号', '天龙三号'],
  'TH-12V': ['天龙三号'],
  'JD-2': [], // 双曲线三号 - 需要检查数据库中是否存在
  'CQ-50': ['智神星一号'],
  '力擎二号': ['力箭一号'],
  'Yuanli-110': [], // 引力二号/三号 - 数据库中没有对应的火箭
  'Thunder-RS': [], // 星云一号 - 数据库中没有
  '龙云': [], // 元行者一号 - 数据库中没有
  '跃迁-1号': [], // 跃迁一号 - 数据库中没有
  'YS-20': [], // 宇石一号 - 数据库中没有
};

// 现在列出需要更新的火箭及其应该使用的发动机
const updates = {
  'Starship': { firstStageEngine: 'Raptor 2' },
  'Falcon 9': { firstStageEngine: 'Merlin 1D++' },
  'CZ-2C': { firstStageEngine: '4 x YF-21C' },
  'CZ-2D': { firstStageEngine: '4 x YF-21C' },
  'CZ-3A': { firstStageEngine: '4 x YF-21C' },
  'CZ-3B': { firstStageEngine: '4 x YF-21C' },
  'CZ-3C': { firstStageEngine: '4 x YF-21C' },
  'CZ-4B': { firstStageEngine: '4 x YF-21C' },
  'CZ-4C': { firstStageEngine: '4 x YF-21C' },
  'CZ-5': { 
    firstStageEngine: '4 x YF-100',
    secondStageEngine: '2 x YF-77'
  },
  'CZ-5B': { 
    firstStageEngine: '4 x YF-100',
    secondStageEngine: '2 x YF-77'
  },
  'CZ-6': { firstStageEngine: '4 x YF-100' },
  'CZ-6A': { firstStageEngine: '4 x YF-100' },
  'CZ-6C': { firstStageEngine: '4 x YF-100' },
  'CZ-7': { firstStageEngine: '4 x YF-100' },
  'CZ-7A': { firstStageEngine: '4 x YF-100' },
  'CZ-8': { firstStageEngine: '4 x YF-100' },
  'CZ-9': { 
    firstStageEngine: 'YF-130 (或 YF-215)',
    secondStageEngine: 'YF-215'
  },
  'CZ-10': { 
    firstStageEngine: '4 x YF-100K',
    secondStageEngine: 'YF-100K'
  },
  '力箭一号': { firstStageEngine: 'YF-102' },
  '天龙二号': { 
    firstStageEngine: '4 x YF-102 / TH-12',
    secondStageEngine: 'YF-102'
  },
  '天龙三号': { 
    firstStageEngine: '4 x TH-12',
    secondStageEngine: 'TH-12V'
  },
  '朱雀二号': { firstStageEngine: 'TQ-12A' },
  '朱雀三号': { 
    firstStageEngine: '7 x TQ-12B',
    secondStageEngine: 'TQ-12B'
  },
  '智神星一号': { firstStageEngine: '7 x CQ-50' },
};

console.log('需要在 seed.js 中更新的火箭及发动机配置：\n');
Object.entries(updates).forEach(([rocketName, config]) => {
  console.log(`${rocketName}:`);
  if (config.firstStageEngine) {
    console.log(`  firstStageEngine: "${config.firstStageEngine}"`);
  }
  if (config.secondStageEngine) {
    console.log(`  secondStageEngine: "${config.secondStageEngine}"`);
  }
  if (config.thirdStageEngine) {
    console.log(`  thirdStageEngine: "${config.thirdStageEngine}"`);
  }
  console.log();
});

// 导出供脚本使用
module.exports = { engineRocketRelations, updates };
