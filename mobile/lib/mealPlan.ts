import AsyncStorage from "@react-native-async-storage/async-storage";

export type MealType = "dorucak" | "uzina" | "rucak" | "vecera";

export type SelectedMeal = {
  id: string;
  title: string;
  titleEn: string | null;
  image: string | null;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
};

export type DailyPlan = {
  dorucak: SelectedMeal | null;
  uzina: SelectedMeal | null;
  rucak: SelectedMeal | null;
  vecera: SelectedMeal | null;
};

const EMPTY_PLAN: DailyPlan = {
  dorucak: null,
  uzina: null,
  rucak: null,
  vecera: null,
};

export function getDateKey(date: Date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `meal_plan_${y}-${m}-${d}`;
}

export function getWeekDays(): Date[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dayOfWeek = today.getDay();
  const monday = new Date(today);
  const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  monday.setDate(today.getDate() + diff);

  const days: Date[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    days.push(d);
  }
  return days;
}

export function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export async function loadPlan(date: Date = new Date()): Promise<DailyPlan> {
  try {
    const raw = await AsyncStorage.getItem(getDateKey(date));
    if (!raw) return EMPTY_PLAN;
    return { ...EMPTY_PLAN, ...JSON.parse(raw) };
  } catch {
    return EMPTY_PLAN;
  }
}

export async function savePlan(
  plan: DailyPlan,
  date: Date = new Date()
): Promise<void> {
  try {
    await AsyncStorage.setItem(getDateKey(date), JSON.stringify(plan));
  } catch (e) {
    console.error("savePlan error:", e);
  }
}

export async function setMeal(
  mealType: MealType,
  meal: SelectedMeal | null,
  date: Date = new Date()
): Promise<DailyPlan> {
  const current = await loadPlan(date);
  const updated = { ...current, [mealType]: meal };
  await savePlan(updated, date);
  return updated;
}

export async function clearPlan(date: Date): Promise<void> {
  await AsyncStorage.removeItem(getDateKey(date));
}

export function calculateTotal(plan: DailyPlan) {
  let calories = 0;
  let protein = 0;
  let carbs = 0;
  let fat = 0;
  for (const key of ["dorucak", "uzina", "rucak", "vecera"] as MealType[]) {
    const meal = plan[key];
    if (meal) {
      calories += meal.calories;
      protein += meal.protein;
      carbs += meal.carbs;
      fat += meal.fat;
    }
  }
  return {
    calories: Math.round(calories),
    protein: Math.round(protein * 10) / 10,
    carbs: Math.round(carbs * 10) / 10,
    fat: Math.round(fat * 10) / 10,
  };
}

export function countSelected(plan: DailyPlan): number {
  return (["dorucak", "uzina", "rucak", "vecera"] as MealType[]).filter(
    (k) => plan[k] !== null
  ).length;
}