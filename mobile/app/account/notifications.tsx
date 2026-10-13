import { View, Text, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import i18n from "../../locales";

export default function NotificationsScreen() {
  const t = (key: string) => i18n.t(key);

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
          {t("account.notificationsTitle")}
        </Text>
      </View>

      <View className="flex-1 items-center justify-center px-6">
        <Text className="text-6xl mb-4">🔔</Text>
        <Text className="text-text text-xl font-bold mb-2 text-center">
          {t("placeholder.comingSoon")}
        </Text>
        <Text className="text-textSecondary text-sm text-center">
          {t("placeholder.notificationsDesc")}
        </Text>
      </View>
    </SafeAreaView>
  );
}