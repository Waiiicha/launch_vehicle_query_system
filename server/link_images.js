const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const ROCKET_PIC_DIR = path.join(__dirname, '../pic/rocket_pic');
const ENGINE_PIC_DIR = path.join(__dirname, '../pic/engine_pic');
const SERVER_ROCKET_URL = 'http://localhost:3001/images/rocket_pic';
const SERVER_ENGINE_URL = 'http://localhost:3001/images/engine_pic';

async function linkImages() {
  console.log('Scanning for rocket images...');
  
  // --- Link Rocket Images ---
  if (fs.existsSync(ROCKET_PIC_DIR)) {
    const files = fs.readdirSync(ROCKET_PIC_DIR).filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f));
    const rockets = await prisma.rocket.findMany();

    for (const rocket of rockets) {
      const matchedFiles = [];
      const cleanName = rocket.name.replace(/\s+/g, '').toLowerCase();
      const escapedName = cleanName.replace(/[.*+?^${}()|[\\]/g, '\\$&');
      // Match: Name followed by ( or space or end
      const regex = new RegExp(`^${escapedName}(\\(|\\s|$)`, 'i');

      files.forEach(f => {
        const fileNameNoExt = path.parse(f).name.replace(/\s+/g, '').toLowerCase();
        if (regex.test(fileNameNoExt)) {
          matchedFiles.push(`${SERVER_ROCKET_URL}/${f}`);
        }
      });

      if (matchedFiles.length > 0) {
        await prisma.rocket.update({
          where: { id: rocket.id },
          data: { imageUrl: JSON.stringify(matchedFiles) }
        });
        console.log(`Linked ${matchedFiles.length} images for Rocket: ${rocket.name}`);
      } else {
        await prisma.rocket.update({
          where: { id: rocket.id },
          data: { imageUrl: null }
        });
      }
    }
  } else {
    console.error('Rocket pic directory not found');
  }

  // --- Link Engine Images ---
  console.log('Scanning for engine images...');
  if (fs.existsSync(ENGINE_PIC_DIR)) {
    const files = fs.readdirSync(ENGINE_PIC_DIR).filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f));
    const engines = await prisma.engine.findMany();

    for (const eng of engines) {
      const matchedFiles = [];
      // Engine matching might be simpler or need similar fuzzy logic
      const cleanName = eng.name.replace(/\s+/g, '').toLowerCase();
      const escapedName = cleanName.replace(/[.*+?^${}()|[\\]/g, '\\$&');
      
      // Strict start match often works best for engines too
      const regex = new RegExp(`^${escapedName}(\\(|\\s|$)`, 'i');

      files.forEach(f => {
        const fileNameNoExt = path.parse(f).name.replace(/\s+/g, '').toLowerCase();
        if (regex.test(fileNameNoExt)) {
          matchedFiles.push(`${SERVER_ENGINE_URL}/${f}`);
        }
      });

      if (matchedFiles.length > 0) {
        // Usually engines have 1 image, but we can store as JSON list for consistency
        // OR just a string if the frontend expects a single string for engines.
        // Looking at schema: imageUrl String?
        // Looking at export_static.js: it handles JSON parse for engines too.
        await prisma.engine.update({
          where: { id: eng.id },
          data: { imageUrl: JSON.stringify(matchedFiles) }
        });
        console.log(`Linked ${matchedFiles.length} images for Engine: ${eng.name}`);
      } else {
        await prisma.engine.update({
          where: { id: eng.id },
          data: { imageUrl: null }
        });
      }
    }
  } else {
    console.error('Engine pic directory not found');
  }

  console.log('Image linking completed.');
}

linkImages()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
