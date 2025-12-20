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

function updateDisplay() {
    input.textContent = currentInput;
    previousExpressionElement.textContent = previousExpression;
}

function appendNumber(number) {
    if (currentInput === '0' || resetScreen) {
        currentInput = number;
        resetScreen = false;
    } else {
        currentInput += number;
    }
    updateDisplay();
    animateButton(event.target);
}

function appendOperation(op) {
    if (operation !== null && !resetScreen) {
        calculate();
    }
    operation = op;
    previousExpression = `${currentInput} ${op}`;
    resetScreen = true;
    updateDisplay();
    animateButton(event.target);
}

function appendDecimal() {
    if (resetScreen) {
        currentInput = '0.';
        resetScreen = false;
    } else if (!currentInput.includes('.')) {
        currentInput += '.';
    }
    updateDisplay();
    animateButton(event.target);
}

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
    animateButton(event.target);
}

function clearAll() {
    currentInput = '0';
    previousExpression = '';
    operation = null;
    updateDisplay();
    animateButton(event.target);
}

function clearEntry() {
    currentInput = '0';
    updateDisplay();
    animateButton(event.target);
}

function showError(message) {
    input.classList.add('error');
    input.textContent = message;
    setTimeout(() => {
        input.classList.remove('error');
        currentInput = '0';
        updateDisplay();
    }, 1500);
}

function animateButton(button) {
    button.classList.add('clicked');
    setTimeout(() => {
        button.classList.remove('clicked');
    }, 200);
}

// Поддержка клавиатуры
document.addEventListener('keydown', (event) => {
    const key = event.key;

    if ((key >= '0' && key <= '9') || key === '.') {
        if (key === '.') {
            appendDecimal();
        } else {
            appendNumber(key);
        }
    } else if (['+', '-', '*', '/', '%'].includes(key)) {
        appendOperation(key);
    } else if (key === 'Enter' || key === '=') {
        event.preventDefault();
        calculate();
    } else if (key === 'Escape' || key === 'Delete') {
        clearAll();
    } else if (key === 'Backspace') {
        if (currentInput.length > 1) {
            currentInput = currentInput.slice(0, -1);
        } else {
            currentInput = '0';
        }
        updateDisplay();
    }
});

// Инициализация
updateDisplay();