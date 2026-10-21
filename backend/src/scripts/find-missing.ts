import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const missing = await prisma.food.findMany({
    where: { 
      OR: [
        { fiber: null },
        { sugar: null },
        { salt: null },
        { saturatedFat: null }
      ]
    },
    select: { id: true, name: true, nameEn: true }
  });

  console.log(`\nUkupno namirnica kojima fale podaci: ${missing.length}\n`);
  
  missing.forEach(m => {
    console.log(`${m.name} | EN: ${m.nameEn || 'NEMA'}`);
  });
}

main().finally(() => prisma.$disconnect());