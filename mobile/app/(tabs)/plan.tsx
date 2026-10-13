import { router } from "expo-router";
import { useState } from "react";
import { View, Text, ScrollView, Image, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLanguage } from "../../contexts/LanguageContext";
import i18n from "../../locales";

type Day = {
  id: string;
  labelKey: string;
};

type Meal = {
  id: string;
  type: string;
  title: string;
  calories: number;
  image: string;
};

const DAYS: Day[] = [
  { id: "mon", labelKey: "days.mon" },
  { id: "tue", labelKey: "days.tue" },
  { id: "wed", labelKey: "days.wed" },
  { id: "thu", labelKey: "days.thu" },
  { id: "fri", labelKey: "days.fri" },
  { id: "sat", labelKey: "days.sat" },
  { id: "sun", labelKey: "days.sun" },
];

const MEALS_BY_DAY: Record<string, Meal[]> = {
  mon: [
    { id: "m1", type: "breakfast", title: "Ovsenka sa bobičastim voćem", calories: 300, image: "https://placehold.co/112x112/1A1A1A/B3FF47" },
    { id: "m2", type: "lunch", title: "Sendvič sa piletinom", calories: 450, image: "https://placehold.co/112x112/1A1A1A/B3FF47" },
    { id: "m3", type: "dinner", title: "Losos sa pečenim povrćem", calories: 600, image: "https://placehold.co/112x112/1A1A1A/B3FF47" },
  ],
  tue: [
    { id: "t1", type: "breakfast", title: "Jogurt sa granolom", calories: 280, image: "https://placehold.co/112x112/1A1A1A/B3FF47" },
    { id: "t2", type: "lunch", title: "Supa od sočiva", calories: 380, image: "https://placehold.co/112x112/1A1A1A/B3FF47" },
    { id: "t3", type: "dinner", title: "Piletina sa brokolijem", calories: 520, image: "https://placehold.co/112x112/1A1A1A/B3FF47" },
  ],
  wed: [
    { id: "w1", type: "breakfast", title: "Kajgana sa povrćem", calories: 320, image: "https://placehold.co/112x112/1A1A1A/B3FF47" },
    { id: "w2", type: "lunch", title: "Rižoto sa pečurkama", calories: 480, image: "https://placehold.co/112x112/1A1A1A/B3FF47" },
    { id: "w3", type: "dinner", title: "Smoothie bowl", calories: 350, image: "https://placehold.co/112x112/1A1A1A/B3FF47" },
  ],
  thu: [
    { id: "th1", type: "breakfast", title: "Tost sa avokadom", calories: 340, image: "https://placehold.co/112x112/1A1A1A/B3FF47" },
    { id: "th2", type: "lunch", title: "Tortilje sa piletinom", calories: 520, image: "https://placehold.co/112x112/1A1A1A/B3FF47" },
    { id: "th3", type: "dinner", title: "Salata sa kinoom", calories: 420, image: "https://placehold.co/112x112/1A1A1A/B3FF47" },
  ],
  fri: [
    { id: "f1", type: "breakfast", title: "Palačinke od ovsenog brašna", calories: 380, image: "https://placehold.co/112x112/1A1A1A/B3FF47" },
    { id: "f2", type: "lunch", title: "Testenina sa pestom", calories: 540, image: "https://placehold.co/112x112/1A1A1A/B3FF47" },
    { id: "f3", type: "dinner", title: "Pečena piletina sa krompirom", calories: 600, image: "https://placehold.co/112x112/1A1A1A/B3FF47" },
  ],
  sat: [
    { id: "s1", type: "breakfast", title: "Musli sa jogurtom", calories: 340, image: "https://placehold.co/112x112/1A1A1A/B3FF47" },
    { id: "s2", type: "lunch", title: "Burgers sa crnim pasuljem", calories: 480, image: "https://placehold.co/112x112/1A1A1A/B3FF47" },
    { id: "s3", type: "dinner", title: "Wok sa povrćem i tofujem", calories: 440, image: "https://placehold.co/112x112/1A1A1A/B3FF47" },
  ],
  sun: [
    { id: "su1", type: "breakfast", title: "Kroasan sa kafom", calories: 380, image: "https://placehold.co/112x112/1A1A1A/B3FF47" },
    { id: "su2", type: "lunch", title: "Nedeljni ručak - sarma", calories: 620, image: "https://placehold.co/112x112/1A1A1A/B3FF47" },
    { id: "su3", type: "dinner", title: "Lagana supa", calories: 280, image: "https://placehold.co/112x112/1A1A1A/B3FF47" },
  ],
};

const MEAL_TYPES = [
  { id: "breakfast", labelKey: "plan.breakfast" },
  { id: "lunch", labelKey: "plan.lunch" },
  { id: "dinner", labelKey: "plan.dinner" },
];

export default function PlanScreen() {
  const [selectedDay, setSelectedDay] = useState("mon");
  const { language } = useLanguage();
  const t = (key: string) => i18n.t(key);

  const meals = MEALS_BY_DAY[selectedDay] || [];
  const totalCalories = meals.reduce((sum, m) => sum + m.calories, 0);

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="pt-4 pb-2 px-4 flex-row items-center justify-between">
        <Text className="text-text text-lg font-bold flex-1 text-center">
          {t("plan.title")}
        </Text>
        <Pressable className="w-12 h-12 items-center justify-center">
          <Text className="text-text text-2xl">📅</Text>
        </Pressable>
      </View>

      <View className="border-b border-border">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16, gap: 32 }}
        >
          {DAYS.map((day) => {
            const isActive = selectedDay === day.id;
            return (
              <Pressable
                key={day.id}
                onPress={() => setSelectedDay(day.id)}
                className={`pt-4 pb-3 border-b-[3px] ${
                  isActive ? "border-primary" : "border-transparent"
                }`}
              >
                <Text
                  className={`text-sm font-bold ${
                    isActive ? "text-text" : "text-textSecondary"
                  }`}
                >
                  {t(day.labelKey)}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-4 pt-5 pb-3">
          <Text className="text-text text-sm">
            {t("plan.total")}:{" "}
            <Text className="text-primary font-bold">{totalCalories} kcal</Text>
          </Text>
        </View>

        {MEAL_TYPES.map((mealType) => {
          const mealOfType = meals.filter((m) => m.type === mealType.id);
          if (mealOfType.length === 0) return null;

          return (
            <View key={mealType.id}>
              <View className="px-4 pt-5 pb-3">
                <Text className="text-text text-2xl font-bold">
                  {t(mealType.labelKey)}
                </Text>
              </View>

              {mealOfType.map((meal) => (
                <Pressable
                  key={meal.id}
                  onPress={() => router.push(`/meal/${meal.id}`)}
                  className="px-4 py-2 flex-row items-center gap-4"
                >
                  <Image
                    source={{ uri: meal.image }}
                    className="w-14 h-14 rounded-lg"
                  />
                  <View className="flex-1">
                    <Text
                      className="text-text text-base font-medium mb-0.5"
                      numberOfLines={2}
                    >
                      {meal.title}
                    </Text>
                    <Text className="text-textSecondary text-sm">
                      {meal.calories} kcal
                    </Text>
                  </View>
                </Pressable>
              ))}
            </View>
          );
        })}

        <Pressable className="mx-4 mt-6 mb-8 py-4 rounded-2xl border border-dashed border-border items-center flex-row justify-center gap-2">
          <Text className="text-textSecondary text-base">+</Text>
          <Text className="text-textSecondary text-base font-medium">
            {t("plan.addMeal")}
          </Text>
        </Pressable>

        <View className="h-4" />
      </ScrollView>
    </SafeAreaView>
  );
}