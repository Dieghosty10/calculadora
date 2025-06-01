// Configuración inicial
document.addEventListener('DOMContentLoaded', () => {
    // Elementos del DOM
    const themeToggle = document.getElementById('theme-toggle');
    const historyToggle = document.getElementById('history-toggle');
    const hapticToggle = document.getElementById('haptic-toggle');
    const clearHistoryBtn = document.getElementById('clear-history');
    const historyPanel = document.querySelector('.history-panel');
    const overlay = document.createElement('div');
    overlay.className = 'overlay';
    document.body.appendChild(overlay);
    
    // Estado de la app
    const appState = {
        hapticFeedback: true,
        currentTheme: localStorage.getItem('calculator-theme') || 'dark'
    };
    
    // Inicializar tema
    document.documentElement.setAttribute('data-theme', appState.currentTheme);
    updateThemeIcon();
    
    // Inicializar hora
    updateClock();
    setInterval(updateClock, 60000);
    
    // Event listeners
    themeToggle.addEventListener('click', toggleTheme);
    historyToggle.addEventListener('click', toggleHistoryPanel);
    hapticToggle.addEventListener('click', toggleHapticFeedback);
    clearHistoryBtn.addEventListener('click', clearHistory);
    overlay.addEventListener('click', closeHistoryPanel);
    
    // Cargar historial si existe
    loadHistory();
    
    // Configurar retroalimentación háptica para botones
    setupButtonHaptics();
    
    // Mostrar animación inicial
    animateCalculator();
    
    // Función para actualizar el reloj
    function updateClock() {
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        document.getElementById('current-time').textContent = `${hours}:${minutes}`;
    }
    
    // Funciones del tema
    function toggleTheme() {
        appState.currentTheme = appState.currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', appState.currentTheme);
        localStorage.setItem('calculator-theme', appState.currentTheme);
        updateThemeIcon();
        triggerHapticFeedback(20);
    }
    
    function updateThemeIcon() {
        const icon = themeToggle.querySelector('i');
        icon.className = appState.currentTheme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
    }
    
    // Funciones del panel de historial
    function toggleHistoryPanel() {
        historyPanel.classList.toggle('active');
        overlay.classList.toggle('active');
        triggerHapticFeedback(20);
    }
    
    function closeHistoryPanel() {
        historyPanel.classList.remove('active');
        overlay.classList.remove('active');
    }
    
    function loadHistory() {
        const history = JSON.parse(localStorage.getItem('calculator-history')) || [];
        const historyList = document.getElementById('history-list');
        
        historyList.innerHTML = '';
        
        history.forEach((item, index) => {
            const li = document.createElement('li');
            li.className = 'history-item';
            li.innerHTML = `
                <div class="history-expression">${item.expression}</div>
                <div class="history-result">${item.result}</div>
            `;
            li.addEventListener('click', () => {
                calculator.loadFromHistory(item.result);
                closeHistoryPanel();
                triggerHapticFeedback(10);
            });
            historyList.appendChild(li);
        });
    }
    
    function addToHistory(expression, result) {
        const history = JSON.parse(localStorage.getItem('calculator-history')) || [];
        
        // Limitar el historial a 50 elementos
        if (history.length >= 50) {
            history.pop();
        }
        
        history.unshift({
            expression,
            result
        });
        
        localStorage.setItem('calculator-history', JSON.stringify(history));
        loadHistory();
    }
    
    function clearHistory() {
        localStorage.removeItem('calculator-history');
        loadHistory();
        triggerHapticFeedback(30);
    }
    
    // Funciones de retroalimentación háptica
    function toggleHapticFeedback() {
        appState.hapticFeedback = !appState.hapticFeedback;
        hapticToggle.style.color = appState.hapticFeedback ? 'var(--secondary-accent)' : 'var(--text-tertiary)';
        triggerHapticFeedback(20);
    }
    
    function setupButtonHaptics() {
        const buttons = document.querySelectorAll('.calc-btn, .icon-btn');
        
        buttons.forEach(button => {
            button.addEventListener('touchstart', () => {
                if (appState.hapticFeedback) {
                    triggerHapticFeedback(10);
                    showTouchFeedback(event);
                }
            });
            
            button.addEventListener('click', () => {
                if (appState.hapticFeedback && !('ontouchstart' in window)) {
                    triggerHapticFeedback(5);
                }
            });
        });
    }
    
    function showTouchFeedback(event) {
        const touchX = event.touches[0].clientX;
        const touchY = event.touches[0].clientY;
        const feedback = document.getElementById('touch-feedback');
        
        feedback.style.left = `${touchX - 30}px`;
        feedback.style.top = `${touchY - 30}px`;
        feedback.classList.add('active');
        
        setTimeout(() => {
            feedback.classList.remove('active');
        }, 200);
    }
    
    // Animaciones
    function animateCalculator() {
        const calculator = document.querySelector('.calculator');
        calculator.style.animation = 'fadeIn 0.5s ease, slideIn 0.5s ease';
        
        setTimeout(() => {
            calculator.style.animation = '';
        }, 500);
    }
});