import { useEffect } from "react";
import { View, Text, Image, Pressable, Dimensions } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  Easing,
  runOnJS,
  interpolate,
} from "react-native-reanimated";

const SCREEN_WIDTH = Dimensions.get("window").width;
const SWIPE_THRESHOLD = 100;

type Recipe = {
  id: string;
  title: string;
  titleEn: string | null;
  image: string | null;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
};

type Props = {
  recipe: Recipe;
  language: string;
  onSelect: () => void;
  onSkip: () => void;
  onPress: () => void;
  hasNext: boolean;
  currentIndex: number;
  totalCount: number;
  labels: {
    select: string;
    skip: string;
  };
};

const CARD_HEIGHT = 340;

export default function MealCard({
  recipe,
  language,
  onSelect,
  onSkip,
  onPress,
  hasNext,
  currentIndex,
  totalCount,
  labels,
}: Props) {
  const displayTitle =
    language === "en" && recipe.titleEn ? recipe.titleEn : recipe.title;

  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const rotate = useSharedValue(0);
  const opacity = useSharedValue(1);

  useEffect(() => {
    translateX.value = 0;
    translateY.value = 0;
    rotate.value = 0;
    opacity.value = 1;
  }, [recipe.id]);

  function handleSkipAnimation() {
    translateX.value = withTiming(-SCREEN_WIDTH * 1.2, {
      duration: 300,
      easing: Easing.out(Easing.cubic),
    });
    rotate.value = withTiming(-15, { duration: 300 });
    opacity.value = withTiming(0, { duration: 250 }, (finished) => {
      if (finished) {
        runOnJS(onSkip)();
      }
    });
  }

  function handleSelectAnimation() {
    translateX.value = withTiming(SCREEN_WIDTH * 1.2, {
      duration: 300,
      easing: Easing.out(Easing.cubic),
    });
    rotate.value = withTiming(15, { duration: 300 });
    opacity.value = withTiming(0, { duration: 250 }, (finished) => {
      if (finished) {
        runOnJS(onSelect)();
      }
    });
  }

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      translateX.value = event.translationX;
      translateY.value = event.translationY * 0.3;
      rotate.value = interpolate(
        event.translationX,
        [-SCREEN_WIDTH, 0, SCREEN_WIDTH],
        [-20, 0, 20]
      );
    })
    .onEnd((event) => {
      if (event.translationX < -SWIPE_THRESHOLD && hasNext) {
        translateX.value = withTiming(-SCREEN_WIDTH * 1.2, {
          duration: 300,
          easing: Easing.out(Easing.cubic),
        });
        rotate.value = withTiming(-20, { duration: 300 });
        opacity.value = withTiming(0, { duration: 250 }, (finished) => {
          if (finished) {
            runOnJS(onSkip)();
          }
        });
      } else if (event.translationX > SWIPE_THRESHOLD) {
        translateX.value = withTiming(SCREEN_WIDTH * 1.2, {
          duration: 300,
          easing: Easing.out(Easing.cubic),
        });
        rotate.value = withTiming(20, { duration: 300 });
        opacity.value = withTiming(0, { duration: 250 }, (finished) => {
          if (finished) {
            runOnJS(onSelect)();
          }
        });
      } else {
        translateX.value = withSpring(0, { damping: 15 });
        translateY.value = withSpring(0, { damping: 15 });
        rotate.value = withSpring(0, { damping: 15 });
      }
    });

  const mainCardStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { rotate: `${rotate.value}deg` },
    ],
    opacity: opacity.value,
  }));

  const skipLabelStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      translateX.value,
      [-SWIPE_THRESHOLD, 0],
      [1, 0],
      "clamp"
    ),
  }));

  const selectLabelStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      translateX.value,
      [0, SWIPE_THRESHOLD],
      [0, 1],
      "clamp"
    ),
  }));

  const nextDisabled = currentIndex >= totalCount - 1;

  return (
    <View>
      <View
        style={{
          height: CARD_HEIGHT + 80,
          paddingTop: 32,
          paddingBottom: 32,
        }}
      >
        {hasNext && currentIndex + 2 < totalCount && (
          <View
            className="absolute bg-surface border border-border rounded-3xl"
            style={{
              left: 28,
              right: 28,
              top: 44,
              height: CARD_HEIGHT,
              transform: [{ rotate: "-4deg" }],
              opacity: 0.35,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.15,
              shadowRadius: 8,
            }}
          />
        )}

        {hasNext && (
          <View
            className="absolute bg-surface border border-border rounded-3xl"
            style={{
              left: 16,
              right: 16,
              top: 38,
              height: CARD_HEIGHT + 4,
              transform: [{ rotate: "2.5deg" }],
              opacity: 0.6,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 6 },
              shadowOpacity: 0.2,
              shadowRadius: 12,
            }}
          />
        )}

        <GestureDetector gesture={panGesture}>
          <Animated.View
            style={[
              {
                position: "absolute",
                left: 0,
                right: 0,
                top: 32,
                height: CARD_HEIGHT,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 16 },
                shadowOpacity: 0.5,
                shadowRadius: 24,
                elevation: 16,
              },
              mainCardStyle,
            ]}
          >
            <Pressable
              onPress={onPress}
              className="bg-surface border border-border rounded-3xl overflow-hidden flex-1"
            >
              {recipe.image ? (
                <Image
                  source={{ uri: recipe.image }}
                  className="w-full h-40"
                  resizeMode="cover"
                />
              ) : (
                <View className="w-full h-40 bg-background items-center justify-center">
                  <Text className="text-6xl">🍽️</Text>
                </View>
              )}

              <View className="p-4 flex-1 justify-between">
                <View>
                  <Text
                    className="text-text text-lg font-bold mb-2"
                    numberOfLines={2}
                  >
                    {displayTitle}
                  </Text>
                  <Text className="text-primary text-base font-bold">
                    {Math.round(recipe.calories)} kcal
                  </Text>
                </View>

                <View className="flex-row gap-2 mt-3">
                  <View className="flex-1 bg-background rounded-xl py-2 items-center">
                    <Text className="text-textSecondary text-[10px] mb-0.5">
                      P
                    </Text>
                    <Text className="text-text text-xs font-bold">
                      {Math.round(recipe.protein)}g
                    </Text>
                  </View>
                  <View className="flex-1 bg-background rounded-xl py-2 items-center">
                    <Text className="text-textSecondary text-[10px] mb-0.5">
                      UH
                    </Text>
                    <Text className="text-text text-xs font-bold">
                      {Math.round(recipe.carbs)}g
                    </Text>
                  </View>
                  <View className="flex-1 bg-background rounded-xl py-2 items-center">
                    <Text className="text-textSecondary text-[10px] mb-0.5">
                      M
                    </Text>
                    <Text className="text-text text-xs font-bold">
                      {Math.round(recipe.fat)}g
                    </Text>
                  </View>
                </View>
              </View>
            </Pressable>

            {/* Overlay: DRUGA OPCIJA */}
            {hasNext && (
              <Animated.View
                style={[
                  {
                    position: "absolute",
                    top: 20,
                    right: 20,
                    paddingHorizontal: 16,
                    paddingVertical: 8,
                    borderRadius: 12,
                    borderWidth: 2,
                    borderColor: "#A0A0A0",
                    backgroundColor: "rgba(160,160,160,0.15)",
                    transform: [{ rotate: "-8deg" }],
                  },
                  skipLabelStyle,
                ]}
                pointerEvents="none"
              >
                <Text
                  style={{
                    color: "#A0A0A0",
                    fontWeight: "bold",
                    fontSize: 14,
                  }}
                >
                  🔄 {labels.skip.toUpperCase()}
                </Text>
              </Animated.View>
            )}

            {/* Overlay: IZABERI */}
            <Animated.View
              style={[
                {
                  position: "absolute",
                  top: 20,
                  left: 20,
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                  borderRadius: 12,
                  borderWidth: 2,
                  borderColor: "#B3FF47",
                  backgroundColor: "rgba(179,255,71,0.15)",
                  transform: [{ rotate: "8deg" }],
                },
                selectLabelStyle,
              ]}
              pointerEvents="none"
            >
              <Text
                style={{
                  color: "#B3FF47",
                  fontWeight: "bold",
                  fontSize: 14,
                }}
              >
                ✓ {labels.select.toUpperCase()}
              </Text>
            </Animated.View>
          </Animated.View>
        </GestureDetector>
      </View>

      <View className="flex-row items-center justify-center gap-3 mb-4">
        <Text className="text-textSecondary text-xs">
          {currentIndex + 1} / {totalCount}
        </Text>
        {totalCount > 1 && (
          <View className="flex-row gap-1.5">
            {Array.from({ length: Math.min(totalCount, 8) }).map((_, i) => {
              const active =
                totalCount <= 8
                  ? i === currentIndex
                  : i === Math.floor((currentIndex / (totalCount - 1)) * 7);
              return (
                <View
                  key={i}
                  className={`rounded-full ${
                    active ? "bg-primary w-5 h-1.5" : "bg-border w-1.5 h-1.5"
                  }`}
                />
              );
            })}
          </View>
        )}
      </View>

      <View className="flex-row gap-2">
        <Pressable
          onPress={handleSkipAnimation}
          disabled={!hasNext || nextDisabled}
          className={`flex-1 rounded-2xl py-4 items-center border flex-row justify-center gap-2 ${
            !hasNext || nextDisabled
              ? "bg-surface/40 border-border/40"
              : "bg-surface border-border"
          }`}
        >
          <Text
            className={`text-base ${
              !hasNext || nextDisabled ? "text-textSecondary/40" : "text-text"
            }`}
          >
            🔄
          </Text>
          <Text
            className={`text-sm font-medium ${
              !hasNext || nextDisabled ? "text-textSecondary/40" : "text-text"
            }`}
          >
            {labels.skip}
          </Text>
        </Pressable>

        <Pressable
          onPress={handleSelectAnimation}
          className="flex-1 bg-primary rounded-2xl py-4 items-center flex-row justify-center gap-2"
        >
          <Text className="text-background text-base">✓</Text>
          <Text className="text-background text-sm font-bold">
            {labels.select}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}