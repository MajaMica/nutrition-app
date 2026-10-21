import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log("Učitavam sve recepte...");
  
  const recipes = await prisma.recipe.findMany({
    include: {
      ingredients: {
        include: { food: true }
      }
    }
  });

  console.log(`Pronađeno ${recipes.length} recepata. Počinjem preračunavanje...`);

  let updatedCount = 0;

  for (const recipe of recipes) {
    let calories = 0, protein = 0, carbs = 0, fat = 0;
    let fiber = 0, sugar = 0, salt = 0, saturatedFat = 0;

    for (const ing of recipe.ingredients) {
      const food = ing.food;
      if (!food) continue;

      // Pretvaranje jedinica u grame (isto kao u recipes.ts)
      let grams = ing.amount;
      if (ing.unit === 'tbsp') grams = ing.amount * 15;
      else if (ing.unit === 'tsp') grams = ing.amount * 5;
      else if (ing.unit === 'cup') grams = ing.amount * 240;

      const factor = grams / 100; // npr. 150g = 1.5

      calories += food.calories * factor;
      protein += food.protein * factor;
      carbs += food.carbs * factor;
      fat += food.fat * factor;
      
      // NOVI NUTRIJENTI
      if (food.fiber) fiber += food.fiber * factor;
      if (food.sugar) sugar += food.sugar * factor;
      if (food.salt) salt += food.salt * factor;
      if (food.saturatedFat) saturatedFat += food.saturatedFat * factor;
    }

    // Zaokruživanje na 1 decimalu
    const nutrition = {
      calories: Math.round(calories * 10) / 10,
      protein: Math.round(protein * 10) / 10,
      carbs: Math.round(carbs * 10) / 10,
      fat: Math.round(fat * 10) / 10,
      fiber: Math.round(fiber * 10) / 10,
      sugar: Math.round(sugar * 10) / 10,
      salt: Math.round(salt * 100) / 100, // So na 2 decimale
      saturatedFat: Math.round(saturatedFat * 10) / 10,
    };

    await prisma.recipe.update({
      where: { id: recipe.id },
      data: nutrition
    });

    updatedCount++;
    console.log(`✅ Preračunat: ${recipe.title}`);
  }

  console.log(`\n--- ZAVRŠENO ---`);
  console.log(`Uspešno preračunato recepata: ${updatedCount}`);
}

main().finally(() => prisma.$disconnect());