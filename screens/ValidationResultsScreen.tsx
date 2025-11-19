import { StyleSheet, View, Pressable } from "react-native";
import { useRoute, useNavigation, RouteProp } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import Animated, { FadeIn, ZoomIn } from "react-native-reanimated";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { BorderRadius, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/useTheme";
import { RootStackParamList } from "@/navigation/RootStackNavigator";

type ValidationResultsRouteProp = RouteProp<RootStackParamList, "ValidationResults">;

export default function ValidationResultsScreen() {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const route = useRoute<ValidationResultsRouteProp>();
  
  const { success, message, hint } = route.params;

  return (
    <View style={styles.overlay}>
      <Pressable style={styles.backdrop} onPress={() => navigation.goBack()} />
      
      <Animated.View
        entering={ZoomIn.duration(300).springify()}
        style={[
          styles.modal,
          { backgroundColor: colors.backgroundDefault },
        ]}
      >
        <Animated.View entering={FadeIn.delay(200)}>
          <View
            style={[
              styles.iconContainer,
              {
                backgroundColor: success
                  ? colors.success + "20"
                  : colors.error + "20",
              },
            ]}
          >
            <Feather
              name={success ? "check-circle" : "x-circle"}
              size={64}
              color={success ? colors.success : colors.error}
            />
          </View>
        </Animated.View>

        <ThemedText style={styles.title}>
          {success ? "Отлично!" : "Ошибка"}
        </ThemedText>
        
        <ThemedText style={[styles.message, { color: colors.textSecondary }]}>
          {message}
        </ThemedText>

        {hint ? (
          <ThemedView
            style={[
              styles.hintContainer,
              { backgroundColor: colors.backgroundSecondary },
            ]}
          >
            <Feather name="info" size={16} color={colors.primary} />
            <ThemedText style={[styles.hint, { color: colors.textSecondary }]}>
              {hint}
            </ThemedText>
          </ThemedView>
        ) : null}

        <Pressable
          onPress={() => navigation.goBack()}
          style={({ pressed }) => [
            styles.button,
            {
              backgroundColor: success ? colors.success : colors.primary,
              opacity: pressed ? 0.7 : 1,
            },
          ]}
        >
          <ThemedText style={styles.buttonText}>Понятно</ThemedText>
        </Pressable>

        {!success && hint ? (
          <Pressable
            onPress={() => navigation.goBack()}
            style={({ pressed }) => [
              styles.textButton,
              { opacity: pressed ? 0.5 : 1 },
            ]}
          >
            <ThemedText style={[styles.textButtonText, { color: colors.primary }]}>
              Закрыть
            </ThemedText>
          </Pressable>
        ) : null}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  modal: {
    width: "80%",
    maxWidth: 400,
    padding: Spacing["2xl"],
    borderRadius: BorderRadius.lg,
    alignItems: "center",
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.lg,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: Spacing.md,
    textAlign: "center",
  },
  message: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: Spacing.lg,
  },
  hintContainer: {
    flexDirection: "row",
    padding: Spacing.md,
    borderRadius: BorderRadius.sm,
    marginBottom: Spacing.lg,
    gap: Spacing.sm,
  },
  hint: {
    flex: 1,
    fontSize: 14,
  },
  button: {
    width: "100%",
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.sm,
    alignItems: "center",
    marginBottom: Spacing.sm,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  textButton: {
    paddingVertical: Spacing.sm,
  },
  textButtonText: {
    fontSize: 14,
    fontWeight: "500",
  },
});

