const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const rockets = await prisma.rocket.findMany({
    select: { manufacturer: true }
  });
  const engines = await prisma.engine.findMany({
    select: { manufacturer: true }
  });

  const manufacturers = new Set([
    ...rockets.map(r => r.manufacturer),
    ...engines.map(e => e.manufacturer)
  ].filter(Boolean));

  console.log('Current Manufacturers:', Array.from(manufacturers));
}

main().catch(console.error).finally(() => prisma.$disconnect());
