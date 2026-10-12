import { useState, useEffect } from "react";
import { View, Text, ScrollView, Image, Pressable, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { supabase } from "../../lib/supabase";
import { signOut } from "../../lib/auth";
import i18n from "../../locales";

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

export default function ProfileScreen() {
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const t = (key: string) => i18n.t(key);

  useEffect(() => {
    async function loadUser() {
      const { data } = await supabase.auth.getUser();
      if (data.user) {
        setUserEmail(data.user.email || "");
        setUserName((data.user.user_metadata?.name as string) || "Korisnik");
      }
    }
    loadUser();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut();
      router.replace("/auth/login");
    } catch (error: any) {
      Alert.alert("Greška", error.message);
    }
  };

  const SECTIONS: Section[] = [
    {
      id: "account",
      title: t("profile.account"),
      items: [
        { id: "personal", label: t("profile.personalInfo") },
        { id: "preferences", label: t("profile.preferences") },
        { id: "notifications", label: t("profile.notifications") },
        { id: "subscription", label: t("profile.subscription") },
      ],
    },
    {
      id: "app",
      title: t("profile.appSettings"),
      items: [
        { id: "language", label: t("profile.language"), value: "Srpski" },
        { id: "theme", label: t("profile.theme"), value: t("profile.themeDark") },
        { id: "about", label: t("profile.about") },
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
              {userName || "..."}
            </Text>
            <Text className="text-textSecondary text-sm" numberOfLines={1}>
              {userEmail || "..."}
            </Text>
          </View>
        </View>

        {SECTIONS.map((section) => (
          <View key={section.id} className="mb-2">
            <View className="px-4 pt-5 pb-2">
              <Text className="text-text text-lg font-bold">
                {section.title}
              </Text>
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
                    <Text className="text-textSecondary text-sm">
                      {item.value}
                    </Text>
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