let currentInput = '0';
let previousExpression = '';
let operation = null;
let resetScreen = false;

const currentInputElement = document.getElementById('current-input');
const previousExpressionElement = document.getElementById('previous-expression');

function updateDisplay() {
    currentInputElement.textContent = currentInput;
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
    currentInputElement.classList.add('error');
    currentInputElement.textContent = message;
    setTimeout(() => {
        currentInputElement.classList.remove('error');
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