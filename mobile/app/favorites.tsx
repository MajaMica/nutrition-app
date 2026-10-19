import { useState, useCallback } from "react";
import { View, Text, FlatList, Image, Pressable, ActivityIndicator, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useFocusEffect } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLanguage } from "../contexts/LanguageContext";
import { apiGet } from "../lib/api";
import i18n from "../locales";

type Recipe = {
  id: string;
  title: string;
  titleEn: string | null;
  image: string | null;
  calories: number;
  mealType: string;
  mealTypes: string[];
};

const FILTERS = [
  { id: "all", labelKey: "foods.all", icon: "🍽️" },
  { id: "dorucak", labelKey: "plan.breakfast", icon: "🌅" },
  { id: "rucak", labelKey: "plan.lunch", icon: "🍲" },
  { id: "vecera", labelKey: "plan.dinner", icon: "🌙" },
  { id: "uzina", labelKey: "plan.snack", icon: "🍎" },
];

export default function FavoritesScreen() {
  const [favorites, setFavorites] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const { language } = useLanguage();
  const t = (key: string) => i18n.t(key);

  useFocusEffect(
    useCallback(() => {
      loadFavorites();
    }, [])
  );

  async function loadFavorites() {
    try {
      setLoading(true);
      const raw = await AsyncStorage.getItem("favorite_recipes");
      const favoriteIds = raw ? (JSON.parse(raw) as string[]) : [];

      if (favoriteIds.length === 0) {
        setFavorites([]);
        setLoading(false);
        return;
      }

      const allRecipes = await apiGet<Recipe[]>("/recipes");
      const filtered = allRecipes.filter((r) => favoriteIds.includes(r.id));
      setFavorites(filtered);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  const getTitle = (r: Recipe) =>
    language === "en" && r.titleEn ? r.titleEn : r.title;

  const filteredFavorites = favorites.filter((recipe) => {
    if (selectedFilter === "all") return true;
    
    if (Array.isArray(recipe.mealTypes) && recipe.mealTypes.length > 0) {
      return recipe.mealTypes.some((t) => t.toLowerCase() === selectedFilter);
    }
    
    return recipe.mealType?.toLowerCase() === selectedFilter;
  });

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <View className="px-4 pt-2 pb-3 flex-row items-center">
        <Pressable
          onPress={() => router.back()}
          className="w-12 h-12 items-center justify-center -ml-3"
        >
          <Text className="text-text text-2xl">←</Text>
        </Pressable>
        <Text className="text-text text-lg font-bold flex-1 text-center pr-9">
          {t("home.favorites")}
        </Text>
      </View>

      {!loading && favorites.length > 0 && (
        <View className="pb-4">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}
          >
            {FILTERS.map((filter) => {
              const isActive = selectedFilter === filter.id;
              return (
                <Pressable
                  key={filter.id}
                  onPress={() => setSelectedFilter(filter.id)}
                  className={`px-4 py-2 rounded-full flex-row items-center gap-2 border ${
                    isActive
                      ? "bg-primary border-primary"
                      : "bg-surface border-border"
                  }`}
                >
                  <Text className="text-sm">{filter.icon}</Text>
                  <Text
                    className={`text-sm font-bold ${
                      isActive ? "text-background" : "text-text"
                    }`}
                  >
                    {t(filter.labelKey)}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>
      )}

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color="#B3FF47" size="large" />
        </View>
      ) : favorites.length === 0 ? (
        <View className="flex-1 items-center justify-center px-8">
          <Text className="text-6xl mb-4">🤍</Text>
          <Text className="text-text text-xl font-bold text-center mb-2">
            {t("favorites.empty")}
          </Text>
          <Text className="text-textSecondary text-base text-center mb-8">
            {t("favorites.emptyDesc")}
          </Text>
          <Pressable
            onPress={() => router.push("/recipes")}
            className="bg-primary px-8 py-3 rounded-full"
          >
            <Text className="text-background text-base font-bold">
              {t("favorites.explore")}
            </Text>
          </Pressable>
        </View>
      ) : filteredFavorites.length === 0 ? (
        <View className="flex-1 items-center justify-center px-8">
          <Text className="text-5xl mb-4">🔍</Text>
          <Text className="text-textSecondary text-base text-center">
            {language === "en" ? "No recipes in this category." : "Nema recepata u ovoj kategoriji."}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredFavorites}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={{ padding: 12, paddingBottom: 24 }}
          columnWrapperStyle={{ gap: 12 }}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => router.push(`/recipe/${item.id}`)}
              className="flex-1 mb-3 bg-surface rounded-2xl border border-border overflow-hidden"
            >
              {item.image ? (
                <Image
                  source={{ uri: item.image }}
                  className="w-full h-36"
                  resizeMode="cover"
                />
              ) : (
                <View className="w-full h-36 bg-background items-center justify-center">
                  <Text className="text-4xl">🍽️</Text>
                </View>
              )}
              <View className="p-3">
                <Text
                  className="text-text text-sm font-bold mb-1"
                  numberOfLines={2}
                >
                  {getTitle(item)}
                </Text>
                <Text className="text-textSecondary text-xs font-medium">
                  {Math.round(item.calories)} kcal
                </Text>
              </View>
            </Pressable>
          )}
        />
      )}
    </SafeAreaView>
  );
}