import { useState, useCallback } from "react";
import { View, Text, ScrollView, Pressable, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useFocusEffect } from "expo-router";
import { supabase } from "../../lib/supabase";
import { signOut } from "../../lib/auth";
import { apiGetAuth } from "../../lib/api";
import { useLanguage } from "../../contexts/LanguageContext";
import i18n from "../../locales";
import { useTheme } from "../../contexts/ThemeContext";

type MenuItem = {
  id: string;
  label: string;
  value?: string;
  onPress?: () => void;
};

type Section = {
  id: string;
  title: string;
  items: MenuItem[];
};

type UserProfile = {
  name: string | null;
  email: string;
};

export default function ProfileScreen() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const { language } = useLanguage();
  const { theme } = useTheme();
  const t = (key: string) => i18n.t(key);

  useFocusEffect(
    useCallback(() => {
      loadUser();
    }, [])
  );

  async function loadUser() {
    try {
      const profile = await apiGetAuth<UserProfile>("/profile");
      setUser(profile);
    } catch {
      const { data } = await supabase.auth.getUser();
      if (data.user) {
        setUser({
          name: (data.user.user_metadata?.name as string) || "Korisnik",
          email: data.user.email || "",
        });
      }
    }
  }

  const handleLogout = async () => {
    try {
      await signOut();
      router.replace("/auth/login");
    } catch (error: any) {
      Alert.alert("Greska", error.message);
    }
  };

  const SECTIONS: Section[] = [
    {
      id: "account",
      title: t("profile.account"),
      items: [
        {
          id: "personal",
          label: t("profile.personalInfo"),
          onPress: () => router.push("/account/personal"),
        },
        {
          id: "preferences",
          label: t("profile.preferences"),
          onPress: () => router.push("/account/preferences"),
        },
        {
          id: "notifications",
          label: t("profile.notifications"),
          onPress: () => router.push("/account/notifications"),
        },
        {
  id: "subscription",
  label: t("profile.subscription"),
  onPress: () => router.push("/account/subscription"),
},
      ],
    },
    {
      id: "app",
      title: t("profile.appSettings"),
      items: [
        {
          id: "language",
          label: t("profile.language"),
          value: language === "sr" ? "Srpski" : "English",
          onPress: () => router.push("/account/language"),
        },
        {
          id: "theme",
          label: t("profile.theme"),
          value: theme === "dark" ? t("profile.themeDark") : t("profile.themeLight"),
          onPress: () => router.push("/account/theme"),
        },
        {
          id: "about",
          label: t("profile.about"),
          onPress: () => router.push("/account/about"),
        },
      ],
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <View className="pt-4 pb-3 px-4">
        <Text className="text-text text-lg font-bold text-center">
          {t("profile.title")}
        </Text>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-4 py-4 flex-row items-center gap-4">
          <View className="w-24 h-24 rounded-full bg-surface items-center justify-center border border-border">
            <Text className="text-4xl">👤</Text>
          </View>
          <View className="flex-1">
            <Text className="text-text text-2xl font-bold mb-1" numberOfLines={1}>
              {user?.name || "..."}
            </Text>
            <Text className="text-textSecondary text-sm" numberOfLines={1}>
              {user?.email || "..."}
            </Text>
          </View>
        </View>

        {SECTIONS.map((section) => (
          <View key={section.id} className="mb-2">
            <View className="px-4 pt-5 pb-2">
              <Text className="text-text text-lg font-bold">{section.title}</Text>
            </View>

            {section.items.map((item) => (
              <Pressable
                key={item.id}
                onPress={item.onPress}
                className="px-4 h-14 flex-row items-center justify-between border-b border-border/40"
              >
                <Text className="text-text text-base">{item.label}</Text>
                <View className="flex-row items-center gap-2">
                  {item.value && (
                    <Text className="text-textSecondary text-sm">{item.value}</Text>
                  )}
                  <Text className="text-textSecondary text-lg">›</Text>
                </View>
              </Pressable>
            ))}
          </View>
        ))}

        <Pressable
          onPress={handleLogout}
          className="mx-4 mt-6 mb-8 py-4 rounded-2xl border border-border items-center"
        >
          <Text className="text-textSecondary text-base font-medium">
            {t("profile.logout")}
          </Text>
        </Pressable>

        <View className="h-6" />
      </ScrollView>
    </SafeAreaView>
  );
}