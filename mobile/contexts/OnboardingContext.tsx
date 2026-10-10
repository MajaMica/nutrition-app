import { createContext, useContext, useState, ReactNode } from "react";

export type OnboardingData = {
  goal: string | null;
  gender: string | null;
  birthYear: number | null;
  height: number | null;
  weight: number | null;
  targetWeight: number | null;
  activityLevel: string | null;
  dietType: string | null;
  allergies: string[];
  dislikedFoods: string[];
  mealsPerDay: number | null;
  cookingTime: string | null;
  cookingSkill: string | null;
  householdSize: number | null;
};

const initialData: OnboardingData = {
  goal: null,
  gender: null,
  birthYear: null,
  height: null,
  weight: null,
  targetWeight: null,
  activityLevel: null,
  dietType: null,
  allergies: [],
  dislikedFoods: [],
  mealsPerDay: null,
  cookingTime: null,
  cookingSkill: null,
  householdSize: null,
};

type OnboardingContextType = {
  data: OnboardingData;
  updateData: (partial: Partial<OnboardingData>) => void;
  resetData: () => void;
};

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<OnboardingData>(initialData);

  const updateData = (partial: Partial<OnboardingData>) => {
    setData((prev) => ({ ...prev, ...partial }));
  };

  const resetData = () => setData(initialData);

  return (
    <OnboardingContext.Provider value={{ data, updateData, resetData }}>
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error("useOnboarding must be used within OnboardingProvider");
  }
  return context;
}