const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const mapping = {
  // China
  '航天一院': '航天一院 (CALT)',
  '航天八院': '航天八院 (SAST)',
  '航天六院': '航天六院 (AALPT)',
  '航天科工 (ExPace)': '航天科工 (ExPace)',
  '蓝箭航天': '蓝箭航天 (LandSpace)',
  '中科宇航': '中科宇航 (CAS Space)',
  '东方空间': '东方空间 (Orienspace)',
  '星河动力': '星河动力 (Galactic Energy)',
  '天兵科技': '天兵科技 (Space Pioneer)',
  '星际荣耀': '星际荣耀 (i-Space)',
  '深蓝航天': '深蓝航天 (Deep Blue)',
  '九州云箭': '九州云箭 (JZYJ)',
  '大航跃迁': '大航跃迁 (Dahang Yueqian)',
  '宇石空间': '宇石空间 (Yushi Space)',
  
  // International
  'ULA': '联合发射联盟 (ULA)',
  'Blue Origin': '蓝色起源 (Blue Origin)',
  'Rocket Lab': '火箭实验室 (Rocket Lab)',
  'Arianespace': '阿丽亚娜空间 (Arianespace)',
  'Khrunichev': '赫鲁尼切夫 (Khrunichev)',
  'JAXA': '日本宇航 (JAXA)',
  'Boeing/NA/Douglas': '波音 (Boeing)',
  'Rockwell/Thiokol': '罗克韦尔 (Rockwell)',
  'NASA / Boeing': 'NASA / 波音 (Boeing)',
  'SpaceX': 'SpaceX' // Keep simple or change to 太空探索 (SpaceX)? Keeping simple for now as it's global brand.
};

async function updateTable(model) {
  const items = await prisma[model].findMany();
  for (const item of items) {
    const newName = mapping[item.manufacturer];
    if (newName && newName !== item.manufacturer) {
      await prisma[model].update({
        where: { id: item.id },
        data: { manufacturer: newName }
      });
      console.log(`[${model}] Updated ${item.manufacturer} -> ${newName}`);
    }
  }
}

async function main() {
  await updateTable('rocket');
  await updateTable('engine');
  console.log('Manufacturer standardization complete.');
}

main().catch(console.error).finally(() => prisma.$disconnect());
