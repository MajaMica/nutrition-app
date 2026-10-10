import { View, Text, ScrollView, Image, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";

type Ingredient = {
  id: string;
  label: string;
  icon: string;
};

const MEAL = {
  title: "Piletina salata sa avokadom",
  image: "https://placehold.co/112x112/1A1A1A/B3FF47",
  servings: "1 porcija",
  nutrition: [
    { id: "cal", label: "Kalorije", value: "450 kcal" },
    { id: "prot", label: "Proteini", value: "30g" },
    { id: "fat", label: "Masti", value: "25g" },
    { id: "carbs", label: "Ugljeni hidrati", value: "15g" },
  ],
  ingredients: [
    { id: "i1", label: "Pileća prsa (150g)", icon: "🍗" },
    { id: "i2", label: "Avokado (50g)", icon: "🥑" },
    { id: "i3", label: "Mešana salata (100g)", icon: "🥬" },
    { id: "i4", label: "Sok od limuna (1 kašika)", icon: "🍋" },
    { id: "i5", label: "Maslinovo ulje (1 kašika)", icon: "🫒" },
  ] as Ingredient[],
};

export default function MealSummaryScreen() {
  const { id } = useLocalSearchParams();

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
          Nutritivne vrednosti
        </Text>
        <View className="w-12 h-12" />
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-4 pt-5 pb-3">
          <Text className="text-text text-2xl font-bold">Sažetak obroka</Text>
        </View>

        <Pressable
          onPress={() => router.push(`/recipe/${id}`)}
          className="px-4 py-2 flex-row items-center gap-4 mb-2"
        >
          <Image
            source={{ uri: MEAL.image }}
            className="w-14 h-14 rounded-lg"
          />
          <View className="flex-1">
            <Text className="text-text text-base font-medium mb-0.5" numberOfLines={1}>
              {MEAL.title}
            </Text>
            <Text className="text-textSecondary text-sm">{MEAL.servings}</Text>
          </View>
          <Text className="text-textSecondary text-lg">›</Text>
        </Pressable>

        <View className="px-4 py-4">
          {MEAL.nutrition.map((item) => (
            <View
              key={item.id}
              className="flex-row justify-between items-center py-2"
            >
              <Text className="text-textSecondary text-sm">{item.label}</Text>
              <Text className="text-text text-sm">{item.value}</Text>
            </View>
          ))}
        </View>

        <View className="px-4 pt-5 pb-3">
          <Text className="text-text text-2xl font-bold">Sastojci</Text>
        </View>

        <View>
          {MEAL.ingredients.map((ingredient) => (
            <View
              key={ingredient.id}
              className="px-4 h-14 flex-row items-center gap-4"
            >
              <View className="w-10 h-10 bg-surface rounded-lg items-center justify-center">
                <Text className="text-xl">{ingredient.icon}</Text>
              </View>
              <Text className="flex-1 text-text text-base" numberOfLines={1}>
                {ingredient.label}
              </Text>
            </View>
          ))}
        </View>

        <View className="h-6" />
      </ScrollView>
    </SafeAreaView>
  );
}