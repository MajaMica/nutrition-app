import { View, Text, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useLanguage } from "../../contexts/LanguageContext";

const LANGUAGES = [
  { id: "sr", label: "Srpski", sublabel: "Serbian", flag: "🇷🇸" },
  { id: "en", label: "English", sublabel: "Engleski", flag: "🇬🇧" },
] as const;

export default function LanguageScreen() {
  const { language, setLanguage } = useLanguage();

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <View className="px-4 pt-2 pb-3 flex-row items-center">
        <Pressable
          onPress={() => router.back()}
          className="w-12 h-12 items-center justify-center"
        >
          <Text className="text-text text-2xl">←</Text>
        </Pressable>
        <Text className="text-text text-lg font-bold flex-1 text-center mr-12">
          Jezik / Language
        </Text>
      </View>

      <View className="px-4 py-6 gap-3">
        {LANGUAGES.map((lang) => {
          const isActive = language === lang.id;
          return (
            <Pressable
              key={lang.id}
              onPress={() => setLanguage(lang.id)}
              className={`flex-row items-center p-5 rounded-2xl border ${
                isActive ? "bg-surface border-primary" : "bg-surface border-border"
              }`}
            >
              <Text className="text-3xl mr-4">{lang.flag}</Text>
              <View className="flex-1">
                <Text className="text-text text-lg font-semibold">{lang.label}</Text>
                <Text className="text-textSecondary text-sm">{lang.sublabel}</Text>
              </View>
              {isActive && (
                <View className="w-7 h-7 rounded-full bg-primary items-center justify-center">
                  <Text className="text-background text-sm font-bold">✓</Text>
                </View>
              )}
            </Pressable>
          );
        })}
      </View>
    </SafeAreaView>
  );
}