import { useState } from "react";
import { TextInput, View, Text } from "react-native";
import { router } from "expo-router";
import { useOnboarding } from "../../contexts/OnboardingContext";
import { OnboardingLayout } from "../../components/OnboardingLayout";
import i18n from "../../locales";

export default function HeightScreen() {
  const { data, updateData } = useOnboarding();
  const [height, setHeight] = useState(data.height?.toString() ?? "");
  const t = (key: string) => i18n.t(key);

  const value = parseInt(height);
  const isValid = !isNaN(value) && value >= 100 && value <= 250;

  const handleContinue = () => {
    if (!isValid) return;
    updateData({ height: value });
    router.push("/onboarding/weight");
  };

  return (
    <OnboardingLayout
      step={4}
      totalSteps={10}
      title={t("onboarding.height.title")}
      subtitle={t("onboarding.height.subtitle")}
      onContinue={handleContinue}
      continueDisabled={!isValid}
    >
      <View className="bg-surface rounded-2xl p-4 border border-border flex-row items-center justify-center gap-2">
        <TextInput
          value={height}
          onChangeText={setHeight}
          placeholder="175"
          placeholderTextColor="#666"
          keyboardType="number-pad"
          maxLength={3}
          className="text-text text-3xl font-bold text-center min-w-[80px]"
        />
        <Text className="text-textSecondary text-lg">cm</Text>
      </View>
    </OnboardingLayout>
  );
}