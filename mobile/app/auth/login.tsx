import { useState } from "react";
import { View, Text, TextInput, Pressable, ActivityIndicator, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import i18n from "../../locales";
import { signIn } from "../../lib/auth";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const t = (key: string) => i18n.t(key);

  const isValid = email.includes("@") && password.length >= 6;

  const handleLogin = async () => {
    if (!isValid || loading) return;

    setLoading(true);
    try {
      await signIn(email, password);
    } catch (error: any) {
      Alert.alert("Greška", error.message || "Neuspešna prijava");
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
            {t("auth.login.title")}
          </Text>
          <Text className="text-textSecondary text-base mb-8">
            {t("auth.login.subtitle")}
          </Text>

          <View className="gap-3">
            <View className="bg-surface rounded-2xl p-4 border border-border">
              <Text className="text-textSecondary text-xs mb-1">
                {t("auth.login.email")}
              </Text>
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder={t("auth.login.emailPlaceholder")}
                placeholderTextColor="#666"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                className="text-text text-base"
              />
            </View>

            <View className="bg-surface rounded-2xl p-4 border border-border">
              <Text className="text-textSecondary text-xs mb-1">
                {t("auth.login.password")}
              </Text>
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder={t("auth.login.passwordPlaceholder")}
                placeholderTextColor="#666"
                secureTextEntry
                className="text-text text-base"
              />
            </View>
          </View>
        </View>

        <View className="gap-4">
          <Pressable
            onPress={handleLogin}
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
                {t("auth.login.submit")}
              </Text>
            )}
          </Pressable>

          <Pressable
            onPress={() => router.push("/auth/register")}
            className="py-2 items-center"
          >
            <Text className="text-textSecondary text-sm">
              {t("auth.login.noAccount")}
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}