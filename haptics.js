// Soporte para vibración en diferentes navegadores
function triggerHapticFeedback(duration) {
    // Verificar si la vibración está habilitada en la app
    if (typeof appState !== 'undefined' && !appState.hapticFeedback) return;
    
    duration = duration || 10; // ms
    
    // Dispositivos iOS (WebKit)
    if (window.navigator.vibrate) {
        window.navigator.vibrate(duration);
    } 
    // Dispositivos Android
    else if (window.navigator.hapticFeedback) {
        window.navigator.hapticFeedback('press');
    }
    // Safari en iOS (polyfill)
    else if (window.Touch && window.Touch.prototype.preventDefault) {
        // Simular vibración con un pequeño timeout
        const event = new Event('vibration');
        document.dispatchEvent(event);
    }
}

// Polyfill para Safari
if (!window.navigator.vibrate) {
    window.navigator.vibrate = function(duration) {
        const event = new CustomEvent('vibration', { detail: duration });
        document.dispatchEvent(event);
        return true;
    };
}

// Escuchar eventos de vibración (para Safari)
document.addEventListener('vibration', () => {
    // Podrías añadir aquí efectos visuales para simular vibración
    // como un pequeño movimiento de los elementos UI
});