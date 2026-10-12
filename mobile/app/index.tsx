import { View, Text, Pressable, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import i18n from "../locales";
import instructorImage from "../assets/images/branding/instructor-03.webp";

export default function Welcome() {
  const t = (key: string) => i18n.t(key);

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1">
        <View className="h-[55%] overflow-hidden relative">
         <Image
  source={require("../assets/images/branding/instructor-03.webp")}
  style={{ width: "100%", height: "100%" }}
  resizeMode="cover"
/>
        </View>

        <View className="flex-1 px-6 pt-8 pb-6 justify-between">
          <View>
            <Text className="text-text text-3xl font-bold mb-3">
              {t("welcome.greeting")}
            </Text>
            <Text className="text-textSecondary text-base leading-6">
              {t("welcome.subtitle")}
            </Text>
          </View>

          <View className="gap-4">
            <Pressable
              onPress={() => router.push("/onboarding/language")}
              className="bg-primary py-4 rounded-2xl items-center"
            >
              <Text className="text-background text-base font-bold">
                {t("welcome.start")}
              </Text>
            </Pressable>

            <Pressable
              onPress={() => router.push("/auth/login")}
              className="py-2 items-center"
            >
              <Text className="text-textSecondary text-sm">
                {t("welcome.hasAccount")}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}