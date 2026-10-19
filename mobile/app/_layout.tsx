import "../global.css";
import { Stack } from "expo-router";
import { View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { usePreventScreenCapture } from "expo-screen-capture";
import { OnboardingProvider } from "../contexts/OnboardingContext";
import { LanguageProvider } from "../contexts/LanguageContext";
import { ThemeProvider, useTheme, themeStyles } from "../contexts/ThemeContext";
import { useAuthProtection } from "../hooks/useAuth";

function RootLayoutNav() {
  useAuthProtection();
  const { theme } = useTheme();
  return (
    <View style={themeStyles[theme]} className="flex-1 bg-background">
      <Stack screenOptions={{ headerShown: false }} />
    </View>
  );
}

export default function RootLayout() {
  usePreventScreenCapture();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <LanguageProvider>
            <OnboardingProvider>
              <RootLayoutNav />
            </OnboardingProvider>
          </LanguageProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}