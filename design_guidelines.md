# Design Guidelines: Visual Programming Block Builder

## Architecture Decisions

### Authentication
**No Auth Required** - This is a single-user educational tool with local data storage.
- Include a **Settings screen** accessible from the main workspace header with:
  - User avatar (generate 1 colorful geometric avatar preset)
  - Display name field (defaults to "Programmer")
  - App preferences: Theme toggle (Light/Dark), Animation speed, Code font size
  - About section with app version and tutorial reset option

### Navigation
**Stack-Only Navigation** - Linear educational flow with modal overlays
- Primary screen: **Workspace** (main drag-and-drop area)
- Modal screens:
  - **Tutorial Selection** (overlay on first launch, accessible from menu)
  - **Code Viewer** (bottom sheet that slides up to show generated C#)
  - **Settings** (right drawer or full modal)
  - **Validation Results** (centered modal with success/error feedback)

### Screen Specifications

#### 1. Workspace Screen
**Purpose**: Main canvas where users build programs by dragging blocks

**Layout**:
- Header: Custom transparent header
  - Left: Menu button (hamburger icon) → opens Settings drawer
  - Center: Current tutorial title or "Freestyle Mode"
  - Right: Code viewer toggle button (</> icon with badge showing error count if any)
- Main Content Area:
  - **Left Side Panel** (30% width, scrollable): Block palette with categories
  - **Center Canvas** (60% width, scrollable in both directions): Drop zone for blocks
  - **Bottom Panel** (slides up): C# code viewer with syntax highlighting
- Footer: Floating Action Buttons
  - Clear All (trash icon, left side)
  - Run/Validate (play icon, right side, primary color)
  
**Safe Area Insets**:
- Top: insets.top + Spacing.xl (transparent header)
- Bottom: insets.bottom + Spacing.xl (FABs are floating)
- Sides: Spacing.lg

#### 2. Tutorial Selection Modal
**Purpose**: Choose from 3+ programming challenges

**Layout**:
- Header: Default modal header
  - Left: Close button (X icon)
  - Title: "Обучающие задания"
- Main Content: Scrollable list of tutorial cards
  - Each card shows: Title, difficulty badge, description, progress indicator, "Начать" button
- Footer: "Freestyle Mode" button (outline style)

**Safe Area Insets**:
- Top: Spacing.xl (modal has default header)
- Bottom: insets.bottom + Spacing.xl

#### 3. Code Viewer Bottom Sheet
**Purpose**: Display generated C# code in real-time

**Layout**:
- Drag handle at top (horizontal pill indicator)
- Header: "Сгенерированный код" with copy button
- Main Content: Scrollable code editor view with syntax highlighting
  - Error annotations inline (red underlines with tooltip)
- States: Collapsed (shows first 3 lines), Half-expanded (50% screen), Full-screen

#### 4. Validation Results Modal
**Purpose**: Show task completion feedback

**Layout**:
- Centered card (80% screen width)
- Icon: Large success (checkmark) or error (X) icon with animation
- Title: "Отлично!" or "Ошибка в программе"
- Body: Detailed feedback (scrollable if long)
- Actions: "Понятно" button (primary) and "Подсказка" (if failed, text button)

## Design System

### Color Palette
**Primary Theme** (Programming/Educational):
- Primary: `#6366F1` (Indigo) - for CTAs, active blocks, success states
- Secondary: `#8B5CF6` (Purple) - for accents, special blocks
- Error: `#EF4444` (Red) - validation errors, destructive actions
- Warning: `#F59E0B` (Amber) - warnings in code
- Success: `#10B981` (Green) - validation success
- Background: `#F9FAFB` (Light) / `#111827` (Dark)
- Surface: `#FFFFFF` (Light) / `#1F2937` (Dark) - for cards, modals
- Text Primary: `#111827` (Light) / `#F9FAFB` (Dark)
- Text Secondary: `#6B7280`

**Block Category Colors** (subtle backgrounds with border):
- Control Flow (if, loop): `#DBEAFE` (Blue tint)
- Data (variable, input): `#FEF3C7` (Yellow tint)
- Operations (add, subtract): `#D1FAE5` (Green tint)
- Output (print, display): `#E0E7FF` (Indigo tint)

### Typography
- **Headers**: System Bold, 20-24px
- **Body**: System Regular, 16px
- **Block Labels**: System Medium, 14px
- **Code**: Monospace (e.g., 'Courier New'), 13px
- **Captions**: System Regular, 12px

### Visual Design

**Block Components**:
- Shape: Rounded rectangles (borderRadius: 12)
- Size: Minimum touch target 56×56 dp
- Shadow for floating/dragging state:
  - shadowOffset: {width: 0, height: 4}
  - shadowOpacity: 0.15
  - shadowRadius: 8
- No shadow when docked in canvas
- **Connector Design**: Puzzle-piece style visual connectors (interlocking tabs/slots) to show valid connection points
- **Active State**: Pulse animation + scale(1.05) when dragging
- **Hover/Press**: Slight elevation increase + brightness(1.1)

**Drag & Drop Feedback**:
- **Dragging**: Block becomes 90% opaque, follows finger with slight delay (spring animation)
- **Valid Drop Zone**: Green outline appears with scale pulse animation
- **Invalid Drop Zone**: Red outline + shake animation
- **Snap Behavior**: Magnetic snap when within 20dp of valid connection point

**Code Viewer**:
- Background: `#1E293B` (dark code editor style)
- Syntax highlighting:
  - Keywords: `#C792EA` (purple)
  - Strings: `#C3E88D` (green)
  - Numbers: `#F78C6C` (orange)
  - Comments: `#676E95` (gray)
- Error annotations: Red wavy underline with inline error message in tooltip

**Interactive Feedback**:
- All touchable elements: Scale(0.95) on press + haptic feedback
- FABs: Drop shadow (shadowOffset: {width: 0, height: 2}, shadowOpacity: 0.10, shadowRadius: 2)
- Buttons: Ripple effect (Android standard)
- Success animations: Confetti particle effect (lightweight)
- Error animations: Shake (3 times, 10dp amplitude)

### Accessibility
- Minimum touch targets: 48×48 dp
- Color contrast ratio: 4.5:1 for text, 3:1 for UI components
- Screen reader labels for all interactive elements
- Alternative text for visual programming blocks
- Haptic feedback for drag-and-drop actions
- Support for TalkBack gestures
- Larger text mode support (scales up to 200%)

### Critical Assets

**Generated Assets** (8 total):
1. **Tutorial Task Icons** (3): Simple line art representing each task
   - Task 1: Calculator icon (basic arithmetic)
   - Task 2: Loop/cycle icon (iteration)
   - Task 3: Branching path icon (conditionals)

2. **Block Category Icons** (4):
   - Control flow: Diamond/decision icon
   - Data: Variable 'x' icon
   - Operations: Plus/minus icon
   - Output: Speech bubble/print icon

3. **User Avatar Preset** (1): Geometric pattern with coding theme (brackets, semicolons arranged artistically)

**System Icons**: Use Feather icons from @expo/vector-icons for all standard actions (menu, settings, play, trash, copy, close, check, alert-circle)

### Tutorial Tasks

**Task 1: "Калькулятор"**
- Goal: Input two numbers, add them, output result
- Required blocks: Start → Input(a) → Input(b) → Add(a,b) → Output → End
- Validation: Checks sequence order and variable usage

**Task 2: "Цикл суммирования"**
- Goal: Sum numbers from 1 to 10 using loop
- Required blocks: Start → Variable(sum=0) → Loop(10) → Add(sum, i) → Output(sum) → End
- Validation: Checks loop implementation and accumulator pattern

**Task 3: "Проверка чётности"**
- Goal: Input number, check if even/odd, output result
- Required blocks: Start → Input(n) → If(n%2==0) → Output("Чётное")/Output("Нечётное") → End
- Validation: Checks conditional branching and modulo operation