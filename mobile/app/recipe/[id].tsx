import { useState } from "react";
import { View, Text, ScrollView, Image, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";

type Ingredient = {
  id: string;
  label: string;
};

type Nutrition = {
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
};

const RECIPE = {
  title: "Mediteranska salata sa kinoom",
  description:
    "Osvežavajuća i zdrava salata puna svežeg povrća, kinoe i dressinga od limuna.",
  image: "https://placehold.co/780x640/1A1A1A/B3FF47",
  ingredients: [
    { id: "i1", label: "1 šolja kinoe" },
    { id: "i2", label: "2 šolje vode" },
    { id: "i3", label: "1 krastavac, iseckan" },
    { id: "i4", label: "1 crvena paprika, iseckana" },
    { id: "i5", label: "1/2 šolje maslina, prepolovljenih" },
    { id: "i6", label: "1/4 šolje feta sira, izmrvljenog" },
  ] as Ingredient[],
  instructions: [
    "Isperi kinou temeljno.",
    "Skuvaj kinou u vodi dok ne postane mekana.",
    "Pomešaj kuvanu kinou sa iseckanim povrćem, maslinama i fetom.",
    "Začini sokom limuna, maslinovim uljem, solju i biberom.",
    "Nežno promešaj i posluži.",
  ],
  nutrition: {
    calories: 350,
    protein: 12,
    fat: 15,
    carbs: 40,
  } as Nutrition,
};

export default function RecipeDetailScreen() {
  const { id } = useLocalSearchParams();
  const [checked, setChecked] = useState<string[]>([]);

  const toggle = (ingredientId: string) => {
    setChecked((prev) =>
      prev.includes(ingredientId)
        ? prev.filter((x) => x !== ingredientId)
        : [...prev, ingredientId]
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <View className="px-4 pt-2 pb-3 flex-row items-center justify-between">
        <Pressable
  onPress={() => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/");
    }
  }}
  className="w-12 h-12 items-center justify-center"
>
          <Text className="text-text text-2xl">←</Text>
        </Pressable>
        <Pressable className="w-12 h-12 items-center justify-center">
          <Text className="text-text text-xl">↗</Text>
        </Pressable>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <Image
          source={{ uri: RECIPE.image }}
          className="w-full h-80"
          resizeMode="cover"
        />

        <View className="px-4 pt-5 pb-3">
          <Text className="text-text text-2xl font-bold">
            {RECIPE.title}
          </Text>
        </View>

        <View className="px-4 pt-1 pb-3">
          <Text className="text-textSecondary text-base leading-6">
            {RECIPE.description}
          </Text>
        </View>

        <View className="px-4 pt-5 pb-3">
          <Text className="text-text text-2xl font-bold">Sastojci</Text>
        </View>

        <View className="px-4">
          {RECIPE.ingredients.map((ingredient) => {
            const isChecked = checked.includes(ingredient.id);
            return (
              <Pressable
                key={ingredient.id}
                onPress={() => toggle(ingredient.id)}
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
                <Text
                  className={`flex-1 text-base ${
                    isChecked
                      ? "text-textSecondary line-through"
                      : "text-text"
                  }`}
                >
                  {ingredient.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <View className="px-4 pt-5 pb-3">
          <Text className="text-text text-2xl font-bold">Priprema</Text>
        </View>

        <View className="px-4">
          {RECIPE.instructions.map((step, index) => (
            <View key={index} className="flex-row gap-3 mb-4">
              <View className="w-7 h-7 rounded-full bg-surface items-center justify-center">
                <Text className="text-primary text-sm font-bold">
                  {index + 1}
                </Text>
              </View>
              <Text className="flex-1 text-text text-base leading-6">
                {step}
              </Text>
            </View>
          ))}
        </View>

        <View className="px-4 pt-5 pb-3">
          <Text className="text-text text-2xl font-bold">
            Nutritivne vrednosti
          </Text>
        </View>

        <View className="px-4 pb-6">
          <View className="flex-row gap-3 mb-3">
            <View className="flex-1 bg-surface rounded-2xl p-4 border border-border">
              <Text className="text-textSecondary text-xs mb-1">Kalorije</Text>
              <Text className="text-primary text-xl font-bold">
                {RECIPE.nutrition.calories}
              </Text>
              <Text className="text-textSecondary text-xs">kcal</Text>
            </View>
            <View className="flex-1 bg-surface rounded-2xl p-4 border border-border">
              <Text className="text-textSecondary text-xs mb-1">Proteini</Text>
              <Text className="text-text text-xl font-bold">
                {RECIPE.nutrition.protein}g
              </Text>
            </View>
          </View>

          <View className="flex-row gap-3">
            <View className="flex-1 bg-surface rounded-2xl p-4 border border-border">
              <Text className="text-textSecondary text-xs mb-1">Masti</Text>
              <Text className="text-text text-xl font-bold">
                {RECIPE.nutrition.fat}g
              </Text>
            </View>
            <View className="flex-1 bg-surface rounded-2xl p-4 border border-border">
              <Text className="text-textSecondary text-xs mb-1">
                Ugljeni hidrati
              </Text>
              <Text className="text-text text-xl font-bold">
                {RECIPE.nutrition.carbs}g
              </Text>
            </View>
          </View>
        </View>

        <View className="h-4" />
      </ScrollView>

      <View className="px-4 py-3 flex-row gap-3 border-t border-border">
        <Pressable className="flex-1 bg-primary py-3 rounded-full items-center">
          <Text className="text-background text-sm font-bold">
            Sačuvaj recept
          </Text>
        </Pressable>
        <Pressable className="w-24 bg-surface py-3 rounded-full items-center border border-border">
          <Text className="text-text text-sm font-bold">Podeli</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}