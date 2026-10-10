import { View, Text, ScrollView, Image, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";

const EBOOK = {
  title: "50 recepata za zdravo mršavljenje",
  description:
    "Kolekcija od 50 pažljivo odabranih recepata koji su niskokalorični ali ukusni. Svaki recept sadrži detaljne nutritivne vrednosti, listu sastojaka i korake pripreme. Idealno za početnike koji žele da smršaju bez gladi.",
  cover: "https://placehold.co/640x853/1A1A1A/B3FF47",
  price: 1490,
  pages: 82,
  chapters: [
    "Doručak - 15 recepata",
    "Ručak - 15 recepata",
    "Večera - 12 recepata",
    "Užine - 8 recepata",
    "Bonus: Nedeljni plan ishrane",
  ],
};

export default function EbookDetailScreen() {
  const { id } = useLocalSearchParams();

  const handlePurchase = () => {
    console.log("Purchase ebook:", id);
  };

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
          Detalji e-knjige
        </Text>
        <View className="w-12 h-12" />
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="items-center pt-4 pb-6">
          <Image
            source={{ uri: EBOOK.cover }}
            className="w-48 h-64 rounded-2xl mb-5"
            resizeMode="cover"
          />
        </View>

        <View className="px-4 pb-5">
          <Text className="text-text text-2xl font-bold mb-3">
            {EBOOK.title}
          </Text>
          <View className="flex-row items-center gap-4 mb-4">
            <View className="bg-surface rounded-full px-3 py-1 border border-border">
              <Text className="text-textSecondary text-xs">
                {EBOOK.pages} strana
              </Text>
            </View>
            <View className="bg-surface rounded-full px-3 py-1 border border-border">
              <Text className="text-textSecondary text-xs">PDF format</Text>
            </View>
          </View>
          <Text className="text-textSecondary text-base leading-6">
            {EBOOK.description}
          </Text>
        </View>

        <View className="px-4 pb-5">
          <Text className="text-text text-lg font-bold mb-3">
            Šta ćeš dobiti
          </Text>
          <View className="bg-surface rounded-2xl border border-border p-4">
            {EBOOK.chapters.map((chapter, index) => (
              <View
                key={index}
                className="flex-row items-center gap-3 py-2"
              >
                <View className="w-6 h-6 rounded-full bg-primary items-center justify-center">
                  <Text className="text-background text-xs font-bold">✓</Text>
                </View>
                <Text className="text-text text-sm flex-1">{chapter}</Text>
              </View>
            ))}
          </View>
        </View>

        <View className="h-4" />
      </ScrollView>

      <View className="px-4 py-3 border-t border-border flex-row items-center gap-4">
        <View className="flex-1">
          <Text className="text-textSecondary text-xs mb-1">Cena</Text>
          <Text className="text-primary text-2xl font-bold">
            {EBOOK.price} RSD
          </Text>
        </View>
        <Pressable
          onPress={handlePurchase}
          className="bg-primary px-8 py-4 rounded-2xl"
        >
          <Text className="text-background text-base font-bold">
            Kupi e-knjigu
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}