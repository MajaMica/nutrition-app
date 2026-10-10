import { useState } from "react";
import { router } from "expo-router";
import { useOnboarding } from "../../contexts/OnboardingContext";
import { OnboardingLayout } from "../../components/OnboardingLayout";
import { OptionButton } from "../../components/OptionButton";
import i18n from "../../locales";

const OPTIONS = [
  { id: "sedentary", key: "sedentary", icon: "🪑" },
  { id: "light", key: "light", icon: "🚶" },
  { id: "active", key: "active", icon: "🏃" },
  { id: "very_active", key: "veryActive", icon: "🔥" },
];

export default function ActivityScreen() {
  const { data, updateData } = useOnboarding();
  const [selected, setSelected] = useState<string | null>(data.activityLevel);
  const t = (key: string) => i18n.t(key);

  const handleContinue = () => {
    if (!selected) return;
    updateData({ activityLevel: selected });
    router.push("/onboarding/diet-type");
  };

  return (
    <OnboardingLayout
      step={7}
      totalSteps={10}
      title={t("onboarding.activity.title")}
      subtitle={t("onboarding.activity.subtitle")}
      onContinue={handleContinue}
      continueDisabled={!selected}
    >
      {OPTIONS.map((option) => (
        <OptionButton
          key={option.id}
          icon={option.icon}
          label={t(`onboarding.activity.${option.key}`)}
          description={t(`onboarding.activity.${option.key}Desc`)}
          selected={selected === option.id}
          onPress={() => setSelected(option.id)}
        />
      ))}
    </OnboardingLayout>
  );
}