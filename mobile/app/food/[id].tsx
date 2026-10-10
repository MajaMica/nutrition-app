import { useState } from "react";
import { View, Text, ScrollView, Pressable, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";

type Food = {
  name: string;
  icon: string;
  category: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar: number;
};

const FOOD: Food = {
  name: "Kajmak",
  icon: "🧀",
  category: "Mlečni proizvodi",
  calories: 350,
  protein: 6.5,
  carbs: 4.2,
  fat: 33,
  fiber: 0,
  sugar: 4.2,
};

const SERVING_UNITS = [
  { id: "g", label: "gram", multiplier: 1 },
  { id: "tbsp", label: "kašika", multiplier: 15 },
  { id: "tsp", label: "kašičica", multiplier: 5 },
  { id: "cup", label: "šolja", multiplier: 240 },
];

export default function FoodDetailScreen() {
  const { id } = useLocalSearchParams();
  const [amount, setAmount] = useState("100");
  const [unit, setUnit] = useState("g");

  const selectedUnit = SERVING_UNITS.find((u) => u.id === unit)!;
  const grams = (parseFloat(amount) || 0) * selectedUnit.multiplier;
  const factor = grams / 100;

  const calc = (value: number) => (value * factor).toFixed(1);

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
          Detalji namirnice
        </Text>
        <View className="w-12 h-12" />
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="items-center pt-4 pb-6">
          <View className="w-24 h-24 bg-surface rounded-3xl items-center justify-center mb-4">
            <Text className="text-5xl">{FOOD.icon}</Text>
          </View>
          <Text className="text-text text-2xl font-bold mb-1">
            {FOOD.name}
          </Text>
          <Text className="text-textSecondary text-sm">{FOOD.category}</Text>
        </View>

        <View className="px-4 pb-6">
          <Text className="text-text text-lg font-bold mb-3">Količina</Text>

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
                    {u.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View className="px-4 pb-6">
          <Text className="text-text text-lg font-bold mb-3">
            Nutritivne vrednosti
          </Text>

          <View className="bg-surface rounded-2xl p-5 border border-border mb-3">
            <Text className="text-textSecondary text-sm mb-2">
              Kalorije ({grams.toFixed(0)}g)
            </Text>
            <Text className="text-primary text-4xl font-bold">
              {calc(FOOD.calories)}
            </Text>
            <Text className="text-textSecondary text-xs mt-1">kcal</Text>
          </View>

          <View className="flex-row gap-3 mb-3">
            <View className="flex-1 bg-surface rounded-2xl p-4 border border-border">
              <Text className="text-textSecondary text-xs mb-1">Proteini</Text>
              <Text className="text-text text-xl font-bold">
                {calc(FOOD.protein)}g
              </Text>
            </View>
            <View className="flex-1 bg-surface rounded-2xl p-4 border border-border">
              <Text className="text-textSecondary text-xs mb-1">
                Ugljeni hidrati
              </Text>
              <Text className="text-text text-xl font-bold">
                {calc(FOOD.carbs)}g
              </Text>
            </View>
            <View className="flex-1 bg-surface rounded-2xl p-4 border border-border">
              <Text className="text-textSecondary text-xs mb-1">Masti</Text>
              <Text className="text-text text-xl font-bold">
                {calc(FOOD.fat)}g
              </Text>
            </View>
          </View>

          <View className="flex-row gap-3">
            <View className="flex-1 bg-surface rounded-2xl p-4 border border-border">
              <Text className="text-textSecondary text-xs mb-1">Vlakna</Text>
              <Text className="text-text text-base font-bold">
                {calc(FOOD.fiber)}g
              </Text>
            </View>
            <View className="flex-1 bg-surface rounded-2xl p-4 border border-border">
              <Text className="text-textSecondary text-xs mb-1">Šećeri</Text>
              <Text className="text-text text-base font-bold">
                {calc(FOOD.sugar)}g
              </Text>
            </View>
          </View>
        </View>

        <View className="h-4" />
      </ScrollView>

      <View className="px-4 py-3 border-t border-border">
        <Pressable className="bg-primary py-4 rounded-2xl items-center">
          <Text className="text-background text-base font-bold">
            Dodaj u obrok
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}