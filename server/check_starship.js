const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const starship = await prisma.rocket.findUnique({
    where: { name: 'Starship' },
    select: { id: true, name: true, firstStageEngine: true }
  });
  console.log(JSON.stringify(starship, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
