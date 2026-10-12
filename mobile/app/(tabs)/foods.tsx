import { useState, useEffect } from "react";
import { View, Text, TextInput, ScrollView, Pressable, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import i18n from "../../locales";
import { apiGet } from "../../lib/api";

type Category = {
  id: string;
  labelKey: string;
  icon: string;
};

type Food = {
  id: string;
  name: string;
  category: string;
  calories: number;
  icon: string | null;
};

const CATEGORIES: Category[] = [
  { id: "all", labelKey: "foods.all", icon: "🍽️" },
  { id: "dairy", labelKey: "foods.dairy", icon: "🧀" },
  { id: "meat", labelKey: "foods.meat", icon: "🥩" },
  { id: "veggies", labelKey: "foods.veggies", icon: "🥕" },
  { id: "fruits", labelKey: "foods.fruits", icon: "🍎" },
  { id: "grains", labelKey: "foods.grains", icon: "🌾" },
  { id: "legumes", labelKey: "foods.legumes", icon: "🫘" },
  { id: "oils", labelKey: "foods.oils", icon: "🫒" },
];

export default function FoodsScreen() {
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [foods, setFoods] = useState<Food[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const t = (key: string) => i18n.t(key);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const data = await apiGet<Food[]>("/foods");
        setFoods(data);
        setError(null);
      } catch (e) {
        setError(String(e));
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filtered = foods.filter((food) => {
    const matchesCategory =
      selectedCategory === "all" || food.category === selectedCategory;
    const matchesQuery = food.name.toLowerCase().includes(query.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <View className="pt-4 pb-2 px-4">
        <Text className="text-text text-lg font-bold text-center">
          {t("foods.title")}
        </Text>
      </View>

      <View className="px-4 py-3">
        <View className="h-12 bg-surface rounded-xl flex-row items-center px-4">
          <Text className="text-textSecondary text-lg mr-2">🔍</Text>
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder={t("foods.search")}
            placeholderTextColor="#9EADBF"
            className="flex-1 text-text text-base h-full"
          />
        </View>
      </View>

      <View style={{ height: 56 }}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={true}
          contentContainerStyle={{ paddingHorizontal: 16, gap: 8, alignItems: "center" }}
        >
          {CATEGORIES.map((category) => {
            const isActive = selectedCategory === category.id;
            return (
              <Pressable
                key={category.id}
                onPress={() => setSelectedCategory(category.id)}
                className={`px-3 h-9 rounded-full flex-row items-center gap-1.5 border ${
                  isActive ? "bg-primary border-primary" : "bg-surface border-border"
                }`}
              >
                <Text className="text-sm">{category.icon}</Text>
                <Text
                  className={`text-xs font-medium ${
                    isActive ? "text-background" : "text-text"
                  }`}
                >
                  {t(category.labelKey)}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16 }}
      >
        {loading ? (
          <View className="items-center py-12">
            <ActivityIndicator color="#B3FF47" size="large" />
            <Text className="text-textSecondary text-sm mt-4">
              {t("common.loading")}
            </Text>
          </View>
        ) : error ? (
          <View className="items-center py-12">
            <Text className="text-4xl mb-3">⚠️</Text>
            <Text className="text-textSecondary text-base text-center">
              {error}
            </Text>
          </View>
        ) : filtered.length === 0 ? (
          <View className="items-center py-12">
            <Text className="text-4xl mb-3">🔍</Text>
            <Text className="text-textSecondary text-base">
              {t("foods.noResults")}
            </Text>
          </View>
        ) : (
          filtered.map((food) => (
            <Pressable
              key={food.id}
              onPress={() => router.push(`/food/${food.id}`)}
              className="py-3 flex-row items-center gap-4 border-b border-border/40"
            >
              <View className="w-12 h-12 bg-surface rounded-xl items-center justify-center">
                <Text className="text-2xl">{food.icon || "🍽️"}</Text>
              </View>
              <View className="flex-1">
                <Text className="text-text text-base font-medium mb-0.5">
                  {food.name}
                </Text>
                <Text className="text-textSecondary text-sm">
                  {food.calories} kcal / 100g
                </Text>
              </View>
              <Text className="text-textSecondary text-lg">›</Text>
            </Pressable>
          ))
        )}

        <View className="h-6" />
      </ScrollView>
    </SafeAreaView>
  );
}