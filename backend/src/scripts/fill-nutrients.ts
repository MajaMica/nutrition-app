import { PrismaClient } from '@prisma/client';
import axios from 'axios';
import * as dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();
const USDA_API_KEY = process.env.USDA_API_KEY;

const NUTRIENT_IDS = {
  FIBER: 1079,
  SUGAR: 2000,
  SODIUM: 1093,
  SAT_FAT: 1258
};

async function searchUSDA(foodName: string) {
  try {
    const res = await axios.get('https://api.nal.usda.gov/fdc/v1/foods/search', {
      params: {
        api_key: USDA_API_KEY,
        query: foodName,
        dataType: 'Foundation,SR Legacy',
        pageSize: 1
      }
    });
    return res.data.foods && res.data.foods.length > 0 ? res.data.foods[0] : null;
  } catch (e) {
    console.error(`Greška pri pretrazi ${foodName}:`, e);
    return null;
  }
}

async function main() {
  if (!USDA_API_KEY) {
    console.error("Nedostaje USDA_API_KEY u .env fajlu!");
    return;
  }

  // Uzimamo SAMO namirnice kojima fali bar jedan nutrijent
  const foods = await prisma.food.findMany({
    where: {
      OR: [
        { fiber: null },
        { sugar: null },
        { salt: null },
        { saturatedFat: null }
      ]
    }
  });

  console.log(`Započinjem ažuriranje za ${foods.length} namirnica...`);

  let updatedCount = 0;
  let notFoundCount = 0;

  for (const food of foods) {
    const searchTerm = food.nameEn || food.name;
    console.log(`Tražim: ${searchTerm}...`);

    const usdaData = await searchUSDA(searchTerm);
    if (!usdaData) {
      console.log(`❌ Nije pronađeno: ${searchTerm}`);
      notFoundCount++;
      continue;
    }

    let fiber = null;
    let sugar = null;
    let salt = null;
    let saturatedFat = null;

    for (const nutrient of usdaData.foodNutrients) {
      if (nutrient.nutrientId === NUTRIENT_IDS.FIBER) fiber = nutrient.value;
      if (nutrient.nutrientId === NUTRIENT_IDS.SUGAR) sugar = nutrient.value;
      if (nutrient.nutrientId === NUTRIENT_IDS.SAT_FAT) saturatedFat = nutrient.value;
      if (nutrient.nutrientId === NUTRIENT_IDS.SODIUM) {
        salt = nutrient.value ? nutrient.value / 400 : 0; 
      }
    }

    await prisma.food.update({
      where: { id: food.id },
      data: {
        fiber: fiber !== null ? Number(fiber) : null,
        sugar: sugar !== null ? Number(sugar) : null,
        salt: salt !== null ? Number(salt) : null,
        saturatedFat: saturatedFat !== null ? Number(saturatedFat) : null,
      }
    });

    console.log(`✅ Ažurirano: ${searchTerm} -> Vlakna: ${fiber}, Šećeri: ${sugar}, So: ${salt}, Zasićene masti: ${saturatedFat}`);
    updatedCount++;
    
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  console.log(`\n--- ZAVRŠENO ---`);
  console.log(`Uspešno ažurirano: ${updatedCount}`);
  console.log(`Nije pronađeno: ${notFoundCount}`);
}

main().finally(() => prisma.$disconnect());