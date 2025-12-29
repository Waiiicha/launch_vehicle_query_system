const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const OUTPUT_DIR = path.join(__dirname, '../client/src/data');
const OUTPUT_FILE = path.join(OUTPUT_DIR, 'rockets.json');

async function exportData() {
  console.log('Exporting data for static site...');
  
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