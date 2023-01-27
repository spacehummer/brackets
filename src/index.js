function check(str, bracketsConfig) {
  /**
   * Пример реализации стека с использованием такой стандартной структуры, как массив.
   * <br>Также рассмотрена работа с ним.
   */
  function stackOnArrayExample() {
    console.log('Stack on Array example:');

    // Создадим массив stack, с которым мы будем работать, как со стеком.
    let stack = [];

    // Далее будем класть поочереди в него элементы, используя метод, стандартный
    // для массивов: .push().
    console.log('  Push fake call stack:');

    console.log('    push Outer');
    stack.push('Outer');

    console.log('    push Inner');
    stack.push('Inner');

    console.log('    push Super-Inner');
    stack.push('Super-Inner');

    console.log('    push Super-Super-Inner');
    stack.push('Super-Super-Inner');

    // Произведём иллюстративный вызов стека - извлечём все его элементы
    console.log('  Execute fake call stack:');

    // Для этого используем цикл while, который будет работать, пока в стеке есть элементы,
    // то есть пока stack.length > 0. Как только он станет равен 0, 0 - это false
    // и цикл while перестанет повторяться.
    while (stack.length) {
      // Каждую итерацию цикла переопределяем переменную operation и кладём в неё
      // верхний элемент стека, извлекая его из стека стандартным для массива методом
      // .pop()
      // https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Array/pop
      let operation = stack.pop();

      // Выводим в консоль с подписью изъятый элемент.
      console.log('    execute -', operation);
    }
  }

  /**
   * Main brackets check function.
   */
  function checkBrackets(str, bracketsConfig) {

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
    let similarBracketsStack = [];

    // Переменные для хранения результата анализа для каждого типа скобок.
    let regularBracketsStatus = true;
    let similarBracketsStatus = true;

    // Переменная для хранения состояния того, отработало ли хотя бы одно условие на проверку
    // классических парных скобок.
    let regularBracketsStatementsStatus = false;

    // Цикл для переборки символ строки и их анализа.
    // Выполняется столько раз, сколько символов в строке.
    for (let charIndex = 0; charIndex < str.length; charIndex++) {
      // Временная переменная для хранения текущего символа.
      let currentSymbol = str[charIndex];

      // Проверяем, является ли текущий символ типом скобки, для которого правая и левая скобка
      // задаётся одним и тем же символом.
      if (similarBracketsPairMap[currentSymbol] === currentSymbol) {

        if (similarBracketsStack.length === 0 && charIndex === str.length - 1) {

          similarBracketsStatus = false;

        } else if (similarBracketsStack.length === 0) {

          similarBracketsStack.push(currentSymbol);

        } else if (similarBracketsStack.length !== 0 && openBracketsStack.length !== 0) {

          similarBracketsStatus = false;

        } else if (similarBracketsStack.length !== 0) {

          similarBracketsStack.pop();
          similarBracketsStatus = true;

        }

      } else {

        regularBracketsStatementsStatus = false;

        // Проверяем, является ли текущий символ открывающей скобкой, используя метод
        // .includes() (метод работы с массивами) для массива с типами открывающихся скобок.
        if (openBracketsTypesArr.includes(currentSymbol)) {
          // Если это так, то кладём открывающую скобку в стек.
          openBracketsStack.push(currentSymbol);

        } else {

          // Иначе проверяем, есть ли в стеке что-то или он пустой (его длинна 0).
          // Если он пустой, а во входных данных мы ожидаем
          // только скобки без других символов, мы возвращаем false, говоря этим, что
          // правила работы со скобками нарушены. Так как тогда мы имеем закрывающую
          // скобку без открывающей.
          if (openBracketsStack.length === 0) {
            regularBracketsStatus = false;
            regularBracketsStatementsStatus = true;
          }

          // Если стек содержит элементы (условие выше не отработало), то выполнится
          // код ниже. А именно: будет получен верхний элемент стека и временно положен
          // в переменную topElement.
          let topElement = openBracketsStack[openBracketsStack.length - 1];

          // Теперь мы проверим, а что это за элемент.
          if (bracketsPairsMap[currentSymbol] === topElement) {
            // Если для текущего символа строки открывающий символ равен верхнему
            // элементу стека, то удали этот верхний элемент стека - мы нашли пару, всё нормально.
            openBracketsStack.pop();
          } else {
            // Иначе принимаем, что правила работы со скобками нарушены и возвращаем false.
            // Так как это будет значить, что мы имеем закрывающую скобку не того типа.
            regularBracketsStatus = false;
            regularBracketsStatementsStatus = true;
          }
        }

        // Если все проверки выше ничего не вернули (они могут вернуть только false),
        // то проверяем, что в стеке ничего нет выражением
        // ниже, которое вернёт true, если стек пустой.
        if (!regularBracketsStatementsStatus) {
          regularBracketsStatus =  openBracketsStack.length === 0;
        }

      }

    }

    return regularBracketsStatus && similarBracketsStatus;

  }

  // stackOnArrayExample();
  return checkBrackets(str, bracketsConfig);

}

module.exports = check;

// console.log(check("((()))()"));
// console.log(check("|()|", "(,),|,|"));
console.log(check("|()|(||)||", "(,),|,|"));
// console.log(check("|(|)", [ [ '(', ')' ], [ '|', '|' ] ]));


