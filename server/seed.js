const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const rocketsData = [
  // --- 1. 长征系列 (Long March) ---
  {
    name: "CZ-1",
    series: "长征系列",
    country: "中国",
    manufacturer: "航天一院",
    status: "退役",
    leoCapacity: 0.3,
    firstStageFuel: "常温(毒)", // 归类便于筛选
    description: "中国首枚火箭，发射东方红一号",
    imageUrl: "https://placehold.co/800x600/f5f5f7/1d1d1f?text=Long+March+1"
  },
  {
    name: "CZ-2C",
    series: "长征系列",
    country: "中国",
    manufacturer: "航天一院",
    status: "现役",
    leoCapacity: 3.85,
    firstStageFuel: "常温(毒)",
    description: "中国金牌火箭，主要用于遥感卫星发射",
    imageUrl: "https://placehold.co/800x600/f5f5f7/1d1d1f?text=Long+March+2C"
  },
  {
    name: "CZ-2D",
    series: "长征系列",
    country: "中国",
    manufacturer: "航天八院",
    status: "现役",
    leoCapacity: 3.5,
    firstStageFuel: "常温(毒)",
    description: "主要用于SSO轨道任务，发射频率极高",
    imageUrl: "https://placehold.co/800x600/f5f5f7/1d1d1f?text=Long+March+2D"
  },
  {
    name: "CZ-2F",
    series: "长征系列",
    country: "中国",
    manufacturer: "航天一院",
    status: "现役",
    leoCapacity: 8.6,
    firstStageFuel: "常温(毒)",
    description: "神箭，载人航天神舟飞船专用火箭，配备逃逸塔",
    imageUrl: "https://placehold.co/800x600/f5f5f7/1d1d1f?text=Long+March+2F"
  },
  {
    name: "CZ-3B",
    series: "长征系列",
    country: "中国",
    manufacturer: "航天一院",
    status: "现役",
    leoCapacity: 11.5,
    gtoCapacity: 5.5,
    firstStageFuel: "常温(毒)",
    thirdStageFuel: "液氢/液氧",
    description: "北斗卫星、深空探测主力，掌握氢氧三级技术",
    imageUrl: "https://placehold.co/800x600/f5f5f7/1d1d1f?text=Long+March+3B"
  },
  {
    name: "CZ-4B/C",
    series: "长征系列",
    country: "中国",
    manufacturer: "航天八院",
    status: "现役",
    leoCapacity: 4.2,
    firstStageFuel: "常温(毒)",
    description: "SSO轨道主力，风云气象卫星发射平台",
    imageUrl: "https://placehold.co/800x600/f5f5f7/1d1d1f?text=Long+March+4"
  },
  {
    name: "CZ-5",
    series: "长征系列",
    country: "中国",
    manufacturer: "航天一院",
    status: "现役",
    height: 56.97,
    diameter: 5.0,
    mass: 869.0,
    leoCapacity: 25.0, // 修正为最大能力
    gtoCapacity: 14.0,
    marsCapacity: 6.0,
    firstStageFuel: "液氢/液氧",
    firstStageEngine: "2*YF-77",
    firstStageThrust: "10570 kN",
    description: "胖五，中国现役最强，负责火星探测、月球采样返回",
    imageUrl: "https://placehold.co/800x600/f5f5f7/1d1d1f?text=Long+March+5"
  },
  {
    name: "CZ-5B",
    series: "长征系列",
    country: "中国",
    manufacturer: "航天一院",
    status: "现役",
    leoCapacity: 25.0,
    firstStageFuel: "液氢/液氧",
    description: "空间站舱段专用运载火箭",
    imageUrl: "https://placehold.co/800x600/f5f5f7/1d1d1f?text=Long+March+5B"
  },
  {
    name: "CZ-6A",
    series: "长征系列",
    country: "中国",
    manufacturer: "航天八院",
    status: "现役",
    leoCapacity: 4.5,
    firstStageFuel: "液氧/煤油",
    description: "中国首款固液混合运载火箭",
    imageUrl: "https://placehold.co/800x600/f5f5f7/1d1d1f?text=Long+March+6A"
  },
  {
    name: "CZ-7",
    series: "长征系列",
    country: "中国",
    manufacturer: "航天一院",
    status: "现役",
    leoCapacity: 13.5,
    firstStageFuel: "液氧/煤油",
    description: "天舟货运飞船发射，新一代中型火箭",
    imageUrl: "https://placehold.co/800x600/f5f5f7/1d1d1f?text=Long+March+7"
  },
  {
    name: "CZ-8",
    series: "长征系列",
    country: "中国",
    manufacturer: "航天一院",
    status: "现役",
    leoCapacity: 8.1,
    firstStageFuel: "液氧/煤油",
    isReusable: true,
    description: "太阳同步轨道主力，具备垂直回收潜力",
    imageUrl: "https://placehold.co/800x600/f5f5f7/1d1d1f?text=Long+March+8"
  },
  {
    name: "CZ-9",
    series: "长征系列",
    country: "中国",
    manufacturer: "航天一院",
    status: "研发中",
    leoCapacity: 150.0,
    marsCapacity: 44.0,
    firstStageFuel: "液氧/甲烷",
    firstStageEngine: "30*YF-215",
    isReusable: true,
    description: "下一代超重型火箭，对标Starship，目标火星殖民",
    imageUrl: "https://placehold.co/800x600/f5f5f7/1d1d1f?text=Long+March+9"
  },
  {
    name: "CZ-10",
    series: "长征系列",
    country: "中国",
    manufacturer: "航天一院",
    status: "研发中",
    leoCapacity: 70.0,
    marsCapacity: 27.0,
    firstStageFuel: "液氧/煤油",
    description: "载人登月核心工具，921火箭",
    imageUrl: "https://placehold.co/800x600/f5f5f7/1d1d1f?text=Long+March+10"
  },
  {
    name: "CZ-12",
    series: "长征系列",
    country: "中国",
    manufacturer: "航天八院",
    status: "现役",
    leoCapacity: 12.0,
    firstStageFuel: "液氧/煤油",
    description: "首个3.8米直径，兼容铁路运输",
    imageUrl: "https://placehold.co/800x600/f5f5f7/1d1d1f?text=Long+March+12"
  },
  {
    name: "CZ-12A",
    series: "长征系列",
    country: "中国",
    manufacturer: "航天八院",
    status: "测试中",
    leoCapacity: 12.0,
    firstStageFuel: "液氧/甲烷",
    isReusable: true,
    description: "长征12的回收版本，动力系统更换为甲烷机",
    imageUrl: "https://placehold.co/800x600/f5f5f7/1d1d1f?text=Long+March+12A"
  },

  // --- 2. 中国商业航天 ---
  {
    name: "快舟1A",
    series: "中国商业航天",
    country: "中国",
    manufacturer: "航天科工",
    status: "现役",
    leoCapacity: 0.3,
    firstStageFuel: "固体",
    description: "快速响应，车载机动发射",
    imageUrl: "https://placehold.co/800x600/f5f5f7/1d1d1f?text=Kuaizhou-1A"
  },
  {
    name: "朱雀二号",
    series: "中国商业航天",
    country: "中国",
    manufacturer: "蓝箭航天",
    status: "现役",
    leoCapacity: 6.0,
    firstStageFuel: "液氧/甲烷",
    firstStageEngine: "TQ-12",
    description: "全球首款入轨液氧甲烷火箭",
    imageUrl: "https://placehold.co/800x600/f5f5f7/1d1d1f?text=Zhuque-2"
  },
  {
    name: "朱雀三号",
    series: "中国商业航天",
    country: "中国",
    manufacturer: "蓝箭航天",
    status: "研发中",
    leoCapacity: 21.0,
    firstStageFuel: "液氧/甲烷",
    isReusable: true,
    description: "全不锈钢箭体，对标Falcon 9",
    imageUrl: "https://placehold.co/800x600/f5f5f7/1d1d1f?text=Zhuque-3"
  },
  {
    name: "力箭一号",
    series: "中国商业航天",
    country: "中国",
    manufacturer: "中科宇航",
    status: "现役",
    leoCapacity: 2.0,
    firstStageFuel: "固体",
    description: "中国目前运力最大的固体火箭之一",
    imageUrl: "https://placehold.co/800x600/f5f5f7/1d1d1f?text=Lijian-1"
  },
  {
    name: "引力一号",
    series: "中国商业航天",
    country: "中国",
    manufacturer: "东方空间",
    status: "现役",
    leoCapacity: 6.5,
    firstStageFuel: "固体",
    description: "全球运力最强固体火箭，海上发射",
    imageUrl: "https://placehold.co/800x600/f5f5f7/1d1d1f?text=Gravity-1"
  },
  {
    name: "谷神星一号",
    series: "中国商业航天",
    country: "中国",
    manufacturer: "星河动力",
    status: "现役",
    leoCapacity: 0.4,
    firstStageFuel: "固体",
    description: "民营商业发射频率最高型号",
    imageUrl: "https://placehold.co/800x600/f5f5f7/1d1d1f?text=Ceres-1"
  },
  {
    name: "天龙二号",
    series: "中国商业航天",
    country: "中国",
    manufacturer: "天兵科技",
    status: "现役",
    leoCapacity: 2.0,
    firstStageFuel: "液氧/煤油",
    description: "民营液体火箭首飞即成功",
    imageUrl: "https://placehold.co/800x600/f5f5f7/1d1d1f?text=Tianlong-2"
  },

  // --- 3. 国际主流 ---
  {
    name: "Falcon 9",
    series: "SpaceX",
    country: "美国",
    manufacturer: "SpaceX",
    status: "现役",
    leoCapacity: 22.8,
    gtoCapacity: 8.3,
    marsCapacity: 4.0,
    firstStageFuel: "液氧/煤油",
    isReusable: true,
    description: "全球最成熟的复用火箭，星链建设主力",
    imageUrl: "https://placehold.co/800x600/f5f5f7/1d1d1f?text=Falcon+9"
  },
  {
    name: "Falcon Heavy",
    series: "SpaceX",
    country: "美国",
    manufacturer: "SpaceX",
    status: "现役",
    leoCapacity: 63.8,
    marsCapacity: 16.8,
    plutoCapacity: 3.5,
    firstStageFuel: "液氧/煤油",
    isReusable: true,
    description: "现役运力第二强，三枚芯级垂直回收",
    imageUrl: "https://placehold.co/800x600/f5f5f7/1d1d1f?text=Falcon+Heavy"
  },
  {
    name: "Starship",
    series: "SpaceX",
    country: "美国",
    manufacturer: "SpaceX",
    status: "测试中",
    leoCapacity: 150.0,
    marsCapacity: 100.0,
    firstStageFuel: "液氧/甲烷",
    isReusable: true,
    description: "人类最强火箭，完全复用，目标火星",
    imageUrl: "https://placehold.co/800x600/f5f5f7/1d1d1f?text=Starship"
  },
  {
    name: "SLS Block 1",
    series: "NASA",
    country: "美国",
    manufacturer: "NASA",
    status: "现役",
    leoCapacity: 95.0,
    marsCapacity: 20.0,
    firstStageFuel: "液氢/液氧",
    description: "Artemis计划核心，重返月球",
    imageUrl: "https://placehold.co/800x600/f5f5f7/1d1d1f?text=SLS"
  },
  {
    name: "Vulcan Centaur",
    series: "ULA",
    country: "美国",
    manufacturer: "ULA",
    status: "现役",
    leoCapacity: 27.2,
    firstStageFuel: "液氧/甲烷",
    isReusable: true,
    description: "替代Atlas V和Delta IV，ULA新一代主力",
    imageUrl: "https://placehold.co/800x600/f5f5f7/1d1d1f?text=Vulcan"
  },
  {
    name: "New Glenn",
    series: "Blue Origin",
    country: "美国",
    manufacturer: "Blue Origin",
    status: "即将首飞",
    leoCapacity: 45.0,
    firstStageFuel: "液氧/甲烷",
    isReusable: true,
    description: "蓝色起源的重型复用火箭",
    imageUrl: "https://placehold.co/800x600/f5f5f7/1d1d1f?text=New+Glenn"
  },
  {
    name: "Electron",
    series: "Rocket Lab",
    country: "美国",
    manufacturer: "Rocket Lab",
    status: "现役",
    leoCapacity: 0.3,
    firstStageFuel: "液氧/煤油",
    description: "全碳纤维箭体，电泵压发动机",
    imageUrl: "https://placehold.co/800x600/f5f5f7/1d1d1f?text=Electron"
  },
  {
    name: "Ariane 6",
    series: "Ariane",
    country: "欧洲",
    manufacturer: "Arianespace",
    status: "现役",
    leoCapacity: 21.6,
    firstStageFuel: "液氢/液氧",
    description: "欧洲最新一代主力火箭",
    imageUrl: "https://placehold.co/800x600/f5f5f7/1d1d1f?text=Ariane+6"
  },
  {
    name: "H3",
    series: "H-II",
    country: "日本",
    manufacturer: "JAXA",
    status: "现役",
    leoCapacity: 16.5,
    firstStageFuel: "液氢/液氧",
    description: "日本新一代主力，追求低成本高可靠性",
    imageUrl: "https://placehold.co/800x600/f5f5f7/1d1d1f?text=H3"
  },
  {
    name: "Angara A5",
    series: "Angara",
    country: "俄罗斯",
    manufacturer: "Khrunichev",
    status: "现役",
    leoCapacity: 24.5,
    firstStageFuel: "液氧/煤油",
    description: "俄罗斯后苏联时代研制的模块化重型火箭",
    imageUrl: "https://placehold.co/800x600/f5f5f7/1d1d1f?text=Angara+A5"
  }
];

async function seed() {
  console.log('Starting Update with Images and Fuel...');
  
  // 使用 upsert 确保不破坏现有ID，但更新字段
  for (const r of rocketsData) {
    try {
      await prisma.rocket.upsert({
        where: { name: r.name },
        update: r,
        create: r
      });
      console.log(`Updated: ${r.name}`);
    } catch (e) {
      console.error(`Error processing ${r.name}: ${e.message}`);
    }
  }
  
  console.log('Seed completed.');
}

seed()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
