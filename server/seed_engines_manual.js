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
    specificImpulse: '327 s (海平面)',
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
    specificImpulse: '282 s (海平面) / 311 s (真空)',
    restartCount: '多次',
    weight: '470 kg',
    throttleRange: '57% - 100%',
    gimbalAngle: null,
    usedBy: 'Falcon 9 (猎鹰9号)',
    description: '猎鹰9号的主力发动机，拥有极高的推重比和可靠性，支持多次重复使用。'
  },
  {
    name: 'YF-209',
    manufacturer: '航天六院',
    country: '中国',
    propellant: '液氧 / 甲烷',
    cycle: '燃气发生器循环',
    thrust: '780 kN (真空)',
    specificImpulse: '未公开',
    restartCount: '≥3次',
    weight: null,
    throttleRange: '27% - 108%',
    gimbalAngle: '±8°',
    usedBy: '商业可重复使用火箭',
    description: '航天六院发布的商业液氧甲烷发动机，专为重复使用运载火箭设计，支持深度变推。'
  },
  {
    name: 'YF-215',
    manufacturer: '航天六院',
    country: '中国',
    propellant: '液氧 / 甲烷',
    cycle: '全流量分级燃烧循环',
    thrust: '2000 kN (海平面)',
    specificImpulse: '327 s (海平面)', // Estimated similar to Raptor 2 class
    restartCount: '多次',
    weight: null,
    throttleRange: '25% - 110%',
    gimbalAngle: null,
    usedBy: '长征九号 (CZ-9)',
    description: '中国研制的200吨级全流量分级燃烧循环液氧甲烷发动机，将作为长征九号的主动力。'
  },
  {
    name: 'YF-100K',
    manufacturer: '航天六院',
    country: '中国',
    propellant: '液氧 / 煤油',
    cycle: '高压补燃循环',
    thrust: '1250 kN (海平面)',
    specificImpulse: '301.8 s (海平面)',
    restartCount: '1次',
    weight: '1900 kg (估)',
    throttleRange: '65% - 105%',
    gimbalAngle: '±8°',
    usedBy: '长征十号, 长征十二号',
    description: '基于YF-100改进的泵后摆发动机，结构紧凑，推力提升，是中国新一代载人火箭的主动力。'
  },
  {
    name: 'YF-102',
    manufacturer: '航天六院',
    country: '中国',
    propellant: '液氧 / 煤油',
    cycle: '燃气发生器循环',
    thrust: '835 kN (海平面)',
    specificImpulse: '275 s (海平面)',
    restartCount: '多次',
    weight: null,
    throttleRange: '55% - 100%',
    gimbalAngle: '±6°',
    usedBy: '天龙二号',
    description: '航天六院发布的80吨级开式循环商业发动机，已成功应用于天龙二号首飞。'
  },
  {
    name: 'TQ-12A',
    manufacturer: '蓝箭航天',
    country: '中国',
    propellant: '液氧 / 甲烷',
    cycle: '燃气发生器循环',
    thrust: '720 kN (海平面) / 836 kN (真空)',
    specificImpulse: '2840 m/s (海平面)',
    restartCount: '多次',
    weight: '<1000 kg',
    throttleRange: '60% - 110%',
    gimbalAngle: '±8°',
    usedBy: '朱雀二号 (ZQ-2)',
    description: '天鹊-12的改进型，推力和比冲提升，支持多次启动和推力调节，用于朱雀二号改进型。'
  },
  {
    name: 'TQ-12B',
    manufacturer: '蓝箭航天',
    country: '中国',
    propellant: '液氧 / 甲烷',
    cycle: '燃气发生器循环',
    thrust: '1000 kN (海平面)', // Uprated TQ-12
    specificImpulse: '285 s (海平面)',
    restartCount: '多次',
    weight: null,
    throttleRange: '50% - 110%',
    gimbalAngle: null,
    usedBy: '朱雀三号 (ZQ-3)',
    description: '天鹊-12系列的深度改进型，推力达到100吨级，专为大型可重复使用火箭朱雀三号设计。'
  },
  {
    name: 'TH-12',
    manufacturer: '天兵科技',
    country: '中国',
    propellant: '液氧 / 煤油',
    cycle: '燃气发生器循环',
    thrust: '1100 kN (海平面)',
    specificImpulse: '285 s (海平面)',
    restartCount: '多次',
    weight: null,
    throttleRange: '50% - 110%',
    gimbalAngle: '±8°',
    usedBy: '天龙三号 (TL-3)',
    description: '天火-12，国内首款110吨级大推力液氧煤油火箭发动机，对标Merlin 1D，用于天龙三号。'
  },
  {
    name: 'TH-12V',
    manufacturer: '天兵科技',
    country: '中国',
    propellant: '液氧 / 煤油',
    cycle: '燃气发生器循环',
    thrust: '约 1200 kN (真空)',
    specificImpulse: '335 s (真空)',
    restartCount: '多次',
    weight: null,
    throttleRange: '40% - 100%',
    gimbalAngle: null,
    usedBy: '天龙三号 (二级)',
    description: '天火-12的真空版，用于天龙三号的二级推进。'
  },
  {
    name: 'JD-2',
    manufacturer: '星际荣耀',
    country: '中国',
    propellant: '液氧 / 甲烷',
    cycle: '燃气发生器循环',
    thrust: '850 kN (海平面)',
    specificImpulse: '280 s (海平面)',
    restartCount: '多次',
    weight: null,
    throttleRange: '35% - 110%',
    gimbalAngle: '±8°',
    usedBy: '双曲线三号 (SQX-3)',
    description: '焦点二号，85吨级液氧甲烷发动机，支持深度变推和多次启动，用于双曲线三号可回收火箭。'
  },
  {
    name: 'CQ-50',
    manufacturer: '星河动力',
    country: '中国',
    propellant: '液氧 / 煤油',
    cycle: '燃气发生器循环',
    thrust: '500 kN (海平面)',
    specificImpulse: '282 s (海平面)',
    restartCount: '多次',
    weight: null,
    throttleRange: '40% - 100%',
    gimbalAngle: '±6°',
    usedBy: '智神星一号 (Pallas-1)',
    description: '苍穹-50，50吨级液氧煤油发动机，支持重复使用，将作为智神星一号的一级动力。'
  },
  {
    name: '力擎二号',
    manufacturer: '中科宇航',
    country: '中国',
    propellant: '液氧 / 煤油',
    cycle: '燃气发生器循环',
    thrust: '1100 kN (海平面)', // Verified 110 ton class
    specificImpulse: '285 s (海平面)',
    restartCount: '多次',
    weight: null,
    throttleRange: '可变推',
    gimbalAngle: null,
    usedBy: '力箭系列',
    description: '110吨级大推力液氧煤油发动机，采用针栓式喷注器，用于中科宇航未来的中大型火箭。'
  },
  {
    name: 'Yuanli-110',
    manufacturer: '东方空间',
    country: '中国',
    propellant: '液氧 / 煤油',
    cycle: '燃气发生器循环',
    thrust: '1100 kN (海平面)',
    specificImpulse: '285 s (海平面)',
    restartCount: '多次',
    weight: null,
    throttleRange: '40% - 110%',
    gimbalAngle: null,
    usedBy: '引力二号 (Gravity-2)',
    description: '原力-110，百吨级液氧煤油发动机，采用针栓技术，旨在实现低成本和可重复使用。'
  },
  {
    name: 'Thunder-RS',
    manufacturer: '深蓝航天',
    country: '中国',
    propellant: '液氧 / 煤油',
    cycle: '燃气发生器循环',
    thrust: '1000 kN',
    specificImpulse: '未公开',
    restartCount: '多次',
    weight: null,
    throttleRange: '可变推',
    gimbalAngle: null,
    usedBy: '星云系列',
    description: '雷霆-RS，深蓝航天研发的大推力可复用液氧煤油发动机。'
  },
  {
    name: '龙云',
    manufacturer: '九州云箭',
    country: '中国',
    propellant: '液氧 / 甲烷',
    cycle: '燃气发生器循环',
    thrust: '676 kN (海平面)',
    specificImpulse: '2842 m/s (真空)',
    restartCount: '≥3次',
    weight: '≤650 kg',
    throttleRange: '32% - 106%',
    gimbalAngle: '±8°',
    usedBy: '元行者一号',
    description: '国内首款多次启动、深度变推的液氧甲烷发动机，已完成多次试车验证。'
  },
  {
    name: '跃迁-1号',
    manufacturer: '大航跃迁',
    country: '中国',
    propellant: '液氧 / 甲烷',
    cycle: '未公开',
    thrust: '800 kN (海平面)',
    specificImpulse: '未公开',
    restartCount: '多次',
    weight: null,
    throttleRange: '可变推',
    gimbalAngle: null,
    usedBy: '跃迁一号',
    description: '80吨级液氧甲烷发动机，将用于“筷子夹”回收型液体火箭跃迁一号。'
  },
  {
    name: 'YS-20',
    manufacturer: '宇石空间',
    country: '中国',
    propellant: '液氧 / 煤油',
    cycle: '燃气发生器循环',
    thrust: '200 kN (海平面)',
    specificImpulse: '275 s (海平面)',
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
