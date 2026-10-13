import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, requireAdmin, AuthRequest } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

router.get('/suggestions', authenticate, async (req: AuthRequest, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      const recipes = await prisma.recipe.findMany({
        where: { isPublished: true },
        include: {
          ingredients: { include: { food: true } },
        },
        orderBy: { createdAt: 'desc' },
      });
      return res.json(recipes);
    }

    const userAllergies = user.allergies || [];
    const userDiet = user.dietType || '';

    const where: any = {
      isPublished: true,
    };

    if (userAllergies.length > 0) {
      where.ingredients = {
        none: {
          food: {
            allergens: { hasSome: userAllergies },
          },
        },
      };
    }

    if (userDiet && userDiet !== 'all' && userDiet !== '') {
      if (userDiet === 'vegetarian') {
        where.dietType = { in: ['vegetarian', 'vegan'] };
      } else if (userDiet === 'fasting') {
        where.dietType = { in: ['fasting', 'vegan'] };
      } else {
        where.dietType = userDiet;
      }
    }

    const recipes = await prisma.recipe.findMany({
      where,
      include: {
        ingredients: { include: { food: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(recipes);
  } catch (error) {
    res.status(500).json({ error: String(error) });
  }
});

router.get('/', async (req, res) => {
  try {
    const recipes = await prisma.recipe.findMany({
      where: { isPublished: true },
      orderBy: { createdAt: 'desc' },
      include: {
        ingredients: { include: { food: true } },
      },
    });
    res.json(recipes);
  } catch (error) {
    res.status(500).json({ error: String(error) });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const recipe = await prisma.recipe.findUnique({
      where: { id: String(req.params.id) },
      include: {
        ingredients: { include: { food: true } },
        steps: { orderBy: { order: 'asc' } },
      },
    });
    if (!recipe) {
      return res.status(404).json({ error: 'Recipe not found' });
    }
    res.json(recipe);
  } catch (error) {
    res.status(500).json({ error: String(error) });
  }
});

router.post('/', authenticate, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const {
      title,
      titleEn,
      description,
      descriptionEn,
      image,
      mealType,
      dietType,
      difficulty,
      prepTime,
      servings,
      isPremium,
      ingredients,
      steps,
    } = req.body;

    if (!title || !mealType) {
      return res.status(400).json({ error: 'title and mealType are required' });
    }

    const nutrition = await calculateNutrition(ingredients);

    const recipe = await prisma.recipe.create({
      data: {
        title,
        titleEn: titleEn || null,
        description,
        descriptionEn: descriptionEn || null,
        image,
        mealType,
        dietType,
        difficulty,
        prepTime,
        servings: servings || 1,
        isPremium: isPremium || false,
        calories: nutrition.calories,
        protein: nutrition.protein,
        carbs: nutrition.carbs,
        fat: nutrition.fat,
        ingredients: {
          create: ingredients.map((ing: any) => ({
            foodId: ing.foodId,
            amount: ing.amount,
            unit: ing.unit || 'g',
          })),
        },
        steps: {
          create: steps.map((step: any, index: number) => ({
            order: index + 1,
            text: step.text || step,
            textEn: step.textEn || null,
          })),
        },
      },
      include: {
        ingredients: { include: { food: true } },
        steps: { orderBy: { order: 'asc' } },
      },
    });

    res.status(201).json(recipe);
  } catch (error) {
    res.status(500).json({ error: String(error) });
  }
});

router.put('/:id', authenticate, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const {
      title, titleEn, description, descriptionEn, image, mealType, dietType,
      difficulty, prepTime, servings, isPremium, isPublished,
      ingredients, steps,
    } = req.body;

    let nutrition = null;
    if (ingredients && ingredients.length > 0) {
      nutrition = await calculateNutrition(ingredients);
    }

    await prisma.recipeIngredient.deleteMany({ where: { recipeId: String(id) } });
    await prisma.recipeStep.deleteMany({ where: { recipeId: String(id) } });

    const recipe = await prisma.recipe.update({
      where: { id: String(id) },
      data: {
        ...(title && { title }),
        ...(titleEn !== undefined && { titleEn: titleEn || null }),
        ...(description !== undefined && { description }),
        ...(descriptionEn !== undefined && { descriptionEn: descriptionEn || null }),
        ...(image !== undefined && { image }),
        ...(mealType && { mealType }),
        ...(dietType !== undefined && { dietType }),
        ...(difficulty !== undefined && { difficulty }),
        ...(prepTime !== undefined && { prepTime }),
        ...(servings && { servings }),
        ...(isPremium !== undefined && { isPremium }),
        ...(isPublished !== undefined && { isPublished }),
        ...(nutrition && {
          calories: nutrition.calories,
          protein: nutrition.protein,
          carbs: nutrition.carbs,
          fat: nutrition.fat,
        }),
        ...(ingredients && {
          ingredients: {
            create: ingredients.map((ing: any) => ({
              foodId: ing.foodId,
              amount: ing.amount,
              unit: ing.unit || 'g',
            })),
          },
        }),
        ...(steps && {
          steps: {
            create: steps.map((step: any, index: number) => ({
              order: index + 1,
              text: step.text || step,
              textEn: step.textEn || null,
            })),
          },
        }),
      },
      include: {
        ingredients: { include: { food: true } },
        steps: { orderBy: { order: 'asc' } },
      },
    });

    res.json(recipe);
  } catch (error) {
    res.status(500).json({ error: String(error) });
  }
});

router.delete('/:id', authenticate, requireAdmin, async (req: AuthRequest, res) => {
  try {
    await prisma.recipe.delete({ where: { id: String(req.params.id) } });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: String(error) });
  }
});

async function calculateNutrition(ingredients: any[]) {
  let calories = 0;
  let protein = 0;
  let carbs = 0;
  let fat = 0;

  for (const ing of ingredients) {
    const food = await prisma.food.findUnique({ where: { id: ing.foodId } });
    if (!food) continue;

    let grams = ing.amount;
    if (ing.unit === 'tbsp') grams = ing.amount * 15;
    else if (ing.unit === 'tsp') grams = ing.amount * 5;
    else if (ing.unit === 'cup') grams = ing.amount * 240;

    const factor = grams / 100;
    calories += food.calories * factor;
    protein += food.protein * factor;
    carbs += food.carbs * factor;
    fat += food.fat * factor;
  }

  return {
    calories: Math.round(calories * 10) / 10,
    protein: Math.round(protein * 10) / 10,
    carbs: Math.round(carbs * 10) / 10,
    fat: Math.round(fat * 10) / 10,
  };
}

export default router;