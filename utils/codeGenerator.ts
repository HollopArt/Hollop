import { PlacedBlock, BlockType } from "@/types/blocks";

export interface CodeGenerationResult {
  code: string;
  errors: CodeError[];
  warnings: CodeWarning[];
}

export interface CodeError {
  line: number;
  message: string;
  blockId: string;
}

export interface CodeWarning {
  line: number;
  message: string;
  blockId: string;
}

export function generateCSharpCode(blocks: PlacedBlock[]): CodeGenerationResult {
  const errors: CodeError[] = [];
  const warnings: CodeWarning[] = [];
  const codeLines: string[] = [];
  const declaredVariables = new Set<string>();
  const usedVariables = new Set<string>();

  if (blocks.length === 0) {
    return {
      code: "// Добавьте блоки для генерации кода",
      errors: [],
      warnings: [],
    };
  }

  if (blocks[0].type !== BlockType.START) {
    errors.push({
      line: 0,
      message: "Программа должна начинаться с блока 'Начало'",
      blockId: blocks[0].id,
    });
  }

  if (blocks[blocks.length - 1].type !== BlockType.END) {
    errors.push({
      line: blocks.length + 1,
      message: "Программа должна заканчиваться с блока 'Конец'",
      blockId: blocks[blocks.length - 1].id,
    });
  }

  codeLines.push("using System;");
  codeLines.push("");
  codeLines.push("class Program");
  codeLines.push("{");
  codeLines.push("    static void Main(string[] args)");
  codeLines.push("    {");

  let indentLevel = 2;
  const indent = (level: number) => "    ".repeat(level);

  // Стек для отслеживания вложенных структур
  const blockStack: { type: BlockType; index: number }[] = [];
  let loopCounter = 0; // Счетчик для уникальных имен переменных циклов

  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i];
    const lineNumber = codeLines.length;

    switch (block.type) {
      case BlockType.START:
        codeLines.push(indent(indentLevel) + "// Начало программы");
        break;

      case BlockType.END_BLOCK:
        // Закрываем один открытый блок
        if (blockStack.length > 0) {
          blockStack.pop();
          indentLevel--;
          codeLines.push(indent(indentLevel) + "}");
        } else {
          errors.push({
            line: lineNumber,
            message: "Блок 'Конец блока' без открывающего цикла или условия",
            blockId: block.id,
          });
        }
        break;

      case BlockType.END:
        // Закрываем все открытые блоки
        while (blockStack.length > 0) {
          const openBlock = blockStack.pop();
          indentLevel--;
          codeLines.push(indent(indentLevel) + "}");
        }
        codeLines.push(indent(indentLevel) + "// Конец программы");
        break;

      case BlockType.INPUT_NUMBER: {
        const varName = block.params?.variableName || "input";
        if (!varName.match(/^[a-zA-Z_][a-zA-Z0-9_]*$/)) {
          errors.push({
            line: lineNumber,
            message: `Некорректное имя переменной: '${varName}'`,
            blockId: block.id,
          });
        }
        if (declaredVariables.has(varName)) {
          warnings.push({
            line: lineNumber,
            message: `Переменная '${varName}' уже объявлена`,
            blockId: block.id,
          });
        }
        declaredVariables.add(varName);
        codeLines.push(indent(indentLevel) + `Console.Write("Введите число: ");`);
        codeLines.push(indent(indentLevel) + `int ${varName} = int.Parse(Console.ReadLine());`);
        break;
      }

      case BlockType.VARIABLE: {
        const assignment = block.params?.value || "x = 0";
        const match = assignment.match(/^\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*=\s*(.+)\s*$/);
        if (!match) {
          errors.push({
            line: lineNumber,
            message: `Некорректный формат переменной. Используйте: имя = значение`,
            blockId: block.id,
          });
          codeLines.push(indent(indentLevel) + `// ОШИБКА: ${assignment}`);
        } else {
          const [, varName, value] = match;
          if (declaredVariables.has(varName)) {
            codeLines.push(indent(indentLevel) + `${varName} = ${value};`);
          } else {
            declaredVariables.add(varName);
            codeLines.push(indent(indentLevel) + `int ${varName} = ${value};`);
          }
        }
        break;
      }

      case BlockType.ADD: {
        const expr = block.params?.value || "a + b = result";
        const match = expr.match(/^\s*(\w+)\s*\+\s*(\w+)\s*=\s*(\w+)\s*$/);
        if (!match) {
          errors.push({
            line: lineNumber,
            message: "Формат: a + b = result",
            blockId: block.id,
          });
          codeLines.push(indent(indentLevel) + `// ОШИБКА: ${expr}`);
        } else {
          const [, a, b, result] = match;
          if (!declaredVariables.has(a)) {
            errors.push({
              line: lineNumber,
              message: `Переменная '${a}' не объявлена`,
              blockId: block.id,
            });
          }
          if (!declaredVariables.has(b)) {
            errors.push({
              line: lineNumber,
              message: `Переменная '${b}' не объявлена`,
              blockId: block.id,
            });
          }
          usedVariables.add(a);
          usedVariables.add(b);
          if (!declaredVariables.has(result)) {
            declaredVariables.add(result);
            codeLines.push(indent(indentLevel) + `int ${result} = ${a} + ${b};`);
          } else {
            codeLines.push(indent(indentLevel) + `${result} = ${a} + ${b};`);
          }
        }
        break;
      }

      case BlockType.SUBTRACT: {
        const expr = block.params?.value || "a - b = result";
        const match = expr.match(/^\s*(\w+)\s*-\s*(\w+)\s*=\s*(\w+)\s*$/);
        if (!match) {
          errors.push({
            line: lineNumber,
            message: "Формат: a - b = result",
            blockId: block.id,
          });
        } else {
          const [, a, b, result] = match;
          if (!declaredVariables.has(a) || !declaredVariables.has(b)) {
            errors.push({
              line: lineNumber,
              message: `Переменные должны быть объявлены`,
              blockId: block.id,
            });
          }
          if (!declaredVariables.has(result)) {
            declaredVariables.add(result);
            codeLines.push(indent(indentLevel) + `int ${result} = ${a} - ${b};`);
          } else {
            codeLines.push(indent(indentLevel) + `${result} = ${a} - ${b};`);
          }
        }
        break;
      }

      case BlockType.MULTIPLY: {
        const expr = block.params?.value || "a * b = result";
        const match = expr.match(/^\s*(\w+)\s*\*\s*(\w+)\s*=\s*(\w+)\s*$/);
        if (!match) {
          errors.push({
            line: lineNumber,
            message: "Формат: a * b = result",
            blockId: block.id,
          });
        } else {
          const [, a, b, result] = match;
          if (!declaredVariables.has(result)) {
            declaredVariables.add(result);
            codeLines.push(indent(indentLevel) + `int ${result} = ${a} * ${b};`);
          } else {
            codeLines.push(indent(indentLevel) + `${result} = ${a} * ${b};`);
          }
        }
        break;
      }

      case BlockType.DIVIDE: {
        const expr = block.params?.value || "a / b = result";
        const match = expr.match(/^\s*(\w+)\s*\/\s*(\w+)\s*=\s*(\w+)\s*$/);
        if (!match) {
          errors.push({
            line: lineNumber,
            message: "Формат: a / b = result",
            blockId: block.id,
          });
        } else {
          const [, a, b, result] = match;
          if (!declaredVariables.has(result)) {
            declaredVariables.add(result);
            codeLines.push(indent(indentLevel) + `int ${result} = ${a} / ${b};`);
          } else {
            codeLines.push(indent(indentLevel) + `${result} = ${a} / ${b};`);
          }
        }
        break;
      }

      case BlockType.MODULO: {
        const expr = block.params?.value || "a % b = result";
        const match = expr.match(/^\s*(\w+)\s*%\s*(\w+)\s*=\s*(\w+)\s*$/);
        if (!match) {
          errors.push({
            line: lineNumber,
            message: "Формат: a % b = result",
            blockId: block.id,
          });
        } else {
          const [, a, b, result] = match;
          if (!declaredVariables.has(result)) {
            declaredVariables.add(result);
            codeLines.push(indent(indentLevel) + `int ${result} = ${a} % ${b};`);
          } else {
            codeLines.push(indent(indentLevel) + `${result} = ${a} % ${b};`);
          }
        }
        break;
      }

      case BlockType.OUTPUT: {
        const value = block.params?.value || "result";
        if (value.match(/^[a-zA-Z_][a-zA-Z0-9_]*$/) && !declaredVariables.has(value)) {
          errors.push({
            line: lineNumber,
            message: `Переменная '${value}' не объявлена`,
            blockId: block.id,
          });
        }
        usedVariables.add(value);
        codeLines.push(indent(indentLevel) + `Console.WriteLine(${value});`);
        break;
      }

      case BlockType.IF: {
        const condition = block.params?.condition || "x > 0";
        codeLines.push(indent(indentLevel) + `if (${condition})`);
        codeLines.push(indent(indentLevel) + `{`);
        indentLevel++;
        blockStack.push({ type: BlockType.IF, index: i });
        break;
      }

      case BlockType.LOOP: {
        const iterations = block.params?.iterations || 10;
        const loopVar = loopCounter === 0 ? "i" : `i${loopCounter}`;
        loopCounter++;
        declaredVariables.add(loopVar);
        codeLines.push(indent(indentLevel) + `for (int ${loopVar} = 1; ${loopVar} <= ${iterations}; ${loopVar}++)`);
        codeLines.push(indent(indentLevel) + `{`);
        indentLevel++;
        blockStack.push({ type: BlockType.LOOP, index: i });
        break;
      }

      default:
        codeLines.push(indent(indentLevel) + `// Неизвестный блок: ${block.type}`);
    }
  }

  codeLines.push("    }");
  codeLines.push("}");

  return {
    code: codeLines.join("\n"),
    errors,
    warnings,
  };
}