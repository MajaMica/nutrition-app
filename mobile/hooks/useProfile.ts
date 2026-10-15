import { useState, useCallback } from "react";
import { useFocusEffect } from "expo-router";
import { apiGetAuth } from "../lib/api";
import { UserProfile } from "../lib/calories";

export function useProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const data = await apiGetAuth<UserProfile>("/profile");
      setProfile(data);
    } catch {
      setProfile(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  return { profile, loading, reload: load };
}