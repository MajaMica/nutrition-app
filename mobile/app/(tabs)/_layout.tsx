import { Tabs } from "expo-router";
import { Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TabsLayout() {
  const insets = useSafeAreaInsets();

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
          title: "Početna",
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 22 }}>🏠</Text>,
        }}
      />
      <Tabs.Screen
        name="recipes"
        options={{
          title: "Recepti",
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 22 }}>🍳</Text>,
        }}
      />
      <Tabs.Screen
        name="plan"
        options={{
          title: "Plan",
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 22 }}>📅</Text>,
        }}
      />
      <Tabs.Screen
        name="foods"
        options={{
          title: "Namirnice",
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 22 }}>🥕</Text>,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profil",
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 22 }}>👤</Text>,
        }}
      />
    </Tabs>
  );
}