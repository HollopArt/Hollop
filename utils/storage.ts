import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEYS = {
  USER_NAME: "@codeblocks_user_name",
  THEME_MODE: "@codeblocks_theme_mode",
  ANIMATION_SPEED: "@codeblocks_animation_speed",
  CODE_FONT_SIZE: "@codeblocks_code_font_size",
  TUTORIAL_PROGRESS: "@codeblocks_tutorial_progress",
  WORKSPACE_BLOCKS: "@codeblocks_workspace_blocks",
  CURRENT_TUTORIAL: "@codeblocks_current_tutorial",
};

export const storage = {
  async getUserName(): Promise<string> {
    try {
      const name = await AsyncStorage.getItem(STORAGE_KEYS.USER_NAME);
      return name || "Programmer";
    } catch {
      return "Programmer";
    }
  },

  async setUserName(name: string): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.USER_NAME, name);
    } catch (error) {
      console.error("Failed to save user name:", error);
    }
  },

  async getThemeMode(): Promise<"light" | "dark" | "auto"> {
    try {
      const mode = await AsyncStorage.getItem(STORAGE_KEYS.THEME_MODE);
      return (mode as "light" | "dark" | "auto") || "auto";
    } catch {
      return "auto";
    }
  },

  async setThemeMode(mode: "light" | "dark" | "auto"): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.THEME_MODE, mode);
    } catch (error) {
      console.error("Failed to save theme mode:", error);
    }
  },

  async getAnimationSpeed(): Promise<number> {
    try {
      const speed = await AsyncStorage.getItem(STORAGE_KEYS.ANIMATION_SPEED);
      return speed ? parseFloat(speed) : 1.0;
    } catch {
      return 1.0;
    }
  },

  async setAnimationSpeed(speed: number): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.ANIMATION_SPEED, speed.toString());
    } catch (error) {
      console.error("Failed to save animation speed:", error);
    }
  },

  async getCodeFontSize(): Promise<number> {
    try {
      const size = await AsyncStorage.getItem(STORAGE_KEYS.CODE_FONT_SIZE);
      return size ? parseInt(size, 10) : 13;
    } catch {
      return 13;
    }
  },

  async setCodeFontSize(size: number): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.CODE_FONT_SIZE, size.toString());
    } catch (error) {
      console.error("Failed to save code font size:", error);
    }
  },

  async getTutorialProgress(): Promise<Record<string, boolean>> {
    try {
      const progress = await AsyncStorage.getItem(STORAGE_KEYS.TUTORIAL_PROGRESS);
      return progress ? JSON.parse(progress) : {};
    } catch {
      return {};
    }
  },

  async setTutorialProgress(progress: Record<string, boolean>): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.TUTORIAL_PROGRESS, JSON.stringify(progress));
    } catch (error) {
      console.error("Failed to save tutorial progress:", error);
    }
  },

  async getWorkspaceBlocks(): Promise<any[]> {
    try {
      const blocks = await AsyncStorage.getItem(STORAGE_KEYS.WORKSPACE_BLOCKS);
      return blocks ? JSON.parse(blocks) : [];
    } catch {
      return [];
    }
  },

  async setWorkspaceBlocks(blocks: any[]): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.WORKSPACE_BLOCKS, JSON.stringify(blocks));
    } catch (error) {
      console.error("Failed to save workspace blocks:", error);
    }
  },

  async getCurrentTutorial(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(STORAGE_KEYS.CURRENT_TUTORIAL);
    } catch {
      return null;
    }
  },

  async setCurrentTutorial(tutorialId: string | null): Promise<void> {
    try {
      if (tutorialId) {
        await AsyncStorage.setItem(STORAGE_KEYS.CURRENT_TUTORIAL, tutorialId);
      } else {
        await AsyncStorage.removeItem(STORAGE_KEYS.CURRENT_TUTORIAL);
      }
    } catch (error) {
      console.error("Failed to save current tutorial:", error);
    }
  },

  async clearAll(): Promise<void> {
    try {
      await AsyncStorage.multiRemove(Object.values(STORAGE_KEYS));
    } catch (error) {
      console.error("Failed to clear storage:", error);
    }
  },
};
