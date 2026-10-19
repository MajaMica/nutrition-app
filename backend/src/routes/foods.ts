import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { authenticate, requireAdmin, AuthRequest } from "../middleware/auth";

const router = Router();
const prisma = new PrismaClient();

router.get("/", async (req, res) => {
  try {
    const { q } = req.query;
    const foods = await prisma.food.findMany({
      where: q
        ? { name: { contains: String(q), mode: "insensitive" } }
        : undefined,
      orderBy: { name: "asc" },
    });
    res.json(foods);
  } catch (error) {
    res.status(500).json({ error: String(error) });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const food = await prisma.food.findUnique({
      where: { id: String(req.params.id) },
    });

    if (!food) {
      return res.status(404).json({ error: "Namirnica nije pronađena" });
    }

    res.json(food);
  } catch (error) {
    res.status(500).json({ error: String(error) });
  }
});

router.post("/", authenticate, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const {
      name,
      nameEn,
      category,
      calories,
      protein,
      carbs,
      fat,
      fiber,
      sugar,
      salt,
      saturatedFat,
      icon,
    } = req.body;

    if (!name || !category || calories === undefined) {
      return res
        .status(400)
        .json({ error: "name, category and calories are required" });
    }

    const food = await prisma.food.create({
      data: {
        name,
        nameEn: nameEn || null,
        category,
        calories: Number(calories),
        protein: Number(protein) || 0,
        carbs: Number(carbs) || 0,
        fat: Number(fat) || 0,
        fiber: fiber !== undefined && fiber !== "" ? Number(fiber) : null,
        sugar: sugar !== undefined && sugar !== "" ? Number(sugar) : null,
        salt: salt !== undefined && salt !== "" ? Number(salt) : null,
        saturatedFat: saturatedFat !== undefined && saturatedFat !== "" ? Number(saturatedFat) : null,
        icon: icon || null,
      },
    });

    res.status(201).json(food);
  } catch (error) {
    res.status(500).json({ error: String(error) });
  }
});

router.put("/:id", authenticate, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      nameEn,
      category,
      calories,
      protein,
      carbs,
      fat,
      fiber,
      sugar,
      salt,
      saturatedFat,
      icon,
    } = req.body;

    const food = await prisma.food.update({
      where: { id: String(id) },
      data: {
        ...(name && { name }),
        ...(nameEn !== undefined && { nameEn: nameEn || null }),
        ...(category && { category }),
        ...(calories !== undefined && { calories: Number(calories) }),
        ...(protein !== undefined && { protein: Number(protein) }),
        ...(carbs !== undefined && { carbs: Number(carbs) }),
        ...(fat !== undefined && { fat: Number(fat) }),
        ...(fiber !== undefined && {
          fiber: fiber === "" ? null : Number(fiber),
        }),
        ...(sugar !== undefined && {
          sugar: sugar === "" ? null : Number(sugar),
        }),
        ...(salt !== undefined && {
          salt: salt === "" ? null : Number(salt),
        }),
        ...(saturatedFat !== undefined && {
          saturatedFat: saturatedFat === "" ? null : Number(saturatedFat),
        }),
        ...(icon !== undefined && { icon: icon || null }),
      },
    });

    res.json(food);
  } catch (error) {
    res.status(500).json({ error: String(error) });
  }
});

router.delete("/:id", authenticate, requireAdmin, async (req: AuthRequest, res) => {
  try {
    await prisma.food.delete({ where: { id: String(req.params.id) } });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: String(error) });
  }
});

export default router;