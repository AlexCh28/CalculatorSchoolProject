// let <какое-то название> - создание переменной с каким-то названием
// переменные в отличие от констант могут менять свое значение в ходе работы кода

// Основные типы данных в JS
// 1).  number - отвечает за все числа (только они работают с математикой)
// 2).  string - отвечает за все тексты (строки)
// 3).  boolean - отвечает за логическую истину или ложь
// 4).  array - массив - список разных значений - [1,2,3,4,5]
//      у массивов есть индексы (номера элементов)
//      индексы в массиве начинаются с нуля
// 5).  null - пустое значение, которое либо вызывает ошибку в коде, если
//      мы пытаемся к нему обращаться, либо ни на что не влияет, если мы делаем
//      с этим значением какие-то математические операции
// 6).  undefined - неопределенное значение
let currentInput = '0';
let previousExpression = '';
let operation = null;
let resetScreen = false;

// const <какое-то название> - создание константы с каким-то именем
// константы это неизменяемое значение
// document - обращение к HTML-файлу, позволяет обращаться к элементам 
// getElementById - взять элемент из документа по его ID
// Как итог, ниже мы создаем константу input, которая хранит ссылку на элемент
// с ID current-input
const input = document.getElementById('current-input');

// создаем константу previousExpressionElement, которая хранит ссылку на
// <div class="previous-expression" id="previous-expression"></div>
// (строчка 13 из html-документа)
const previousExpressionElement = document.getElementById('previous-expression');

// Обновляет экран калькулятора
// Подробно: функция updateDisplay - передает в текстовое поле калькулятора текущее
// число, которое набирает пользователь и текущий знак действия.
// Во время запуска стартовое значение 0 и знак действия отсутствует. 
function updateDisplay() {
    input.textContent = currentInput;
    previousExpressionElement.textContent = previousExpression;
}

// Добавляет на экран число по нажатию на кнопку
// Подробнее: Функция appendNumber принимает на вход число. 
// В нашем случае это параметр number
// && - логическое И
// || - логическое ИЛИ
// Функция добавляет на экран переданное число.
// Если на экране написано 0 ИЛИ только что
// был выполнен расчет примера с помощью знака равно, 
// то текстовое поле полностью заменяется на переданное число.
// Если на экране не 0, то новое число приписывается справа
// После этого экран обновляется с помощью функции updateDisplay
function appendNumber(number) {
    if (currentInput === '0' || resetScreen) {
        currentInput = number;
        resetScreen = false;
    } else {
        currentInput += number;
    }
    updateDisplay();
}

// Добавляет на экран знак действия по нажатию на кнопку
function appendOperation(op) {
    if (operation !== null && !resetScreen) {
        calculate();
    }
    operation = op;
    previousExpression = `${currentInput} ${op}`;
    resetScreen = true;
    updateDisplay();
}

// Пишет на экране дробное число, если такое появилось по итогу расчета
function appendDecimal() {
    if (resetScreen) {
        currentInput = '0.';
        resetScreen = false;
    } else if (!currentInput.includes('.')) {
        currentInput += '.';
    }
    updateDisplay();
}

// Выполняет расчет примера
function calculate() {
    let computation;
    const prev = parseFloat(previousExpression.split(' ')[0]);
    const current = parseFloat(currentInput);

    if (isNaN(prev) || isNaN(current)) return;

    switch (operation) {
        case '+':
            computation = prev + current;
            break;
        case '-':
            computation = prev - current;
            break;
        case '*':
            computation = prev * current;
            break;
        case '/':
            if (current === 0) {
                showError("Деление на ноль!");
                return;
            }
            computation = prev / current;
            break;
        case '%':
            computation = prev % current;
            break;
        default:
            return;
    }

    // Округляем до 10 знаков после запятой, чтобы избежать ошибок округления
    computation = Math.round(computation * 10000000000) / 10000000000;

    previousExpression = `${previousExpression} ${currentInput} =`;
    currentInput = computation.toString();
    operation = null;
    resetScreen = true;
    updateDisplay();
}


// Очищает калькулятор от всех чисел и действий
function clearAll() {
    currentInput = '0';
    previousExpression = '';
    operation = null;
    updateDisplay();
}

// Показывает ошибку
function showError(message) {
    input.classList.add('error');
    input.textContent = message;
    setTimeout(() => {
        input.classList.remove('error');
        currentInput = '0';
        updateDisplay();
    }, 1500);
}

// Отрисовывает стартовые калькулятор
updateDisplay();