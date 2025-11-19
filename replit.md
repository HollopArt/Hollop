# CodeBlocks - Visual Programming Block Builder

## Overview

CodeBlocks is a React Native educational application that teaches programming concepts through a visual block-based interface. Users drag and drop programming blocks to construct C# programs, with real-time code generation and validation. The app targets beginners learning fundamental programming concepts like variables, control flow, and basic operations through interactive tutorials.

The application is built with Expo and React Native, supporting iOS, Android, and Web platforms. It features a single-screen workspace with collapsible panels for block selection and code viewing, tutorial-based learning paths, and a freestyle mode for open experimentation.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React Native with Expo SDK 54
- Uses React Native's new architecture (enabled via `newArchEnabled: true`)
- React 19.1.0 with experimental React Compiler enabled
- Cross-platform support (iOS, Android, Web) with platform-specific optimizations

**Navigation Pattern**: Stack-based navigation with modal overlays
- Primary navigation uses `@react-navigation/native-stack` for performance
- Main screens: Workspace (primary), TutorialSelection (modal), Settings (modal), ValidationResults (centered modal)
- No tab-based navigation; linear educational flow prioritized
- Custom transparent headers with blur effects on iOS

**UI Component Strategy**: Custom themed components over third-party UI libraries
- Theme system with light/dark mode support via `useColorScheme` hook
- Platform-specific safe area handling with `react-native-safe-area-context`
- Custom components: ThemedView, ThemedText, Button, Card, FloatingActionButton
- Reusable screen wrappers: ScreenScrollView, ScreenKeyboardAwareScrollView, ScreenFlatList

**Animation & Gestures**:
- `react-native-reanimated` (~4.1.1) for performant animations
- `react-native-gesture-handler` (~2.28.0) for gesture recognition
- Spring-based animations with consistent configuration across components
- Haptic feedback via `expo-haptics` for tactile user interactions

**Visual Design System**:
- Centralized theme constants in `/constants/theme.ts`
- Color scheme includes category-specific colors (controlFlowBg, dataBg, operationsBg, outputBg)
- Standardized spacing, border radius, and typography scales
- Code editor uses dark theme (`#1E293B`/`#0F172A`) regardless of app theme

### State Management

**Local State Only**: No global state management library
- Component-level state with React hooks (useState, useEffect)
- Navigation state managed by React Navigation
- Workspace blocks stored in component state and persisted to AsyncStorage

**Data Persistence**: AsyncStorage for local-only storage
- User preferences: name, theme mode, animation speed, code font size
- Tutorial progress tracking (completion status per tutorial)
- Workspace state: current tutorial ID and placed blocks array
- No authentication required (single-user educational tool)

### Block System Architecture

**Block Definitions**: Type-safe block system with TypeScript enums
- BlockType enum defines all available blocks (START, END, INPUT_NUMBER, VARIABLE, operations, control flow)
- BlockCategory enum groups blocks (CONTROL, DATA, OPERATIONS, OUTPUT)
- Block definitions include metadata: label, icon, description, parameter configuration
- PlacedBlock interface tracks instantiated blocks with unique IDs, order, and runtime parameters

**Code Generation**: Client-side C# code generation
- Transforms PlacedBlock array into syntactically valid C# code
- Validation includes: program structure checks, variable usage tracking, parameter validation
- Returns CodeGenerationResult with generated code, errors array, and warnings array
- Error/warning objects include line numbers and block IDs for highlighting

**Tutorial Validation**: Custom validation functions per tutorial
- Each Tutorial defines required blocks and validation logic
- Validation returns success boolean with user-friendly messages and hints
- Tutorial progress persisted to AsyncStorage upon successful completion

### Screen Architecture

**WorkspaceScreen** (Primary):
- Three-panel layout: BlockPalette (left 30%), Canvas (center 60%), CodeViewer (bottom slide-up)
- Floating Action Buttons: Clear All (left), Run/Validate (right)
- Transparent header with menu button (opens Settings) and code viewer toggle
- Real-time code generation on block state changes

**Modal Screens**:
- TutorialSelection: Scrollable list of TutorialCard components with difficulty indicators
- Settings: User profile (avatar, name), app preferences, tutorial reset
- ValidationResults: Centered modal with success/error feedback and animated icons

### Internationalization

**Language**: Russian (primary)
- All UI text, error messages, and tutorials in Russian (Cyrillic)
- Label mappings: "Управление" (Control), "Данные" (Data), "Операции" (Operations), "Вывод" (Output)
- No i18n library; hardcoded strings suitable for educational context

### Development Tooling

**Build Configuration**:
- Babel with module resolver for `@/` path aliasing
- EAS Build configuration for development, preview (APK), and production (AAB)
- Platform-specific Replit integration via environment variables

**Code Quality**:
- ESLint with Expo config and Prettier integration
- TypeScript strict mode enabled
- Format scripts for automated code styling

## External Dependencies

### Core Framework
- **expo** (^54.0.25): Meta-framework for React Native development
- **react-native** (0.81.5): Core mobile framework
- **react** (19.1.0) / **react-dom** (19.1.0): Latest React with experimental compiler

### Navigation & Routing
- **@react-navigation/native** (^7.1.8): Navigation container and state management
- **@react-navigation/native-stack** (^7.3.16): Native stack navigator for iOS/Android
- **@react-navigation/elements** (^2.6.3): Shared navigation UI components
- **react-native-screens** (~4.16.0): Native screen primitives for navigation

### UI & Interaction
- **react-native-gesture-handler** (~2.28.0): Cross-platform gesture system
- **react-native-reanimated** (~4.1.1): Performant animation library with worklets
- **react-native-safe-area-context** (~5.6.0): Safe area inset handling
- **expo-haptics** (~15.0.7): Haptic feedback for iOS/Android
- **expo-blur** (~15.0.7): Native blur effects (iOS header backgrounds)
- **expo-symbols** (~1.0.7): SF Symbols support (iOS icons)

### Assets & Media
- **expo-image** (~3.0.10): Optimized image component with caching
- **@expo/vector-icons** (^15.0.2): Icon library (Feather icons used extensively)
- **expo-splash-screen** (~31.0.10): Splash screen management
- **expo-font** (~14.0.9): Custom font loading

### Storage & Utilities
- **@react-native-async-storage/async-storage** (^2.2.0): Key-value storage for persistence
- **expo-clipboard** (^8.0.7): Clipboard access for code copying
- **expo-constants** (~18.0.9): App constants and configuration
- **expo-linking** (~8.0.8): Deep linking support
- **expo-web-browser** (~15.0.9): In-app browser functionality

### Keyboard Management
- **react-native-keyboard-controller** (1.18.5): Advanced keyboard handling
- Platform-specific workarounds: KeyboardAwareScrollView falls back to ScreenScrollView on web

### Platform-Specific
- **react-native-web** (~0.21.0): Web platform compatibility layer
- **expo-system-ui** (~6.0.8): System UI styling (status bar, navigation bar)
- **expo-status-bar** (~3.0.8): Status bar configuration

### Development Tools
- **typescript** (~5.9.2): Type safety and IDE support
- **babel-plugin-module-resolver** (^5.0.2): Path alias resolution (`@/` → root)
- **eslint** + **prettier**: Code quality and formatting enforcement

### Notable Architectural Decisions

**No Database**: All data stored locally in AsyncStorage (educational single-user app)

**No Authentication**: Designed for offline, single-user educational use without user accounts

**No Backend Services**: Fully client-side application; code generation and validation run in-app

**Expo Managed Workflow**: Leverages Expo's managed services while enabling native builds via EAS

**Replit Integration**: Custom build scripts for Replit deployment with environment-specific domain handling