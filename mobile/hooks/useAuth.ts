import { useState, useEffect } from "react";
import { router, useSegments } from "expo-router";
import { supabase } from "../lib/supabase";

export function useAuthProtection() {
  const [isReady, setIsReady] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const segments = useSegments();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session);
      setIsReady(true);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setIsAuthenticated(!!session);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!isReady) return;

    const inTabsGroup = segments[0] === "(tabs)";
    const inAuthGroup = segments[0] === "auth";
    const inOnboarding = segments[0] === "onboarding";
    const atRoot = segments.length === 0;

    if (isAuthenticated && (inAuthGroup || atRoot)) {
      router.replace("/(tabs)");
      return;
    }

    if (!isAuthenticated && inTabsGroup) {
      router.replace("/auth/login");
      return;
    }
  }, [isReady, isAuthenticated, segments]);

  return { isReady, isAuthenticated };
}