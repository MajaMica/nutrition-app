import { ReactNode } from "react";
import { View, Text, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import i18n from "../locales";

type Props = {
  step: number;
  totalSteps: number;
  title: string;
  subtitle?: string;
  children: ReactNode;
  onContinue: () => void;
  continueDisabled?: boolean;
};

export function OnboardingLayout({
  step,
  totalSteps,
  title,
  subtitle,
  children,
  onContinue,
  continueDisabled = false,
}: Props) {
  const progress = (step / totalSteps) * 100;
  const t = (key: string) => i18n.t(key);

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="px-6 pt-6 pb-6">
        <View className="flex-row justify-between items-center mb-3">
          <Text className="text-primary text-xs font-medium tracking-wider">
            {t("onboarding.stepOf")
              .replace("{step}", String(step))
              .replace("{total}", String(totalSteps))}
          </Text>
          <Pressable onPress={() => router.back()}>
            <Text className="text-textSecondary text-sm">{t("common.back")}</Text>
          </Pressable>
        </View>
        <View className="h-1 bg-surface rounded-full overflow-hidden">
          <View
            className="h-1 bg-primary rounded-full"
            style={{ width: `${progress}%` }}
          />
        </View>
      </View>

      <View className="px-6 mb-8">
        <Text className="text-text text-3xl font-bold mb-3">{title}</Text>
        {subtitle && (
          <Text className="text-textSecondary text-base">{subtitle}</Text>
        )}
      </View>

      <View className="px-6 gap-3 flex-1">{children}</View>

      <View className="px-6 pb-8 pt-4">
        <Pressable
          onPress={onContinue}
          disabled={continueDisabled}
          className={`py-4 rounded-2xl items-center ${
            continueDisabled ? "bg-surface" : "bg-primary"
          }`}
        >
          <Text
            className={`text-base font-bold ${
              continueDisabled ? "text-textSecondary" : "text-background"
            }`}
          >
            {t("common.continue")}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}