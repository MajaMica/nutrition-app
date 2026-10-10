import { useState } from "react";
import { TextInput, View, Text, Pressable } from "react-native";
import { router } from "expo-router";
import { useOnboarding } from "../../contexts/OnboardingContext";
import { OnboardingLayout } from "../../components/OnboardingLayout";
import i18n from "../../locales";

export default function TargetWeightScreen() {
  const { data, updateData } = useOnboarding();
  const [weight, setWeight] = useState(data.targetWeight?.toString() ?? "");
  const t = (key: string) => i18n.t(key);

  const value = parseInt(weight);
  const isValid = !isNaN(value) && value >= 30 && value <= 300;

  const handleContinue = () => {
    if (!isValid) return;
    updateData({ targetWeight: value });
    router.push("/onboarding/activity");
  };

  const handleSkip = () => {
    router.push("/onboarding/activity");
  };

  return (
    <OnboardingLayout
      step={6}
      totalSteps={10}
      title={t("onboarding.targetWeight.title")}
      subtitle={t("onboarding.targetWeight.subtitle")}
      onContinue={handleContinue}
      continueDisabled={!isValid}
    >
      <View className="bg-surface rounded-2xl p-4 border border-border flex-row items-center justify-center gap-2">
        <TextInput
          value={weight}
          onChangeText={setWeight}
          placeholder="65"
          placeholderTextColor="#666"
          keyboardType="number-pad"
          maxLength={3}
          className="text-text text-3xl font-bold text-center min-w-[80px]"
        />
        <Text className="text-textSecondary text-lg">kg</Text>
      </View>

      <Pressable onPress={handleSkip} className="py-3 items-center">
        <Text className="text-textSecondary text-sm">{t("common.skip")}</Text>
      </Pressable>
    </OnboardingLayout>
  );
}