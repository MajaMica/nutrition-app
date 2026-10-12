import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const foods = [
  {
    name: "Kajmak",
    nameEn: "Kajmak (Serbian cream cheese)",
    category: "dairy",
    calories: 350,
    protein: 6.5,
    carbs: 4.2,
    fat: 33,
    icon: "🧀",
  },
  {
    name: "Jabuka",
    nameEn: "Apple",
    category: "fruits",
    calories: 52,
    protein: 0.3,
    carbs: 14,
    fat: 0.2,
    fiber: 2.4,
    sugar: 10,
    icon: "🍎",
  },
  {
    name: "Piletina (prsa)",
    nameEn: "Chicken breast",
    category: "meat",
    calories: 165,
    protein: 31,
    carbs: 0,
    fat: 3.6,
    icon: "🍗",
  },
  {
    name: "Brokoli",
    nameEn: "Broccoli",
    category: "veggies",
    calories: 34,
    protein: 2.8,
    carbs: 7,
    fat: 0.4,
    fiber: 2.6,
    icon: "🥦",
  },
  {
    name: "Pirinač (kuvan)",
    nameEn: "Cooked rice",
    category: "grains",
    calories: 130,
    protein: 2.7,
    carbs: 28,
    fat: 0.3,
    icon: "🍚",
  },
];

async function main() {
  console.log('Starting seed...');

  for (const food of foods) {
    const created = await prisma.food.create({ data: food });
    console.log(`Added: ${created.name}`);
  }

  const total = await prisma.food.count();
  console.log(`Total in database: ${total} foods`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });