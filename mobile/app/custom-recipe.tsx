import { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Pressable,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLanguage } from "../contexts/LanguageContext";
import { apiGet } from "../lib/api";
import { setMeal, loadPlan, MealType, getWeekDays, isSameDay } from "../lib/mealPlan";
import i18n from "../locales";

type Food = {
  id: string;
  name: string;
  nameEn: string | null;
  icon: string | null;
  category: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number | null;
  sugar: number | null;
};

type CustomIngredient = {
  food: Food;
  amount: number;
};

const CATEGORIES = [
  { id: "all", labelKey: "foods.all", icon: "🍽️" },
  { id: "dairy", labelKey: "foods.dairy", icon: "🧀" },
  { id: "meat", labelKey: "foods.meat", icon: "🥩" },
  { id: "fish", labelKey: "foods.fish", icon: "🐟" },
  { id: "seafood", labelKey: "foods.seafood", icon: "🦐" },
  { id: "veggies", labelKey: "foods.veggies", icon: "🥕" },
  { id: "fruits", labelKey: "foods.fruits", icon: "🍎" },
  { id: "grains", labelKey: "foods.grains", icon: "🌾" },
  { id: "legumes", labelKey: "foods.legumes", icon: "🫘" },
  { id: "nuts", labelKey: "foods.nuts", icon: "🥜" },
  { id: "oils", labelKey: "foods.oils", icon: "🫒" },
  { id: "sweets", labelKey: "foods.sweets", icon: "🍫" },
  { id: "drinks", labelKey: "foods.drinks", icon: "🥤" },
  { id: "traditional", labelKey: "foods.traditional", icon: "🥘" },
];

const PLAN_MEAL_TYPES: { id: MealType; labelKey: string; icon: string }[] = [
  { id: "dorucak", labelKey: "plan.breakfast", icon: "🌅" },
  { id: "uzina", labelKey: "plan.snack", icon: "🍎" },
  { id: "rucak", labelKey: "plan.lunch", icon: "🍽️" },
  { id: "vecera", labelKey: "plan.dinner", icon: "🌙" },
];

const DAY_LABELS_SR = ["Pon", "Uto", "Sre", "Čet", "Pet", "Sub", "Ned"];
const DAY_LABELS_EN = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function CustomRecipeScreen() {
  const [allFoods, setAllFoods] = useState<Food[]>([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [ingredients, setIngredients] = useState<CustomIngredient[]>([]);
  const [loading, setLoading] = useState(true);
  const [userTier, setUserTier] = useState("free");

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedMealType, setSelectedMealType] = useState<MealType>("rucak");
  
  const [overwriteWarningVisible, setOverwriteWarningVisible] = useState(false);

  const { language } = useLanguage();
  const { foodId, grams } = useLocalSearchParams();
  const t = (key: string) => i18n.t(key);

  const weekDays = getWeekDays();
  const dayLabels = language === "en" ? DAY_LABELS_EN : DAY_LABELS_SR;

  const hasAddedInitialFood = useRef(false);

  useEffect(() => {
    async function loadData() {
      try {
        const tier = await AsyncStorage.getItem("@user_tier");
        setUserTier(tier || "free");

        const data = await apiGet<Food[]>("/foods");
        setAllFoods(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  useEffect(() => {
    if (foodId && allFoods.length > 0 && !hasAddedInitialFood.current) {
      const foodToAdd = allFoods.find((f) => f.id === foodId);
      if (foodToAdd) {
        const parsedAmount = parseFloat(grams as string) || 100;
        
        setIngredients((prev) => {
          const existing = prev.find((i) => i.food.id === foodToAdd.id);
          if (existing) {
            return prev.map((i) =>
              i.food.id === foodToAdd.id ? { ...i, amount: i.amount + parsedAmount } : i
            );
          }
          return [...prev, { food: foodToAdd, amount: parsedAmount }];
        });

        hasAddedInitialFood.current = true;
      }
    }
  }, [foodId, allFoods, grams]);

  const addIngredient = (food: Food) => {
    const existing = ingredients.find((i) => i.food.id === food.id);
    if (existing) {
      setIngredients(
        ingredients.map((i) =>
          i.food.id === food.id ? { ...i, amount: i.amount + 100 } : i
        )
      );
    } else {
      setIngredients([...ingredients, { food, amount: 100 }]);
    }
    setSearch("");
    setSelectedCategory("all");
  };

  const updateAmount = (id: string, amountStr: string) => {
    const parsed = parseFloat(amountStr);
    const amount = isNaN(parsed) ? 0 : parsed;
    setIngredients(
      ingredients.map((i) => (i.food.id === id ? { ...i, amount } : i))
    );
  };

  const removeIngredient = (id: string) => {
    setIngredients(ingredients.filter((i) => i.food.id !== id));
  };

  const totals = ingredients.reduce(
    (acc, item) => {
      const factor = item.amount / 100;
      acc.calories += item.food.calories * factor;
      acc.protein += item.food.protein * factor;
      acc.carbs += item.food.carbs * factor;
      acc.fat += item.food.fat * factor;
      acc.fiber += (item.food.fiber || 0) * factor;
      acc.sugar += (item.food.sugar || 0) * factor;
      return acc;
    },
    { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, sugar: 0 }
  );

  const filteredFoods = allFoods.filter((f) => {
    const matchesCategory = selectedCategory === "all" || f.category === selectedCategory;
    
    if (!search && selectedCategory === "all") return false;

    const term = search.toLowerCase();
    const matchesSearch = !search || 
      f.name.toLowerCase().includes(term) || 
      (f.nameEn && f.nameEn.toLowerCase().includes(term));

    return matchesCategory && matchesSearch;
  }).slice(0, 15);

  async function handleSaveToPlan() {
    if (ingredients.length === 0) return;

    const currentPlan = await loadPlan(selectedDate);
    
    if (currentPlan[selectedMealType]) {
      setOverwriteWarningVisible(true);
    } else {
      saveMeal();
    }
  }

  async function saveMeal() {
    const mealName = language === "en" ? "Custom Meal" : "Moj obrok";
    const titleText = ingredients
      .slice(0, 2)
      .map((i) => (language === "en" && i.food.nameEn ? i.food.nameEn : i.food.name))
      .join(" i ") + (ingredients.length > 2 ? "..." : "");

    const mealData = {
      id: `custom_${Date.now()}`,
      title: `${mealName} (${titleText})`,
      titleEn: `${mealName} (${titleText})`,
      image: null,
      calories: Math.round(totals.calories),
      protein: Math.round(totals.protein * 10) / 10,
      carbs: Math.round(totals.carbs * 10) / 10,
      fat: Math.round(totals.fat * 10) / 10,
    };

    await setMeal(selectedMealType, mealData, selectedDate);
    setModalVisible(false);
    setOverwriteWarningVisible(false);
    router.replace("/plan");
  }

  const activeMealLabel = t(PLAN_MEAL_TYPES.find((m) => m.id === selectedMealType)?.labelKey || "");

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color="#B3FF47" size="large" />
        </View>
      </SafeAreaView>
    );
  }
  
  if (userTier !== "diamond") {
    return (
      <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
        <View className="px-4 pt-2 pb-3 flex-row items-center">
          <Pressable onPress={() => router.back()} className="w-12 h-12 items-center justify-center -ml-3">
            <Text className="text-text text-2xl">←</Text>
          </Pressable>
        </View>
        <View className="flex-1 items-center justify-center px-8">
          <Text className="text-6xl mb-6">🔒</Text>
          <Text className="text-text text-2xl font-bold text-center mb-4">
            Ekskluzivna funkcija
          </Text>
          <Text className="text-textSecondary text-base text-center mb-8">
            Kreiranje sopstvenih recepata je dostupno samo za Diamond članove. Nadogradi nalog i sastavi svoj savršen obrok!
          </Text>
          <Pressable onPress={() => router.replace("/paywall")} className="bg-primary px-8 py-4 rounded-full">
            <Text className="text-background font-bold text-base">Nadogradi na Diamond</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View className="px-4 pt-2 pb-3 flex-row items-center">
          <Pressable
            onPress={() => router.back()}
            className="w-12 h-12 items-center justify-center -ml-3"
          >
            <Text className="text-text text-2xl">←</Text>
          </Pressable>
          <Text className="text-text text-lg font-bold flex-1 text-center pr-9">
            {t("home.customRecipeBtn")}
          </Text>
        </View>

        <View className="px-4 pb-2">
          <View className="h-12 bg-surface rounded-xl flex-row items-center px-4 border border-border">
            <Text className="text-textSecondary text-lg mr-2">🔍</Text>
            <TextInput
              value={search}
              onChangeText={setSearch}
              placeholder={t("foods.search")}
              placeholderTextColor="#9EADBF"
              className="flex-1 text-text text-base h-full"
            />
          </View>
        </View>

        <View className="mb-2">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}
          >
            {CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <Pressable
                  key={cat.id}
                  onPress={() => setSelectedCategory(cat.id)}
                  className={`px-3 h-9 rounded-full flex-row items-center gap-1.5 border ${
                    isActive ? "bg-primary border-primary" : "bg-surface border-border"
                  }`}
                >
                  <Text className="text-sm">{cat.icon}</Text>
                  <Text
                    className={`text-xs font-medium ${
                      isActive ? "text-background" : "text-text"
                    }`}
                  >
                    {t(cat.labelKey)}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        {(search.length > 0 || selectedCategory !== "all") && (
          <View className="mx-4 bg-surface rounded-xl border border-border overflow-hidden mb-2 max-h-64">
            <ScrollView keyboardShouldPersistTaps="handled">
              {filteredFoods.length === 0 ? (
                <View className="p-4 items-center">
                  <Text className="text-textSecondary text-sm">{t("foods.noResults")}</Text>
                </View>
              ) : (
                filteredFoods.map((f) => (
                  <Pressable
                    key={f.id}
                    onPress={() => addIngredient(f)}
                    className="p-3 border-b border-border flex-row items-center gap-3"
                  >
                    <Text className="text-xl">{f.icon || "🍽️"}</Text>
                    <Text className="text-text text-sm flex-1">
                      {language === "en" && f.nameEn ? f.nameEn : f.name}
                    </Text>
                    <Text className="text-primary text-xs font-bold">+ Dodaj</Text>
                  </Pressable>
                ))
              )}
            </ScrollView>
          </View>
        )}

        <ScrollView className="flex-1 px-4" keyboardShouldPersistTaps="handled">
          {ingredients.length === 0 && search.length === 0 && selectedCategory === "all" ? (
            <View className="items-center justify-center mt-12">
              <Text className="text-6xl mb-4">🥣</Text>
              <Text className="text-textSecondary text-base text-center px-6">
                {language === "en"
                  ? "Search for ingredients above or select a category to build your custom meal."
                  : "Pretraži namirnice iznad ili izaberi kategoriju kako bi sastavio svoj obrok."}
              </Text>
            </View>
          ) : (
            <View className="gap-3 pb-4">
              {ingredients.map((item) => (
                <View
                  key={item.food.id}
                  className="bg-surface rounded-2xl p-3 flex-row items-center gap-3 border border-border"
                >
                  <Text className="text-2xl">{item.food.icon || "🍽️"}</Text>
                  <View className="flex-1">
                    <Text className="text-text text-sm font-bold mb-1" numberOfLines={1}>
                      {language === "en" && item.food.nameEn ? item.food.nameEn : item.food.name}
                    </Text>
                    <Text className="text-textSecondary text-xs">
                      {Math.round((item.food.calories * item.amount) / 100)} kcal
                    </Text>
                  </View>
                  <View className="flex-row items-center gap-2">
                    <TextInput
                      value={item.amount === 0 ? "" : item.amount.toString()}
                      onChangeText={(val) => updateAmount(item.food.id, val)}
                      keyboardType="numeric"
                      className="bg-background border border-border rounded-lg w-16 py-2 text-center text-text font-bold"
                    />
                    <Text className="text-textSecondary text-sm">g</Text>
                  </View>
                  <Pressable
                    onPress={() => removeIngredient(item.food.id)}
                    className="w-8 h-8 items-center justify-center"
                  >
                    <Text className="text-red-400 text-lg">✕</Text>
                  </Pressable>
                </View>
              ))}
            </View>
          )}
        </ScrollView>

        <SafeAreaView edges={["bottom"]} className="bg-surface border-t border-border">
          <View className="p-4">
            <View className="mb-4 gap-2">
              <View className="flex-row gap-2">
                <View className="flex-1 bg-background rounded-xl p-2 items-center border border-border">
                  <Text className="text-textSecondary text-[10px] mb-0.5">Kalorije</Text>
                  <Text className="text-primary font-bold text-sm">{Math.round(totals.calories)}</Text>
                </View>
                <View className="flex-1 bg-background rounded-xl p-2 items-center border border-border">
                  <Text className="text-textSecondary text-[10px] mb-0.5">Proteini</Text>
                  <Text className="text-text font-bold text-sm">{Math.round(totals.protein)}g</Text>
                </View>
                <View className="flex-1 bg-background rounded-xl p-2 items-center border border-border">
                  <Text className="text-textSecondary text-[10px] mb-0.5">UH</Text>
                  <Text className="text-text font-bold text-sm">{Math.round(totals.carbs)}g</Text>
                </View>
              </View>

              <View className="flex-row gap-2">
                <View className="flex-1 bg-background rounded-xl p-2 items-center border border-border">
                  <Text className="text-textSecondary text-[10px] mb-0.5">Masti</Text>
                  <Text className="text-text font-bold text-sm">{Math.round(totals.fat)}g</Text>
                </View>
                <View className="flex-1 bg-background rounded-xl p-2 items-center border border-border">
                  <Text className="text-textSecondary text-[10px] mb-0.5">Vlakna</Text>
                  <Text className="text-text font-bold text-sm">{Math.round(totals.fiber)}g</Text>
                </View>
                <View className="flex-1 bg-background rounded-xl p-2 items-center border border-border">
                  <Text className="text-textSecondary text-[10px] mb-0.5">Šećeri</Text>
                  <Text className="text-text font-bold text-sm">{Math.round(totals.sugar)}g</Text>
                </View>
              </View>
            </View>
            
            <Pressable
              onPress={() => setModalVisible(true)}
              className={`py-4 rounded-full items-center ${
                ingredients.length === 0 ? "bg-border" : "bg-primary"
              }`}
              disabled={ingredients.length === 0}
            >
              <Text
                className={`text-base font-bold ${
                  ingredients.length === 0 ? "text-textSecondary" : "text-background"
                }`}
              >
                {t("recipe.addToPlan")}
              </Text>
            </Pressable>
          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>

      {modalVisible && (
        <View
          className="absolute inset-0 z-50 flex-1 justify-end"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.6)" }}
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
                  onPress={handleSaveToPlan}
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

      {overwriteWarningVisible && (
        <View
          className="absolute inset-0 z-[60] flex-1 justify-center items-center px-6"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.7)" }}
        >
          <View className="bg-surface w-full rounded-3xl p-6 border border-border items-center">
            <Text className="text-4xl mb-4">⚠️</Text>
            <Text className="text-text text-lg font-bold text-center mb-2">
              {t("plan.overwriteTitle")}
            </Text>
            <Text className="text-textSecondary text-sm text-center mb-6">
              {t("plan.overwriteDesc")}
            </Text>
            <View className="flex-row gap-3 w-full">
              <Pressable
                onPress={() => setOverwriteWarningVisible(false)}
                className="flex-1 py-3 rounded-xl bg-background border border-border items-center"
              >
                <Text className="text-text font-bold">{t("common.cancel")}</Text>
              </Pressable>
              <Pressable
                onPress={saveMeal}
                className="flex-1 py-3 rounded-xl bg-red-500 items-center"
              >
                <Text className="text-white font-bold">{t("plan.overwriteBtn")}</Text>
              </Pressable>
            </View>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}