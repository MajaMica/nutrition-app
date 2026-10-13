import { useState, useEffect } from "react";
import { View, Text, Pressable, ScrollView, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useLanguage } from "../../contexts/LanguageContext";
import { apiGetAuth, apiPut } from "../../lib/api";
import i18n from "../../locales";

type Profile = {
  dietType: string | null;
  allergies: string[];
  dislikedFoods: string[];
};

const DIET_TYPES = [
  { id: "all", labelKey: "onboarding.dietType.all", icon: "🍽️" },
  { id: "vegetarian", labelKey: "onboarding.dietType.vegetarian", icon: "🥗" },
  { id: "vegan", labelKey: "onboarding.dietType.vegan", icon: "🌱" },
  { id: "gluten_free", labelKey: "onboarding.dietType.glutenFree", icon: "🌾" },
  { id: "lactose_free", labelKey: "onboarding.dietType.lactoseFree", icon: "🥛" },
  { id: "no_sugar", labelKey: "onboarding.dietType.noSugar", icon: "🚫🍬" },
  { id: "no_pork", labelKey: "onboarding.dietType.noPork", icon: "🐖" },
  { id: "fasting", labelKey: "onboarding.dietType.fasting", icon: "✝️" },
];

const ALLERGY_IDS = [
  "gluten", "lactose", "eggs", "nuts", "peanuts",
  "fish", "shellfish", "soy", "sesame", "celery",
];

const ALLERGY_KEYS: Record<string, string> = {
  gluten: "allergies.gluten",
  lactose: "allergies.lactose",
  eggs: "allergies.eggs",
  nuts: "allergies.nuts",
  peanuts: "allergies.peanuts",
  fish: "allergies.fish",
  shellfish: "allergies.shellfish",
  soy: "allergies.soy",
  sesame: "allergies.sesame",
  celery: "allergies.celery",
};

const DISLIKED_IDS = [
  "liver", "fish", "mushrooms", "eggplant", "onion",
  "garlic", "olives", "cheese", "seafood", "broccoli",
];

const DISLIKED_KEYS: Record<string, string> = {
  liver: "disliked.liver",
  fish: "disliked.fish",
  mushrooms: "disliked.mushrooms",
  eggplant: "disliked.eggplant",
  onion: "disliked.onion",
  garlic: "disliked.garlic",
  olives: "disliked.olives",
  cheese: "disliked.cheese",
  seafood: "disliked.seafood",
  broccoli: "disliked.broccoli",
};

export default function PreferencesScreen() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const [dietType, setDietType] = useState<string | null>(null);
  const [allergies, setAllergies] = useState<string[]>([]);
  const [dislikedFoods, setDislikedFoods] = useState<string[]>([]);

  const { language } = useLanguage();
  const t = (key: string) => i18n.t(key);

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    try {
      const data = await apiGetAuth<Profile>("/profile");
      setDietType(data.dietType);
      setAllergies(data.allergies || []);
      setDislikedFoods(data.dislikedFoods || []);
    } catch (e: any) {
      setMessage({ type: "error", text: e.message });
    } finally {
      setLoading(false);
    }
  }

  function toggleAllergy(id: string) {
    setAllergies((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  function toggleDisliked(id: string) {
    setDislikedFoods((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  async function handleSave() {
    setSaving(true);
    setMessage(null);
    try {
      await apiPut("/profile", {
        dietType,
        allergies,
        dislikedFoods,
      });
      setMessage({ type: "success", text: t("account.preferencesSaved") });
      setTimeout(() => setMessage(null), 3000);
    } catch (e: any) {
      setMessage({ type: "error", text: e.message });
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color="#B3FF47" size="large" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <View className="px-4 pt-2 pb-3 flex-row items-center">
        <Pressable
          onPress={() => router.back()}
          className="w-12 h-12 items-center justify-center"
        >
          <Text className="text-text text-2xl">←</Text>
        </Pressable>
        <Text className="text-text text-lg font-bold flex-1 text-center mr-12">
          {t("account.preferencesTitle")}
        </Text>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-4 py-4">
          <Text className="text-text text-lg font-bold mb-3">
            {t("account.dietType")}
          </Text>
          <View className="gap-2 mb-6">
            {DIET_TYPES.map((d) => {
              const isActive = dietType === d.id;
              return (
                <Pressable
                  key={d.id}
                  onPress={() => setDietType(d.id)}
                  className={`p-4 rounded-2xl border flex-row items-center gap-3 ${
                    isActive ? "bg-surface border-primary" : "bg-surface border-border"
                  }`}
                >
                  <Text className="text-2xl">{d.icon}</Text>
                  <Text className="text-text text-base flex-1">{t(d.labelKey)}</Text>
                  {isActive && (
                    <View className="w-5 h-5 rounded-full bg-primary items-center justify-center">
                      <Text className="text-background text-xs font-bold">✓</Text>
                    </View>
                  )}
                </Pressable>
              );
            })}
          </View>

          <Text className="text-text text-lg font-bold mb-3">
            {t("account.allergies")}
          </Text>
          <View className="flex-row flex-wrap gap-2 mb-6">
            {ALLERGY_IDS.map((id) => {
              const isActive = allergies.includes(id);
              return (
                <Pressable
                  key={id}
                  onPress={() => toggleAllergy(id)}
                  className={`px-4 py-3 rounded-full border ${
                    isActive ? "bg-primary border-primary" : "bg-surface border-border"
                  }`}
                >
                  <Text
                    className={`text-sm font-medium ${
                      isActive ? "text-background" : "text-text"
                    }`}
                  >
                    {t(ALLERGY_KEYS[id])}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <Text className="text-text text-lg font-bold mb-3">
            {t("account.dislikedFoods")}
          </Text>
          <View className="flex-row flex-wrap gap-2 mb-6">
            {DISLIKED_IDS.map((id) => {
              const isActive = dislikedFoods.includes(id);
              return (
                <Pressable
                  key={id}
                  onPress={() => toggleDisliked(id)}
                  className={`px-4 py-3 rounded-full border ${
                    isActive ? "bg-primary border-primary" : "bg-surface border-border"
                  }`}
                >
                  <Text
                    className={`text-sm font-medium ${
                      isActive ? "text-background" : "text-text"
                    }`}
                  >
                    {t(DISLIKED_KEYS[id])}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {message && (
            <View
              className={`p-4 rounded-2xl ${
                message.type === "success"
                  ? "bg-primary/20 border border-primary"
                  : "bg-red-500/20 border border-red-500"
              }`}
            >
              <Text
                className={`text-sm ${
                  message.type === "success" ? "text-primary" : "text-red-400"
                }`}
              >
                {message.text}
              </Text>
            </View>
          )}
        </View>

        <View className="px-4 pb-8">
          <Pressable
            onPress={handleSave}
            disabled={saving}
            className={`py-4 rounded-2xl items-center ${
              saving ? "bg-surface" : "bg-primary"
            }`}
          >
            {saving ? (
              <ActivityIndicator color="#0D0D0D" />
            ) : (
              <Text className="text-background text-base font-bold">
                {t("account.save")}
              </Text>
            )}
          </Pressable>
        </View>

        <View className="h-6" />
      </ScrollView>
    </SafeAreaView>
  );
}