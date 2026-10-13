import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type Allergen =
  | "gluten"
  | "lactose"
  | "eggs"
  | "nuts"
  | "peanuts"
  | "fish"
  | "shellfish"
  | "soy"
  | "sesame"
  | "celery";

function detectAllergens(food: {
  name: string;
  nameEn: string | null;
  category: string;
}): Allergen[] {
  const allergens = new Set<Allergen>();
  const n = food.name.toLowerCase();
  const en = (food.nameEn || "").toLowerCase();
  const both = n + " " + en;
  const cat = food.category;

  // ─── LAKTOZA ───
  if (cat === "dairy") allergens.add("lactose");
  if (/mleko|mlečn|jogurt|sir|pavlaka|puter|kajmak|kefir|kačamak/i.test(n))
    allergens.add("lactose");

  // ─── GLUTEN ───
  if (cat === "grains") allergens.add("gluten");
  if (/hleb|hlebac|testenin|brašno|brasno|kolač|keks|biskvit|kroasan|pita|pogača|tortilj|musli|granol|ovsen|pšenič|pšenic|ječm|raž|tost|bulgur|kuskus|prezla|paste|pasta|nudle/i.test(both))
    allergens.add("gluten");

  // ─── JAJA ───
  if (/jaje|jaja|omlet|kajgan|majonez|majoneza/i.test(both))
    allergens.add("eggs");

  // ─── RIBA ───
  if (cat === "fish" && !/škamp|lignj|dagnj|rak|jastog|kamenic|školjk|mussel|squid|shrimp|octopus|hobotnic/i.test(both))
    allergens.add("fish");
  if (/tuna|losos|sardina|skuša|pastrmka|oslić|bakalar|inćun|sardela|salmon|hake|mackerel|trout/i.test(both))
    allergens.add("fish");

  // ─── ŠKOLJKE ───
  if (/škamp|lignj|dagnj|rak|jastog|kamenic|školjk|mussel|squid|shrimp|octopus|hobotnic/i.test(both))
    allergens.add("shellfish");

  // ─── ORAŠASTI ───
  if (cat === "nuts" && !/kikiriki|peanut/i.test(both))
    allergens.add("nuts");
  if (/badem|orah|lešnik|indijski|pistać|kesten|kešu|badem|coconut|kokos|walnut|almond|hazelnut|cashew|pistachio/i.test(both))
    allergens.add("nuts");

  // ─── KIKIRIKI ───
  if (/kikiriki|peanut|arašid/i.test(both))
    allergens.add("peanuts");

  // ─── SOJA ───
  if (/soja|soj[ae]|tofu|edamame|miso|tempeh|sojin/i.test(both))
    allergens.add("soy");

  // ─── SUSAM ───
  if (/susam|sezam|tahini|tahin/i.test(both))
    allergens.add("sesame");

  // ─── CELER ───
  if (/celer/i.test(both))
    allergens.add("celery");

  return Array.from(allergens);
}

async function main() {
  console.log("🚀 Tagujem alergene za namirnice...\n");

  const foods = await prisma.food.findMany();
  console.log(`Ukupno namirnica: ${foods.length}\n`);

  let updated = 0;
  let totalTags = 0;
  const byAllergen: Record<string, number> = {};

  for (const food of foods) {
    const allergens = detectAllergens({
      name: food.name,
      nameEn: food.nameEn,
      category: food.category,
    });

    if (allergens.length > 0) {
      await prisma.food.update({
        where: { id: food.id },
        data: { allergens },
      });
      updated++;
      totalTags += allergens.length;

      for (const a of allergens) {
        byAllergen[a] = (byAllergen[a] || 0) + 1;
      }

      console.log(`  ${food.name} → [${allergens.join(", ")}]`);
    }
  }

  console.log(`\n✅ Gotovo!`);
  console.log(`   Ažurirano: ${updated}/${foods.length} namirnica`);
  console.log(`   Ukupno tagova: ${totalTags}\n`);
  console.log(`📊 Po alergenu:`);
  Object.entries(byAllergen)
    .sort((a, b) => b[1] - a[1])
    .forEach(([k, v]) => console.log(`   ${k}: ${v}`));
}

main()
  .catch((e) => {
    console.error("❌ Greška:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
