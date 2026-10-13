import { useState, useEffect } from "react";
import { View, Text, TextInput, ScrollView, Image, Pressable, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useLanguage } from "../../contexts/LanguageContext";
import i18n from "../../locales";
import { apiGet } from "../../lib/api";

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

export default function RecipesScreen() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const { language } = useLanguage();
  const t = (key: string) => i18n.t(key);

  useEffect(() => {
    loadRecipes();
  }, []);

  async function loadRecipes() {
    try {
      setLoading(true);
      const data = await apiGet<Recipe[]>("/recipes");
      setRecipes(data);
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

  const filtered = recipes.filter((r) =>
    r.title.toLowerCase().includes(search.toLowerCase()) ||
    (r.titleEn?.toLowerCase().includes(search.toLowerCase()) ?? false)
  );

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <View className="pt-2 pb-3 px-4 flex-row items-center justify-between">
        <Text className="text-text text-lg font-bold flex-1 text-center">
          {t("recipes.title")}
        </Text>
        <Pressable className="w-12 h-12 items-center justify-center">
          <Text className="text-text text-2xl">🔍</Text>
        </Pressable>
      </View>

      <View className="px-4 pb-3">
        <View className="h-12 bg-surface rounded-xl flex-row items-center px-4">
          <Text className="text-textSecondary text-lg mr-2">🔍</Text>
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder={t("recipes.search")}
            placeholderTextColor="#9EADBF"
            className="flex-1 text-text text-base h-full"
          />
        </View>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {loading ? (
          <View className="items-center py-12">
            <ActivityIndicator color="#B3FF47" size="large" />
            <Text className="text-textSecondary text-sm mt-4">
              {t("common.loading")}
            </Text>
          </View>
        ) : error ? (
          <View className="items-center py-12 px-6">
            <Text className="text-4xl mb-3">⚠️</Text>
            <Text className="text-textSecondary text-base text-center">
              {error}
            </Text>
          </View>
        ) : filtered.length === 0 ? (
          <View className="items-center py-12 px-6">
            <Text className="text-4xl mb-3">🍽️</Text>
            <Text className="text-textSecondary text-base text-center">
              {recipes.length === 0
                ? t("recipes.empty")
                : t("recipes.noResults")}
            </Text>
          </View>
        ) : (
          <View className="px-4">
            {filtered.map((recipe) => {
              const displayTitle =
                language === "en" && recipe.titleEn ? recipe.titleEn : recipe.title;
              const displayDescription =
                language === "en" && recipe.descriptionEn
                  ? recipe.descriptionEn
                  : recipe.description;

              return (
                <Pressable
                  key={recipe.id}
                  onPress={() => router.push(`/recipe/${recipe.id}`)}
                  className="bg-surface rounded-2xl mb-4 border border-border overflow-hidden"
                >
                  {recipe.image ? (
                    <Image
                      source={{ uri: recipe.image }}
                      className="w-full h-48"
                      resizeMode="cover"
                    />
                  ) : (
                    <View className="w-full h-48 bg-background items-center justify-center">
                      <Text className="text-4xl">🍽️</Text>
                    </View>
                  )}
                  <View className="p-4">
                    <View className="flex-row items-center justify-between mb-1">
                      <Text
                        className="text-text text-base font-bold flex-1"
                        numberOfLines={1}
                      >
                        {displayTitle}
                      </Text>
                      {recipe.isPremium && (
                        <Text className="text-primary text-sm ml-2">⭐</Text>
                      )}
                    </View>
                    {displayDescription && (
                      <Text
                        className="text-textSecondary text-sm mb-2"
                        numberOfLines={2}
                      >
                        {displayDescription}
                      </Text>
                    )}
                    <Text className="text-textSecondary text-xs">
                      {getMealTypeLabel(recipe.mealType)} · {Math.round(recipe.calories)} kcal
                    </Text>
                  </View>
                </Pressable>
              );
            })}
          </View>
        )}

        <View className="h-6" />
      </ScrollView>
    </SafeAreaView>
  );
}