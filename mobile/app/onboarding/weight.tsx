import { useState } from "react";
import { TextInput, View, Text } from "react-native";
import { router } from "expo-router";
import { useOnboarding } from "../../contexts/OnboardingContext";
import { OnboardingLayout } from "../../components/OnboardingLayout";
import i18n from "../../locales";

export default function WeightScreen() {
  const { data, updateData } = useOnboarding();
  const [weight, setWeight] = useState(data.weight?.toString() ?? "");
  const t = (key: string) => i18n.t(key);

  const value = parseInt(weight);
  const isValid = !isNaN(value) && value >= 30 && value <= 300;

  const handleContinue = () => {
    if (!isValid) return;
    updateData({ weight: value });
    router.push("/onboarding/target-weight");
  };

  return (
    <OnboardingLayout
      step={5}
      totalSteps={10}
      title={t("onboarding.weight.title")}
      subtitle={t("onboarding.weight.subtitle")}
      onContinue={handleContinue}
      continueDisabled={!isValid}
    >
      <View className="bg-surface rounded-2xl p-4 border border-border flex-row items-center justify-center gap-2">
        <TextInput
          value={weight}
          onChangeText={setWeight}
          placeholder="70"
          placeholderTextColor="#666"
          keyboardType="number-pad"
          maxLength={3}
          className="text-text text-3xl font-bold text-center min-w-[80px]"
        />
        <Text className="text-textSecondary text-lg">kg</Text>
      </View>
    </OnboardingLayout>
  );
}