import { View, Text, ScrollView, Image, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useLanguage } from "../../contexts/LanguageContext";
import i18n from "../../locales";

type Ebook = {
  id: string;
  title: string;
  description: string;
  cover: string;
  price: number;
  pages: number;
};

const EBOOKS: Ebook[] = [
  {
    id: "1",
    title: "50 recepata za zdravo mršavljenje",
    description: "Kolekcija proverenih recepata sa niskim kalorijama.",
    cover: "https://placehold.co/320x426/1A1A1A/B3FF47",
    price: 1490,
    pages: 82,
  },
  {
    id: "2",
    title: "Vodič kroz makronutrijente",
    description: "Nauči da balansiraš proteine, UH i masti.",
    cover: "https://placehold.co/320x426/1A1A1A/B3FF47",
    price: 990,
    pages: 64,
  },
  {
    id: "3",
    title: "Tradicionalna srpska kuhinja - fit verzija",
    description: "Sarma, pasulj, gibanica - sa manje kalorija.",
    cover: "https://placehold.co/320x426/1A1A1A/B3FF47",
    price: 1790,
    pages: 120,
  },
];

export default function EbooksScreen() {
  const { language } = useLanguage();
  const t = (key: string) => i18n.t(key);

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <View className="pt-2 pb-3 px-4 flex-row items-center justify-between">
        <Pressable
          onPress={() => router.back()}
          className="w-12 h-12 items-center justify-center"
        >
          <Text className="text-text text-2xl">←</Text>
        </Pressable>
        <Text className="text-text text-lg font-bold flex-1 text-center">
          {t("ebooks.title")}
        </Text>
        <View className="w-12 h-12" />
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-4 pt-2 pb-5">
          <Text className="text-text text-3xl font-bold mb-2">
            {t("ebooks.heading")}
          </Text>
          <Text className="text-textSecondary text-base">
            {t("ebooks.subtitle")}
          </Text>
        </View>

        {EBOOKS.map((ebook) => (
          <Pressable
            key={ebook.id}
            onPress={() => router.push(`/ebooks/${ebook.id}`)}
            className="mx-4 mb-4 bg-surface rounded-2xl border border-border p-3 flex-row gap-4"
          >
            <Image
              source={{ uri: ebook.cover }}
              className="w-24 h-32 rounded-xl"
              resizeMode="cover"
            />
            <View className="flex-1 py-1">
              <Text
                className="text-text text-base font-bold mb-1"
                numberOfLines={2}
              >
                {ebook.title}
              </Text>
              <Text
                className="text-textSecondary text-sm mb-3 flex-1"
                numberOfLines={2}
              >
                {ebook.description}
              </Text>
              <View className="flex-row items-center justify-between">
                <Text className="text-primary text-base font-bold">
                  {ebook.price} RSD
                </Text>
                <Text className="text-textSecondary text-xs">
                  {ebook.pages} {t("ebooks.pages")}
                </Text>
              </View>
            </View>
          </Pressable>
        ))}

        <View className="h-6" />
      </ScrollView>
    </SafeAreaView>
  );
}