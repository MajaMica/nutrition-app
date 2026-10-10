import { useState } from "react";
import { View, Text, Pressable } from "react-native";
import { router } from "expo-router";
import { useOnboarding } from "../../contexts/OnboardingContext";
import { OnboardingLayout } from "../../components/OnboardingLayout";
import i18n from "../../locales";

const FOODS = [
  { id: "liver", label: "Iznutrice / Offal" },
  { id: "fish", label: "Riba / Fish" },
  { id: "mushrooms", label: "Pečurke / Mushrooms" },
  { id: "eggplant", label: "Patlidžan / Eggplant" },
  { id: "onion", label: "Crni luk / Onion" },
  { id: "garlic", label: "Beli luk / Garlic" },
  { id: "olives", label: "Masline / Olives" },
  { id: "cheese", label: "Sirevi / Cheese" },
  { id: "seafood", label: "Morski plodovi / Seafood" },
  { id: "broccoli", label: "Brokoli / Broccoli" },
];

export default function DislikedFoodsScreen() {
  const { data, updateData } = useOnboarding();
  const [selected, setSelected] = useState<string[]>(data.dislikedFoods);
  const t = (key: string) => i18n.t(key);

  const toggle = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleContinue = () => {
    updateData({ dislikedFoods: selected });
    router.push("/onboarding/result");
  };

  return (
    <OnboardingLayout
      step={10}
      totalSteps={10}
      title={t("onboarding.dislikedFoods.title")}
      subtitle={t("onboarding.dislikedFoods.subtitle")}
      onContinue={handleContinue}
    >
      <View className="flex-row flex-wrap gap-2">
        {FOODS.map((item) => {
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