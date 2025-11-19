import { StyleSheet, View, ScrollView, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import { ThemedText } from "./ThemedText";
import { BorderRadius, Spacing, Fonts } from "@/constants/theme";
import { useTheme } from "@/hooks/useTheme";
import { useState } from "react";
import * as Haptics from "expo-haptics";

interface CodeViewerProps {
  code: string;
  errors?: { line: number; message: string }[];
  warnings?: { line: number; message: string }[];
}

export function CodeViewer({ code, errors = [], warnings = [] }: CodeViewerProps) {
  const { colors } = useTheme();
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await Clipboard.setStringAsync(code);
    setCopied(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setTimeout(() => setCopied(false), 2000);
  };

  const codeLines = code.split("\n");

  return (
    <View style={[styles.container, { backgroundColor: colors.codeEditorBg }]}>
      <View style={[styles.header, { borderBottomColor: colors.textSecondary + "30" }]}>
        <ThemedText style={[styles.headerText, { color: "#FFFFFF" }]}>
          Сгенерированный код
        </ThemedText>
        <Pressable
          onPress={handleCopy}
          style={({ pressed }) => [styles.copyButton, { opacity: pressed ? 0.6 : 1 }]}
        >
          <Feather name={copied ? "check" : "copy"} size={20} color="#FFFFFF" />
        </Pressable>
      </View>

      {errors.length > 0 ? (
        <View style={[styles.errorContainer, { backgroundColor: colors.error + "20" }]}>
          <Feather name="alert-circle" size={16} color={colors.error} />
          <ThemedText style={[styles.errorText, { color: colors.error }]}>
            {errors.length} {errors.length === 1 ? "ошибка" : "ошибок"} в коде
          </ThemedText>
        </View>
      ) : null}

      {warnings.length > 0 ? (
        <View style={[styles.warningContainer, { backgroundColor: colors.warning + "20" }]}>
          <Feather name="alert-triangle" size={16} color={colors.warning} />
          <ThemedText style={[styles.warningText, { color: colors.warning }]}>
            {warnings.length} {warnings.length === 1 ? "предупреждение" : "предупреждений"}
          </ThemedText>
        </View>
      ) : null}

      <ScrollView style={styles.codeScroll} horizontal showsHorizontalScrollIndicator={false}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.codeContainer}>
            {codeLines.map((line, index) => (
              <View key={index} style={styles.codeLine}>
                <ThemedText style={[styles.lineNumber, { color: "#676E95" }]}>
                  {(index + 1).toString().padStart(3, " ")}
                </ThemedText>
                <ThemedText
                  style={[
                    styles.codeText,
                    {
                      color: line.includes("//")
                        ? "#676E95"
                        : line.includes("ОШИБКА")
                        ? colors.error
                        : "#D6DEEB",
                      fontFamily: Fonts.mono,
                    },
                  ]}
                >
                  {line}
                </ThemedText>
              </View>
            ))}
          </View>
        </ScrollView>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderTopLeftRadius: BorderRadius.md,
    borderTopRightRadius: BorderRadius.md,
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: Spacing.md,
    borderBottomWidth: 1,
  },
  headerText: {
    fontSize: 16,
    fontWeight: "600",
  },
  copyButton: {
    padding: Spacing.sm,
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.sm,
    gap: Spacing.sm,
  },
  errorText: {
    fontSize: 12,
    fontWeight: "500",
  },
  warningContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.sm,
    gap: Spacing.sm,
  },
  warningText: {
    fontSize: 12,
    fontWeight: "500",
  },
  codeScroll: {
    maxHeight: 400,
  },
  codeContainer: {
    padding: Spacing.md,
  },
  codeLine: {
    flexDirection: "row",
    marginBottom: 2,
  },
  lineNumber: {
    marginRight: Spacing.md,
    fontSize: 13,
    fontFamily: "monospace",
  },
  codeText: {
    fontSize: 13,
    lineHeight: 20,
  },
});
