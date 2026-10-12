import { View, Text, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useOnboarding } from "../../contexts/OnboardingContext";
import i18n from "../../locales";

function calculateBMR(weight: number, height: number, age: number, gender: string | null) {
  if (gender === "female") {
    return 10 * weight + 6.25 * height - 5 * age - 161;
  }
  return 10 * weight + 6.25 * height - 5 * age + 5;
}

function getActivityMultiplier(level: string | null) {
  switch (level) {
    case "sedentary": return 1.2;
    case "light": return 1.375;
    case "active": return 1.55;
    case "very_active": return 1.725;
    default: return 1.2;
  }
}

function getProteinPerKg(goal: string | null) {
  switch (goal) {
    case "lose": return 1.8;
    case "gain": return 1.8;
    case "healthy": return 1.4;
    default: return 1.2;
  }
}

function getMinimumCalories(gender: string | null) {
  return gender === "female" ? 1200 : 1500;
}

export default function ResultScreen() {
  const { data } = useOnboarding();
  const t = (key: string) => i18n.t(key);

  const currentYear = new Date().getFullYear();
  const age = data.birthYear ? currentYear - data.birthYear : 30;
  const weight = data.weight ?? 70;
  const height = data.height ?? 170;

  const bmr = calculateBMR(weight, height, age, data.gender);
  const tdee = Math.round(bmr * getActivityMultiplier(data.activityLevel));

  let targetCalories = tdee;
  if (data.goal === "lose") targetCalories = tdee - 500;
  if (data.goal === "healthy") targetCalories = tdee - 200;
  if (data.goal === "gain") targetCalories = tdee + 300;

  const minCalories = getMinimumCalories(data.gender);
  if (targetCalories < minCalories) {
    targetCalories = minCalories;
  }

  const proteinPerKg = getProteinPerKg(data.goal);
  const proteinGrams = Math.round(weight * proteinPerKg);
  const proteinCalories = proteinGrams * 4;

  const fatCalories = targetCalories * 0.25;
  const fatGrams = Math.round(fatCalories / 9);

  const carbsCalories = targetCalories - proteinCalories - fatCalories;
  const carbsGrams = Math.max(0, Math.round(carbsCalories / 4));

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 px-6 pt-12 justify-between pb-8">
        <View>
          <Text className="text-primary text-sm font-medium tracking-wider mb-3">
            {t("onboarding.result.planReady")}
          </Text>
          <Text className="text-text text-4xl font-bold mb-3">
            {t("onboarding.result.title")}
          </Text>
          <Text className="text-textSecondary text-base mb-10">
            {t("onboarding.result.subtitle")}
          </Text>

          <View className="bg-surface rounded-3xl p-6 border border-border mb-6">
            <Text className="text-textSecondary text-sm mb-2">
              {t("onboarding.result.dailyCalories")}
            </Text>
            <Text className="text-primary text-5xl font-bold mb-1">
              {targetCalories}
            </Text>
            <Text className="text-textSecondary text-sm">
              {t("onboarding.result.kcal")}
            </Text>
          </View>

          <View className="flex-row gap-3">
            <View className="flex-1 bg-surface rounded-2xl p-4 border border-border">
              <Text className="text-textSecondary text-xs mb-1">
                {t("onboarding.result.protein")}
              </Text>
              <Text className="text-text text-xl font-bold">{proteinGrams}g</Text>
            </View>
            <View className="flex-1 bg-surface rounded-2xl p-4 border border-border">
              <Text className="text-textSecondary text-xs mb-1">
                {t("onboarding.result.carbs")}
              </Text>
              <Text className="text-text text-xl font-bold">{carbsGrams}g</Text>
            </View>
            <View className="flex-1 bg-surface rounded-2xl p-4 border border-border">
              <Text className="text-textSecondary text-xs mb-1">
                {t("onboarding.result.fat")}
              </Text>
              <Text className="text-text text-xl font-bold">{fatGrams}g</Text>
            </View>
          </View>
        </View>

        <Pressable
          onPress={() => router.replace("/auth/register")}
          className="bg-primary py-4 rounded-2xl items-center"
        >
          <Text className="text-background text-base font-bold">
            {t("onboarding.result.createAccount")}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}