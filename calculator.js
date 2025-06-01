// calculator.js - Versión corregida
class Calculator {
    constructor(previousOperandTextElement, currentOperandTextElement) {
        this.previousOperandTextElement = previousOperandTextElement;
        this.currentOperandTextElement = currentOperandTextElement;
        this.clear();
    }

    clear() {
        this.currentOperand = '0';
        this.previousOperand = '';
        this.operation = undefined;
        this.updateDisplay();
    }

    delete() {
        if (this.currentOperand === 'Error') {
            this.clear();
            return;
        }
        
        this.currentOperand = this.currentOperand.toString().slice(0, -1);
        
        if (this.currentOperand === '' || this.currentOperand === '-') {
            this.currentOperand = '0';
        }
        
        this.updateDisplay();
    }

    appendNumber(number) {
        if (number === '.' && this.currentOperand.includes('.')) return;
        
        if (this.currentOperand === '0' && number !== '.') {
            this.currentOperand = number.toString();
        } else {
            this.currentOperand = this.currentOperand.toString() + number.toString();
        }
        
        this.updateDisplay();
    }

    chooseOperation(operation) {
        if (this.currentOperand === '0' && this.previousOperand === '') return;
        
        if (this.currentOperand === '') {
            this.operation = operation;
            this.updateDisplay();
            return;
        }
        
        if (this.previousOperand !== '') {
            this.compute();
        }
        
        this.operation = operation;
        this.previousOperand = this.currentOperand;
        this.currentOperand = '';
        this.updateDisplay();
    }

    compute() {
        let computation;
        const prev = parseFloat(this.previousOperand);
        const current = parseFloat(this.currentOperand);
        
        if (isNaN(prev) || isNaN(current)) {
            this.currentOperand = 'Error';
            this.updateDisplay();
            return;
        }
        
        try {
            switch (this.operation) {
                case '+':
                    computation = prev + current;
                    break;
                case '-':
                    computation = prev - current;
                    break;
                case '×':
                    computation = prev * current;
                    break;
                case '÷':
                    computation = prev / current;
                    if (!isFinite(computation)) throw new Error('División por cero');
                    break;
                case '%':
                    computation = prev % current;
                    break;
                default:
                    return;
            }
            
            // Manejo preciso de decimales
            computation = this.roundResult(computation);
            
            this.currentOperand = computation.toString();
            this.operation = undefined;
            this.previousOperand = '';
            
            // Guardar en historial
            if (typeof addToHistory === 'function') {
                const expression = `${this.previousOperand} ${this.operation} ${this.currentOperand}`;
                addToHistory(expression, this.currentOperand);
            }
        } catch (error) {
            this.currentOperand = 'Error';
        }
        
        this.updateDisplay();
    }

    roundResult(num) {
        // Para manejar el problema de la precisión decimal en JavaScript
        const precision = 12;
        const factor = Math.pow(10, precision);
        return Math.round(num * factor) / factor;
    }

    updateDisplay() {
        this.currentOperandTextElement.innerText = this.currentOperand;
        
        if (this.operation != null) {
            this.previousOperandTextElement.innerText = 
                `${this.previousOperand} ${this.operation}`;
        } else {
            this.previousOperandTextElement.innerText = '';
        }
        
        this.adjustFontSize();
    }

    adjustFontSize() {
        const length = this.currentOperand.length;
        if (length > 12) {
            this.currentOperandTextElement.style.fontSize = '1.5rem';
        } else if (length > 8) {
            this.currentOperandTextElement.style.fontSize = '2rem';
        } else {
            this.currentOperandTextElement.style.fontSize = '2.5rem';
        }
    }
}

// Inicialización
const previousOperandTextElement = document.querySelector('[data-previous-operand]');
const currentOperandTextElement = document.querySelector('[data-current-operand]');
const calculator = new Calculator(previousOperandTextElement, currentOperandTextElement);

// Event listeners para botones
document.querySelectorAll('[data-number]').forEach(button => {
    button.addEventListener('click', () => {
        calculator.appendNumber(button.innerText);
        if (typeof triggerHapticFeedback === 'function') {
            triggerHapticFeedback(5);
        }
    });
});

document.querySelectorAll('[data-operation]').forEach(button => {
    button.addEventListener('click', () => {
        calculator.chooseOperation(button.innerText);
        if (typeof triggerHapticFeedback === 'function') {
            triggerHapticFeedback(10);
        }
    });
});

document.querySelector('[data-equals]').addEventListener('click', () => {
    calculator.compute();
    if (typeof triggerHapticFeedback === 'function') {
        triggerHapticFeedback(20);
    }
});

document.querySelector('[data-all-clear]').addEventListener('click', () => {
    calculator.clear();
    if (typeof triggerHapticFeedback === 'function') {
        triggerHapticFeedback(10);
    }
});

document.querySelector('[data-delete]').addEventListener('click', () => {
    calculator.delete();
    if (typeof triggerHapticFeedback === 'function') {
        triggerHapticFeedback(5);
    }
});

// Soporte para teclado
document.addEventListener('keydown', (e) => {
    if (e.key >= 0 && e.key <= 9) {
        calculator.appendNumber(e.key);
        if (typeof triggerHapticFeedback === 'function') {
            triggerHapticFeedback(5);
        }
    }
    
    if (e.key === '.') {
        calculator.appendNumber('.');
        if (typeof triggerHapticFeedback === 'function') {
            triggerHapticFeedback(5);
        }
    }
    
    if (e.key === '+' || e.key === '-' || e.key === '*' || e.key === '/') {
        let operation;
        switch (e.key) {
            case '*': operation = '×'; break;
            case '/': operation = '÷'; break;
            default: operation = e.key;
        }
        calculator.chooseOperation(operation);
        if (typeof triggerHapticFeedback === 'function') {
            triggerHapticFeedback(10);
        }
    }
    
    if (e.key === 'Enter' || e.key === '=') {
        calculator.compute();
        if (typeof triggerHapticFeedback === 'function') {
            triggerHapticFeedback(20);
        }
    }
    
    if (e.key === 'Backspace') {
        calculator.delete();
        if (typeof triggerHapticFeedback === 'function') {
            triggerHapticFeedback(5);
        }
    }
    
    if (e.key === 'Escape') {
        calculator.clear();
        if (typeof triggerHapticFeedback === 'function') {
            triggerHapticFeedback(10);
        }
    }
});