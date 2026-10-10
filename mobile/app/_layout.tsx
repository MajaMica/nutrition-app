import "../global.css";
import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { OnboardingProvider } from "../contexts/OnboardingContext";
import { LanguageProvider } from "../contexts/LanguageContext";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <LanguageProvider>
        <OnboardingProvider>
          <Stack screenOptions={{ headerShown: false }} />
        </OnboardingProvider>
      </LanguageProvider>
    </SafeAreaProvider>
  );
}