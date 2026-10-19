import { useState, useEffect } from "react";
import { View, Text, ScrollView, Image, Pressable, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLanguage } from "../../contexts/LanguageContext";
import { apiGet } from "../../lib/api";
import { setMeal, MealType, getWeekDays, isSameDay } from "../../lib/mealPlan";
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
  fiber: number | null;
  salt: number | null;
  saturatedFat: number | null;
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

const PLAN_MEAL_TYPES: { id: MealType; labelKey: string; icon: string }[] = [
  { id: "dorucak", labelKey: "plan.breakfast", icon: "🌅" },
  { id: "uzina", labelKey: "plan.snack", icon: "🍎" },
  { id: "rucak", labelKey: "plan.lunch", icon: "🍽️" },
  { id: "vecera", labelKey: "plan.dinner", icon: "🌙" },
];

const DAY_LABELS_SR = ["Pon", "Uto", "Sre", "Čet", "Pet", "Sub", "Ned"];
const DAY_LABELS_EN = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

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

  const [isFavorite, setIsFavorite] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedMealType, setSelectedMealType] = useState<MealType>("rucak");
  const [addedMessage, setAddedMessage] = useState<string | null>(null);

  const { language } = useLanguage();
  const t = (key: string) => i18n.t(key);
  
  const weekDays = getWeekDays();
  const dayLabels = language === "en" ? DAY_LABELS_EN : DAY_LABELS_SR;

  useEffect(() => {
    loadRecipe();
    checkFavorite();
  }, [id]);

  async function loadRecipe() {
    try {
      setLoading(true);
      const data = await apiGet<Recipe>(`/recipes/${id}`);
      setRecipe(data);
      setServings(data.servings || 1);
      
      const initialMeal = data.mealType?.toLowerCase();
      if (["dorucak", "uzina", "rucak", "vecera"].includes(initialMeal)) {
        setSelectedMealType(initialMeal as MealType);
      }
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function checkFavorite() {
    try {
      const raw = await AsyncStorage.getItem("favorite_recipes");
      if (raw) {
        const favorites = JSON.parse(raw) as string[];
        setIsFavorite(favorites.includes(String(id)));
      }
    } catch {}
  }

  async function toggleFavorite() {
    try {
      const raw = await AsyncStorage.getItem("favorite_recipes");
      let favorites = raw ? (JSON.parse(raw) as string[]) : [];
      
      if (favorites.includes(String(id))) {
        favorites = favorites.filter((fId) => fId !== String(id));
        setIsFavorite(false);
      } else {
        favorites.push(String(id));
        setIsFavorite(true);
      }
      
      await AsyncStorage.setItem("favorite_recipes", JSON.stringify(favorites));
    } catch {}
  }

  async function handleAddToPlan() {
    if (!recipe) return;
    
    const meal = {
      id: recipe.id,
      title: recipe.title,
      titleEn: recipe.titleEn,
      image: recipe.image,
      calories: recipe.calories,
      protein: recipe.protein,
      carbs: recipe.carbs,
      fat: recipe.fat,
    };
    
    await setMeal(selectedMealType, meal, selectedDate);
    
    const mealLabelKey = PLAN_MEAL_TYPES.find(m => m.id === selectedMealType)?.labelKey || "";
    setAddedMessage(`${t("recipe.addedFor")} ${t(mealLabelKey)}`);
    
    setModalVisible(false);
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
  const totalFiber = (recipe.fiber || 0) * servingsRatio;
  const totalSalt = (recipe.salt || 0) * servingsRatio;
  const totalSaturatedFat = (recipe.saturatedFat || 0) * servingsRatio;

  const displayTitle =
    language === "en" && recipe.titleEn ? recipe.titleEn : recipe.title;
  const displayDescription =
    language === "en" && recipe.descriptionEn
      ? recipe.descriptionEn
      : recipe.description;

  const activeMealLabel = t(PLAN_MEAL_TYPES.find(m => m.id === selectedMealType)?.labelKey || "");

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <View className="px-4 pt-2 pb-3 flex-row items-center justify-between">
        <Pressable
          onPress={() => router.back()}
          className="w-12 h-12 items-center justify-center"
        >
          <Text className="text-text text-2xl">←</Text>
        </Pressable>
        <Pressable
          onPress={toggleFavorite}
          className="w-12 h-12 items-center justify-center"
        >
          <Text className="text-text text-xl">{isFavorite ? "❤️" : "🤍"}</Text>
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
                  <View className="w-7 h-7 rounded-full bg-surface border border-border items-center justify-center">
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

          <View className="flex-row gap-3 mb-3">
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

          <View className="flex-row gap-3">
            <View className="flex-1 bg-surface rounded-2xl p-3 border border-border">
              <Text className="text-textSecondary text-xs mb-1" numberOfLines={1}>
                {t("recipe.fiber")}
              </Text>
              <Text className="text-text text-lg font-bold">
                {Math.round(totalFiber * 10) / 10}g
              </Text>
            </View>
            <View className="flex-1 bg-surface rounded-2xl p-3 border border-border">
              <Text className="text-textSecondary text-xs mb-1" numberOfLines={1}>
                {t("recipe.salt")}
              </Text>
              <Text className="text-text text-lg font-bold">
                {Math.round(totalSalt * 100) / 100}g
              </Text>
            </View>
            <View className="flex-1 bg-surface rounded-2xl p-3 border border-border">
              <Text className="text-textSecondary text-xs mb-1" numberOfLines={1}>
                {t("recipe.saturatedFat")}
              </Text>
              <Text className="text-text text-lg font-bold">
                {Math.round(totalSaturatedFat * 10) / 10}g
              </Text>
            </View>
          </View>
        </View>

        <View className="h-4" />
      </ScrollView>

      <View className="px-4 py-3 border-t border-border">
        <Pressable
          onPress={() => setModalVisible(true)}
          className={`py-4 rounded-full items-center border ${
            addedMessage 
              ? "bg-surface border-primary" 
              : "bg-primary border-primary"
          }`}
        >
          <Text className={`text-base font-bold ${addedMessage ? "text-primary" : "text-background"}`}>
            {addedMessage ? `✓ ${addedMessage}` : t("recipe.addToPlan")}
          </Text>
        </Pressable>
      </View>

      {modalVisible && (
        <View 
          className="absolute inset-0 z-50 flex-1 justify-end" 
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}
        >
          <Pressable 
            className="absolute inset-0" 
            onPress={() => setModalVisible(false)} 
          />
          
          <View className="bg-surface rounded-t-3xl border-t border-border">
            <SafeAreaView edges={["bottom"]}>
              <View className="px-6 pb-6 pt-4">
                <View className="w-12 h-1.5 rounded-full bg-border self-center mb-4" />
                
                <View className="flex-row justify-between items-center mb-6">
                  <Text className="text-text text-xl font-bold">
                    {t("recipe.addToPlan")}
                  </Text>
                  <Pressable
                    onPress={() => setModalVisible(false)}
                    className="w-8 h-8 bg-background rounded-full items-center justify-center border border-border"
                  >
                    <Text className="text-textSecondary text-lg">✕</Text>
                  </Pressable>
                </View>

                <Text className="text-textSecondary text-sm font-bold mb-3">
                  {t("recipe.selectDay")}
                </Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ gap: 8, marginBottom: 24, paddingRight: 24 }}
                >
                  {weekDays.map((day, i) => {
                    const isActive = isSameDay(day, selectedDate);
                    return (
                      <Pressable
                        key={i}
                        onPress={() => setSelectedDate(day)}
                        className={`min-w-[56px] px-3 py-3 rounded-2xl items-center border ${
                          isActive
                            ? "bg-primary border-primary"
                            : "bg-background border-border"
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
                      </Pressable>
                    );
                  })}
                </ScrollView>

                <Text className="text-textSecondary text-sm font-bold mb-3">
                  {t("recipe.selectMeal")}
                </Text>
                <View className="flex-row flex-wrap gap-2 mb-8">
                  {PLAN_MEAL_TYPES.map((m) => {
                    const isActive = selectedMealType === m.id;
                    return (
                      <Pressable
                        key={m.id}
                        onPress={() => setSelectedMealType(m.id)}
                        className={`flex-1 min-w-[45%] flex-row items-center gap-2 px-4 py-3 rounded-xl border ${
                          isActive
                            ? "bg-primary/20 border-primary"
                            : "bg-background border-border"
                        }`}
                      >
                        <Text className="text-lg">{m.icon}</Text>
                        <Text
                          className={`text-sm font-bold ${
                            isActive ? "text-primary" : "text-text"
                          }`}
                        >
                          {t(m.labelKey)}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>

                <Pressable
                  onPress={handleAddToPlan}
                  className="bg-primary py-4 rounded-xl items-center flex-row justify-center gap-2"
                >
                  <Text className="text-background text-base font-bold">
                    {t("recipe.confirm")} ({activeMealLabel})
                  </Text>
                </Pressable>
              </View>
            </SafeAreaView>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}