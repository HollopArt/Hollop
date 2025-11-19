import { StyleSheet, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useState, useEffect } from "react";

import { ScreenScrollView } from "@/components/ScreenScrollView";
import { ThemedText } from "@/components/ThemedText";
import { TutorialCard } from "@/components/TutorialCard";
import { BorderRadius, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/useTheme";
import { RootStackParamList } from "@/navigation/RootStackNavigator";
import { TUTORIALS } from "@/types/tutorials";
import { storage } from "@/utils/storage";

type NavigationProp = NativeStackNavigationProp<RootStackParamList, "TutorialSelection">;

export default function TutorialSelectionScreen() {
  const { colors } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const [tutorialProgress, setTutorialProgress] = useState<Record<string, boolean>>({});

  useEffect(() => {
    loadProgress();
  }, []);

  const loadProgress = async () => {
    const progress = await storage.getTutorialProgress();
    setTutorialProgress(progress);
  };

  const handleTutorialSelect = async (tutorialId: string) => {
    await storage.setCurrentTutorial(tutorialId);
    await storage.setWorkspaceBlocks([]);
    navigation.goBack();
  };

  const handleFreestyleMode = async () => {
    await storage.setCurrentTutorial(null);
    navigation.goBack();
  };

  return (
    <ScreenScrollView>
      <ThemedText style={styles.header}>Выберите задание для обучения</ThemedText>
      
      {TUTORIALS.map((tutorial) => (
        <TutorialCard
          key={tutorial.id}
          tutorial={tutorial}
          completed={tutorialProgress[tutorial.id] || false}
          onPress={() => handleTutorialSelect(tutorial.id)}
        />
      ))}

      <Pressable
        onPress={handleFreestyleMode}
        style={({ pressed }) => [
          styles.freestyleButton,
          {
            borderColor: colors.primary,
            opacity: pressed ? 0.7 : 1,
          },
        ]}
      >
        <ThemedText style={[styles.freestyleText, { color: colors.primary }]}>
          Свободный режим
        </ThemedText>
      </Pressable>
    </ScreenScrollView>
  );
}

const styles = StyleSheet.create({
  header: {
    fontSize: 20,
    fontWeight: "600",
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  freestyleButton: {
    marginHorizontal: Spacing.lg,
    marginVertical: Spacing.lg,
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.md,
    borderWidth: 2,
    alignItems: "center",
  },
  freestyleText: {
    fontSize: 16,
    fontWeight: "600",
  },
});

