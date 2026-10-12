import "../global.css";
import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { OnboardingProvider } from "../contexts/OnboardingContext";
import { LanguageProvider } from "../contexts/LanguageContext";
import { useAuthProtection } from "../hooks/useAuth";

function RootLayoutNav() {
  useAuthProtection();
  return <Stack screenOptions={{ headerShown: false }} />;
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <LanguageProvider>
        <OnboardingProvider>
          <RootLayoutNav />
        </OnboardingProvider>
      </LanguageProvider>
    </SafeAreaProvider>
  );
}