import { View, Text, ScrollView, Pressable, Linking } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useLanguage } from "../../contexts/LanguageContext";
import i18n from "../../locales";

export default function AboutScreen() {
  const { language } = useLanguage();
  const t = (key: string) => i18n.t(key);
  const APP_VERSION = "1.0.0";

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <View className="px-4 pt-4 pb-3 flex-row items-center">
        <Pressable
          onPress={() => router.back()}
          className="w-12 h-12 items-center justify-center"
        >
          <Text className="text-text text-2xl">←</Text>
        </Pressable>
        <Text className="text-text text-lg font-bold flex-1 text-center mr-12">
          {t("about.title")}
        </Text>
      </View>

      <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
        <View className="items-center py-8">
          <View className="w-24 h-24 rounded-full bg-surface items-center justify-center border border-border mb-4">
            <Text className="text-4xl">👨‍🍳</Text>
          </View>
          <Text className="text-text text-2xl font-bold mb-1">Chef Nemanja</Text>
          <Text className="text-textSecondary text-sm">
            {t("about.subtitle")}
          </Text>
        </View>

        <View className="bg-surface rounded-2xl p-5 border border-border mb-4">
          <Text className="text-text text-base leading-6 mb-3">
            {t("about.bio1")}
          </Text>
          <Text className="text-text text-base leading-6">
            {t("about.bio2")}
          </Text>
        </View>

        <Pressable
          onPress={() => Linking.openURL("https://nemanjachef.com")}
          className="bg-surface rounded-2xl p-5 border border-border mb-4 flex-row items-center justify-between"
        >
          <Text className="text-text text-base">{t("about.website")}</Text>
          <Text className="text-textSecondary text-lg">↗</Text>
        </Pressable>

        <View className="items-center py-6">
          <Text className="text-textSecondary text-xs mb-1">
            {t("about.version")} {APP_VERSION}
          </Text>
          <Text className="text-textSecondary text-xs">
            © 2026 Chef Nemanja
          </Text>
        </View>

        <View className="h-6" />
      </ScrollView>
    </SafeAreaView>
  );
}