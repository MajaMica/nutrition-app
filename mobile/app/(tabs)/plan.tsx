import { router } from "expo-router";
import { useState } from "react";
import { View, Text, ScrollView, Image, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Day = {
  id: string;
  short: string;
  full: string;
};

type Meal = {
  id: string;
  type: string;
  title: string;
  calories: number;
  image: string;
};

const DAYS: Day[] = [
  { id: "mon", short: "Pon", full: "Ponedeljak" },
  { id: "tue", short: "Uto", full: "Utorak" },
  { id: "wed", short: "Sre", full: "Sreda" },
  { id: "thu", short: "Čet", full: "Četvrtak" },
  { id: "fri", short: "Pet", full: "Petak" },
  { id: "sat", short: "Sub", full: "Subota" },
  { id: "sun", short: "Ned", full: "Nedelja" },
];

const MEALS_BY_DAY: Record<string, Meal[]> = {
  mon: [
    { id: "m1", type: "Doručak", title: "Ovsenka sa bobičastim voćem", calories: 300, image: "https://placehold.co/112x112/1A1A1A/B3FF47" },
    { id: "m2", type: "Ručak", title: "Sendvič sa piletinom", calories: 450, image: "https://placehold.co/112x112/1A1A1A/B3FF47" },
    { id: "m3", type: "Večera", title: "Losos sa pečenim povrćem", calories: 600, image: "https://placehold.co/112x112/1A1A1A/B3FF47" },
  ],
  tue: [
    { id: "t1", type: "Doručak", title: "Jogurt sa granolom", calories: 280, image: "https://placehold.co/112x112/1A1A1A/B3FF47" },
    { id: "t2", type: "Ručak", title: "Supa od sočiva", calories: 380, image: "https://placehold.co/112x112/1A1A1A/B3FF47" },
    { id: "t3", type: "Večera", title: "Piletina sa brokolijem", calories: 520, image: "https://placehold.co/112x112/1A1A1A/B3FF47" },
  ],
  wed: [
    { id: "w1", type: "Doručak", title: "Kajgana sa povrćem", calories: 320, image: "https://placehold.co/112x112/1A1A1A/B3FF47" },
    { id: "w2", type: "Ručak", title: "Rižoto sa pečurkama", calories: 480, image: "https://placehold.co/112x112/1A1A1A/B3FF47" },
    { id: "w3", type: "Večera", title: "Smoothie bowl", calories: 350, image: "https://placehold.co/112x112/1A1A1A/B3FF47" },
  ],
  thu: [
    { id: "th1", type: "Doručak", title: "Tost sa avokadom", calories: 340, image: "https://placehold.co/112x112/1A1A1A/B3FF47" },
    { id: "th2", type: "Ručak", title: "Tortilje sa piletinom", calories: 520, image: "https://placehold.co/112x112/1A1A1A/B3FF47" },
    { id: "th3", type: "Večera", title: "Salata sa kinoom", calories: 420, image: "https://placehold.co/112x112/1A1A1A/B3FF47" },
  ],
  fri: [
    { id: "f1", type: "Doručak", title: "Palačinke od ovsenog brašna", calories: 380, image: "https://placehold.co/112x112/1A1A1A/B3FF47" },
    { id: "f2", type: "Ručak", title: "Testenina sa pestom", calories: 540, image: "https://placehold.co/112x112/1A1A1A/B3FF47" },
    { id: "f3", type: "Večera", title: "Pečena piletina sa krompirom", calories: 600, image: "https://placehold.co/112x112/1A1A1A/B3FF47" },
  ],
  sat: [
    { id: "s1", type: "Doručak", title: "Musli sa jogurtom", calories: 340, image: "https://placehold.co/112x112/1A1A1A/B3FF47" },
    { id: "s2", type: "Ručak", title: "Burgers sa crnim pasuljem", calories: 480, image: "https://placehold.co/112x112/1A1A1A/B3FF47" },
    { id: "s3", type: "Večera", title: "Wok sa povrćem i tofujem", calories: 440, image: "https://placehold.co/112x112/1A1A1A/B3FF47" },
  ],
  sun: [
    { id: "su1", type: "Doručak", title: "Kroasan sa kafom", calories: 380, image: "https://placehold.co/112x112/1A1A1A/B3FF47" },
    { id: "su2", type: "Ručak", title: "Nedeljni ručak - sarma", calories: 620, image: "https://placehold.co/112x112/1A1A1A/B3FF47" },
    { id: "su3", type: "Večera", title: "Lagana supa", calories: 280, image: "https://placehold.co/112x112/1A1A1A/B3FF47" },
  ],
};

const MEAL_TYPES = ["Doručak", "Ručak", "Večera"];

export default function PlanScreen() {
  const [selectedDay, setSelectedDay] = useState("mon");
  const meals = MEALS_BY_DAY[selectedDay] || [];
  const totalCalories = meals.reduce((sum, m) => sum + m.calories, 0);

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="pt-4 pb-2 px-4 flex-row items-center justify-between">
        <Text className="text-text text-lg font-bold flex-1 text-center">
          Plan ishrane
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
                  {day.short}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-4 pt-5 pb-3">
          <Text className="text-text text-sm">
            Ukupno:{" "}
            <Text className="text-primary font-bold">{totalCalories} kcal</Text>
          </Text>
        </View>

        {MEAL_TYPES.map((mealType) => {
          const mealOfType = meals.filter((m) => m.type === mealType);
          if (mealOfType.length === 0) return null;

          return (
            <View key={mealType}>
              <View className="px-4 pt-5 pb-3">
                <Text className="text-text text-2xl font-bold">{mealType}</Text>
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
            Dodaj obrok
          </Text>
        </Pressable>

        <View className="h-4" />
      </ScrollView>
    </SafeAreaView>
  );
}