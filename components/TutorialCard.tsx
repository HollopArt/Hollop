import { StyleSheet, View, Pressable } from "react-native";
import { Image } from "expo-image";
import { Feather } from "@expo/vector-icons";
import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";
import { BorderRadius, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/useTheme";
import { Tutorial } from "@/types/tutorials";
import * as Haptics from "expo-haptics";

interface TutorialCardProps {
  tutorial: Tutorial;
  completed: boolean;
  onPress: () => void;
}

export function TutorialCard({ tutorial, completed, onPress }: TutorialCardProps) {
  const { colors } = useTheme();

  const getDifficultyColor = () => {
    switch (tutorial.difficulty) {
      case "easy":
        return colors.success;
      case "medium":
        return colors.warning;
      case "hard":
        return colors.error;
      default:
        return colors.textSecondary;
    }
  };

  const getDifficultyLabel = () => {
    switch (tutorial.difficulty) {
      case "easy":
        return "Легко";
      case "medium":
        return "Средне";
      case "hard":
        return "Сложно";
      default:
        return "";
    }
  };

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [
        styles.card,
        {
          opacity: pressed ? 0.7 : 1,
          transform: [{ scale: pressed ? 0.98 : 1 }],
        },
      ]}
    >
      <ThemedView style={[styles.cardContent, { backgroundColor: colors.backgroundDefault }]}>
        <View style={styles.cardHeader}>
          <Image
            source={
              tutorial.iconAsset === "task-calculator"
                ? require("@/assets/images/task-calculator.png")
                : tutorial.iconAsset === "task-loop"
                ? require("@/assets/images/task-loop.png")
                : require("@/assets/images/task-conditional.png")
            }
            style={styles.tutorialIcon}
            contentFit="contain"
          />
          <View style={styles.titleContainer}>
            <ThemedText style={styles.title}>{tutorial.title}</ThemedText>
            <View
              style={[
                styles.difficultyBadge,
                { backgroundColor: getDifficultyColor() + "20" },
              ]}
            >
              <ThemedText
                style={[styles.difficultyText, { color: getDifficultyColor() }]}
              >
                {getDifficultyLabel()}
              </ThemedText>
            </View>
          </View>
          {completed ? (
            <Feather name="check-circle" size={24} color={colors.success} />
          ) : null}
        </View>
        <ThemedText style={[styles.description, { color: colors.textSecondary }]}>
          {tutorial.description}
        </ThemedText>
        <Pressable
          style={[styles.button, { backgroundColor: colors.primary }]}
          onPress={handlePress}
        >
          <ThemedText style={styles.buttonText}>
            {completed ? "Пройти снова" : "Начать"}
          </ThemedText>
        </Pressable>
      </ThemedView>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: Spacing.md,
    marginHorizontal: Spacing.lg,
  },
  cardContent: {
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  tutorialIcon: {
    width: 48,
    height: 48,
    marginRight: Spacing.md,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: Spacing.xs,
  },
  difficultyBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.xs,
  },
  difficultyText: {
    fontSize: 12,
    fontWeight: "500",
  },
  description: {
    fontSize: 14,
    marginBottom: Spacing.lg,
  },
  button: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.sm,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
