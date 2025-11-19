export enum BlockType {
  START = "start",
  END = "end",
  END_BLOCK = "end_block",
  INPUT_NUMBER = "input_number",
  VARIABLE = "variable",
  ADD = "add",
  SUBTRACT = "subtract",
  MULTIPLY = "multiply",
  DIVIDE = "divide",
  MODULO = "modulo",
  OUTPUT = "output",
  IF = "if",
  LOOP = "loop",
}

export enum BlockCategory {
  CONTROL = "control",
  DATA = "data",
  OPERATIONS = "operations",
  OUTPUT = "output",
}

export interface BlockDefinition {
  type: BlockType;
  category: BlockCategory;
  label: string;
  icon: string;
  description: string;
  hasParams: boolean;
  paramType?: "text" | "number" | "variable";
  paramLabel?: string;
}

export interface PlacedBlock {
  id: string;
  type: BlockType;
  order: number;
  params?: {
    value?: string;
    variableName?: string;
    condition?: string;
    iterations?: number;
  };
}

export const BLOCK_DEFINITIONS: Record<BlockType, BlockDefinition> = {
  [BlockType.START]: {
    type: BlockType.START,
    category: BlockCategory.CONTROL,
    label: "Начало",
    icon: "play",
    description: "Начало программы",
    hasParams: false,
  },
  [BlockType.END]: {
    type: BlockType.END,
    category: BlockCategory.CONTROL,
    label: "Конец",
    icon: "square",
    description: "Конец программы",
    hasParams: false,
  },
  [BlockType.INPUT_NUMBER]: {
    type: BlockType.INPUT_NUMBER,
    category: BlockCategory.DATA,
    label: "Ввести число",
    icon: "download",
    description: "Запросить число у пользователя",
    hasParams: true,
    paramType: "text",
    paramLabel: "Имя переменной",
  },
  [BlockType.VARIABLE]: {
    type: BlockType.VARIABLE,
    category: BlockCategory.DATA,
    label: "Переменная",
    icon: "box",
    description: "Объявить переменную со значением",
    hasParams: true,
    paramType: "text",
    paramLabel: "имя = значение",
  },
  [BlockType.ADD]: {
    type: BlockType.ADD,
    category: BlockCategory.OPERATIONS,
    label: "Сложить",
    icon: "plus",
    description: "Сложить два числа",
    hasParams: true,
    paramType: "text",
    paramLabel: "a + b = result",
  },
  [BlockType.SUBTRACT]: {
    type: BlockType.SUBTRACT,
    category: BlockCategory.OPERATIONS,
    label: "Вычесть",
    icon: "minus",
    description: "Вычесть одно число из другого",
    hasParams: true,
    paramType: "text",
    paramLabel: "a - b = result",
  },
  [BlockType.MULTIPLY]: {
    type: BlockType.MULTIPLY,
    category: BlockCategory.OPERATIONS,
    label: "Умножить",
    icon: "x",
    description: "Умножить два числа",
    hasParams: true,
    paramType: "text",
    paramLabel: "a * b = result",
  },
  [BlockType.DIVIDE]: {
    type: BlockType.DIVIDE,
    category: BlockCategory.OPERATIONS,
    label: "Разделить",
    icon: "divide",
    description: "Разделить одно число на другое",
    hasParams: true,
    paramType: "text",
    paramLabel: "a / b = result",
  },
  [BlockType.MODULO]: {
    type: BlockType.MODULO,
    category: BlockCategory.OPERATIONS,
    label: "Остаток",
    icon: "percent",
    description: "Получить остаток от деления",
    hasParams: true,
    paramType: "text",
    paramLabel: "a % b = result",
  },
  [BlockType.OUTPUT]: {
    type: BlockType.OUTPUT,
    category: BlockCategory.OUTPUT,
    label: "Вывести",
    icon: "upload",
    description: "Вывести значение",
    hasParams: true,
    paramType: "text",
    paramLabel: "значение",
  },
  [BlockType.IF]: {
    type: BlockType.IF,
    category: BlockCategory.CONTROL,
    label: "Если",
    icon: "git-branch",
    description: "Условный оператор",
    hasParams: true,
    paramType: "text",
    paramLabel: "условие",
  },
  [BlockType.LOOP]: {
    type: BlockType.LOOP,
    category: BlockCategory.CONTROL,
    label: "Цикл",
    icon: "repeat",
    description: "Повторить N раз",
    hasParams: true,
    paramType: "number",
    paramLabel: "повторений",
  },
  [BlockType.END_BLOCK]: {
    type: BlockType.END_BLOCK,
    category: BlockCategory.CONTROL,
    label: "Конец блока",
    icon: "corner-down-left",
    description: "Закрывает цикл или условие",
    hasParams: false,
  },
};