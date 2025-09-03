// Class Calculator untuk mengelola semua operasi kalkulator
class Calculator {
    constructor(previousOperandElement, currentOperandElement) {
        this.previousOperandElement = previousOperandElement;
        this.currentOperandElement = currentOperandElement;
        this.clear();
    }

    // Method untuk menghapus semua data
    clear() {
        this.currentOperand = '';
        this.previousOperand = '';
        this.operation = undefined;
        this.shouldResetDisplay = false;
    }

    // Method untuk menghapus karakter terakhir
    delete() {
        if (this.shouldResetDisplay) {
            this.clear();
            return;
        }
        this.currentOperand = this.currentOperand.toString().slice(0, -1);
        if (this.currentOperand === '') {
            this.currentOperand = '0';
        }
    }

    // Method untuk menambahkan angka ke display
    appendNumber(number) {
        // Reset display jika perlu (setelah operasi selesai)
        if (this.shouldResetDisplay) {
            this.currentOperand = '';
            this.shouldResetDisplay = false;
        }

        // Cegah multiple decimal points
        if (number === '.' && this.currentOperand.includes('.')) return;
        
        // Handle angka 0 di awal
        if (this.currentOperand === '0' && number !== '.') {
            this.currentOperand = number;
        } else {
            this.currentOperand = this.currentOperand.toString() + number.toString();
        }
    }

    // Method untuk memilih operasi matematika
    chooseOperation(operation) {
        // Jika tidak ada angka saat ini, jangan lakukan apa-apa
        if (this.currentOperand === '') return;
        
        // Jika ada operasi sebelumnya, hitung dulu
        if (this.previousOperand !== '') {
            this.compute();
        }

        this.operation = operation;
        this.previousOperand = this.currentOperand;
        this.currentOperand = '';
    }

    // Method untuk melakukan perhitungan
    compute() {
        let computation;
        const prev = parseFloat(this.previousOperand);
        const current = parseFloat(this.currentOperand);

        // Validasi input
        if (isNaN(prev) || isNaN(current)) return;

        // Lakukan operasi berdasarkan operator
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
                if (current === 0) {
                    alert('Error: Tidak bisa membagi dengan nol!');
                    this.clear();
                    return;
                }
                computation = prev / current;
                break;
            default:
                return;
        }

        // Set hasil dan reset state
        this.currentOperand = this.roundResult(computation);
        this.operation = undefined;
        this.previousOperand = '';
        this.shouldResetDisplay = true;
    }

    // Method untuk membulatkan hasil perhitungan
    roundResult(number) {
        // Bulatkan ke 10 desimal untuk menghindari floating point errors
        return Math.round((number + Number.EPSILON) * 10000000000) / 10000000000;
    }

    // Method untuk memformat angka dengan pemisah ribuan
    getDisplayNumber(number) {
        const stringNumber = number.toString();
        const integerDigits = parseFloat(stringNumber.split('.')[0]);
        const decimalDigits = stringNumber.split('.')[1];
        
        let integerDisplay;
        if (isNaN(integerDigits)) {
            integerDisplay = '';
        } else {
            integerDisplay = integerDigits.toLocaleString('id-ID', {
                maximumFractionDigits: 0
            });
        }

        if (decimalDigits != null) {
            return `${integerDisplay}.${decimalDigits}`;
        } else {
            return integerDisplay;
        }
    }

    // Method untuk update display
    updateDisplay() {
        this.currentOperandElement.innerText = 
            this.getDisplayNumber(this.currentOperand) || '0';
        
        if (this.operation != null) {
            this.previousOperandElement.innerText = 
                `${this.getDisplayNumber(this.previousOperand)} ${this.operation}`;
        } else {
            this.previousOperandElement.innerText = '';
        }
    }
}

// Inisialisasi kalkulator setelah DOM loaded
document.addEventListener('DOMContentLoaded', function() {
    const previousOperandElement = document.getElementById('previous-operand');
    const currentOperandElement = document.getElementById('current-operand');

    // Buat instance kalkulator global
    window.calculator = new Calculator(previousOperandElement, currentOperandElement);

    // Update display awal
    calculator.updateDisplay();

    // Event listener untuk keyboard input
    document.addEventListener('keydown', function(event) {
        const key = event.key;

        // Angka dan titik desimal
        if ((key >= '0' && key <= '9') || key === '.') {
            calculator.appendNumber(key);
            calculator.updateDisplay();
        }

        // Operasi matematika
        if (key === '+' || key === '-') {
            calculator.chooseOperation(key);
            calculator.updateDisplay();
        }

        if (key === '*') {
            calculator.chooseOperation('×');
            calculator.updateDisplay();
        }

        if (key === '/') {
            event.preventDefault(); // Cegah browser search
            calculator.chooseOperation('÷');
            calculator.updateDisplay();
        }

        // Enter atau equals untuk compute
        if (key === 'Enter' || key === '=') {
            event.preventDefault();
            calculator.compute();
            calculator.updateDisplay();
        }

        // Escape untuk clear
        if (key === 'Escape') {
            calculator.clear();
            calculator.updateDisplay();
        }

        // Backspace untuk delete
        if (key === 'Backspace') {
            calculator.delete();
            calculator.updateDisplay();
        }
    });

    // Override method untuk update display otomatis
    const originalMethods = ['clear', 'delete', 'appendNumber', 'chooseOperation', 'compute'];
    
    originalMethods.forEach(methodName => {
        const originalMethod = calculator[methodName];
        calculator[methodName] = function(...args) {
            originalMethod.apply(this, args);
            this.updateDisplay();
        };
    });
});

// Fungsi utilitas untuk debugging (opsional)
function debugCalculator() {
    console.log('Current Operand:', calculator.currentOperand);
    console.log('Previous Operand:', calculator.previousOperand);
    console.log('Operation:', calculator.operation);
    console.log('Should Reset Display:', calculator.shouldResetDisplay);
}

