import { StyleSheet, View, ScrollView } from "react-native";
import { Image } from "expo-image";
import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";
import { DraggableBlock } from "./DraggableBlock";
import { BorderRadius, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/useTheme";
import { BLOCK_DEFINITIONS, BlockCategory, BlockType } from "@/types/blocks";
import { useState } from "react";

interface BlockPaletteProps {
  onBlockSelect: (blockType: BlockType) => void;
}

export function BlockPalette({ onBlockSelect }: BlockPaletteProps) {
  const { colors } = useTheme();
  const [expandedCategory, setExpandedCategory] = useState<BlockCategory | null>(
    BlockCategory.CONTROL
  );

  const blocksByCategory = Object.values(BLOCK_DEFINITIONS).reduce(
    (acc, block) => {
      if (!acc[block.category]) {
        acc[block.category] = [];
      }
      acc[block.category].push(block);
      return acc;
    },
    {} as Record<BlockCategory, typeof BLOCK_DEFINITIONS[BlockType][]>
  );

  const getCategoryIcon = (category: BlockCategory) => {
    const iconMap = {
      [BlockCategory.CONTROL]: require("@/assets/images/category-control.png"),
      [BlockCategory.DATA]: require("@/assets/images/category-data.png"),
      [BlockCategory.OPERATIONS]: require("@/assets/images/category-operations.png"),
      [BlockCategory.OUTPUT]: require("@/assets/images/category-output.png"),
    };
    return iconMap[category];
  };

  const getCategoryTitle = (category: BlockCategory) => {
    const titleMap = {
      [BlockCategory.CONTROL]: "Управление",
      [BlockCategory.DATA]: "Данные",
      [BlockCategory.OPERATIONS]: "Операции",
      [BlockCategory.OUTPUT]: "Вывод",
    };
    return titleMap[category];
  };

  return (
    <ThemedView style={styles.palette}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {Object.entries(blocksByCategory).map(([category, blocks]) => (
          <View key={category} style={styles.categorySection}>
            <ThemedView
              style={[
                styles.categoryHeader,
                { backgroundColor: colors.backgroundSecondary },
              ]}
            >
              <Image
                source={getCategoryIcon(category as BlockCategory)}
                style={styles.categoryIcon}
                contentFit="contain"
              />
              <ThemedText style={styles.categoryTitle}>
                {getCategoryTitle(category as BlockCategory)}
              </ThemedText>
            </ThemedView>
            <View style={styles.blocksContainer}>
              {blocks.map((block) => (
                <DraggableBlock
                  key={block.type}
                  block={block}
                  onPress={() => onBlockSelect(block.type)}
                />
              ))}
            </View>
          </View>
        ))}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  palette: {
    flex: 1,
    paddingTop: Spacing.md,
  },
  categorySection: {
    marginBottom: Spacing.lg,
  },
  categoryHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.sm,
    borderRadius: BorderRadius.xs,
    marginBottom: Spacing.sm,
    marginHorizontal: Spacing.sm,
  },
  categoryIcon: {
    width: 24,
    height: 24,
    marginRight: Spacing.sm,
  },
  categoryTitle: {
    fontSize: 14,
    fontWeight: "600",
  },
  blocksContainer: {
    paddingHorizontal: Spacing.sm,
  },
});
