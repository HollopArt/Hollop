import { StyleSheet, View, TextInput, Pressable, Alert } from "react-native";
import { Image } from "expo-image";
import { useState, useEffect } from "react";

import { ScreenScrollView } from "@/components/ScreenScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { BorderRadius, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/useTheme";
import { storage } from "@/utils/storage";

export default function SettingsScreen() {
  const { colors } = useTheme();
  const [userName, setUserName] = useState("Programmer");

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    const name = await storage.getUserName();
    setUserName(name);
  };

  const handleSaveName = async () => {
    await storage.setUserName(userName);
    Alert.alert("Сохранено", "Имя пользователя обновлено");
  };

  const handleResetTutorials = () => {
    Alert.alert(
      "Сбросить прогресс?",
      "Вы уверены, что хотите сбросить весь прогресс обучения?",
      [
        { text: "Отмена", style: "cancel" },
        {
          text: "Сбросить",
          style: "destructive",
          onPress: async () => {
            await storage.setTutorialProgress({});
            Alert.alert("Готово", "Прогресс обучения сброшен");
          },
        },
      ]
    );
  };

  return (
    <ScreenScrollView>
      <View style={styles.avatarContainer}>
        <Image
          source={require("@/assets/images/user-avatar.png")}
          style={styles.avatar}
          contentFit="cover"
        />
      </View>

      <ThemedView style={[styles.section, { backgroundColor: colors.backgroundDefault }]}>
        <ThemedText style={styles.sectionTitle}>Профиль</ThemedText>
        
        <View style={styles.field}>
          <ThemedText style={styles.label}>Имя пользователя</ThemedText>
          <TextInput
            value={userName}
            onChangeText={setUserName}
            style={[
              styles.input,
              {
                backgroundColor: colors.backgroundSecondary,
                color: colors.text,
                borderColor: colors.textSecondary + "30",
              },
            ]}
            placeholder="Введите имя"
            placeholderTextColor={colors.textSecondary}
          />
        </View>

        <Pressable
          onPress={handleSaveName}
          style={({ pressed }) => [
            styles.button,
            {
              backgroundColor: colors.primary,
              opacity: pressed ? 0.7 : 1,
            },
          ]}
        >
          <ThemedText style={styles.buttonText}>Сохранить</ThemedText>
        </Pressable>
      </ThemedView>

      <ThemedView style={[styles.section, { backgroundColor: colors.backgroundDefault }]}>
        <ThemedText style={styles.sectionTitle}>Обучение</ThemedText>
        
        <Pressable
          onPress={handleResetTutorials}
          style={({ pressed }) => [
            styles.dangerButton,
            {
              borderColor: colors.error,
              opacity: pressed ? 0.7 : 1,
            },
          ]}
        >
          <ThemedText style={[styles.dangerButtonText, { color: colors.error }]}>
            Сбросить прогресс обучения
          </ThemedText>
        </Pressable>
      </ThemedView>

      <ThemedView style={[styles.section, { backgroundColor: colors.backgroundDefault }]}>
        <ThemedText style={styles.sectionTitle}>О приложении</ThemedText>
        <ThemedText style={[styles.infoText, { color: colors.textSecondary }]}>
          CodeBlocks - обучающее приложение для визуального программирования
        </ThemedText>
        <ThemedText style={[styles.infoText, { color: colors.textSecondary }]}>
          Версия 1.0.0
        </ThemedText>
      </ThemedView>
    </ScreenScrollView>
  );
}

const styles = StyleSheet.create({
  avatarContainer: {
    alignItems: "center",
    paddingVertical: Spacing["2xl"],
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  section: {
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: Spacing.md,
  },
  field: {
    marginBottom: Spacing.md,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: Spacing.sm,
  },
  input: {
    padding: Spacing.md,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    fontSize: 16,
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
  dangerButton: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.sm,
    alignItems: "center",
    borderWidth: 2,
  },
  dangerButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  infoText: {
    fontSize: 14,
    marginBottom: Spacing.sm,
  },
});

