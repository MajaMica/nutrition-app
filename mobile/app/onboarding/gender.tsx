import { useState } from "react";
import { router } from "expo-router";
import { useOnboarding } from "../../contexts/OnboardingContext";
import { OnboardingLayout } from "../../components/OnboardingLayout";
import { OptionButton } from "../../components/OptionButton";
import i18n from "../../locales";

const OPTIONS = [
  { id: "male", key: "male", icon: "👨" },
  { id: "female", key: "female", icon: "👩" },
  { id: "other", key: "other", icon: "🙂" },
];

export default function GenderScreen() {
  const { data, updateData } = useOnboarding();
  const [selected, setSelected] = useState<string | null>(data.gender);
  const t = (key: string) => i18n.t(key);

  const handleContinue = () => {
    if (!selected) return;
    updateData({ gender: selected });
    router.push("/onboarding/birth-year");
  };

  return (
    <OnboardingLayout
      step={2}
      totalSteps={10}
      title={t("onboarding.gender.title")}
      subtitle={t("onboarding.gender.subtitle")}
      onContinue={handleContinue}
      continueDisabled={!selected}
    >
      {OPTIONS.map((option) => (
        <OptionButton
          key={option.id}
          icon={option.icon}
          label={t(`onboarding.gender.${option.key}`)}
          selected={selected === option.id}
          onPress={() => setSelected(option.id)}
        />
      ))}
    </OnboardingLayout>
  );
}