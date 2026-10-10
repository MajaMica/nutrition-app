import { useState } from "react";
import { View, Text, TextInput, ScrollView, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";

type Category = {
  id: string;
  label: string;
  icon: string;
};

type Food = {
  id: string;
  name: string;
  calories: number;
  category: string;
  icon: string;
};

const CATEGORIES: Category[] = [
  { id: "all", label: "Sve", icon: "🍽️" },
  { id: "dairy", label: "Mlečni", icon: "🧀" },
  { id: "meat", label: "Meso", icon: "🥩" },
  { id: "veggies", label: "Povrće", icon: "🥕" },
  { id: "fruits", label: "Voće", icon: "🍎" },
  { id: "grains", label: "Žitarice", icon: "🌾" },
  { id: "legumes", label: "Mahunarke", icon: "🫘" },
  { id: "oils", label: "Ulja", icon: "🫒" },
];

const FOODS: Food[] = [
  { id: "1", name: "Kajmak", calories: 350, category: "dairy", icon: "🧀" },
  { id: "2", name: "Jabuka", calories: 52, category: "fruits", icon: "🍎" },
  { id: "3", name: "Teleća šnicla", calories: 220, category: "meat", icon: "🥩" },
  { id: "4", name: "Brokoli", calories: 34, category: "veggies", icon: "🥦" },
  { id: "5", name: "Pirinаč", calories: 130, category: "grains", icon: "🍚" },
  { id: "6", name: "Pasulj", calories: 333, category: "legumes", icon: "🫘" },
  { id: "7", name: "Maslinovo ulje", calories: 884, category: "oils", icon: "🫒" },
  { id: "8", name: "Sir", calories: 400, category: "dairy", icon: "🧀" },
  { id: "9", name: "Piletina", calories: 165, category: "meat", icon: "🍗" },
  { id: "10", name: "Paradajz", calories: 18, category: "veggies", icon: "🍅" },
  { id: "11", name: "Banana", calories: 89, category: "fruits", icon: "🍌" },
  { id: "12", name: "Ovseno brašno", calories: 389, category: "grains", icon: "🌾" },
  { id: "13", name: "Sočivo", calories: 116, category: "legumes", icon: "🫘" },
  { id: "14", name: "Jogurt", calories: 59, category: "dairy", icon: "🥛" },
  { id: "15", name: "Svinjetina", calories: 242, category: "meat", icon: "🥓" },
];

export default function FoodsScreen() {
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filtered = FOODS.filter((food) => {
    const matchesCategory =
      selectedCategory === "all" || food.category === selectedCategory;
    const matchesQuery = food.name
      .toLowerCase()
      .includes(query.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <View className="pt-4 pb-2 px-4">
        <Text className="text-text text-lg font-bold text-center">
          Namirnice
        </Text>
      </View>

      <View className="px-4 py-3">
        <View className="h-12 bg-surface rounded-xl flex-row items-center px-4">
          <Text className="text-textSecondary text-lg mr-2">🔍</Text>
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Pretraži namirnice"
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
            isActive
              ? "bg-primary border-primary"
              : "bg-surface border-border"
          }`}
        >
          <Text className="text-sm">{category.icon}</Text>
          <Text
            className={`text-xs font-medium ${
              isActive ? "text-background" : "text-text"
            }`}
          >
            {category.label}
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
        {filtered.length === 0 ? (
          <View className="items-center py-12">
            <Text className="text-4xl mb-3">🔍</Text>
            <Text className="text-textSecondary text-base">
              Nema rezultata
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
                <Text className="text-2xl">{food.icon}</Text>
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