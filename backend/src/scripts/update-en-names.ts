import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const translations: Record<string, string> = {
  "test": "test",
  "Bubrezi Goveđi": "Beef kidneys",
  "Beli pšenični hleb": "White bread",
  "Boranija zelena": "Green beans",
  "Boranija žuta": "Yellow beans",
  "Borovnice": "Blueberries",
  "Brusnica": "Cranberries",
  "Bukovača": "Oyster mushroom",
  "Bundeva semenke": "Pumpkin seeds",
  "Celer koren": "Celery root",
  "Celer štap": "Celery",
  "Čeri paradajz": "Cherry tomatoes",
  "Čia semenke": "Chia seeds",
  "Ćureći belo meso": "Turkey breast",
  "Đumbir": "Ginger",
  "Dunja": "Quince",
  "Endevija": "Endive",
  "Goveđi but": "Beef round",
  "Grašak smrznuti": "Frozen peas",
  "Grejpfrut": "Grapefruit",
  "Grožđe belo": "White grapes",
  "Grožđe crno": "Black grapes",
  "Jagode": "Strawberries",
  "Jaja A klasa": "Eggs",
  "Ječmena kaša": "Barley",
  "Jogurt 0%": "Nonfat yogurt",
  "Jogurt 2.8": "Yogurt",
  "Jogurt 3.2": "Yogurt",
  "Kajsija suva": "Dried apricots",
  "Kajsije": "Apricots",
  "Kinoa": "Quinoa",
  "Kiseli kupus": "Sauerkraut",
  "Kopriva": "Stinging nettle",
  "Kozije mleko": "Goat milk",
  "Kozje kiselo mleko": "Goat yogurt",
  "Krompir mladi": "New potatoes",
  "Krompir slatki": "Sweet potato",
  "Kukuruz": "Corn",
  "Kupine": "Blackberries",
  "Kupus crveni": "Red cabbage",
  "Kupus zeleni": "Cabbage",
  "Leblebija": "Chickpeas",
  "Leblenija Deleze u konzervi": "Canned chickpeas",
  "Ljuta papričica": "Chili pepper",
  "Luk Beli": "Garlic",
  "Luk crni": "Onion",
  "Luk mladi": "Spring onions",
  "Maline": "Raspberries",
  "Masline zelene": "Green olives",
  "Med bagremov": "Honey",
  "Mleko kozije": "Goat milk",
  "Mleveno meso govedina": "Ground beef",
  "Mleveno meso svinjetina": "Ground pork",
  "Narandža": "Orange",
  "Nektarina": "Nectarine",
  "Orasi": "Walnuts",
  "Oslić fileti": "Hake fillet",
  "Ovsene pahuljice": "Oats",
  "Pasulj beli tetovac": "White kidney beans",
  "Patljidžan": "Eggplant",
  "Piletina belo": "Chicken breast",
  "Pirinač beli dugo zrno": "Long grain white rice",
  "Pirinač integralni": "Brown rice",
  "Praziluk": "Leek",
  "Prokelj": "Brussels sprouts",
  "Mandarine": "Tangerines",
  "Pšenični integralni hleb": "Whole wheat bread",
  "Ražani hleb": "Rye bread",
  "Repa bela": "Turnip",
  "Rotkvice": "Radishes",
  "Salata zelena": "Lettuce",
  "Smokve sušene": "Dried figs",
  "Sočivo": "Lentils",
  "Suva šljiva": "Prunes",
  "Suvo grožđe": "Raisins",
  "Tikvice": "Zucchini",
  "Ulje suncokretovo": "Sunflower oil",
  "Urme": "Dates",
  "Vrganj": "Porcini mushroom",
  "Integralni dvopek": "Whole wheat rusk",
  "Čija semenke": "Chia seeds",
  "Humus ribela": "Hummus",
  "Pileći batak bez koze": "Chicken thigh",
  "Dimljena kolenica": "Smoked pork knuckle",
  "Dimljena svinjska rebra": "Smoked pork ribs",
  "Kikiriki puter": "Peanut butter",
  "Dzem od sljiva": "Plum jam",
  "Crna cokolada": "Dark chocolate",
  "Tunjevina": "Tuna",
  "Luk Crveni": "Red onion",
  "Konzervisana skusa": "Canned mackerel",
  "Mleko bez laktoze": "Lactose free milk",
  "Svinjska mast": "Pork lard",
  "Yamamoti Iso": "Green tea",
  "Palenta": "Polenta",
  "Extra devičansko maslinovo ulje": "Extra virgin olive oil",
  "Sardine": "Sardines"
};

async function main() {
  let updatedCount = 0;
  
  for (const [srpski, engleski] of Object.entries(translations)) {
    const foods = await prisma.food.findMany({
      where: { name: srpski }
    });

    for (const food of foods) {
      await prisma.food.update({
        where: { id: food.id },
        data: { nameEn: engleski }
      });
      updatedCount++;
    }
  }

  console.log(`Uspešno dodato englesko ime za ${updatedCount} namirnica!`);
}

main().finally(() => prisma.$disconnect());