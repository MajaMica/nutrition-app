import { useState } from "react";
import { View, Text, Pressable } from "react-native";
import { router } from "expo-router";
import { useOnboarding } from "../../contexts/OnboardingContext";
import { OnboardingLayout } from "../../components/OnboardingLayout";
import i18n from "../../locales";

const ALLERGIES = [
  { id: "gluten", label: "Gluten" },
  { id: "lactose", label: "Laktoza / Lactose" },
  { id: "eggs", label: "Jaja / Eggs" },
  { id: "nuts", label: "Orašasti / Nuts" },
  { id: "peanuts", label: "Kikiriki / Peanuts" },
  { id: "fish", label: "Riba / Fish" },
  { id: "shellfish", label: "Školjke / Shellfish" },
  { id: "soy", label: "Soja / Soy" },
  { id: "sesame", label: "Susam / Sesame" },
  { id: "celery", label: "Celer / Celery" },
];

export default function AllergiesScreen() {
  const { data, updateData } = useOnboarding();
  const [selected, setSelected] = useState<string[]>(data.allergies);
  const t = (key: string) => i18n.t(key);

  const toggle = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleContinue = () => {
    updateData({ allergies: selected });
    router.push("/onboarding/disliked-foods");
  };

  return (
    <OnboardingLayout
      step={9}
      totalSteps={10}
      title={t("onboarding.allergies.title")}
      subtitle={t("onboarding.allergies.subtitle")}
      onContinue={handleContinue}
    >
      <View className="flex-row flex-wrap gap-2">
        {ALLERGIES.map((item) => {
          const isSelected = selected.includes(item.id);
          return (
            <Pressable
              key={item.id}
              onPress={() => toggle(item.id)}
              className={`px-4 py-3 rounded-full border ${
                isSelected
                  ? "bg-primary border-primary"
                  : "bg-surface border-border"
              }`}
            >
              <Text
                className={`text-sm font-medium ${
                  isSelected ? "text-background" : "text-text"
                }`}
              >
                {item.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </OnboardingLayout>
  );
}