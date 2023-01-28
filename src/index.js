function check(str, bracketsConfig) {

  /*
   * Использовался алгоритм с двумя стеками. Имелись ложные срабатывания `|()|(||)||`.
   * */

  /*
   * Вторая версия: алгоритм с одним стеком для обоих типов скобок. Сразу работаю с исходным
   * конфигом в виде двумерного массива.
   * */

  /**
   * Main brackets check function.
   */
  function checkBrackets(str, bracketsConfig) {

    // Debug info: objects to watch:
    // str, charIndex, currentSymbol, similarBracketsStack, openBracketsStack, similarBracketsStatus, regularBracketsStatus

    // Вывести в лог текущую строку со скобками:
    console.log(`\nTesting string:`, str);

    // Вывести в лог текущий конфиг проверяемых скобок:
    console.log(`Brackets config:`, bracketsConfig);

    // Массив, описывающий типы открывающих скобок
    const openBracketsTypesArr = ['(', '{', '[', '|'];

    // Словарь (map), который задаёт пару скобок. Он из себя на уровне JS представляет
    // объект.
    // Ключи - закрывающие скобки.
    // Значения - открывающие скобки.
    // Используя эту структуру, будем проверять, какой тип скобки должен
    // лежать на верхушке стека, чтобы его убрать.
    const bracketsPairsMap = {
      [')']: '(',
      ['}']: '{',
      [']']: '[',
    };

    const similarBracketsPairMap = {
      ['|']: '|',
    };

    // Создаём стек для накопления открывающих скобок, которые встречаются в строке.
    // Когда находим закрывающую - убираем последнюю открывающую из стека,
    // удаляя верхний элемент.
    let openBracketsStack = [];

    // Создаём стек для скобок такого типа, при котором открывающаяся и закрывающая одним и тем
    // же символом обозначается.
    // let similarBracketsStack = [];

    // Переменные для хранения результата анализа для каждого типа скобок.
    // let regularBracketsStatus = true;
    // let similarBracketsStatus = true;

    // Переменная для хранения состояния того, отработало ли хотя бы одно условие на проверку
    // классических парных скобок.
    // Not used in current version.
    let regularBracketsStatementsStatus = false;

    // Необходимо найти способ работать с исходным конфигом скобок.
    // Если работаем, как со строкой. `.replace()` с регулярным выражением уберёт скобки,
    // которые появятся из-за вложенности массивов.
    // Not used in current version.
    let bracketsConfigStr = bracketsConfig.join('').replace(/,/g, '');


    // Функция для проверки типа скобки (является ли она открывающейся).
    // Если работаем с исходным массивом.
    function isBracketsIsOpen (bracketsConfig, bracketChecked) {

      let isOpenStatus = false;

      bracketsConfig.forEach((bracketPair) => {
        if (bracketPair[0] === bracketChecked) {
          isOpenStatus = true;
        }
      })

      return isOpenStatus;
    }

    // Функция для получения идентификатора типа скобки исходя из данной конфигурации скобок.
    // Это будет номер вложенного массива с парой скобок.
    // Функция применяется, если работаем с исходным массивом.
    function getBracketsPairTypeNumber (bracketsConfig, bracketChecked) {

      let bracketPairIndexOutput = null;

      bracketsConfig.forEach((bracketPair, bracketPairIndex) => {
        if (bracketPair.includes(bracketChecked)) {
          bracketPairIndexOutput = bracketPairIndex;
        }
      })

      return bracketPairIndexOutput;

    }


    // Main loop - for iterate through source string
    for (let charIndex = 0; charIndex < str.length; charIndex ++) {

      // Temporal const (update every iteration) - current symbol of source string.
      const currentSymbol = str[charIndex];

      // Работаем с конфигом скобок, как с массивом двумерным, строка не нужна.
      // let bracketsIndex = bracketsConfigStr.indexOf(currentSymbol)

      // Get brackets pair type from config: it is number of inner Array in outer Array.
      // 0 < bracketsPairTypeNumber < bracketsConfig.length - 1
      let bracketsPairTypeNumber = getBracketsPairTypeNumber(bracketsConfig, currentSymbol);

      // Get brackets type of pair (opening or closing) by it position in inner config Array.
      // 0 - opening;
      // 1 - closing.
      let bracketsInPairIndex = bracketsConfig[bracketsPairTypeNumber].indexOf(currentSymbol)

      // Класть в стек и обрабатывать объект с информаций о скобке?..
      // Not used in current version.
      const bracketInfo = {
        pairTypeNumber: bracketsPairTypeNumber,
        bracketsInPairIndex: bracketsInPairIndex,
      }

      // Текущая скобка открывающаяся?
      if (isBracketsIsOpen(bracketsConfig, currentSymbol)) {

        // Если текущая скобка (открывающаяся), обозначена таким же символом, как закрывающаяся,
        // и текущий тип скобок (тип текущей скобки) лежит в стеке сверху:
        // => извлечь из стека верхний элемент.
        if (currentSymbol === bracketsConfig[bracketsPairTypeNumber][1] && openBracketsStack[openBracketsStack.length - 1] === bracketsConfig[bracketsPairTypeNumber][bracketsInPairIndex]){
          openBracketsStack.pop();
          // иначе: если текущая скобка (открывающаяся), обозначена таким же символом, как закрывающаяся,
          // и текущий тип скобок не соответствует типу скобки, которая лежит в стеке сверху:
          // => добавить текущую скобку в стек.
        } else if (currentSymbol === bracketsConfig[bracketsPairTypeNumber][1] && openBracketsStack[openBracketsStack.length - 1] !== bracketsConfig[bracketsPairTypeNumber][bracketsInPairIndex]) {
          openBracketsStack.push(bracketsConfig[bracketsPairTypeNumber][bracketsInPairIndex])
        }
        else{
          // иначе (это если скобка разными символами слева и справа обозначается):
          // => добавить текущую скобку в стек.
          openBracketsStack.push(bracketsConfig[bracketsPairTypeNumber][bracketsInPairIndex])
        }
      }
      // иначе (если текущая скобка закрывающаяся, причём закрывающаяся кодируемая разными
      // символами слева и справа):
      else {

        // Если текущая скобка, которая должна быть закрывающейся, не является таковой
        // для скобки, лежащей вверху стека:
        // => остановить выполнение функции и вернуть `false`.
        if (openBracketsStack[openBracketsStack.length - 1] !== bracketsConfig[bracketsPairTypeNumber][bracketsInPairIndex - 1]){
          return false;
        }

        // В любом случае извлеки верхний элемент стека:
        openBracketsStack.pop()

      }

    }

    // Если проверки в цикле не прервали выполнение функции, но мы дошли до конца строки,
    // проверяем, пустой ли стек.
    // Если стек пустой - то вернётся `true` - все скобки закрываются и отбалансированы.
    // Если строка закончилась, а стек не пустой - то вернётся `false` - какие-то скобки не закрыты.
    return openBracketsStack.length === 0


  }

  return checkBrackets(str, bracketsConfig);

}

module.exports = check;

// console.log(check("((()))()", [['(', ')']]));
// console.log(check("|()|", [['(', ')'], ['|', '|']]));
// console.log(check("|(|)", [['(', ')'], ['|', '|']]));
// console.log(check("|()|(||)||", [['(', ')'], ['|', '|']]));



