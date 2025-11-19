import { BlockType } from "./blocks";

export interface Tutorial {
  id: string;
  title: string;
  difficulty: "easy" | "medium" | "hard";
  description: string;
  iconAsset: string;
  requiredBlocks: BlockType[];
  validationFunction: (blocks: any[]) => { success: boolean; message: string; hint?: string };
}

export const TUTORIALS: Tutorial[] = [
  {
    id: "calculator",
    title: "Калькулятор",
    difficulty: "easy",
    description: "Введите два числа, сложите их и выведите результат",
    iconAsset: "task-calculator",
    requiredBlocks: [
      BlockType.START,
      BlockType.INPUT_NUMBER,
      BlockType.INPUT_NUMBER,
      BlockType.ADD,
      BlockType.OUTPUT,
      BlockType.END,
    ],
    validationFunction: (blocks) => {
      if (blocks.length < 6) {
        return {
          success: false,
          message: "Программа неполная",
          hint: "Вам нужно как минимум 6 блоков: Начало, два блока Ввести число, Сложить, Вывести и Конец",
        };
      }

      if (blocks[0]?.type !== BlockType.START) {
        return {
          success: false,
          message: "Программа должна начинаться с блока 'Начало'",
          hint: "Первым блоком должен быть 'Начало'",
        };
      }

      if (blocks[blocks.length - 1]?.type !== BlockType.END) {
        return {
          success: false,
          message: "Программа должна заканчиваться блоком 'Конец'",
          hint: "Последним блоком должен быть 'Конец'",
        };
      }

      const hasInputs = blocks.filter((b) => b.type === BlockType.INPUT_NUMBER).length >= 2;
      const hasAdd = blocks.some((b) => b.type === BlockType.ADD);
      const hasOutput = blocks.some((b) => b.type === BlockType.OUTPUT);

      if (!hasInputs) {
        return {
          success: false,
          message: "Нужно два блока ввода чисел",
          hint: "Используйте блок 'Ввести число' два раза для ввода двух чисел",
        };
      }

      if (!hasAdd) {
        return {
          success: false,
          message: "Не хватает операции сложения",
          hint: "Добавьте блок 'Сложить' для сложения двух чисел",
        };
      }

      if (!hasOutput) {
        return {
          success: false,
          message: "Нужно вывести результат",
          hint: "Добавьте блок 'Вывести' для отображения результата",
        };
      }

      return {
        success: true,
        message: "Отлично! Вы создали простой калькулятор. Программа вводит два числа, складывает их и выводит результат.",
      };
    },
  },
  {
    id: "sum_loop",
    title: "Цикл суммирования",
    difficulty: "medium",
    description: "Сложите числа от 1 до 10 с помощью цикла",
    iconAsset: "task-loop",
    requiredBlocks: [
      BlockType.START,
      BlockType.VARIABLE,
      BlockType.LOOP,
      BlockType.ADD,
      BlockType.OUTPUT,
      BlockType.END,
    ],
    validationFunction: (blocks) => {
      if (blocks.length < 6) {
        return {
          success: false,
          message: "Программа неполная",
          hint: "Используйте переменную для накопления суммы и цикл для повторения операций",
        };
      }

      if (blocks[0]?.type !== BlockType.START) {
        return {
          success: false,
          message: "Программа должна начинаться с блока 'Начало'",
        };
      }

      const hasVariable = blocks.some((b) => b.type === BlockType.VARIABLE);
      const hasLoop = blocks.some((b) => b.type === BlockType.LOOP);
      const hasAdd = blocks.some((b) => b.type === BlockType.ADD);
      const hasOutput = blocks.some((b) => b.type === BlockType.OUTPUT);

      if (!hasVariable) {
        return {
          success: false,
          message: "Нужна переменная для хранения суммы",
          hint: "Создайте переменную sum = 0 перед циклом",
        };
      }

      if (!hasLoop) {
        return {
          success: false,
          message: "Используйте блок цикла",
          hint: "Добавьте блок 'Цикл' с 10 повторениями",
        };
      }

      if (!hasAdd) {
        return {
          success: false,
          message: "Нужна операция сложения в цикле",
          hint: "Внутри цикла добавляйте текущее число к сумме",
        };
      }

      if (!hasOutput) {
        return {
          success: false,
          message: "Выведите итоговую сумму",
          hint: "После цикла выведите значение переменной sum",
        };
      }

      return {
        success: true,
        message: "Превосходно! Вы использовали цикл для вычисления суммы чисел от 1 до 10. Это важный паттерн программирования!",
      };
    },
  },
  {
    id: "even_odd",
    title: "Проверка чётности",
    difficulty: "medium",
    description: "Проверьте, чётное число или нечётное",
    iconAsset: "task-conditional",
    requiredBlocks: [
      BlockType.START,
      BlockType.INPUT_NUMBER,
      BlockType.IF,
      BlockType.MODULO,
      BlockType.OUTPUT,
      BlockType.END,
    ],
    validationFunction: (blocks) => {
      if (blocks.length < 5) {
        return {
          success: false,
          message: "Программа слишком короткая",
          hint: "Используйте ввод числа, условие с проверкой остатка от деления на 2, и вывод результата",
        };
      }

      if (blocks[0]?.type !== BlockType.START) {
        return {
          success: false,
          message: "Программа должна начинаться с блока 'Начало'",
        };
      }

      const hasInput = blocks.some((b) => b.type === BlockType.INPUT_NUMBER);
      const hasIf = blocks.some((b) => b.type === BlockType.IF);
      const hasModulo = blocks.some((b) => b.type === BlockType.MODULO);
      const hasOutput = blocks.some((b) => b.type === BlockType.OUTPUT);

      if (!hasInput) {
        return {
          success: false,
          message: "Нужно ввести число",
          hint: "Используйте блок 'Ввести число' для получения числа от пользователя",
        };
      }

      if (!hasIf) {
        return {
          success: false,
          message: "Используйте условный оператор",
          hint: "Добавьте блок 'Если' для проверки условия",
        };
      }

      if (!hasModulo) {
        return {
          success: false,
          message: "Для проверки чётности нужна операция остатка",
          hint: "Используйте блок 'Остаток' для проверки n % 2 == 0",
        };
      }

      if (!hasOutput) {
        return {
          success: false,
          message: "Выведите результат проверки",
          hint: "Используйте блок 'Вывести' для отображения результата (чётное или нечётное)",
        };
      }

      return {
        success: true,
        message: "Замечательно! Вы создали программу проверки чётности с использованием условного оператора и операции остатка от деления.",
      };
    },
  },
];
