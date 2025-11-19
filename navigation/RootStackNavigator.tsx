import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Feather } from "@expo/vector-icons";
import { Pressable } from "react-native";

import WorkspaceScreen from "@/screens/WorkspaceScreen";
import TutorialSelectionScreen from "@/screens/TutorialSelectionScreen";
import SettingsScreen from "@/screens/SettingsScreen";
import ValidationResultsScreen from "@/screens/ValidationResultsScreen";
import { HeaderTitle } from "@/components/HeaderTitle";
import { getCommonScreenOptions } from "./screenOptions";
import { useTheme } from "@/hooks/useTheme";

export type RootStackParamList = {
  Workspace: undefined;
  TutorialSelection: undefined;
  Settings: undefined;
  ValidationResults: { success: boolean; message: string; hint?: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootStackNavigator() {
  const { theme, isDark } = useTheme();

  return (
    <Stack.Navigator screenOptions={getCommonScreenOptions({ theme, isDark })}>
      <Stack.Screen
        name="Workspace"
        component={WorkspaceScreen}
        options={({ navigation }) => ({
          headerTransparent: true,
          headerTitle: () => <HeaderTitle title="CodeBlocks" />,
          headerLeft: () => (
            <Pressable
              onPress={() => navigation.navigate("Settings")}
              style={({ pressed }) => ({
                opacity: pressed ? 0.5 : 1,
                padding: 8,
              })}
            >
              <Feather name="menu" size={24} color={theme.text} />
            </Pressable>
          ),
        })}
      />
      <Stack.Screen
        name="TutorialSelection"
        component={TutorialSelectionScreen}
        options={{
          presentation: "modal",
          title: "Обучающие задания",
        }}
      />
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          presentation: "modal",
          title: "Настройки",
        }}
      />
      <Stack.Screen
        name="ValidationResults"
        component={ValidationResultsScreen}
        options={{
          presentation: "transparentModal",
          headerShown: false,
          animation: "fade",
        }}
      />
    </Stack.Navigator>
  );
}
