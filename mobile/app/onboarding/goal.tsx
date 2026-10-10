import { useState } from "react";
import { router } from "expo-router";
import { useOnboarding } from "../../contexts/OnboardingContext";
import { OnboardingLayout } from "../../components/OnboardingLayout";
import { OptionButton } from "../../components/OptionButton";
import i18n from "../../locales";

const OPTIONS = [
  { id: "lose", key: "lose", icon: "📉" },
  { id: "healthy", key: "healthy", icon: "🥗" },
  { id: "maintain", key: "maintain", icon: "⚖️" },
  { id: "gain", key: "gain", icon: "💪" },
];

export default function GoalScreen() {
  const { data, updateData } = useOnboarding();
  const [selected, setSelected] = useState<string | null>(data.goal);
  const t = (key: string) => i18n.t(key);

  const handleContinue = () => {
    if (!selected) return;
    updateData({ goal: selected });
    router.push("/onboarding/gender");
  };

  return (
    <OnboardingLayout
      step={1}
      totalSteps={10}
      title={t("onboarding.goal.title")}
      subtitle={t("onboarding.goal.subtitle")}
      onContinue={handleContinue}
      continueDisabled={!selected}
    >
      {OPTIONS.map((option) => (
        <OptionButton
          key={option.id}
          icon={option.icon}
          label={t(`onboarding.goal.${option.key}`)}
          description={t(`onboarding.goal.${option.key}Desc`)}
          selected={selected === option.id}
          onPress={() => setSelected(option.id)}
        />
      ))}
    </OnboardingLayout>
  );
}