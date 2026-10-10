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

export default function ResultScreen() {
  const { data } = useOnboarding();
  const t = (key: string) => i18n.t(key);

  const currentYear = new Date().getFullYear();
  const age = data.birthYear ? currentYear - data.birthYear : 30;
  const bmr = calculateBMR(data.weight ?? 70, data.height ?? 170, age, data.gender);
  const tdee = Math.round(bmr * getActivityMultiplier(data.activityLevel));

  let targetCalories = tdee;
  if (data.goal === "lose") targetCalories = Math.round(tdee - 500);
  if (data.goal === "gain") targetCalories = Math.round(tdee + 300);

  const protein = Math.round((targetCalories * 0.3) / 4);
  const carbs = Math.round((targetCalories * 0.4) / 4);
  const fat = Math.round((targetCalories * 0.3) / 9);

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
              <Text className="text-text text-xl font-bold">{protein}g</Text>
            </View>
            <View className="flex-1 bg-surface rounded-2xl p-4 border border-border">
              <Text className="text-textSecondary text-xs mb-1">
                {t("onboarding.result.carbs")}
              </Text>
              <Text className="text-text text-xl font-bold">{carbs}g</Text>
            </View>
            <View className="flex-1 bg-surface rounded-2xl p-4 border border-border">
              <Text className="text-textSecondary text-xs mb-1">
                {t("onboarding.result.fat")}
              </Text>
              <Text className="text-text text-xl font-bold">{fat}g</Text>
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