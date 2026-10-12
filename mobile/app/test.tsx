import { useEffect, useState } from "react";
import { View, Text, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { supabase } from "../lib/supabase";

export default function TestScreen() {
  const [status, setStatus] = useState("Testiram...");

  useEffect(() => {
    async function test() {
      const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
      const key = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

      if (!url) {
        setStatus("❌ EXPO_PUBLIC_SUPABASE_URL nije postavljen");
        return;
      }
      if (!key) {
        setStatus("❌ EXPO_PUBLIC_SUPABASE_ANON_KEY nije postavljen");
        return;
      }

      const { error } = await supabase.auth.getSession();

      if (error) {
        setStatus(`❌ Greška: ${error.message}`);
      } else {
        setStatus(`✅ Supabase radi!\n\nURL: ${url}\nKey: ${key.slice(0, 20)}...`);
      }
    }
    test();
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView className="flex-1 p-6">
        <Text className="text-text text-xl font-bold mb-4">Supabase Test</Text>
        <Text className="text-textSecondary text-base">{status}</Text>
      </ScrollView>
    </SafeAreaView>
  );
}
