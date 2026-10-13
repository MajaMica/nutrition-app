import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

async function main() {
  const jsonPath = path.join(__dirname, '../data/foods.json');
  const rawData = fs.readFileSync(jsonPath, 'utf-8');
  const foods = JSON.parse(rawData);

  console.log(`Found ${foods.length} foods to import\n`);

  let added = 0;
  let skipped = 0;

  for (const food of foods) {
    try {
      const existing = await prisma.food.findFirst({
        where: { name: food.name },
      });

      if (existing) {
        skipped++;
        continue;
      }

      await prisma.food.create({
        data: {
          name: food.name,
          nameEn: food.nameEn || null,
          category: food.category,
          calories: food.calories,
          protein: food.protein,
          carbs: food.carbs,
          fat: food.fat,
          fiber: food.fiber ?? null,
          sugar: food.sugar ?? null,
          icon: food.icon || null,
        },
      });
      added++;
    } catch (error) {
      console.error(`Error adding "${food.name}":`, error);
    }
  }

  const total = await prisma.food.count();
  console.log(`\nAdded: ${added}`);
  console.log(`Skipped (already exist): ${skipped}`);
  console.log(`Total in database: ${total}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
