import { useState, useEffect } from "react";
import { View, Text, ScrollView, Image, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useLanguage } from "../../contexts/LanguageContext";
import { supabase } from "../../lib/supabase";
import i18n from "../../locales";

type SuggestedRecipe = {
  id: string;
  title: string;
  calories: number;
  image: string;
};

const SUGGESTED: SuggestedRecipe[] = [
  {
    id: "1",
    title: "Mediteranska salata",
    calories: 350,
    image: "https://placehold.co/320x426/1A1A1A/B3FF47",
  },
  {
    id: "2",
    title: "Piletina sa povrćem",
    calories: 480,
    image: "https://placehold.co/320x426/1A1A1A/B3FF47",
  },
  {
    id: "3",
    title: "Smoothie bowl",
    calories: 280,
    image: "https://placehold.co/320x426/1A1A1A/B3FF47",
  },
];

export default function HomeScreen() {
  const [userName, setUserName] = useState("");
  const dailyGoal = 1800;
  const consumed = 1240;
  const percentage = Math.round((consumed / dailyGoal) * 100);

  const { language } = useLanguage();
  const t = (key: string) => i18n.t(key);

  useEffect(() => {
    async function loadUser() {
      const { data } = await supabase.auth.getUser();
      if (data.user) {
        const name = (data.user.user_metadata?.name as string) || "Korisnik";
        setUserName(name.split(" ")[0]);
      }
    }
    loadUser();
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-4 pt-4 pb-3">
          <Text className="text-textSecondary text-sm mb-1">
            {t("home.greeting")}
          </Text>
          <Text className="text-text text-3xl font-bold">
            {userName || "..."} 👋
          </Text>
        </View>

        <View className="mx-4 mt-2 bg-surface rounded-3xl p-6 border border-border">
          <View className="flex-row items-center justify-between mb-6">
            <View>
              <Text className="text-textSecondary text-sm mb-1">
                {t("home.dailyGoal")}
              </Text>
              <Text className="text-text text-3xl font-bold">
                {consumed}{" "}
                <Text className="text-textSecondary text-lg font-normal">
                  / {dailyGoal} kcal
                </Text>
              </Text>
            </View>
            <View className="w-16 h-16 rounded-full border-4 border-primary items-center justify-center">
              <Text className="text-primary text-base font-bold">
                {percentage}%
              </Text>
            </View>
          </View>

          <View className="h-2 bg-background rounded-full overflow-hidden">
            <View
              className="h-2 bg-primary rounded-full"
              style={{ width: `${percentage}%` }}
            />
          </View>
        </View>

        <View className="px-4 pt-6 pb-3 flex-row items-center justify-between">
          <Text className="text-text text-xl font-bold">
            {t("home.nextMeal")}
          </Text>
          <Pressable onPress={() => router.push("/plan")}>
            <Text className="text-primary text-sm font-medium">
              {t("home.seeAll")}
            </Text>
          </Pressable>
        </View>

        <Pressable
          onPress={() => router.push("/recipe/1")}
          className="mx-4 bg-surface rounded-2xl p-3 flex-row items-center gap-3 border border-border"
        >
          <Image
            source={{ uri: "https://placehold.co/112x112/1A1A1A/B3FF47" }}
            className="w-14 h-14 rounded-xl"
          />
          <View className="flex-1">
            <Text className="text-text text-base font-medium mb-0.5">
              Tost sa avokadom
            </Text>
            <Text className="text-textSecondary text-sm">340 kcal</Text>
          </View>
          <Text className="text-textSecondary text-lg">›</Text>
        </Pressable>

        <View className="px-4 pt-6 pb-3">
          <Text className="text-text text-xl font-bold">
            {t("home.quickActions")}
          </Text>
        </View>

        <View className="px-4 flex-row gap-3">
          <Pressable
            onPress={() => router.push("/recipes")}
            className="flex-1 bg-surface rounded-2xl p-4 border border-border items-center"
          >
            <Text className="text-3xl mb-2">🍳</Text>
            <Text className="text-text text-sm font-medium text-center">
              {t("home.makeRecipe")}
            </Text>
          </Pressable>

          <Pressable
            onPress={() => router.push("/foods")}
            className="flex-1 bg-surface rounded-2xl p-4 border border-border items-center"
          >
            <Text className="text-3xl mb-2">🥕</Text>
            <Text className="text-text text-sm font-medium text-center">
              {t("home.searchFoods")}
            </Text>
          </Pressable>
        </View>

        <View className="px-4 pt-6 pb-3">
          <Text className="text-text text-xl font-bold">{t("home.forYou")}</Text>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          snapToInterval={170 + 12}
          decelerationRate="fast"
          contentContainerStyle={{
            paddingHorizontal: 16,
            gap: 12,
            paddingRight: 32,
          }}
        >
          {SUGGESTED.map((recipe) => (
            <Pressable
              key={recipe.id}
              onPress={() => router.push(`/recipe/${recipe.id}`)}
              style={{ width: 170 }}
              className="gap-3"
            >
              <Image
                source={{ uri: recipe.image }}
                style={{ width: "100%", height: 213, borderRadius: 16 }}
                resizeMode="cover"
              />
              <View>
                <Text
                  className="text-text text-base font-medium mb-1"
                  numberOfLines={2}
                >
                  {recipe.title}
                </Text>
                <Text className="text-textSecondary text-sm">
                  {recipe.calories} kcal
                </Text>
              </View>
            </Pressable>
          ))}
        </ScrollView>

        <View className="px-4 pt-6">
          <Pressable
            onPress={() => router.push("/ebooks")}
            className="bg-primary rounded-2xl p-5 flex-row items-center gap-4"
          >
            <Text className="text-4xl">📖</Text>
            <View className="flex-1">
              <Text className="text-background text-base font-bold mb-1">
                {t("home.newEbook")}
              </Text>
              <Text className="text-background/80 text-sm">
                {t("home.newEbookDesc")}
              </Text>
            </View>
            <Text className="text-background text-2xl">›</Text>
          </Pressable>
        </View>

        <View className="h-8" />
      </ScrollView>
    </SafeAreaView>
  );
}