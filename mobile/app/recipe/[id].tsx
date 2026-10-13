import { useState, useEffect } from "react";
import { View, Text, ScrollView, Image, Pressable, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import { useLanguage } from "../../contexts/LanguageContext";
import { apiGet } from "../../lib/api";
import i18n from "../../locales";

type Food = {
  id: string;
  name: string;
  nameEn: string | null;
  icon: string | null;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
};

type Ingredient = {
  id: string;
  amount: number;
  unit: string;
  food: Food;
};

type Step = {
  id: string;
  order: number;
  text: string;
  textEn: string | null;
};

type Recipe = {
  id: string;
  title: string;
  titleEn: string | null;
  description: string | null;
  descriptionEn: string | null;
  image: string | null;
  mealType: string;
  dietType: string | null;
  difficulty: string | null;
  prepTime: number | null;
  servings: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  isPremium: boolean;
  ingredients: Ingredient[];
  steps: Step[];
};

const MEAL_TYPE_KEYS: Record<string, string> = {
  dorucak: "plan.breakfast",
  rucak: "plan.lunch",
  vecera: "plan.dinner",
  uzina: "plan.snack",
  breakfast: "plan.breakfast",
  lunch: "plan.lunch",
  dinner: "plan.dinner",
  snack: "plan.snack",
};

const DIFFICULTY_KEYS: Record<string, string> = {
  lako: "recipe.difficultyEasy",
  srednje: "recipe.difficultyMedium",
  tesko: "recipe.difficultyHard",
};

function isValidImageUrl(url: string | null): boolean {
  if (!url) return false;
  return url.startsWith("http://") || url.startsWith("https://");
}

export default function RecipeDetailScreen() {
  const { id } = useLocalSearchParams();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [checked, setChecked] = useState<string[]>([]);
  const [servings, setServings] = useState(1);

  const { language } = useLanguage();
  const t = (key: string) => i18n.t(key);

  useEffect(() => {
    loadRecipe();
  }, [id]);

  async function loadRecipe() {
    try {
      setLoading(true);
      const data = await apiGet<Recipe>(`/recipes/${id}`);
      setRecipe(data);
      setServings(data.servings || 1);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  function getMealTypeLabel(mealType: string): string {
    const key = MEAL_TYPE_KEYS[mealType.toLowerCase()];
    return key ? t(key) : mealType;
  }

  function getDifficultyLabel(difficulty: string): string {
    const key = DIFFICULTY_KEYS[difficulty.toLowerCase()];
    return key ? t(key) : difficulty;
  }

  const toggle = (ingredientId: string) => {
    setChecked((prev) =>
      prev.includes(ingredientId)
        ? prev.filter((x) => x !== ingredientId)
        : [...prev, ingredientId]
    );
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color="#B3FF47" size="large" />
          <Text className="text-textSecondary text-sm mt-4">
            {t("common.loading")}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !recipe) {
    return (
      <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
        <View className="px-4 pt-2 pb-3 flex-row items-center">
          <Pressable
            onPress={() => router.back()}
            className="w-12 h-12 items-center justify-center"
          >
            <Text className="text-text text-2xl">←</Text>
          </Pressable>
        </View>
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-4xl mb-3">⚠️</Text>
          <Text className="text-textSecondary text-base text-center">
            {error || t("recipe.notFound")}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const servingsRatio = servings / (recipe.servings || 1);
  const totalCalories = recipe.calories * servingsRatio;
  const totalProtein = recipe.protein * servingsRatio;
  const totalCarbs = recipe.carbs * servingsRatio;
  const totalFat = recipe.fat * servingsRatio;

  const displayTitle =
    language === "en" && recipe.titleEn ? recipe.titleEn : recipe.title;
  const displayDescription =
    language === "en" && recipe.descriptionEn
      ? recipe.descriptionEn
      : recipe.description;

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <View className="px-4 pt-2 pb-3 flex-row items-center justify-between">
        <Pressable
          onPress={() => router.back()}
          className="w-12 h-12 items-center justify-center"
        >
          <Text className="text-text text-2xl">←</Text>
        </Pressable>
        <Pressable className="w-12 h-12 items-center justify-center">
          <Text className="text-text text-xl">↗</Text>
        </Pressable>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {isValidImageUrl(recipe.image) ? (
          <Image
            source={{ uri: recipe.image! }}
            className="w-full h-80"
            resizeMode="cover"
          />
        ) : (
          <View className="w-full h-80 bg-surface items-center justify-center">
            <Text className="text-6xl">🍽️</Text>
          </View>
        )}

        <View className="px-4 pt-5 pb-3">
          <View className="flex-row items-center justify-between">
            <Text className="text-text text-2xl font-bold flex-1 mr-2">
              {displayTitle}
            </Text>
            {recipe.isPremium && (
              <Text className="text-primary text-2xl">⭐</Text>
            )}
          </View>
        </View>

        {displayDescription && (
          <View className="px-4 pt-1 pb-3">
            <Text className="text-textSecondary text-base leading-6">
              {displayDescription}
            </Text>
          </View>
        )}

        <View className="px-4 pt-3 pb-3 flex-row flex-wrap gap-2">
          <View className="bg-surface rounded-full px-3 py-1.5 border border-border">
            <Text className="text-textSecondary text-xs">
              {getMealTypeLabel(recipe.mealType)}
            </Text>
          </View>
          {recipe.prepTime != null && (
            <View className="bg-surface rounded-full px-3 py-1.5 border border-border">
              <Text className="text-textSecondary text-xs">
                ⏱ {recipe.prepTime} min
              </Text>
            </View>
          )}
          {!!recipe.difficulty && (
            <View className="bg-surface rounded-full px-3 py-1.5 border border-border">
              <Text className="text-textSecondary text-xs">
                {getDifficultyLabel(recipe.difficulty)}
              </Text>
            </View>
          )}
          {!!recipe.dietType && (
            <View className="bg-surface rounded-full px-3 py-1.5 border border-border">
              <Text className="text-textSecondary text-xs">
                {recipe.dietType}
              </Text>
            </View>
          )}
        </View>

        <View className="px-4 pt-5 pb-3 flex-row items-center justify-between">
          <Text className="text-text text-2xl font-bold">
            {t("recipe.ingredients")}
          </Text>
          <View className="flex-row items-center gap-3 bg-surface rounded-full border border-border px-3 py-1">
            <Pressable
              onPress={() => setServings((s) => Math.max(1, s - 1))}
              className="w-7 h-7 items-center justify-center"
            >
              <Text className="text-text text-lg">−</Text>
            </Pressable>
            <Text className="text-text text-sm font-bold">
              {servings}{" "}
              {servings === 1
                ? t("recipe.serving")
                : t("recipe.servings")}
            </Text>
            <Pressable
              onPress={() => setServings((s) => s + 1)}
              className="w-7 h-7 items-center justify-center"
            >
              <Text className="text-text text-lg">+</Text>
            </Pressable>
          </View>
        </View>

        <View className="px-4">
          {recipe.ingredients.map((ing) => {
            const isChecked = checked.includes(ing.id);
            const scaledAmount = ing.amount * servingsRatio;
            return (
              <Pressable
                key={ing.id}
                onPress={() => toggle(ing.id)}
                className="py-3 flex-row items-center gap-3"
              >
                <View
                  className={`w-5 h-5 rounded border-2 items-center justify-center ${
                    isChecked
                      ? "bg-primary border-primary"
                      : "border-border"
                  }`}
                >
                  {isChecked && (
                    <Text className="text-background text-xs font-bold">✓</Text>
                  )}
                </View>
                <Text className="text-xl">{ing.food.icon || "🍽️"}</Text>
                <Text
                  className={`flex-1 text-base ${
                    isChecked
                      ? "text-textSecondary line-through"
                      : "text-text"
                  }`}
                >
                  {language === "en" && ing.food.nameEn
                    ? ing.food.nameEn
                    : ing.food.name}
                </Text>
                <Text className="text-textSecondary text-sm">
                  {Math.round(scaledAmount * 10) / 10} {ing.unit}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {recipe.steps && recipe.steps.length > 0 && (
          <>
            <View className="px-4 pt-5 pb-3">
              <Text className="text-text text-2xl font-bold">
                {t("recipe.instructions")}
              </Text>
            </View>

            <View className="px-4">
              {recipe.steps.map((step, index) => (
                <View key={step.id} className="flex-row gap-3 mb-4">
                  <View className="w-7 h-7 rounded-full bg-surface items-center justify-center">
                    <Text className="text-primary text-sm font-bold">
                      {index + 1}
                    </Text>
                  </View>
                  <Text className="flex-1 text-text text-base leading-6">
                    {language === "en" && step.textEn ? step.textEn : step.text}
                  </Text>
                </View>
              ))}
            </View>
          </>
        )}

        <View className="px-4 pt-5 pb-3">
          <Text className="text-text text-2xl font-bold">
            {t("recipe.nutrition")}
          </Text>
          <Text className="text-textSecondary text-xs mt-1">
            {t("recipe.for")} {servings}{" "}
            {servings === 1 ? t("recipe.serving") : t("recipe.servings")}
          </Text>
        </View>

        <View className="px-4 pb-6">
          <View className="flex-row gap-3 mb-3">
            <View className="flex-1 bg-surface rounded-2xl p-4 border border-border">
              <Text className="text-textSecondary text-xs mb-1">
                {t("recipe.calories")}
              </Text>
              <Text className="text-primary text-xl font-bold">
                {Math.round(totalCalories)}
              </Text>
              <Text className="text-textSecondary text-xs">kcal</Text>
            </View>
            <View className="flex-1 bg-surface rounded-2xl p-4 border border-border">
              <Text className="text-textSecondary text-xs mb-1">
                {t("recipe.protein")}
              </Text>
              <Text className="text-text text-xl font-bold">
                {Math.round(totalProtein * 10) / 10}g
              </Text>
            </View>
          </View>

          <View className="flex-row gap-3">
            <View className="flex-1 bg-surface rounded-2xl p-4 border border-border">
              <Text className="text-textSecondary text-xs mb-1">
                {t("recipe.fat")}
              </Text>
              <Text className="text-text text-xl font-bold">
                {Math.round(totalFat * 10) / 10}g
              </Text>
            </View>
            <View className="flex-1 bg-surface rounded-2xl p-4 border border-border">
              <Text className="text-textSecondary text-xs mb-1">
                {t("recipe.carbs")}
              </Text>
              <Text className="text-text text-xl font-bold">
                {Math.round(totalCarbs * 10) / 10}g
              </Text>
            </View>
          </View>
        </View>

        <View className="h-4" />
      </ScrollView>

      <View className="px-4 py-3 flex-row gap-3 border-t border-border">
        <Pressable className="flex-1 bg-primary py-3 rounded-full items-center">
          <Text className="text-background text-sm font-bold">
            {t("recipe.save")}
          </Text>
        </Pressable>
        <Pressable className="w-24 bg-surface py-3 rounded-full items-center border border-border">
          <Text className="text-text text-sm font-bold">
            {t("recipe.share")}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}