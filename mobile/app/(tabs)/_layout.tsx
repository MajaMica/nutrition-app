import { Tabs } from "expo-router";
import { Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useLanguage } from "../../contexts/LanguageContext";
import i18n from "../../locales";

export default function TabsLayout() {
  const insets = useSafeAreaInsets();
  const { language } = useLanguage();
  const t = (key: string) => i18n.t(key);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#1A1A1A",
          borderTopColor: "#2A2A2A",
          paddingBottom: insets.bottom + 8,
          paddingTop: 8,
          height: 70 + insets.bottom,
        },
        tabBarActiveTintColor: "#B3FF47",
        tabBarInactiveTintColor: "#A0A0A0",
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t("tabs.home"),
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 22 }}>🏠</Text>,
        }}
      />
      <Tabs.Screen
        name="recipes"
        options={{
          title: t("tabs.recipes"),
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 22 }}>🍳</Text>,
        }}
      />
      <Tabs.Screen
        name="plan"
        options={{
          title: t("tabs.plan"),
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 22 }}>📅</Text>,
        }}
      />
      <Tabs.Screen
        name="foods"
        options={{
          title: t("tabs.foods"),
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 22 }}>🥕</Text>,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: t("tabs.profile"),
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 22 }}>👤</Text>,
        }}
      />
    </Tabs>
  );
}