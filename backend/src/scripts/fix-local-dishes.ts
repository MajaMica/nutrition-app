import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const localDishes: Record<string, { fiber: number, sugar: number, salt: number, saturatedFat: number }> = {
  "Ćevapi": { fiber: 0, sugar: 0, salt: 2.0, saturatedFat: 8.0 },
  "Pršut": { fiber: 0, sugar: 0, salt: 5.0, saturatedFat: 8.0 },
  "Kulen": { fiber: 0, sugar: 0, salt: 3.0, saturatedFat: 10.0 },
  "Baklava": { fiber: 1.5, sugar: 30.0, salt: 0.5, saturatedFat: 8.0 },
  "Urmašice": { fiber: 1.0, sugar: 25.0, salt: 0.3, saturatedFat: 5.0 },
  "Vanilice": { fiber: 0.5, sugar: 30.0, salt: 0.2, saturatedFat: 7.0 },
  "Musaka": { fiber: 1.5, sugar: 3.0, salt: 1.2, saturatedFat: 5.0 },
  "Prebranac": { fiber: 6.0, sugar: 2.0, salt: 1.5, saturatedFat: 2.0 },
  "Čobanac": { fiber: 1.0, sugar: 1.0, salt: 1.5, saturatedFat: 4.0 },
  "Riblja čorba": { fiber: 0.5, sugar: 1.0, salt: 1.2, saturatedFat: 1.0 },
  "Ajvar": { fiber: 2.5, sugar: 6.0, salt: 1.5, saturatedFat: 0.5 },
  "Nutella": { fiber: 0, sugar: 56.0, salt: 0.1, saturatedFat: 10.0 },
  "Pašteta": { fiber: 0, sugar: 1.0, salt: 1.8, saturatedFat: 6.0 },
};

async function main() {
  let fixedCount = 0;

  // 1. Ručno popunjavamo domaće namirnice
  for (const [name, data] of Object.entries(localDishes)) {
    const foods = await prisma.food.findMany({ where: { name } });
    for (const food of foods) {
      await prisma.food.update({
        where: { id: food.id },
        data: {
          fiber: data.fiber,
          sugar: data.sugar,
          salt: data.salt,
          saturatedFat: data.saturatedFat,
        }
      });
      fixedCount++;
    }
  }

  console.log(`Ručno popunjeno domaćih jela: ${fixedCount}`);

  // 2. Za sve ostale kojima je ostao null, upisujemo 0 (jer npr. meso nema vlakna)
  const result = await prisma.food.updateMany({
    where: { fiber: null },
    data: { fiber: 0 }
  });
  const result2 = await prisma.food.updateMany({
    where: { sugar: null },
    data: { sugar: 0 }
  });
  const result3 = await prisma.food.updateMany({
    where: { salt: null },
    data: { salt: 0 }
  });
  const result4 = await prisma.food.updateMany({
    where: { saturatedFat: null },
    data: { saturatedFat: 0 }
  });

  console.log(`Sređeno preostalih null vrednosti: ${result.count + result2.count + result3.count + result4.count}`);
}

main().finally(() => prisma.$disconnect());