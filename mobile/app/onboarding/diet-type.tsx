import { useState } from "react";
import { router } from "expo-router";
import { useOnboarding } from "../../contexts/OnboardingContext";
import { OnboardingLayout } from "../../components/OnboardingLayout";
import { OptionButton } from "../../components/OptionButton";
import i18n from "../../locales";

const OPTIONS = [
  { id: "all", key: "all", icon: "🍽️" },
  { id: "vegetarian", key: "vegetarian", icon: "🥗" },
  { id: "vegan", key: "vegan", icon: "🌱" },
  { id: "gluten_free", key: "glutenFree", icon: "🌾" },
  { id: "lactose_free", key: "lactoseFree", icon: "🥛" },
  { id: "no_sugar", key: "noSugar", icon: "🚫🍬" },
  { id: "no_pork", key: "noPork", icon: "🐖" },
  { id: "fasting", key: "fasting", icon: "✝️" },
];

export default function DietTypeScreen() {
  const { data, updateData } = useOnboarding();
  const [selected, setSelected] = useState<string | null>(data.dietType);
  const t = (key: string) => i18n.t(key);

  const handleContinue = () => {
    if (!selected) return;
    updateData({ dietType: selected });
    router.push("/onboarding/allergies");
  };

  return (
    <OnboardingLayout
      step={8}
      totalSteps={10}
      title={t("onboarding.dietType.title")}
      subtitle={t("onboarding.dietType.subtitle")}
      onContinue={handleContinue}
      continueDisabled={!selected}
    >
      {OPTIONS.map((option) => (
        <OptionButton
          key={option.id}
          icon={option.icon}
          label={t(`onboarding.dietType.${option.key}`)}
          selected={selected === option.id}
          onPress={() => setSelected(option.id)}
        />
      ))}
    </OnboardingLayout>
  );
}