const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const OUTPUT_DIR = path.join(__dirname, '../client/src/data');
const OUTPUT_FILE = path.join(OUTPUT_DIR, 'rockets.json');

async function exportData() {
  console.log('Exporting data for static site...');
  
  // 1. 确保输出目录存在
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  // 2. 获取数据
  const rockets = await prisma.rocket.findMany();

  // 3. 转换数据 (主要是图片路径)
  const staticRockets = rockets.map(r => {
    let newImages = null;
    
    // 处理图片路径: 从 http://localhost:3001/images/xxx 变为 ./images/xxx
    if (r.imageUrl) {
      try {
        // 尝试解析 JSON 数组
        const images = JSON.parse(r.imageUrl);
        if (Array.isArray(images)) {
          newImages = JSON.stringify(images.map(url => {
            const filename = url.split('/').pop();
            return `./images/${filename}`;
          }));
        }
      } catch (e) {
        // 普通字符串
        const filename = r.imageUrl.split('/').pop();
        // 如果是 placehold.co 的占位图，保持原样；如果是本地图，转换
        if (r.imageUrl.includes('localhost')) {
           newImages = `./images/${filename}`;
        } else {
           newImages = r.imageUrl;
        }
      }
    }

    return {
      ...r,
      imageUrl: newImages
    };
  });

  // 4. 写入文件
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(staticRockets, null, 2));
  console.log(`Successfully exported ${staticRockets.length} rockets to ${OUTPUT_FILE}`);
}

exportData()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
