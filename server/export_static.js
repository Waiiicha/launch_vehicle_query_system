const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const OUTPUT_DIR = path.join(__dirname, '../client/src/data');
const OUTPUT_FILE = path.join(OUTPUT_DIR, 'rockets.json');
const ROCKET_PIC_DIR = path.join(__dirname, '../pic/rocket_pic');
const ENGINE_PIC_DIR = path.join(__dirname, '../pic/engine_pic');
const ROCKET_PUBLIC_DIR = path.join(__dirname, '../client/public/images/rockets');
const ENGINE_PUBLIC_DIR = path.join(__dirname, '../client/public/images/engines');

// Copy images from source to public directory
function copyImages(srcDir, destDir, category) {
  if (!fs.existsSync(srcDir)) {
    console.warn(`${category} source directory not found: ${srcDir}`);
    return;
  }

  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }

  const files = fs.readdirSync(srcDir).filter(f => /\.(jpg|jpeg|png|webp|gif)$/i.test(f));
  files.forEach(f => {
    const src = path.join(srcDir, f);
    const dest = path.join(destDir, f);
    fs.copyFileSync(src, dest);
  });
  console.log(`Copied ${files.length} ${category} images to public directory.`);
}

async function exportData() {
  console.log('Exporting data for static site...');
  
  // Copy images first
  copyImages(ROCKET_PIC_DIR, ROCKET_PUBLIC_DIR, 'rocket');
  copyImages(ENGINE_PIC_DIR, ENGINE_PUBLIC_DIR, 'engine');
  
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const rockets = await prisma.rocket.findMany();

  const staticRockets = rockets.map(r => {
    let newImages = null;
    if (r.imageUrl) {
      try {
        const images = JSON.parse(r.imageUrl);
        if (Array.isArray(images)) {
          newImages = JSON.stringify(images.map(url => `./images/rockets/${url.split('/').pop()}`));
        }
      } catch (e) {
        if (r.imageUrl.includes('localhost')) {
           newImages = `./images/rockets/${r.imageUrl.split('/').pop()}`;
        } else {
           newImages = r.imageUrl;
        }
      }
    }
    return { ...r, imageUrl: newImages };
  });

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(staticRockets, null, 2));
  console.log(`Successfully exported rockets.`);

  const engines = await prisma.engine.findMany({ orderBy: { name: 'asc' } });

  const staticEngines = await Promise.all(engines.map(async (eng) => {
    let newEngineImage = null;
    if (eng.imageUrl) {
      try {
        const parsed = JSON.parse(eng.imageUrl);
        if (Array.isArray(parsed)) {
          newEngineImage = JSON.stringify(parsed.map(url => `./images/engines/${url.split('/').pop()}`));
        }
      } catch (e) {
        if (eng.imageUrl.includes('localhost')) {
           newEngineImage = `./images/engines/${eng.imageUrl.split('/').pop()}`;
        } else {
           newEngineImage = eng.imageUrl;
        }
      }
    }

    const relatedRockets = await prisma.rocket.findMany({
      where: {
        OR: [
          { firstStageEngine: { contains: eng.name } },
          { secondStageEngine: { contains: eng.name } },
          { thirdStageEngine: { contains: eng.name } },
        ]
      },
      select: { id: true, name: true, imageUrl: true, manufacturer: true }
    });

    const processedRelated = relatedRockets.map(r => {
        let newImg = null;
        if (r.imageUrl) {
            try {
                const parsed = JSON.parse(r.imageUrl);
                if (Array.isArray(parsed)) {
                     newImg = JSON.stringify(parsed.map(url => `./images/rockets/${url.split('/').pop()}`));
                }
            } catch (e) {
                if (r.imageUrl.includes('localhost')) {
                   newImg = `./images/rockets/${r.imageUrl.split('/').pop()}`;
                } else {
                   newImg = r.imageUrl;
                }
            }
        }
        return { ...r, imageUrl: newImg };
    });

    return { ...eng, imageUrl: newEngineImage, relatedRockets: processedRelated };
  }));

  const OUTPUT_ENGINE_FILE = path.join(OUTPUT_DIR, 'engines.json');
  fs.writeFileSync(OUTPUT_ENGINE_FILE, JSON.stringify(staticEngines, null, 2));
  console.log(`Successfully exported engines.`);
}

exportData().catch(e => console.error(e)).finally(async () => { await prisma.$disconnect(); });