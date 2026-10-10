import { useState } from "react";
import { TextInput, View } from "react-native";
import { router } from "expo-router";
import { useOnboarding } from "../../contexts/OnboardingContext";
import { OnboardingLayout } from "../../components/OnboardingLayout";
import i18n from "../../locales";

export default function BirthYearScreen() {
  const { data, updateData } = useOnboarding();
  const [year, setYear] = useState(data.birthYear?.toString() ?? "");
  const t = (key: string) => i18n.t(key);

  const isValid =
    year.length === 4 && parseInt(year) > 1920 && parseInt(year) < 2010;

  const handleContinue = () => {
    if (!isValid) return;
    updateData({ birthYear: parseInt(year) });
    router.push("/onboarding/height");
  };

  return (
    <OnboardingLayout
      step={3}
      totalSteps={10}
      title={t("onboarding.birthYear.title")}
      subtitle={t("onboarding.birthYear.subtitle")}
      onContinue={handleContinue}
      continueDisabled={!isValid}
    >
      <View className="bg-surface rounded-2xl p-4 border border-border">
        <TextInput
          value={year}
          onChangeText={setYear}
          placeholder="1995"
          placeholderTextColor="#666"
          keyboardType="number-pad"
          maxLength={4}
          className="text-text text-2xl font-bold text-center"
        />
      </View>
    </OnboardingLayout>
  );
}