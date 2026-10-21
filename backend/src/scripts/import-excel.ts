import { PrismaClient } from '@prisma/client';
import * as xlsx from 'xlsx';

const prisma = new PrismaClient();

async function main() {
  // Putanja do tvog Excel fajla
  const filePath = '/home/maja/Downloads/Kalkulator namirnica (1).xlsx';
  
  console.log('Učitavam Excel fajl...');
  const workbook = xlsx.readFile(filePath);
  const sheetName = 'Food Database';
  const sheet = workbook.Sheets[sheetName];
  
  // Pretvaramo u JSON (niz nizova)
  const data: any[] = xlsx.utils.sheet_to_json(sheet, { header: 1 });
  
  console.log(`Pronađeno ${data.length} redova. Počinjem obradu...`);
  
  let addedCount = 0;
  let skippedCount = 0;

  // Podaci počinju od 3. reda (indeks 2), jer su prva dva zaglavlja
  for (let i = 2; i < data.length; i++) {
    const row = data[i];
    const name = row[0]; // Food
    
    // Preskačemo prazne redove ili zaglavlja
    if (!name || typeof name !== 'string' || name.trim() === '' || name === 'Food') {
      continue;
    }

    const protein = parseFloat(row[2]) || 0;
    const carbs = parseFloat(row[3]) || 0;
    const fat = parseFloat(row[4]) || 0;
    const calories = parseFloat(row[5]) || 0;

    // Proveravamo da li namirnica već postoji u bazi (po imenu)
    const existing = await prisma.food.findFirst({
      where: { name: { equals: name.trim(), mode: 'insensitive' } }
    });

    if (existing) {
      // console.log(`⏩ Preskočeno (već postoji): ${name}`);
      skippedCount++;
      continue;
    }

    // Ako ne postoji, dodajemo je
    await prisma.food.create({
      data: {
        name: name.trim(),
        category: 'traditional', // Podrazumevana kategorija, posle možemo menjati
        calories,
        protein,
        carbs,
        fat,
        // fiber, sugar, salt, saturatedFat ostavljamo null, popuniće ih USDA
      }
    });
    console.log(`✅ Dodato: ${name}`);
    addedCount++;
  }

  console.log(`\n--- ZAVRŠENO ---`);
  console.log(`Novih namirnica dodato: ${addedCount}`);
  console.log(`Preskočeno (već postoje): ${skippedCount}`);
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());