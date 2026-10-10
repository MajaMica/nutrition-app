import { View, Text, ScrollView, Image, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";

type MenuItem = {
  id: string;
  label: string;
  value?: string;
  onPress?: () => void;
};

type Section = {
  id: string;
  title: string;
  items: MenuItem[];
};

const SECTIONS: Section[] = [
  {
    id: "account",
    title: "Nalog",
    items: [
      { id: "personal", label: "Lični podaci" },
      { id: "preferences", label: "Preferencije" },
      { id: "notifications", label: "Notifikacije" },
      { id: "subscription", label: "Pretplata" },
    ],
  },
  {
    id: "app",
    title: "Podešavanja aplikacije",
    items: [
      { id: "language", label: "Jezik", value: "Srpski" },
      { id: "theme", label: "Tema", value: "Tamna" },
      { id: "about", label: "O aplikaciji" },
    ],
  },
];

export default function ProfileScreen() {
  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <View className="pt-4 pb-3 px-4">
        <Text className="text-text text-lg font-bold text-center">
          Profil
        </Text>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-4 py-4 flex-row items-center gap-4">
          <Image
            source={{ uri: "https://placehold.co/256x256/1A1A1A/B3FF47" }}
            className="w-24 h-24 rounded-full"
          />
          <View className="flex-1">
            <Text className="text-text text-2xl font-bold mb-1">
              Marija Dogandžić
            </Text>
            <Text className="text-textSecondary text-base">
              Premium član
            </Text>
          </View>
        </View>

        {SECTIONS.map((section) => (
          <View key={section.id} className="mb-2">
            <View className="px-4 pt-5 pb-2">
              <Text className="text-text text-lg font-bold">
                {section.title}
              </Text>
            </View>

            {section.items.map((item) => (
              <Pressable
                key={item.id}
                onPress={() => {
                  if (item.id === "about") {
                    router.push("/about");
                  }
                }}
                className="px-4 h-14 flex-row items-center justify-between border-b border-border/40"
              >
                <Text className="text-text text-base">{item.label}</Text>
                <View className="flex-row items-center gap-2">
                  {item.value && (
                    <Text className="text-textSecondary text-sm">
                      {item.value}
                    </Text>
                  )}
                  <Text className="text-textSecondary text-lg">›</Text>
                </View>
              </Pressable>
            ))}
          </View>
        ))}

        <Pressable
          onPress={() => router.replace("/")}
          className="mx-4 mt-6 mb-8 py-4 rounded-2xl border border-border items-center"
        >
          <Text className="text-textSecondary text-base font-medium">
            Odjavi se
          </Text>
        </Pressable>

        <View className="h-6" />
      </ScrollView>
    </SafeAreaView>
  );
}