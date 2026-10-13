import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { authenticate, AuthRequest } from "../middleware/auth";

const router = Router();
const prisma = new PrismaClient();

router.get("/", authenticate, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id;

    let user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          id: userId,
          email: req.user!.email,
          name: null,
        },
      });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: String(error) });
  }
});

router.put("/", authenticate, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id;
    const {
      name,
      birthYear,
      gender,
      height,
      weight,
      targetWeight,
      activityLevel,
      dietType,
      allergies,
      dislikedFoods,
      onboardingDone,
    } = req.body;

    const user = await prisma.user.upsert({
      where: { id: userId },
      create: {
        id: userId,
        email: req.user!.email,
        name,
        birthYear,
        gender,
        height,
        weight,
        targetWeight,
        activityLevel,
        dietType,
        allergies: allergies ?? [],
        dislikedFoods: dislikedFoods ?? [],
        onboardingDone: onboardingDone ?? false,
      },
      update: {
        ...(name !== undefined && { name }),
        ...(birthYear !== undefined && { birthYear }),
        ...(gender !== undefined && { gender }),
        ...(height !== undefined && { height }),
        ...(weight !== undefined && { weight }),
        ...(targetWeight !== undefined && { targetWeight }),
        ...(activityLevel !== undefined && { activityLevel }),
        ...(dietType !== undefined && { dietType }),
        ...(allergies !== undefined && { allergies }),
        ...(dislikedFoods !== undefined && { dislikedFoods }),
        ...(onboardingDone !== undefined && { onboardingDone }),
      },
    });

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: String(error) });
  }
});

export default router;