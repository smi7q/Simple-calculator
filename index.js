document.addEventListener('DOMContentLoaded', function () {
    const keys = document.querySelector('.calculator-keys');
    const display = document.querySelector('.calculator-display');
    const history = [];

    document.addEventListener('keydown', function (e) {
        const key = e.key;
        if (key === 'Enter') {
            handleOperation('=');
        } else if (key === 'Backspace') {
            handleClear();
        } else if (key === 'Escape') {
            display.value = '0';
        } else if (!isNaN(key) || key === '.' || key === '+' || key === '-' || key === '*' || key === '/' || key === '=') {
            handleOperation(key);
        }
    });

    keys.addEventListener('click', function (e) {
        const target = e.target;
        if (target.matches('button')) {
            handleOperation(target.value);
        }
    });

    function handleOperation(operation) {
        const key = operation;
        const displayedNum = display.value;
        const previousKeyType = keys.dataset.previousKeyType;

        if (!isNaN(key) || key === '.') {
            if (displayedNum === '0' || previousKeyType === 'operator' || previousKeyType === 'calculate') {
                display.value = key;
            } else {
                display.value += key;
            }
            keys.dataset.previousKeyType = 'number';
        }

        if (key === 'Backspace') {
            handleClear();
        }

        if (key === 'all-clear') {
            display.value = '0';
            delete keys.dataset.firstValue;
            delete keys.dataset.operator;
            delete keys.dataset.modValue;
            keys.dataset.previousKeyType = 'all-clear';
        }

        if (key === '=') {
            const firstValue = keys.dataset.firstValue;
            const operator = keys.dataset.operator;
            const secondValue = displayedNum;

            if (operator && (previousKeyType !== 'operator' && previousKeyType !== 'calculate')) {
                const result = calculate(firstValue, operator, secondValue);
                display.value = result;
                history.push(`${firstValue} ${operator} ${secondValue} = ${result}`);
                renderHistory();
            }

            keys.dataset.previousKeyType = 'calculate';
        }

        if (['+', '-', '*', '/'].includes(key)) {
            keys.dataset.previousKeyType = 'operator';
            keys.dataset.firstValue = displayedNum;
            keys.dataset.operator = key;
        }
    }

    function handleClear() {
        let currentValue = display.value;
        display.value = currentValue.slice(0, -1);
        if (display.value === '') {
            display.value = '0';
        }
    }

    function calculate(firstValue, operator, secondValue) {
        firstValue = parseFloat(firstValue);
        secondValue = parseFloat(secondValue);
        if (operator === '+') return firstValue + secondValue;
        if (operator === '-') return firstValue - secondValue;
        if (operator === '*') return firstValue * secondValue;
        if (operator === '/') {
            if (secondValue === 0) {
                alert('Error: Division by zero');
                return 'Error';
            }
            return firstValue / secondValue;
        }
    }

    function renderHistory() {
        const historyList = document.querySelector('.history-list');
        historyList.innerHTML = '';

        history.forEach((calculation) => {
            const listItem = document.createElement('li');
            listItem.textContent = calculation;
            listItem.classList.add('history-item');
            historyList.appendChild(listItem);
        });
    }
});
