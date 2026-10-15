export type UserProfile = {
  name: string | null;
  birthYear: number | null;
  gender: string | null;
  height: number | null;
  weight: number | null;
  targetWeight: number | null;
  activityLevel: string | null;
  dietType?: string | null;
  goal?: string | null;
};

export function calculateDailyCalories(profile: UserProfile | null): number {
  if (!profile) return 2000;

  const { gender, birthYear, height, weight, activityLevel, goal } = profile;

  if (!gender || !birthYear || !height || !weight) return 2000;

  const age = new Date().getFullYear() - birthYear;

  let bmr = 10 * weight + 6.25 * height - 5 * age;
  bmr += gender === "male" ? 5 : -161;

  const multipliers: Record<string, number> = {
    sedentary: 1.2,
    light: 1.375,
    active: 1.55,
    very_active: 1.725,
    veryActive: 1.725,
  };
  const multiplier = multipliers[activityLevel] || 1.375;

  let tdee = bmr * multiplier;

  if (goal === "lose") tdee -= 500;
  else if (goal === "gain") tdee += 300;

  return Math.round(tdee);
}