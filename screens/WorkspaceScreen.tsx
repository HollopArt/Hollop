import { StyleSheet, View, Pressable, Alert, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Feather } from "@expo/vector-icons";
import { useState, useEffect, useRef } from "react";
import * as Haptics from "expo-haptics";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";

import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { BlockPalette } from "@/components/BlockPalette";
import { DraggableBlock } from "@/components/DraggableBlock";
import { CodeViewer } from "@/components/CodeViewer";
import { FloatingActionButton } from "@/components/FloatingActionButton";
import { Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/useTheme";
import { BlockType, BLOCK_DEFINITIONS, PlacedBlock } from "@/types/blocks";
import { RootStackParamList } from "@/navigation/RootStackNavigator";
import { generateCSharpCode } from "@/utils/codeGenerator";
import { TUTORIALS } from "@/types/tutorials";
import { storage } from "@/utils/storage";

type NavigationProp = NativeStackNavigationProp<RootStackParamList, "Workspace">;

export default function WorkspaceScreen() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProp>();

  const [placedBlocks, setPlacedBlocks] = useState<PlacedBlock[]>([]);
  const [currentTutorialId, setCurrentTutorialId] = useState<string | null>(null);
  const [showCodeViewer, setShowCodeViewer] = useState(false);
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
  const [dropTargetIndex, setDropTargetIndex] = useState<number | null>(null);
  
  const scrollViewRef = useRef<any>(null);
  const blockRefs = useRef<{ [key: string]: { y: number; height: number } }>({});

  useEffect(() => {
    loadWorkspaceState();

    const unsubscribe = navigation.addListener('focus', () => {
      loadWorkspaceState();
    });

    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    storage.setWorkspaceBlocks(placedBlocks);
  }, [placedBlocks]);

  const loadWorkspaceState = async () => {
    const blocks = await storage.getWorkspaceBlocks();
    const tutorialId = await storage.getCurrentTutorial();
    setPlacedBlocks(blocks);
    setCurrentTutorialId(tutorialId);
  };

  const codeResult = generateCSharpCode(placedBlocks);

  const handleBlockSelect = (blockType: BlockType) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const newBlock: PlacedBlock = {
      id: `${blockType}_${Date.now()}`,
      type: blockType,
      order: placedBlocks.length,
      params: {},
    };
    setPlacedBlocks([...placedBlocks, newBlock]);
  };

  const handleBlockRemove = (blockId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setPlacedBlocks(placedBlocks.filter((b) => b.id !== blockId));
  };

  const handleBlockParamsChange = (blockId: string, params: any) => {
    setPlacedBlocks(
      placedBlocks.map((b) => (b.id === blockId ? { ...b, params } : b))
    );
  };

  const handleStartDrag = (index: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setDraggingIndex(index);
    setDropTargetIndex(null);
  };

  const handleDropTargetHover = (targetIndex: number) => {
    if (draggingIndex === null) return;
    setDropTargetIndex(targetIndex);
  };

  const handleDrop = (targetIndex?: number) => {
    const finalTargetIndex = targetIndex !== undefined ? targetIndex : dropTargetIndex;
    
    if (draggingIndex === null || finalTargetIndex === null) {
      handleEndDrag();
      return;
    }
    
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    const newBlocks = [...placedBlocks];
    const [draggedBlock] = newBlocks.splice(draggingIndex, 1);
    
    const adjustedTargetIndex = draggingIndex < finalTargetIndex 
      ? finalTargetIndex - 1 
      : finalTargetIndex;
    
    newBlocks.splice(adjustedTargetIndex, 0, draggedBlock);
    const reorderedBlocks = newBlocks.map((block, i) => ({ ...block, order: i }));
    setPlacedBlocks(reorderedBlocks);
    
    setDraggingIndex(null);
    setDropTargetIndex(null);
  };

  const handleEndDrag = () => {
    if (draggingIndex !== null) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      setDraggingIndex(null);
      setDropTargetIndex(null);
    }
  };

  const handleClearAll = () => {
    Alert.alert(
      "Очистить всё?",
      "Вы уверены, что хотите удалить все блоки?",
      [
        { text: "Отмена", style: "cancel" },
        {
          text: "Очистить",
          style: "destructive",
          onPress: () => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            setPlacedBlocks([]);
          },
        },
      ]
    );
  };

  const handleValidate = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    
    if (placedBlocks.length === 0) {
      navigation.navigate("ValidationResults", {
        success: false,
        message: "Рабочая область пуста",
        hint: "Добавьте блоки из палитры слева",
      });
      return;
    }

    if (codeResult.errors.length > 0) {
      navigation.navigate("ValidationResults", {
        success: false,
        message: "В программе есть ошибки",
        hint: codeResult.errors[0].message,
      });
      return;
    }

    if (currentTutorialId) {
      const tutorial = TUTORIALS.find((t) => t.id === currentTutorialId);
      if (tutorial) {
        const result = tutorial.validationFunction(placedBlocks);
        navigation.navigate("ValidationResults", result);
        
        if (result.success) {
          storage.getTutorialProgress().then((progress) => {
            progress[currentTutorialId] = true;
            storage.setTutorialProgress(progress);
          });
        }
      }
    } else {
      navigation.navigate("ValidationResults", {
        success: true,
        message: "Программа корректна!",
        hint: "Код успешно сгенерирован без ошибок",
      });
    }
  };

  const currentTutorial = currentTutorialId
    ? TUTORIALS.find((t) => t.id === currentTutorialId)
    : null;

  return (
    <ThemedView style={styles.container}>
      <View
        style={[
          styles.topBar,
          {
            paddingTop: insets.top + 60,
            backgroundColor: colors.backgroundDefault + "F0",
          },
        ]}
      >
        <Pressable
          onPress={() => navigation.navigate("TutorialSelection")}
          style={({ pressed }) => [
            styles.tutorialButton,
            {
              backgroundColor: colors.backgroundSecondary,
              opacity: pressed ? 0.7 : 1,
            },
          ]}
        >
          <ThemedText style={styles.tutorialButtonText}>
            {currentTutorial ? currentTutorial.title : "Выбрать задание"}
          </ThemedText>
          <Feather name="chevron-down" size={16} color={colors.text} />
        </Pressable>
        
        <View style={styles.topBarButtons}>
          {currentTutorial ? (
            <Pressable
              onPress={() => {
                Alert.alert(
                  "Подсказка",
                  currentTutorial.description + "\n\nНеобходимые блоки:\n" +
                  currentTutorial.requiredBlocks
                    .map(bt => BLOCK_DEFINITIONS[bt]?.label || bt)
                    .join("\n• "),
                  [{ text: "Понятно" }]
                );
              }}
              style={({ pressed }) => [
                styles.hintButton,
                {
                  backgroundColor: colors.warning,
                  opacity: pressed ? 0.7 : 1,
                },
              ]}
            >
              <Feather name="help-circle" size={20} color="#FFFFFF" />
            </Pressable>
          ) : null}
          
          <Pressable
            onPress={() => setShowCodeViewer(!showCodeViewer)}
            style={({ pressed }) => [
              styles.codeButton,
              {
                backgroundColor: colors.primary,
                opacity: pressed ? 0.7 : 1,
              },
            ]}
          >
            <Feather name="code" size={20} color="#FFFFFF" />
            {codeResult.errors.length > 0 ? (
              <View style={[styles.badge, { backgroundColor: colors.error }]}>
                <ThemedText style={styles.badgeText}>
                  {codeResult.errors.length}
                </ThemedText>
              </View>
            ) : null}
          </Pressable>
        </View>
      </View>

      {draggingIndex !== null ? (
        <Pressable
          onPress={handleEndDrag}
          style={[styles.dragBanner, { backgroundColor: colors.primary }]}
        >
          <Feather name="move" size={20} color="#FFFFFF" />
          <ThemedText style={styles.dragBannerText}>
            Нажмите на место вставки или сюда для отмены
          </ThemedText>
        </Pressable>
      ) : null}

      <View style={styles.workspaceContainer}>
        <View style={[styles.paletteContainer, { borderRightColor: colors.backgroundTertiary }]}>
          <BlockPalette onBlockSelect={handleBlockSelect} />
        </View>

        <KeyboardAwareScrollView 
          ref={scrollViewRef}
          style={styles.canvas} 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          bottomOffset={Platform.OS === 'ios' ? 80 : 40}
        >
          <View style={styles.canvasContent}>
            {placedBlocks.length === 0 ? (
              <View style={styles.emptyState}>
                <Feather name="layers" size={48} color={colors.textSecondary} />
                <ThemedText style={[styles.emptyText, { color: colors.textSecondary }]}>
                  Перетащите блоки сюда
                </ThemedText>
              </View>
            ) : (
              <>
{placedBlocks.map((block, index) => {
                  // Вычисляем уровень вложенности
                  let nestLevel = 0;
                  for (let i = 0; i < index; i++) {
                    if (placedBlocks[i].type === BlockType.LOOP || placedBlocks[i].type === BlockType.IF) {
                      nestLevel++;
                    } else if (placedBlocks[i].type === BlockType.END_BLOCK) {
                      nestLevel--;
                    }
                  }
                  
                  const isDragging = draggingIndex === index;
                  const isDropTarget = dropTargetIndex === index;
                  const showDropZone = draggingIndex !== null && draggingIndex !== index;
                  
                  return (
                    <View key={block.id}>
                      {showDropZone && (
                        <Pressable
                          onPress={() => handleDrop(index)}
                          style={[
                            styles.dropZone,
                            { marginLeft: nestLevel * 20 },
                            isDropTarget && styles.dropZoneActive,
                          ]}
                        >
                          <View style={[styles.dropZoneLine, { backgroundColor: isDropTarget ? colors.primary : colors.backgroundTertiary }]} />
                          {isDropTarget && (
                            <ThemedText style={[styles.dropZoneText, { color: colors.primary }]}>
                              Вставить здесь
                            </ThemedText>
                          )}
                        </Pressable>
                      )}
                      
                      <View 
                        style={[
                          styles.placedBlockContainer,
                          { marginLeft: nestLevel * 20 },
                          isDragging && styles.hiddenBlock,
                        ]}
                      >
                        <View style={styles.blockWrapper}>
                          <Pressable
                            onLongPress={() => handleStartDrag(index)}
                            delayLongPress={200}
                            style={[
                              styles.placedBlock,
                              isDragging && styles.draggingBlock,
                            ]}
                          >
                            <View style={styles.dragHandle}>
                              <Feather name="menu" size={16} color={colors.textSecondary} />
                            </View>
                            <View style={styles.blockContent}>
                              <DraggableBlock
                                block={BLOCK_DEFINITIONS[block.type]}
                                isPlaced
                                params={block.params}
                                onParamsChange={(params) => handleBlockParamsChange(block.id, params)}
                              />
                            </View>
                          </Pressable>
                          <Pressable
                            onPress={() => handleBlockRemove(block.id)}
                            style={({ pressed }) => [
                              styles.removeButton,
                              {
                                backgroundColor: colors.error,
                                opacity: pressed ? 0.7 : 1,
                              },
                            ]}
                          >
                            <Feather name="x" size={16} color="#FFFFFF" />
                          </Pressable>
                        </View>
                      </View>
                    </View>
                  );
                })}
                
                {/* Drop zone after last block */}
                {draggingIndex !== null && (
                  <Pressable
                    onPress={() => handleDrop(placedBlocks.length)}
                    style={[
                      styles.dropZone,
                      dropTargetIndex === placedBlocks.length && styles.dropZoneActive,
                    ]}
                  >
                    <View style={[styles.dropZoneLine, { backgroundColor: dropTargetIndex === placedBlocks.length ? colors.primary : colors.backgroundTertiary }]} />
                    {dropTargetIndex === placedBlocks.length && (
                      <ThemedText style={[styles.dropZoneText, { color: colors.primary }]}>
                        Вставить в конец
                      </ThemedText>
                    )}
                  </Pressable>
                )}
              </>
            )}
          </View>
        </KeyboardAwareScrollView>
      </View>

      {showCodeViewer ? (
        <View style={styles.codeViewerContainer}>
          <CodeViewer
            code={codeResult.code}
            errors={codeResult.errors}
            warnings={codeResult.warnings}
          />
        </View>
      ) : null}

      <FloatingActionButton
        icon="trash-2"
        onPress={handleClearAll}
        variant="danger"
        position="left"
      />
      <FloatingActionButton
        icon="play"
        onPress={handleValidate}
        variant="primary"
        position="right"
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  tutorialButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: 8,
    gap: Spacing.sm,
    flex: 1,
    marginRight: Spacing.sm,
  },
  tutorialButtonText: {
    fontSize: 14,
    fontWeight: "500",
  },
  topBarButtons: {
    flexDirection: "row",
    gap: Spacing.sm,
  },
  hintButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },
  codeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  badge: {
    position: "absolute",
    top: -4,
    right: -4,
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
  },
  badgeText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "600",
  },
  dragBanner: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    gap: Spacing.sm,
  },
  dragBannerText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "500",
    flex: 1,
  },
  workspaceContainer: {
    flex: 1,
    flexDirection: "row",
  },
  paletteContainer: {
    width: "30%",
    borderRightWidth: 1,
  },
  canvas: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 800,
  },
  canvasContent: {
    padding: Spacing.lg,
    minHeight: "100%",
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: Spacing["5xl"],
  },
  emptyText: {
    marginTop: Spacing.md,
    fontSize: 16,
  },
  placedBlockContainer: {
    marginBottom: Spacing.sm,
  },
  blockWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  placedBlock: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  dragHandle: {
    width: 32,
    height: 56,
    justifyContent: "center",
    alignItems: "center",
    marginRight: Spacing.xs,
  },
  blockContent: {
    flex: 1,
  },
  hiddenBlock: {
    opacity: 0.3,
  },
  draggingBlock: {
    opacity: 0.95,
    transform: [{ scale: 1.05 }, { translateY: -4 }],
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
  },
  dropZone: {
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.xs,
  },
  dropZoneLine: {
    height: 2,
    width: "100%",
    borderRadius: 1,
  },
  dropZoneActive: {
    height: 50,
  },
  dropZoneText: {
    fontSize: 12,
    fontWeight: "600",
    marginTop: Spacing.xs,
  },
  removeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: Spacing.sm,
  },
  codeViewerContainer: {
    maxHeight: "40%",
  },
});

