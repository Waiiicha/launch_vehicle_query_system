const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const enginesData = [
  {
    name: 'Raptor 2',
    manufacturer: 'SpaceX',
    country: '美国',
    propellant: '液氧 / 甲烷',
    cycle: '全流量分级燃烧循环',
    thrust: '2260 kN (海平面)',
    specificImpulse: '327 s / 3204.6 m/s (海平面)',
    specificImpulseSecond: 327,
    restartCount: '多次',
    weight: '1630 kg',
    throttleRange: '40% - 100%',
    gimbalAngle: null,
    usedBy: 'Starship (星舰)',
    description: 'SpaceX星舰使用的第二代全流量分级燃烧循环发动机，推力大幅提升，结构更简化。'
  },
  {
    name: 'Merlin 1D++',
    manufacturer: 'SpaceX',
    country: '美国',
    propellant: '液氧 / 煤油',
    cycle: '燃气发生器循环',
    thrust: '845 kN (海平面) / 981 kN (真空)',
    specificImpulse: '282 s / 2763.6 m/s (海平面) / 311 s / 3047.8 m/s (真空)',
    specificImpulseSecond: 282,
    restartCount: '多次',
    weight: '470 kg',
    throttleRange: '57% - 100%',
    gimbalAngle: null,
    usedBy: 'Falcon 9 (猎鹰9号)',
    description: '猎鹰9号的主力发动机，拥有极高的推重比和可靠性，支持多次重复使用。'
  },
  {
    name: 'YF-209',
    manufacturer: '航天六院 (CAST)',
    country: '中国',
    propellant: '液氧 / 甲烷',
    cycle: '燃气发生器循环',
    thrust: '780 kN (真空)',
    specificImpulse: '未公开',
    specificImpulseSecond: null,
    restartCount: '≥3次',
    weight: null,
    throttleRange: '27% - 108%',
    gimbalAngle: '±8°',
    usedBy: '商业可重复使用火箭',
    description: '航天六院发布的商业液氧甲烷发动机，专为重复使用运载火箭设计，支持深度变推。'
  },
  {
    name: 'YF-215',
    manufacturer: '航天六院 (CAST)',
    country: '中国',
    propellant: '液氧 / 甲烷',
    cycle: '全流量分级燃烧循环',
    thrust: '2000 kN (海平面)',
    specificImpulse: '327 s / 3204.6 m/s (海平面)',
    specificImpulseSecond: 327,
    restartCount: '多次',
    weight: null,
    throttleRange: '25% - 110%',
    gimbalAngle: null,
    usedBy: '长征九号 (CZ-9)',
    description: '中国研制的200吨级全流量分级燃烧循环液氧甲烷发动机，将作为长征九号的主动力。'
  },
  {
    name: 'YF-100K',
    manufacturer: '航天六院 (CAST)',
    country: '中国',
    propellant: '液氧 / 煤油',
    cycle: '高压补燃循环',
    thrust: '1250 kN (海平面)',
    specificImpulse: '301.8 s / 2957.6 m/s (海平面)',
    specificImpulseSecond: 301.8,
    restartCount: '1次',
    weight: '1900 kg (估)',
    throttleRange: '65% - 105%',
    gimbalAngle: '±8°',
    usedBy: '长征十号, 长征十二号',
    description: '基于YF-100改进的泵后摆发动机，结构紧凑，推力提升，是中国新一代载人火箭的主动力。'
  },
  {
    name: 'YF-102',
    manufacturer: '航天六院 (CAST)',
    country: '中国',
    propellant: '液氧 / 煤油',
    cycle: '燃气发生器循环',
    thrust: '835 kN (海平面)',
    specificImpulse: '275 s / 2695 m/s (海平面)',
    specificImpulseSecond: 275,
    restartCount: '多次',
    weight: null,
    throttleRange: '55% - 100%',
    gimbalAngle: '±6°',
    usedBy: '天龙二号',
    description: '航天六院发布的80吨级开式循环商业发动机，已成功应用于天龙二号首飞。'
  },
  {
    name: 'YF-21C',
    manufacturer: '航天六院 (CAST)',
    country: '中国',
    propellant: '四氧化二氮 / 偏二甲肼',
    cycle: '燃气发生器循环',
    thrust: '2960 kN (海平面)',
    specificImpulse: '259 s / 2538.2 m/s (有效喷气速度)',
    specificImpulseSecond: 259,
    restartCount: '1次',
    weight: '2850 kg',
    twRatio: '100',
    throttleRange: '不可调节',
    gimbalAngle: '±10°',
    usedBy: '长征二/三/四号',
    description: '常温推进剂芯一级发动机，长期用于长征二/三/四号系列。'
  },
  {
    name: 'YF-77',
    manufacturer: '航天六院 (CAST)',
    country: '中国',
    propellant: '液氧 / 液氢',
    cycle: '燃气发生器循环',
    thrust: '518 kN (海平面)',
    specificImpulse: '317 s / 3103.7 m/s (有效喷气速度)',
    specificImpulseSecond: 317,
    restartCount: '1次',
    weight: '1375 kg',
    twRatio: '38',
    throttleRange: '不可调节',
    gimbalAngle: '±8°',
    usedBy: '长征五号',
    description: '长征五号芯一级主发动机。'
  },
  {
    name: 'YF-100',
    manufacturer: '西安航天动力研究所 (XADRI)',
    country: '中国',
    propellant: '液氧 / 煤油',
    cycle: '高压补燃富氧分级燃烧循环',
    thrust: '1200 kN (海平面)',
    specificImpulse: '300 s / 2940 m/s (有效喷气速度)',
    specificImpulseSecond: 300,
    restartCount: '1次',
    weight: '1900 kg',
    twRatio: null,
    throttleRange: '65% - 105%',
    gimbalAngle: '±8°',
    usedBy: '长征五助推器, 长征六/七/八',
    description: '新一代液氧煤油大推力发动机，应用于多型长征火箭。'
  },
  {
    name: 'YF-130',
    manufacturer: '航天六院 (CAST)',
    country: '中国',
    propellant: '液氧 / 煤油',
    cycle: '高压补燃富氧分级燃烧循环',
    thrust: '5000 kN (海平面)',
    specificImpulse: null,
    specificImpulseSecond: null,
    restartCount: null,
    weight: '＞6000 kg',
    twRatio: '＞73',
    throttleRange: null,
    gimbalAngle: null,
    usedBy: '长征九号（2011）',
    description: '在研的500吨级发动机概念方案，长征九号早期方案使用。'
  },
  {
    name: 'YF-100N',
    manufacturer: '航天六院 (CAST)',
    country: '中国',
    propellant: '液氧 / 煤油',
    cycle: '高压补燃富氧分级燃烧循环',
    thrust: '1250 kN (海平面)',
    specificImpulse: '302 s / 2958 m/s (有效喷气速度)',
    specificImpulseSecond: 302,
    restartCount: '2次',
    weight: null,
    twRatio: '70.1',
    throttleRange: '65% - 105%',
    gimbalAngle: '±8°',
    usedBy: '长征十号甲（载人）',
    description: 'YF-100系列改进型，支持多次点火。'
  },
  {
    name: 'TQ-12A',
    manufacturer: '蓝箭航天 (LandSpace)',
    country: '中国',
    propellant: '液氧 / 甲烷',
    cycle: '燃气发生器循环',
    thrust: '720 kN (海平面) / 836 kN (真空)',
    specificImpulse: '290 s / 2840 m/s (海平面)',
    specificImpulseSecond: 290,
    restartCount: '多次',
    weight: '<1000 kg',
    throttleRange: '60% - 110%',
    gimbalAngle: '±8°',
    usedBy: '朱雀二号 (ZQ-2)',
    description: '天鹊-12的改进型，推力和比冲提升，支持多次启动和推力调节，用于朱雀二号改进型。'
  },
  {
    name: 'TQ-12B',
    manufacturer: '蓝箭航天 (LandSpace)',
    country: '中国',
    propellant: '液氧 / 甲烷',
    cycle: '燃气发生器循环',
    thrust: '1000 kN (海平面)',
    specificImpulse: '285 s / 2793 m/s (海平面)',
    specificImpulseSecond: 285,
    restartCount: '多次',
    weight: null,
    throttleRange: '50% - 110%',
    gimbalAngle: null,
    usedBy: '朱雀三号 (ZQ-3)',
    description: '天鹊-12系列的深度改进型，推力达到100吨级，专为大型可重复使用火箭朱雀三号设计。'
  },
  {
    name: 'TH-12',
    manufacturer: '天兵科技 (Space Pioneer)',
    country: '中国',
    propellant: '液氧 / 煤油',
    cycle: '燃气发生器循环',
    thrust: '1100 kN (海平面)',
    specificImpulse: '285 s / 2793 m/s (海平面)',
    specificImpulseSecond: 285,
    restartCount: '多次',
    description: '天火-12，国内首款110吨级大推力液氧煤油火箭发动机，对标Merlin 1D，用于天龙三号。'
  },
  {
    name: 'TH-12V',
    manufacturer: '天兵科技 (Space Pioneer)',
    country: '中国',
    propellant: '液氧 / 煤油',
    cycle: '燃气发生器循环',
    thrust: '约 1200 kN (真空)',
    specificImpulse: '335 s / 3283 m/s (真空)',
    specificImpulseSecond: 335,
    restartCount: '多次',
    weight: null,
    throttleRange: '40% - 100%',
    gimbalAngle: null,
    usedBy: '天龙三号 (二级)',
    description: '天火-12的真空版，用于天龙三号的二级推进。'
  },
  {
    name: 'JD-2',
    manufacturer: '星际荣耀 (i-Space)',
    country: '中国',
    propellant: '液氧 / 甲烷',
    cycle: '燃气发生器循环',
    thrust: '850 kN (海平面)',
    specificImpulse: '280 s / 2744 m/s (海平面)',
    specificImpulseSecond: 280,
    restartCount: '多次',
    weight: null,
    throttleRange: '35% - 110%',
    gimbalAngle: '±8°',
    usedBy: '双曲线三号 (SQX-3)',
    description: '焦点二号，85吨级液氧甲烷发动机，支持深度变推和多次启动，用于双曲线三号可回收火箭。'
  },
  {
    name: 'CQ-50',
    manufacturer: '星河动力 (Galactic Energy)',
    country: '中国',
    propellant: '液氧 / 煤油',
    cycle: '燃气发生器循环',
    thrust: '500 kN (海平面)',
    specificImpulse: '282 s / 2763.6 m/s (海平面)',
    specificImpulseSecond: 282,
    restartCount: '多次',
    weight: null,
    throttleRange: '40% - 100%',
    gimbalAngle: '±6°',
    usedBy: '智神星一号 (Pallas-1)',
    description: '苍穹-50，50吨级液氧煤油发动机，支持重复使用，将作为智神星一号的一级动力。'
  },
  {
    name: '力擎二号',
    manufacturer: '中科宇航 (CAS Space)',
    country: '中国',
    propellant: '液氧 / 煤油',
    cycle: '燃气发生器循环',
    thrust: '1100 kN (海平面)',
    specificImpulse: '285 s / 2793 m/s (海平面)',
    specificImpulseSecond: 285,
    restartCount: '多次',
    weight: null,
    throttleRange: '可变推',
    gimbalAngle: null,
    usedBy: '力箭系列',
    description: '110吨级大推力液氧煤油发动机，采用针栓式喷注器，用于中科宇航未来的中大型火箭。'
  },
  {
    name: 'Yuanli-110',
    manufacturer: '东方空间 (Orienspace)',
    country: '中国',
    propellant: '液氧 / 煤油',
    cycle: '燃气发生器循环',
    thrust: '1100 kN (海平面)',
    specificImpulse: '285 s / 2793 m/s (海平面)',
    specificImpulseSecond: 285,
    restartCount: '多次',
    weight: null,
    throttleRange: '40% - 110%',
    gimbalAngle: null,
    usedBy: '引力二号 (Gravity-2)',
    description: '原力-110，百吨级液氧煤油发动机，采用针栓技术，旨在实现低成本和可重复使用。'
  },
  {
    name: 'Thunder-RS',
    manufacturer: '深蓝航天 (Deep Blue)',
    country: '中国',
    propellant: '液氧 / 煤油',
    cycle: '燃气发生器循环',
    thrust: '1000 kN',
    specificImpulse: '未公开',
    specificImpulseSecond: null,
    restartCount: '多次',
    weight: null,
    throttleRange: '可变推',
    gimbalAngle: null,
    usedBy: '星云系列',
    description: '雷霆-RS，深蓝航天研发的大推力可复用液氧煤油发动机。'
  },
  {
    name: '龙云',
    manufacturer: '九州云箭 (JZYJ)',
    country: '中国',
    propellant: '液氧 / 甲烷',
    cycle: '燃气发生器循环',
    thrust: '676 kN (海平面)',
    specificImpulse: '290 s / 2842 m/s (真空)',
    specificImpulseSecond: 290,
    restartCount: '≥3次',
    weight: '≤650 kg',
    throttleRange: '32% - 106%',
    gimbalAngle: '±8°',
    usedBy: '元行者一号',
    description: '国内首款多次启动、深度变推的液氧甲烷发动机，已完成多次试车验证。'
  },
  {
    name: '跃迁-1号',
    manufacturer: '大航跃迁 (Dahang Yueqian)',
    country: '中国',
    propellant: '液氧 / 甲烷',
    cycle: '未公开',
    thrust: '800 kN (海平面)',
    specificImpulse: '未公开',
    specificImpulseSecond: null,
    restartCount: '多次',
    weight: null,
    throttleRange: '可变推',
    gimbalAngle: null,
    usedBy: '跃迁一号',
    description: '80吨级液氧甲烷发动机，将用于“筷子夹”回收型液体火箭跃迁一号。'
  },
  {
    name: 'YS-20',
    manufacturer: '宇石空间 (Yushi Space)',
    country: '中国',
    propellant: '液氧 / 煤油',
    cycle: '燃气发生器循环',
    thrust: '200 kN (海平面)',
    specificImpulse: '275 s / 2695 m/s (海平面)',
    specificImpulseSecond: 275,
    restartCount: '多次',
    weight: null,
    throttleRange: '可变推',
    gimbalAngle: null,
    usedBy: '商业微型火箭',
    description: '20吨级小型液氧煤油发动机，结构简单，成本低廉。'
  }
];

async function main() {
  console.log('Clearing database and seeding 18 curated engine models...');
  
  await prisma.engine.deleteMany({});
  console.log('Database cleared.');

  for (const engine of enginesData) {
    try {
      await prisma.engine.create({
        data: engine
      });
      console.log(`Created: ${engine.name}`);
    } catch (e) {
      console.error(`Failed to create ${engine.name}: ${e.message}`);
    }
  }
  
  console.log(`Seeding finished. Total: ${enginesData.length}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
