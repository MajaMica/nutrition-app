import { View, Text, Pressable } from "react-native";

type Props = {
  icon: string;
  label: string;
  description?: string;
  selected: boolean;
  onPress: () => void;
};

export function OptionButton({ icon, label, description, selected, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      className={`flex-row items-center p-4 rounded-2xl border ${
        selected ? "bg-surface border-primary" : "bg-surface border-border"
      }`}
    >
      <Text className="text-3xl mr-4">{icon}</Text>
      <View className="flex-1">
        <Text className="text-text text-base font-semibold mb-0.5">{label}</Text>
        {description && (
          <Text className="text-textSecondary text-sm">{description}</Text>
        )}
      </View>
      {selected && (
        <View className="w-6 h-6 rounded-full bg-primary items-center justify-center">
          <Text className="text-background text-xs font-bold">✓</Text>
        </View>
      )}
    </Pressable>
  );
}