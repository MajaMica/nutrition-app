import { useState, useEffect } from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLanguage } from "../contexts/LanguageContext";
import i18n from "../locales";

export default function PaywallScreen() {
  const { language } = useLanguage();
  const t = (key: string) => i18n.t(key);
  const [currentTier, setCurrentTier] = useState("free");

  useEffect(() => {
    loadTier();
  }, []);

  async function loadTier() {
    const savedTier = await AsyncStorage.getItem("@user_tier");
    if (savedTier) setCurrentTier(savedTier);
  }

  async function simulateUpgrade(tier: string) {
    await AsyncStorage.setItem("@user_tier", tier);
    setCurrentTier(tier);
    alert(`Uspešno simulirano: Sada ste ${tier.toUpperCase()} član!`);
  }

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <View className="px-4 pt-2 pb-3 flex-row items-center">
        <Pressable onPress={() => router.back()} className="w-12 h-12 items-center justify-center -ml-3">
          <Text className="text-text text-2xl">←</Text>
        </Pressable>
        <Text className="text-text text-lg font-bold flex-1 text-center pr-9">
          Nadogradi nalog
        </Text>
      </View>

      <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
        <View className="items-center py-8">
          <Text className="text-6xl mb-4">💎</Text>
          <Text className="text-text text-3xl font-bold text-center mb-2">
            Otključaj pun potencijal
          </Text>
          <Text className="text-textSecondary text-base text-center px-4">
            Izaberi paket koji najbolje odgovara tvojim ciljevima.
          </Text>
        </View>

        <View className={`bg-surface rounded-3xl p-5 mb-4 border ${currentTier === "free" ? "border-primary" : "border-border"}`}>
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-text text-lg font-bold">Free</Text>
            <Text className="text-textSecondary font-bold">€0.00</Text>
          </View>
          <Text className="text-textSecondary text-sm mb-4">Osnovno praćenje ishrane.</Text>
          <View className="gap-2 mb-4">
            <Text className="text-text text-sm">✓ 1 obrok dnevno u Planu</Text>
            <Text className="text-text text-sm">✓ Osnovni proračun kalorija</Text>
          </View>
          {currentTier === "free" ? (
            <View className="bg-primary/20 py-2 rounded-xl items-center">
              <Text className="text-primary font-bold text-sm">Trenutni paket</Text>
            </View>
          ) : (
            <Pressable onPress={() => simulateUpgrade("free")} className="border border-border py-2 rounded-xl items-center">
              <Text className="text-text font-bold text-sm">Vrati se na Free</Text>
            </Pressable>
          )}
        </View>

        <View className={`bg-surface rounded-3xl p-5 mb-4 border ${currentTier === "premium" ? "border-primary" : "border-border"}`}>
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-text text-lg font-bold">Premium</Text>
            <Text className="text-primary font-bold">€9.99 / mes</Text>
          </View>
          <Text className="text-textSecondary text-sm mb-4">Za ozbiljne rezultate.</Text>
          <View className="gap-2 mb-4">
            <Text className="text-text text-sm">✓ Sve iz Free paketa</Text>
            <Text className="text-text text-sm">✓ Neograničen broj obroka u Planu</Text>
            <Text className="text-text text-sm">✓ Omiljeni recepti</Text>
          </View>
          {currentTier === "premium" ? (
            <View className="bg-primary/20 py-2 rounded-xl items-center">
              <Text className="text-primary font-bold text-sm">Trenutni paket</Text>
            </View>
          ) : (
            <Pressable onPress={() => simulateUpgrade("premium")} className="bg-primary py-3 rounded-xl items-center">
              <Text className="text-background font-bold text-sm">Simuliraj Premium</Text>
            </Pressable>
          )}
        </View>

        <View className={`bg-surface rounded-3xl p-5 mb-6 border-2 relative ${currentTier === "diamond" ? "border-primary" : "border-[#B3FF47]"}`}>
          <View className="absolute -top-3 left-0 right-0 items-center">
            <View className="bg-[#B3FF47] px-3 py-1 rounded-full">
              <Text className="text-black text-[10px] font-bold uppercase tracking-wider">
                Najbolja vrednost
              </Text>
            </View>
          </View>
          
          <View className="flex-row justify-between items-center mb-3 mt-2">
            <Text className="text-text text-lg font-bold">Diamond</Text>
            <Text className="text-primary font-bold">€19.99 / mes</Text>
          </View>
          <Text className="text-textSecondary text-sm mb-4">Kompletno iskustvo i ekskluzive.</Text>
          <View className="gap-2 mb-4">
            <Text className="text-text text-sm">✓ Sve iz Premium paketa</Text>
            <Text className="text-text text-sm">✓ Kreiraj sopstvene recepte</Text>
            <Text className="text-text text-sm">✓ Pristup svim E-knjigama</Text>
          </View>
          {currentTier === "diamond" ? (
            <View className="bg-primary/20 py-2 rounded-xl items-center">
              <Text className="text-primary font-bold text-sm">Trenutni paket</Text>
            </View>
          ) : (
            <Pressable onPress={() => simulateUpgrade("diamond")} className="bg-[#B3FF47] py-3 rounded-xl items-center">
              <Text className="text-black font-bold text-sm">Simuliraj Diamond</Text>
            </Pressable>
          )}
        </View>

        <View className="flex-row items-center mb-6 mt-2">
          <View className="flex-1 h-[1px] bg-border" />
          <Text className="text-textSecondary px-4 text-xs font-bold uppercase tracking-wider">
            Ili
          </Text>
          <View className="flex-1 h-[1px] bg-border" />
        </View>

        <Pressable className="bg-surface rounded-2xl p-4 mb-8 border border-border flex-row items-center justify-between">
          <View className="flex-1 mr-4">
            <Text className="text-text font-bold text-base mb-1">
              E-knjiga
            </Text>
            <Text className="text-textSecondary text-xs">
              Kupi pojedinačno bez pretplate.
            </Text>
          </View>
          <View className="bg-background border border-border px-4 py-2.5 rounded-full">
            <Text className="text-text font-bold text-sm">€14.99</Text>
          </View>
        </Pressable>

        <View className="h-8" />
      </ScrollView>
    </SafeAreaView>
  );
}