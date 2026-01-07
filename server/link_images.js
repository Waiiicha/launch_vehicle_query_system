const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const PIC_DIR = path.join(__dirname, '../pic/rocket_pic');
const SERVER_URL = 'http://localhost:3001/images/rocket_pic';

async function linkImages() {
  console.log('Scanning for multiple images...');
  
  if (!fs.existsSync(PIC_DIR)) {
    console.error('Pic directory not found');
    return;
  }

  const files = fs.readdirSync(PIC_DIR).filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f));
  const rockets = await prisma.rocket.findMany();

  for (const rocket of rockets) {
    const matchedFiles = [];
    const cleanName = rocket.name.replace(/\s+/g, '').toLowerCase();

    // 转义正则特殊字符，如 + ( )
    const escapedName = cleanName.replace(/[.*+?^${}()|[\\]/g, '\\$&');
    // 匹配规则：文件名以 rocketName 开头，后面跟着 ( 或空格 或 结束
    // 例如 CZ-5 匹配 CZ-5.jpg 和 CZ-5(2).jpg
    const regex = new RegExp(`^${escapedName}(\\(|\\s|$)`, 'i');

    files.forEach(f => {
      const fileNameNoExt = path.parse(f).name.replace(/\s+/g, '').toLowerCase();
      if (regex.test(fileNameNoExt)) {
        matchedFiles.push(`${SERVER_URL}/${f}`);
      }
    });

    if (matchedFiles.length > 0) {
      // 存储为 JSON 字符串
      await prisma.rocket.update({
        where: { id: rocket.id },
        data: { imageUrl: JSON.stringify(matchedFiles) }
      });
      console.log(`Linked ${matchedFiles.length} images for: ${rocket.name}`);
    } else {
      // 如果没有找到，存个空数组或者 null
      await prisma.rocket.update({
        where: { id: rocket.id },
        data: { imageUrl: null }
      });
    }
  }
  console.log('Multi-image linking completed.');
}

linkImages()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
