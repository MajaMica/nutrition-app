import { useState, useEffect } from "react";
import { View, Text, ScrollView, Pressable, TextInput, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import { useLanguage } from "../../contexts/LanguageContext";
import i18n from "../../locales";
import { apiGet } from "../../lib/api";

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
  salt: number | null;
  saturatedFat: number | null;
};

const SERVING_UNITS = [
  { id: "g", labelKey: "food.gram", multiplier: 1 },
  { id: "tbsp", labelKey: "food.tbsp", multiplier: 15 },
  { id: "tsp", labelKey: "food.tsp", multiplier: 5 },
  { id: "cup", labelKey: "food.cup", multiplier: 240 },
];

export default function FoodDetailScreen() {
  const { id } = useLocalSearchParams();
  const [food, setFood] = useState<Food | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [amount, setAmount] = useState("100");
  const [unit, setUnit] = useState("g");

  const { language } = useLanguage();
  const t = (key: string) => i18n.t(key);

  useEffect(() => {
    loadFood();
  }, [id]);

  async function loadFood() {
    try {
      setLoading(true);
      const data = await apiGet<Food>(`/foods/${id}`);
      setFood(data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

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

  if (error || !food) {
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
            {error || "Namirnica nije pronađena"}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const displayName =
    language === "en" && food.nameEn ? food.nameEn : food.name;

  const selectedUnit = SERVING_UNITS.find((u) => u.id === unit)!;
  const grams = (parseFloat(amount) || 0) * selectedUnit.multiplier;
  const factor = grams / 100;

  const calc = (value: number | null) =>
    value != null ? (value * factor).toFixed(1) : "0.0";

  const calcSalt = (value: number | null) =>
    value != null ? (value * factor).toFixed(2) : "0.00";

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <View className="px-4 pt-2 pb-3 flex-row items-center justify-between">
        <Pressable
          onPress={() => router.back()}
          className="w-12 h-12 items-center justify-center"
        >
          <Text className="text-text text-2xl">←</Text>
        </Pressable>
        <Text className="text-text text-lg font-bold flex-1 text-center">
          {t("food.title")}
        </Text>
        <View className="w-12 h-12" />
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="items-center pt-4 pb-6">
          <View className="w-24 h-24 bg-surface rounded-3xl items-center justify-center mb-4">
            <Text className="text-5xl">{food.icon || "🍽️"}</Text>
          </View>
          <Text className="text-text text-2xl font-bold mb-1">
            {displayName}
          </Text>
          <Text className="text-textSecondary text-sm">{food.category}</Text>
        </View>

        <View className="px-4 pb-6">
          <Text className="text-text text-lg font-bold mb-3">
            {t("food.amount")}
          </Text>

          <View className="flex-row gap-3 mb-3">
            <View className="flex-1 bg-surface rounded-2xl p-3 border border-border flex-row items-center">
              <TextInput
                value={amount}
                onChangeText={setAmount}
                keyboardType="numeric"
                placeholder="100"
                placeholderTextColor="#666"
                className="flex-1 text-text text-xl font-bold text-center"
              />
            </View>
          </View>

          <View className="flex-row gap-2">
            {SERVING_UNITS.map((u) => {
              const isActive = unit === u.id;
              return (
                <Pressable
                  key={u.id}
                  onPress={() => setUnit(u.id)}
                  className={`flex-1 py-3 rounded-xl items-center border ${
                    isActive
                      ? "bg-primary border-primary"
                      : "bg-surface border-border"
                  }`}
                >
                  <Text
                    className={`text-sm font-medium ${
                      isActive ? "text-background" : "text-text"
                    }`}
                  >
                    {t(u.labelKey)}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View className="px-4 pb-6">
          <Text className="text-text text-lg font-bold mb-3">
            {t("food.nutrition")}
          </Text>

          <View className="bg-surface rounded-2xl p-5 border border-border mb-3">
            <Text className="text-textSecondary text-sm mb-2">
              {t("food.calories")} ({grams.toFixed(0)}g)
            </Text>
            <Text className="text-primary text-4xl font-bold">
              {calc(food.calories)}
            </Text>
            <Text className="text-textSecondary text-xs mt-1">kcal</Text>
          </View>

          <View className="flex-row gap-3 mb-3">
            <View className="flex-1 bg-surface rounded-2xl p-4 border border-border">
              <Text className="text-textSecondary text-xs mb-1">
                {t("food.protein")}
              </Text>
              <Text className="text-text text-xl font-bold">
                {calc(food.protein)}g
              </Text>
            </View>
            <View className="flex-1 bg-surface rounded-2xl p-4 border border-border">
              <Text className="text-textSecondary text-xs mb-1">
                {t("food.carbs")}
              </Text>
              <Text className="text-text text-xl font-bold">
                {calc(food.carbs)}g
              </Text>
            </View>
            <View className="flex-1 bg-surface rounded-2xl p-4 border border-border">
              <Text className="text-textSecondary text-xs mb-1">
                {t("food.fat")}
              </Text>
              <Text className="text-text text-xl font-bold">
                {calc(food.fat)}g
              </Text>
            </View>
          </View>

          <View className="flex-row gap-3 mb-3">
            <View className="flex-1 bg-surface rounded-2xl p-4 border border-border">
              <Text className="text-textSecondary text-xs mb-1">
                {t("food.fiber")}
              </Text>
              <Text className="text-text text-base font-bold">
                {calc(food.fiber)}g
              </Text>
            </View>
            <View className="flex-1 bg-surface rounded-2xl p-4 border border-border">
              <Text className="text-textSecondary text-xs mb-1">
                {t("food.sugar")}
              </Text>
              <Text className="text-text text-base font-bold">
                {calc(food.sugar)}g
              </Text>
            </View>
          </View>

          <View className="flex-row gap-3">
            <View className="flex-1 bg-surface rounded-2xl p-4 border border-border">
              <Text className="text-textSecondary text-xs mb-1">
                {t("food.salt")}
              </Text>
              <Text className="text-text text-base font-bold">
                {calcSalt(food.salt)}g
              </Text>
            </View>
            <View className="flex-1 bg-surface rounded-2xl p-4 border border-border">
              <Text className="text-textSecondary text-xs mb-1" numberOfLines={1}>
                {t("food.saturatedFat")}
              </Text>
              <Text className="text-text text-base font-bold">
                {calc(food.saturatedFat)}g
              </Text>
            </View>
          </View>
        </View>

        <View className="h-4" />
      </ScrollView>

          <SafeAreaView edges={["bottom"]} className="bg-background border-t border-border">
        <View className="px-4 py-3">
          <Pressable
            onPress={() => {
              const gramsAmount = (parseFloat(amount) || 0) * selectedUnit.multiplier;
              router.push({
                pathname: "/custom-recipe",
                params: { foodId: food.id, grams: gramsAmount }
              });
            }}
            className="bg-primary py-4 rounded-2xl items-center"
          >
            <Text className="text-background text-base font-bold">
              {t("food.addToMeal")}
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </SafeAreaView>
  );
}