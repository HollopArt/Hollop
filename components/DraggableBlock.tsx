import { StyleSheet, View, Pressable, TextInput } from "react-native";
import { Feather } from "@expo/vector-icons";
import { ThemedText } from "./ThemedText";
import { BorderRadius, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/useTheme";
import { BlockDefinition } from "@/types/blocks";
import { useState } from "react";

interface DraggableBlockProps {
  block: BlockDefinition;
  onPress?: () => void;
  isPlaced?: boolean;
  params?: any;
  onParamsChange?: (params: any) => void;
}

export function DraggableBlock({
  block,
  onPress,
  isPlaced = false,
  params,
  onParamsChange,
}: DraggableBlockProps) {
  const { colors } = useTheme();
  const [inputValue, setInputValue] = useState(params?.value || params?.variableName || params?.condition || params?.iterations?.toString() || "");

  const getCategoryColor = () => {
    switch (block.category) {
      case "control":
        return colors.controlFlowBg;
      case "data":
        return colors.dataBg;
      case "operations":
        return colors.operationsBg;
      case "output":
        return colors.outputBg;
      default:
        return colors.backgroundSecondary;
    }
  };

  const handleInputChange = (text: string) => {
    setInputValue(text);
    if (onParamsChange) {
      const newParams: any = {};
      if (block.paramType === "number") {
        newParams.iterations = parseInt(text, 10) || 1;
      } else if (block.type === "input_number") {
        newParams.variableName = text;
      } else if (block.type === "if") {
        newParams.condition = text;
      } else {
        newParams.value = text;
      }
      onParamsChange(newParams);
    }
  };

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.block,
        isPlaced && styles.placedBlock,
        {
          backgroundColor: getCategoryColor(),
          opacity: pressed ? 0.7 : 1,
          transform: [{ scale: pressed ? 0.95 : 1 }],
        },
      ]}
    >
      <View style={styles.blockHeader}>
        <Feather name={block.icon as any} size={20} color={colors.text} />
        <ThemedText style={styles.blockLabel}>{block.label}</ThemedText>
      </View>
      {block.hasParams && isPlaced ? (
        <TextInput
          value={inputValue}
          onChangeText={handleInputChange}
          placeholder={block.paramLabel}
          placeholderTextColor={colors.textSecondary}
          style={[
            styles.paramInput,
            {
              backgroundColor: colors.backgroundDefault,
              color: colors.text,
              borderColor: colors.textSecondary,
            },
          ]}
          keyboardType={block.paramType === "number" ? "numeric" : "default"}
        />
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  block: {
    borderRadius: BorderRadius.sm,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    minHeight: 56,
    justifyContent: "center",
  },
  placedBlock: {
    marginBottom: 0,
  },
  blockHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  blockLabel: {
    fontSize: 14,
    fontWeight: "600",
  },
  paramInput: {
    marginTop: Spacing.sm,
    padding: Spacing.sm,
    borderRadius: BorderRadius.xs,
    borderWidth: 1,
    fontSize: 12,
  },
});
