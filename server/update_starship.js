const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.rocket.update({
    where: { name: 'Starship' },
    data: { firstStageEngine: '33 x Raptor 2' }
  });
  console.log('Updated Starship engine to Raptor 2');
}

main().catch(console.error).finally(() => prisma.$disconnect());
