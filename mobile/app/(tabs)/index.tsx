import { useState, useEffect, useCallback } from "react";
import { View, Text, ScrollView, Image, Pressable, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useFocusEffect } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLanguage } from "../../contexts/LanguageContext";
import { useProfile } from "../../hooks/useProfile";
import { calculateDailyCalories } from "../../lib/calories";
import { loadPlan, calculateTotal } from "../../lib/mealPlan";
import { supabase } from "../../lib/supabase";
import { apiGetAuth, apiGet } from "../../lib/api";
import i18n from "../../locales";

type Recipe = {
  id: string;
  title: string;
  titleEn: string | null;
  description: string | null;
  descriptionEn: string | null;
  image: string | null;
  mealType: string;
  calories: number;
  isPremium: boolean;
};

export default function HomeScreen() {
  const [userName, setUserName] = useState("");
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const { profile, loading: profileLoading } = useProfile();
  const [consumed, setConsumed] = useState(0);

  const dailyGoal = calculateDailyCalories(profile);
  const percentage =
    dailyGoal > 0
      ? Math.min(Math.round((consumed / dailyGoal) * 100), 100)
      : 0;

  const { language } = useLanguage();
  const t = (key: string) => i18n.t(key);

  useEffect(() => {
    loadUser();
    loadRecipes();
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadConsumed();
      loadFavorites();
    }, [])
  );

  async function loadConsumed() {
    try {
      const plan = await loadPlan();
      const totals = calculateTotal(plan);
      setConsumed(totals.calories);
    } catch {
      setConsumed(0);
    }
  }

  async function loadFavorites() {
    try {
      const raw = await AsyncStorage.getItem("favorite_recipes");
      if (raw) {
        setFavoriteIds(JSON.parse(raw));
      } else {
        setFavoriteIds([]);
      }
    } catch {}
  }

  async function loadUser() {
    const { data } = await supabase.auth.getUser();
    if (data.user) {
      const name = (data.user.user_metadata?.name as string) || "Korisnik";
      setUserName(name.split(" ")[0]);
    }
  }

  async function loadRecipes() {
    try {
      setLoading(true);
      let data: Recipe[];
      try {
        data = await apiGetAuth<Recipe[]>("/recipes/suggestions");
        if (data.length < 20) {
          const allData = await apiGet<Recipe[]>("/recipes");
          const existingIds = new Set(data.map(r => r.id));
          const missing = allData.filter(r => !existingIds.has(r.id));
          data = [...data, ...missing];
        }
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

  const getTitle = (r: Recipe) =>
    language === "en" && r.titleEn ? r.titleEn : r.title;

  const nextMeal = recipes[0];
  const forYou = recipes.slice(0, 6);
  
  const favoriteRecipes = recipes.filter(r => favoriteIds.includes(r.id));

  if (loading || profileLoading) {
    return (
      <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color="#B3FF47" size="large" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-4 pt-4 pb-3">
          <Text className="text-textSecondary text-sm mb-1">
            {t("home.greeting")}
          </Text>
          <Text className="text-text text-3xl font-bold">
            {userName || "..."} 👋
          </Text>
        </View>

        <View className="mx-4 mt-2 bg-surface rounded-3xl p-6 border border-border">
          <View className="flex-row items-center justify-between mb-6">
            <View>
              <Text className="text-textSecondary text-sm mb-1">
                {t("home.dailyGoal")}
              </Text>
              <Text className="text-text text-3xl font-bold">
                {consumed}{" "}
                <Text className="text-textSecondary text-lg font-normal">
                  / {dailyGoal} kcal
                </Text>
              </Text>
            </View>
            <View className="w-16 h-16 rounded-full border-4 border-primary items-center justify-center">
              <Text className="text-primary text-base font-bold">
                {percentage}%
              </Text>
            </View>
          </View>

          <View className="h-2 bg-background rounded-full overflow-hidden">
            <View
              className="h-2 bg-primary rounded-full"
              style={{ width: `${percentage}%` }}
            />
          </View>
        </View>

        {nextMeal && (
          <>
            <View className="px-4 pt-6 pb-3 flex-row items-center justify-between">
              <Text className="text-text text-xl font-bold">
                {t("home.nextMeal")}
              </Text>
              <Pressable onPress={() => router.push("/plan")}>
                <Text className="text-primary text-sm font-medium">
                  {t("home.seeAll")}
                </Text>
              </Pressable>
            </View>

            <Pressable
              onPress={() => router.push(`/recipe/${nextMeal.id}`)}
              className="mx-4 bg-surface rounded-2xl p-3 flex-row items-center gap-3 border border-border"
            >
              {nextMeal.image ? (
                <Image
                  source={{ uri: nextMeal.image }}
                  className="w-14 h-14 rounded-xl"
                />
              ) : (
                <View className="w-14 h-14 rounded-xl bg-background items-center justify-center">
                  <Text className="text-2xl">🍽️</Text>
                </View>
              )}
              <View className="flex-1">
                <Text
                  className="text-text text-base font-medium mb-0.5"
                  numberOfLines={1}
                >
                  {getTitle(nextMeal)}
                </Text>
                <Text className="text-textSecondary text-sm">
                  {Math.round(nextMeal.calories)} kcal
                </Text>
              </View>
              <Text className="text-textSecondary text-lg">›</Text>
            </Pressable>
          </>
        )}

        <View className="px-4 pt-6 pb-3">
          <Text className="text-text text-xl font-bold">
            {t("home.quickActions")}
          </Text>
        </View>

        <View className="px-4 flex-row gap-3">
          <Pressable
            onPress={() => router.push("/recipes")}
            className="flex-1 bg-surface rounded-2xl p-4 border border-border items-center"
          >
            <Text className="text-3xl mb-2">🍳</Text>
            <Text className="text-text text-sm font-medium text-center">
              {t("home.makeRecipe")}
            </Text>
          </Pressable>

          <Pressable
            onPress={() => router.push("/foods")}
            className="flex-1 bg-surface rounded-2xl p-4 border border-border items-center"
          >
            <Text className="text-3xl mb-2">🥕</Text>
            <Text className="text-text text-sm font-medium text-center">
              {t("home.searchFoods")}
            </Text>
          </Pressable>
        </View>

        {favoriteRecipes.length > 0 && (
          <>
            <View className="px-4 pt-6 pb-3 flex-row items-center justify-between">
              <Text className="text-text text-xl font-bold">
                {t("home.favorites")}
              </Text>
              <Pressable onPress={() => router.push("/favorites")}>
                <Text className="text-primary text-sm font-medium">
                  {t("home.seeAll")}
                </Text>
              </Pressable>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              snapToInterval={150 + 12}
              decelerationRate="fast"
              contentContainerStyle={{
                paddingHorizontal: 16,
                gap: 12,
                paddingRight: 32,
              }}
            >
              {favoriteRecipes.map((recipe) => (
                <Pressable
                  key={recipe.id}
                  onPress={() => router.push(`/recipe/${recipe.id}`)}
                  style={{ width: 150 }}
                  className="gap-2"
                >
                  {recipe.image ? (
                    <Image
                      source={{ uri: recipe.image }}
                      style={{ width: "100%", height: 150, borderRadius: 16 }}
                      resizeMode="cover"
                    />
                  ) : (
                    <View
                      style={{ width: "100%", height: 150, borderRadius: 16 }}
                      className="bg-surface items-center justify-center"
                    >
                      <Text className="text-4xl">🍽️</Text>
                    </View>
                  )}
                  <View>
                    <Text
                      className="text-text text-sm font-medium mb-1"
                      numberOfLines={2}
                    >
                      {getTitle(recipe)}
                    </Text>
                    <Text className="text-textSecondary text-xs">
                      {Math.round(recipe.calories)} kcal
                    </Text>
                  </View>
                </Pressable>
              ))}
            </ScrollView>
          </>
        )}

        <View className="px-4 pt-6 pb-3">
          <Text className="text-text text-xl font-bold">{t("home.forYou")}</Text>
        </View>

        {forYou.length === 0 ? (
          <View className="px-4 py-8 items-center">
            <Text className="text-textSecondary text-sm text-center">
              {language === "en" ? "No recipes yet" : "Još nema recepata"}
            </Text>
          </View>
        ) : (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            snapToInterval={170 + 12}
            decelerationRate="fast"
            contentContainerStyle={{
              paddingHorizontal: 16,
              gap: 12,
              paddingRight: 32,
            }}
          >
            {forYou.map((recipe) => (
              <Pressable
                key={recipe.id}
                onPress={() => router.push(`/recipe/${recipe.id}`)}
                style={{ width: 170 }}
                className="gap-3"
              >
                {recipe.image ? (
                  <Image
                    source={{ uri: recipe.image }}
                    style={{ width: "100%", height: 213, borderRadius: 16 }}
                    resizeMode="cover"
                  />
                ) : (
                  <View
                    style={{ width: "100%", height: 213, borderRadius: 16 }}
                    className="bg-surface items-center justify-center"
                  >
                    <Text className="text-5xl">🍽️</Text>
                  </View>
                )}
                <View>
                  <Text
                    className="text-text text-base font-medium mb-1"
                    numberOfLines={2}
                  >
                    {getTitle(recipe)}
                  </Text>
                  <Text className="text-textSecondary text-sm">
                    {Math.round(recipe.calories)} kcal
                  </Text>
                </View>
              </Pressable>
            ))}
          </ScrollView>
        )}
        
        <View className="px-4 pt-6">
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

        <View className="px-4 pt-6">
          <Pressable
            onPress={() => router.push("/ebooks")}
            className="bg-primary rounded-2xl p-5 flex-row items-center gap-4"
          >
            <Text className="text-4xl">📖</Text>
            <View className="flex-1">
              <Text className="text-background text-base font-bold mb-1">
                {t("home.newEbook")}
              </Text>
              <Text className="text-background/80 text-sm">
                {t("home.newEbookDesc")}
              </Text>
            </View>
            <Text className="text-background text-2xl">›</Text>
          </Pressable>
        </View>

        <View className="h-8" />
      </ScrollView>
    </SafeAreaView>
  );
}