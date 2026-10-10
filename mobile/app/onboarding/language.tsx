import { View, Text, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useLanguage } from "../../contexts/LanguageContext";
import i18n from "../../locales";

export default function LanguageScreen() {
  const { language, setLanguage } = useLanguage();
  const t = (key: string) => i18n.t(key);

  const handleContinue = () => {
    router.push("/onboarding/goal");
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 px-6 pt-12 pb-8 justify-between">
        <View>
          <Text className="text-primary text-sm font-medium tracking-wider mb-4">
            {language === "sr" ? "DOBRODOŠAO" : "WELCOME"}
          </Text>

          <Text className="text-text text-4xl font-bold mb-4">
            {language === "sr"
              ? "Na kom jeziku želiš da koristiš aplikaciju?"
              : "Which language would you like to use?"}
          </Text>

          <Text className="text-textSecondary text-base leading-6 mb-10">
            {language === "sr"
              ? "Možeš da promeniš jezik kasnije u podešavanjima."
              : "You can change the language later in settings."}
          </Text>

          <View className="gap-3">
            <Pressable
              onPress={() => setLanguage("sr")}
              className={`flex-row items-center p-5 rounded-2xl border ${
                language === "sr"
                  ? "bg-surface border-primary"
                  : "bg-surface border-border"
              }`}
            >
              <Text className="text-3xl mr-4">🇷🇸</Text>
              <View className="flex-1">
                <Text className="text-text text-lg font-semibold">
                  Srpski
                </Text>
                <Text className="text-textSecondary text-sm">
                  Serbian
                </Text>
              </View>
              {language === "sr" && (
                <View className="w-7 h-7 rounded-full bg-primary items-center justify-center">
                  <Text className="text-background text-sm font-bold">✓</Text>
                </View>
              )}
            </Pressable>

            <Pressable
              onPress={() => setLanguage("en")}
              className={`flex-row items-center p-5 rounded-2xl border ${
                language === "en"
                  ? "bg-surface border-primary"
                  : "bg-surface border-border"
              }`}
            >
              <Text className="text-3xl mr-4">🇬🇧</Text>
              <View className="flex-1">
                <Text className="text-text text-lg font-semibold">
                  English
                </Text>
                <Text className="text-textSecondary text-sm">
                  Engleski
                </Text>
              </View>
              {language === "en" && (
                <View className="w-7 h-7 rounded-full bg-primary items-center justify-center">
                  <Text className="text-background text-sm font-bold">✓</Text>
                </View>
              )}
            </Pressable>
          </View>
        </View>

        <Pressable
          onPress={handleContinue}
          className="bg-primary py-4 rounded-2xl items-center"
        >
          <Text className="text-background text-base font-bold">
            {language === "sr" ? "Nastavi" : "Continue"}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}