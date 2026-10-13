import { useState, useEffect } from "react";
import { View, Text, TextInput, Pressable, ScrollView, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useLanguage } from "../../contexts/LanguageContext";
import { apiGetAuth, apiPut } from "../../lib/api";
import i18n from "../../locales";

type Profile = {
  name: string | null;
  birthYear: number | null;
  gender: string | null;
  height: number | null;
  weight: number | null;
  targetWeight: number | null;
  activityLevel: string | null;
};

const GENDERS = [
  { id: "male", labelKey: "account.genderMale" },
  { id: "female", labelKey: "account.genderFemale" },
  { id: "other", labelKey: "account.genderOther" },
];

const ACTIVITIES = [
  { id: "sedentary", labelKey: "onboarding.activity.sedentary" },
  { id: "light", labelKey: "onboarding.activity.light" },
  { id: "active", labelKey: "onboarding.activity.active" },
  { id: "very_active", labelKey: "onboarding.activity.veryActive" },
];

export default function PersonalInfoScreen() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const [name, setName] = useState("");
  const [birthYear, setBirthYear] = useState("");
  const [gender, setGender] = useState<string | null>(null);
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [targetWeight, setTargetWeight] = useState("");
  const [activityLevel, setActivityLevel] = useState<string | null>(null);

  const { language } = useLanguage();
  const t = (key: string) => i18n.t(key);

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    try {
      const data = await apiGetAuth<Profile>("/profile");
      setName(data.name ?? "");
      setBirthYear(data.birthYear?.toString() ?? "");
      setGender(data.gender);
      setHeight(data.height?.toString() ?? "");
      setWeight(data.weight?.toString() ?? "");
      setTargetWeight(data.targetWeight?.toString() ?? "");
      setActivityLevel(data.activityLevel);
    } catch (e: any) {
      setMessage({ type: "error", text: e.message });
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    setSaving(true);
    setMessage(null);
    try {
      await apiPut("/profile", {
        name: name || null,
        birthYear: birthYear ? parseInt(birthYear) : null,
        gender,
        height: height ? parseInt(height) : null,
        weight: weight ? parseFloat(weight) : null,
        targetWeight: targetWeight ? parseFloat(targetWeight) : null,
        activityLevel,
      });
      setMessage({ type: "success", text: t("account.saved") });
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
          {t("account.personalTitle")}
        </Text>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-4 py-4 gap-3">
          <View>
            <Text className="text-textSecondary text-xs mb-2">{t("account.name")}</Text>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder={t("account.namePlaceholder")}
              placeholderTextColor="#666"
              className="bg-surface border border-border rounded-2xl px-4 py-4 text-text text-base"
            />
          </View>

          <View>
            <Text className="text-textSecondary text-xs mb-2">{t("account.birthYear")}</Text>
            <TextInput
              value={birthYear}
              onChangeText={setBirthYear}
              placeholder="1995"
              placeholderTextColor="#666"
              keyboardType="number-pad"
              maxLength={4}
              className="bg-surface border border-border rounded-2xl px-4 py-4 text-text text-base"
            />
          </View>

          <View>
            <Text className="text-textSecondary text-xs mb-2">{t("account.gender")}</Text>
            <View className="flex-row gap-2 flex-wrap">
              {GENDERS.map((g) => {
                const isActive = gender === g.id;
                return (
                  <Pressable
                    key={g.id}
                    onPress={() => setGender(g.id)}
                    className={`px-4 py-3 rounded-full border ${
                      isActive ? "bg-primary border-primary" : "bg-surface border-border"
                    }`}
                  >
                    <Text
                      className={`text-sm font-medium ${
                        isActive ? "text-background" : "text-text"
                      }`}
                    >
                      {t(g.labelKey)}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          <View className="flex-row gap-3">
            <View className="flex-1">
              <Text className="text-textSecondary text-xs mb-2">{t("account.height")}</Text>
              <TextInput
                value={height}
                onChangeText={setHeight}
                placeholder="175"
                placeholderTextColor="#666"
                keyboardType="number-pad"
                maxLength={3}
                className="bg-surface border border-border rounded-2xl px-4 py-4 text-text text-base"
              />
            </View>
            <View className="flex-1">
              <Text className="text-textSecondary text-xs mb-2">{t("account.weight")}</Text>
              <TextInput
                value={weight}
                onChangeText={setWeight}
                placeholder="70"
                placeholderTextColor="#666"
                keyboardType="numeric"
                className="bg-surface border border-border rounded-2xl px-4 py-4 text-text text-base"
              />
            </View>
          </View>

          <View>
            <Text className="text-textSecondary text-xs mb-2">{t("account.targetWeight")}</Text>
            <TextInput
              value={targetWeight}
              onChangeText={setTargetWeight}
              placeholder="65"
              placeholderTextColor="#666"
              keyboardType="numeric"
              className="bg-surface border border-border rounded-2xl px-4 py-4 text-text text-base"
            />
          </View>

          <View>
            <Text className="text-textSecondary text-xs mb-2">{t("account.activityLevel")}</Text>
            <View className="gap-2">
              {ACTIVITIES.map((a) => {
                const isActive = activityLevel === a.id;
                return (
                  <Pressable
                    key={a.id}
                    onPress={() => setActivityLevel(a.id)}
                    className={`p-4 rounded-2xl border flex-row items-center justify-between ${
                      isActive ? "bg-surface border-primary" : "bg-surface border-border"
                    }`}
                  >
                    <Text className="text-text text-sm">{t(a.labelKey)}</Text>
                    {isActive && (
                      <View className="w-5 h-5 rounded-full bg-primary items-center justify-center">
                        <Text className="text-background text-xs font-bold">✓</Text>
                      </View>
                    )}
                  </Pressable>
                );
              })}
            </View>
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