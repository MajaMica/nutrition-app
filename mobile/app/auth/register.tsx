import { useState } from "react";
import { View, Text, TextInput, Pressable, ActivityIndicator, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import i18n from "../../locales";
import { signUp } from "../../lib/auth";
import { apiPut } from "../../lib/api";
import { useOnboarding } from "../../contexts/OnboardingContext";

export default function RegisterScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const t = (key: string) => i18n.t(key);
  const { data: onboardingData, resetData } = useOnboarding();

  const isValid = name.length >= 2 && email.includes("@") && password.length >= 6;

  const handleRegister = async () => {
    if (!isValid || loading) return;

    setLoading(true);
    try {
      await signUp(email, password, name);

      const profileData = {
        name,
        birthYear: onboardingData.birthYear,
        gender: onboardingData.gender,
        height: onboardingData.height,
        weight: onboardingData.weight,
        targetWeight: onboardingData.targetWeight,
        activityLevel: onboardingData.activityLevel,
        dietType: onboardingData.dietType,
        allergies: onboardingData.allergies,
        dislikedFoods: onboardingData.dislikedFoods,
        onboardingDone: true,
      };

      try {
        await apiPut("/profile", profileData);
      } catch (profileError) {
        console.error("Profile save error:", profileError);
      }

      resetData();
      router.replace("/(tabs)");
    } catch (error: any) {
      Alert.alert("Greska", error.message || "Neuspesna registracija");
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 px-6 pt-12 pb-8 justify-between">
        <View>
          <Pressable onPress={() => router.back()} className="mb-8">
            <Text className="text-textSecondary text-sm">← {t("common.back")}</Text>
          </Pressable>

          <Text className="text-text text-3xl font-bold mb-3">
            {t("auth.register.title")}
          </Text>
          <Text className="text-textSecondary text-base mb-8">
            {t("auth.register.subtitle")}
          </Text>

          <View className="gap-3">
            <View className="bg-surface rounded-2xl p-4 border border-border">
              <Text className="text-textSecondary text-xs mb-1">
                {t("auth.register.name")}
              </Text>
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder={t("auth.register.namePlaceholder")}
                placeholderTextColor="#666"
                autoCapitalize="words"
                className="text-text text-base"
              />
            </View>

            <View className="bg-surface rounded-2xl p-4 border border-border">
              <Text className="text-textSecondary text-xs mb-1">
                {t("auth.register.email")}
              </Text>
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder={t("auth.register.emailPlaceholder")}
                placeholderTextColor="#666"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                className="text-text text-base"
              />
            </View>

            <View className="bg-surface rounded-2xl p-4 border border-border">
              <Text className="text-textSecondary text-xs mb-1">
                {t("auth.register.password")}
              </Text>
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder={t("auth.register.passwordPlaceholder")}
                placeholderTextColor="#666"
                secureTextEntry
                className="text-text text-base"
              />
            </View>
          </View>
        </View>

        <View className="gap-4">
          <Pressable
            onPress={handleRegister}
            disabled={!isValid || loading}
            className={`py-4 rounded-2xl items-center ${
              isValid && !loading ? "bg-primary" : "bg-surface"
            }`}
          >
            {loading ? (
              <ActivityIndicator color="#0D0D0D" />
            ) : (
              <Text
                className={`text-base font-bold ${
                  isValid ? "text-background" : "text-textSecondary"
                }`}
              >
                {t("auth.register.submit")}
              </Text>
            )}
          </Pressable>

          <Pressable
            onPress={() => router.push("/auth/login")}
            className="py-2 items-center"
          >
            <Text className="text-textSecondary text-sm">
              {t("auth.register.hasAccount")}
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}