import { router } from "expo-router";
import { View, Text, TextInput, ScrollView, Image, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Recipe = {
  id: string;
  title: string;
  description: string;
  image: string;
};

type Section = {
  id: string;
  title: string;
  recipes: Recipe[];
  large?: boolean;
};

const SECTIONS: Section[] = [
  {
    id: "all",
    title: "Svi recepti",
    large: true,
    recipes: [
      {
        id: "1",
        title: "Mediteranska salata sa kinoom",
        description: "Osvežavajuća salata sa kinom, feta sirom i maslinama.",
        image: "https://placehold.co/480x640/1A1A1A/B3FF47",
      },
      {
        id: "2",
        title: "Burgers sa crnim pasuljem",
        description: "Ukusni vegetarijanski burgeri sa ljutim začinima.",
        image: "https://placehold.co/480x640/1A1A1A/B3FF47",
      },
      {
        id: "3",
        title: "Piletina sa limunom",
        description: "Mekana piletina sa marinadom od limuna i začina.",
        image: "https://placehold.co/480x640/1A1A1A/B3FF47",
      },
    ],
  },
  {
    id: "quick",
    title: "Brzo i lako",
    recipes: [
      {
        id: "4",
        title: "Tost sa avokadom i jajetom",
        description: "Brz i hranljiv doručak.",
        image: "https://placehold.co/320x426/1A1A1A/B3FF47",
      },
      {
        id: "5",
        title: "Grčki jogurt sa voćem",
        description: "Slojeviti desert sa voćem i granolom.",
        image: "https://placehold.co/320x426/1A1A1A/B3FF47",
      },
      {
        id: "6",
        title: "Smoothie bowl",
        description: "Zdrava i ukusna užina.",
        image: "https://placehold.co/320x426/1A1A1A/B3FF47",
      },
    ],
  },
  {
    id: "vegetarian",
    title: "Vegetarijanski",
    recipes: [
      {
        id: "7",
        title: "Wok sa povrćem",
        description: "Šareni wok sa tofujem i povrćem.",
        image: "https://placehold.co/320x426/1A1A1A/B3FF47",
      },
      {
        id: "8",
        title: "Supa od sočiva",
        description: "Bogata i ukusna supa od sočiva.",
        image: "https://placehold.co/320x426/1A1A1A/B3FF47",
      },
      {
        id: "9",
        title: "Rižoto sa pečurkama",
        description: "Kremasti rižoto sa šumskim pečurkama.",
        image: "https://placehold.co/320x426/1A1A1A/B3FF47",
      },
    ],
  },
  {
    id: "family",
    title: "Za celu porodicu",
    recipes: [
      {
        id: "10",
        title: "Losos sa povrćem",
        description: "Pečeni losos sa povrćem iz rerne.",
        image: "https://placehold.co/320x426/1A1A1A/B3FF47",
      },
      {
        id: "11",
        title: "Tortilje sa piletinom",
        description: "Zabavne tortilje sa piletinom.",
        image: "https://placehold.co/320x426/1A1A1A/B3FF47",
      },
      {
        id: "12",
        title: "Testenina sa pestom",
        description: "Prosta testenina sa pesto sosom.",
        image: "https://placehold.co/320x426/1A1A1A/B3FF47",
      },
    ],
  },
];

function RecipeCard({ recipe, large }: { recipe: Recipe; large?: boolean }) {
  const CARD_WIDTH = large ? 260 : 170;
  const IMAGE_HEIGHT = large ? 320 : 213;

  return (
    <Pressable
      style={{ width: CARD_WIDTH }}
      className="gap-3"
      onPress={() => router.push(`/recipe/${recipe.id}`)}
    >
      <Image
        source={{ uri: recipe.image }}
        style={{
          width: "100%",
          height: IMAGE_HEIGHT,
          borderRadius: 16,
        }}
        resizeMode="cover"
      />
      <View>
        <Text className="text-text text-base font-medium mb-1" numberOfLines={2}>
          {recipe.title}
        </Text>
        <Text className="text-textSecondary text-sm" numberOfLines={2}>
          {recipe.description}
        </Text>
      </View>
    </Pressable>
  );
}

export default function RecipesScreen() {
  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="pt-4 pb-2 px-4 flex-row items-center justify-between">
        <Text className="text-text text-lg font-bold flex-1 text-center">
          Recepti
        </Text>
        <Pressable className="w-12 h-12 items-center justify-center">
          <Text className="text-text text-2xl">🔍</Text>
        </Pressable>
      </View>

      <View className="px-4 py-3">
        <View className="h-12 bg-surface rounded-xl flex-row items-center px-4">
          <Text className="text-textSecondary text-lg mr-2">🔍</Text>
          <TextInput
            placeholder="Pretraži recepte"
            placeholderTextColor="#9EADBF"
            className="flex-1 text-text text-base h-full"
          />
        </View>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {SECTIONS.map((section) => (
          <View key={section.id} className="mb-2">
            <View className="px-4 pt-5 pb-3">
              <Text className="text-text text-2xl font-bold">
                {section.title}
              </Text>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              snapToInterval={section.large ? 260 + 12 : 170 + 12}
              decelerationRate="fast"
              contentContainerStyle={{ paddingHorizontal: 16, gap: 12, paddingRight: 32 }}
            >
              {section.recipes.map((recipe) => (
                <RecipeCard
                  key={recipe.id}
                  recipe={recipe}
                  large={section.large}
                />
              ))}
            </ScrollView>
          </View>
        ))}

        <View className="h-6" />
      </ScrollView>
    </SafeAreaView>
  );
}