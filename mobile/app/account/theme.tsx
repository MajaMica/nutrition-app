import { View, Text, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useTheme } from "../../contexts/ThemeContext";
import i18n from "../../locales";

export default function ThemeScreen() {
  const { theme, setTheme } = useTheme();
  const t = (key: string) => i18n.t(key);

  const OPTIONS: { value: "dark" | "light"; label: string; icon: string }[] = [
    { value: "dark", label: t("theme.dark"), icon: "🌙" },
    { value: "light", label: t("theme.light"), icon: "☀️" },
  ];

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
          {t("theme.title")}
        </Text>
      </View>

      <View className="px-4 pt-4">
        {OPTIONS.map((opt) => (
          <Pressable
            key={opt.value}
            onPress={() => setTheme(opt.value)}
            className="px-4 py-4 flex-row items-center justify-between bg-surface rounded-2xl border border-border mb-3"
          >
            <View className="flex-row items-center gap-3">
              <Text className="text-2xl">{opt.icon}</Text>
              <Text className="text-text text-base">{opt.label}</Text>
            </View>
            {theme === opt.value && (
              <Text className="text-primary text-xl">✓</Text>
            )}
          </Pressable>
        ))}
      </View>
    </SafeAreaView>
  );
}