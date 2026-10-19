import { useState, useEffect, useCallback } from "react";
import { View, Text, ScrollView, Image, Pressable, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useFocusEffect } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLanguage } from "../../contexts/LanguageContext";
import { useProfile } from "../../hooks/useProfile";
import { calculateDailyCalories } from "../../lib/calories";
import { apiGetAuth, apiGet } from "../../lib/api";
import {
  loadPlan,
  setMeal,
  calculateTotal,
  countSelected,
  getWeekDays,
  isSameDay,
  DailyPlan,
  MealType,
  SelectedMeal,
} from "../../lib/mealPlan";
import MealCard from "../../components/MealCard";
import i18n from "../../locales";

type Recipe = {
  id: string;
  title: string;
  titleEn: string | null;
  image: string | null;
  mealType: string;
  mealTypes: string[];
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
};

const MEAL_TYPES: { id: MealType; labelKey: string; icon: string }[] = [
  { id: "dorucak", labelKey: "plan.breakfast", icon: "🌅" },
  { id: "uzina", labelKey: "plan.snack", icon: "🍎" },
  { id: "rucak", labelKey: "plan.lunch", icon: "🍽️" },
  { id: "vecera", labelKey: "plan.dinner", icon: "🌙" },
];

const DAY_LABELS_SR = ["Pon", "Uto", "Sre", "Čet", "Pet", "Sub", "Ned"];
const DAY_LABELS_EN = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function PlanScreen() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [plan, setPlan] = useState<DailyPlan>({
    dorucak: null,
    uzina: null,
    rucak: null,
    vecera: null,
  });
  const [indexes, setIndexes] = useState<Record<MealType, number>>({
    dorucak: 0,
    uzina: 0,
    rucak: 0,
    vecera: 0,
  });
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [userTier, setUserTier] = useState("free");

  useFocusEffect(
    useCallback(() => {
      loadAll();
      loadTier();
    }, [])
  );

  async function loadTier() {
    const tier = await AsyncStorage.getItem("@user_tier");
    setUserTier(tier || "free");
  }

  const { profile } = useProfile();
  const { language } = useLanguage();
  const t = (key: string) => i18n.t(key);

  const weekDays = getWeekDays();
  const dailyGoal = calculateDailyCalories(profile);
  const totals = calculateTotal(plan);
  const selectedCount = countSelected(plan);
  const remaining = dailyGoal - totals.calories;
  const percentage =
    dailyGoal > 0
      ? Math.min(Math.round((totals.calories / dailyGoal) * 100), 100)
      : 0;


  useEffect(() => {
    loadPlanForDate(selectedDate);
  }, [selectedDate]);

  async function loadAll() {
    try {
      setLoading(true);
      let data: Recipe[];
      try {
        data = await apiGetAuth<Recipe[]>("/recipes/suggestions");
      } catch {
        data = await apiGet<Recipe[]>("/recipes");
      }
      setRecipes(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  async function loadPlanForDate(date: Date) {
    const saved = await loadPlan(date);
    setPlan(saved);
    setIndexes({ dorucak: 0, uzina: 0, rucak: 0, vecera: 0 });
  }

function getRecipesForMeal(mealType: MealType): Recipe[] {
  const selectedIds = MEAL_TYPES.map((m) => plan[m.id]?.id).filter(Boolean);
  return recipes.filter((r) => {
    if (selectedIds.includes(r.id)) return false;

    if (Array.isArray(r.mealTypes) && r.mealTypes.length > 0) {
      return r.mealTypes.some((t) => t.toLowerCase() === mealType);
    }

    return r.mealType && r.mealType.toLowerCase() === mealType;
  });
}

  async function handleSelect(mealType: MealType, recipe: Recipe) {
    if (userTier === "free" && selectedCount >= 1) {
      router.push("/paywall");
      return;
    }
    const meal: SelectedMeal = {
      id: recipe.id,
      title: recipe.title,
      titleEn: recipe.titleEn,
      image: recipe.image,
      calories: recipe.calories,
      protein: recipe.protein,
      carbs: recipe.carbs,
      fat: recipe.fat,
    };
    const updated = await setMeal(mealType, meal, selectedDate);
    setPlan(updated);
  }

  async function handleRemove(mealType: MealType) {
    const updated = await setMeal(mealType, null, selectedDate);
    setPlan(updated);
  }

  function handleSkip(mealType: MealType, total: number) {
    setIndexes((prev) => ({
      ...prev,
      [mealType]: Math.min(prev[mealType] + 1, Math.max(total - 1, 0)),
    }));
  }

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color="#B3FF47" size="large" />
        </View>
      </SafeAreaView>
    );
  }

  const remainingColor = remaining > 0 ? "text-primary" : "text-red-400";
  const dayLabels = language === "en" ? DAY_LABELS_EN : DAY_LABELS_SR;

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <View className="pt-4 pb-2 px-4">
        <Text className="text-text text-lg font-bold text-center">
          {t("plan.title")}
        </Text>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="mb-4">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}
          >
            {weekDays.map((day, i) => {
              const isActive = isSameDay(day, selectedDate);
              const isToday = isSameDay(day, new Date());
              return (
                <Pressable
                  key={i}
                  onPress={() => setSelectedDate(day)}
                  className={`min-w-[56px] px-3 py-3 rounded-2xl items-center border ${
                    isActive
                      ? "bg-primary border-primary"
                      : "bg-surface border-border"
                  }`}
                >
                  <Text
                    className={`text-xs font-bold ${
                      isActive ? "text-background" : "text-text"
                    }`}
                  >
                    {dayLabels[i]}
                  </Text>
                  <Text
                    className={`text-lg font-bold mt-1 ${
                      isActive ? "text-background" : "text-text"
                    }`}
                  >
                    {day.getDate()}
                  </Text>
                  {isToday && !isActive && (
                    <View className="w-1.5 h-1.5 rounded-full bg-primary mt-1" />
                  )}
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        <View className="mx-4 mb-5 bg-surface rounded-3xl p-5 border border-border">
          <View className="flex-row items-center justify-between mb-4">
            <View>
              <Text className="text-textSecondary text-xs mb-1">
                {t("plan.dailyGoal")}
              </Text>
              <Text className="text-text text-2xl font-bold">
                {totals.calories}{" "}
                <Text className="text-textSecondary text-base font-normal">
                  / {dailyGoal} kcal
                </Text>
              </Text>
            </View>
            <View className="w-14 h-14 rounded-full border-4 border-primary items-center justify-center">
              <Text className="text-primary text-sm font-bold">
                {percentage}%
              </Text>
            </View>
          </View>

          <View className="h-2 bg-background rounded-full overflow-hidden mb-4">
            <View
              className="h-2 bg-primary rounded-full"
              style={{ width: `${percentage}%` }}
            />
          </View>

          <View className="flex-row justify-between">
            <View>
              <Text className="text-textSecondary text-xs mb-1">
                {remaining >= 0 ? t("plan.remaining") : t("plan.exceeded")}
              </Text>
              <Text className={`text-base font-bold ${remainingColor}`}>
                {Math.abs(remaining)} kcal
              </Text>
            </View>
            <View className="items-end">
              <Text className="text-textSecondary text-xs mb-1">
                {t("plan.selected")}
              </Text>
              <Text className="text-text text-base font-bold">
                {selectedCount} / 4
              </Text>
            </View>
          </View>
        </View>

        {MEAL_TYPES.map((mealType) => {
          const mealRecipes = getRecipesForMeal(mealType.id);
          const selected = plan[mealType.id];
          const currentIndex =
            indexes[mealType.id] % Math.max(mealRecipes.length, 1);
          const currentRecipe = mealRecipes[currentIndex];

          return (
            <View key={mealType.id} className="mb-6">
              <View className="px-4 pb-3 flex-row items-center gap-2">
                <Text className="text-2xl">{mealType.icon}</Text>
                <Text className="text-text text-xl font-bold">
                  {t(mealType.labelKey)}
                </Text>
                {selected && (
                  <View className="ml-auto bg-primary rounded-full px-3 py-1">
                    <Text className="text-background text-xs font-bold">
                      ✓ {t("plan.selected")}
                    </Text>
                  </View>
                )}
              </View>

              {selected ? (
                <View className="mx-4 bg-surface border border-primary rounded-3xl p-4">
                  <View className="flex-row items-center gap-3">
                    {selected.image ? (
                      <Image
                        source={{ uri: selected.image }}
                        className="w-16 h-16 rounded-2xl"
                      />
                    ) : (
                      <View className="w-16 h-16 rounded-2xl bg-background items-center justify-center">
                        <Text className="text-3xl">🍽️</Text>
                      </View>
                    )}
                    <Pressable
                      onPress={() => router.push(`/recipe/${selected.id}`)}
                      className="flex-1"
                    >
                      <Text
                        className="text-text text-base font-bold mb-1"
                        numberOfLines={2}
                      >
                        {language === "en" && selected.titleEn
                          ? selected.titleEn
                          : selected.title}
                      </Text>
                      <Text className="text-primary text-sm font-bold">
                        {Math.round(selected.calories)} kcal
                      </Text>
                    </Pressable>
                    <Pressable
                      onPress={() => handleRemove(mealType.id)}
                      className="w-10 h-10 bg-background rounded-full items-center justify-center"
                    >
                      <Text className="text-red-400 text-xl">✗</Text>
                    </Pressable>
                  </View>
                </View>
              ) : !currentRecipe ? (
                <View className="mx-4 bg-surface rounded-3xl p-6 items-center border border-border">
                  <Text className="text-textSecondary text-sm text-center">
                    {t("plan.empty")}
                  </Text>
                </View>
              ) : (
                <View className="mx-4">
                  <MealCard
                    recipe={currentRecipe}
                    language={language}
                    hasNext={mealRecipes.length > 1}
                    currentIndex={currentIndex}
                    totalCount={mealRecipes.length}
                    onSelect={() => handleSelect(mealType.id, currentRecipe)}
                    onSkip={() =>
                      handleSkip(mealType.id, mealRecipes.length)
                    }
                    onPress={() =>
                      router.push(`/recipe/${currentRecipe.id}`)
                    }
                    labels={{
                      select: t("plan.select"),
                      skip: t("plan.skip"),
                    }}
                  />
                </View>
              )}
            </View>
          );
        })}

        {selectedCount === 4 ? (
          <View className="mx-4 mb-4 bg-primary/10 border border-primary rounded-3xl p-6 items-center">
            <Text className="text-4xl mb-3">🏆</Text>
            <Text className="text-primary text-lg font-bold text-center mb-1">
              {language === "en" ? "Your menu is complete!" : "Tvoj meni je kompletan!"}
            </Text>
            <Text className="text-textSecondary text-sm text-center">
              {language === "en" ? "All meals are selected. Enjoy the flavors!" : "Svi obroci su izabrani. Uživaj u ukusima!"}
            </Text>
          </View>
        ) : (
          <View className="px-4 pt-4 pb-8">
            <Pressable
              onPress={() => router.push("/custom-recipe")}
              className="bg-surface rounded-2xl p-6 border border-primary items-center"
            >
              <Text className="text-5xl mb-3">👨‍🍳</Text>
              <Text className="text-text text-lg font-bold text-center mb-1">
                {t("home.customRecipeTitle")}
              </Text>
              <Text className="text-textSecondary text-sm text-center mb-4">
                {t("home.customRecipeDesc")}
              </Text>
              <View className="bg-primary px-6 py-2.5 rounded-full">
                <Text className="text-background font-bold text-sm">
                  {t("home.customRecipeBtn")}
                </Text>
              </View>
            </Pressable>
          </View>
        )}

        <View className="h-8" />
      </ScrollView>
    </SafeAreaView>
  );
}