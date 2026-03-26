// Esperamos a que todo el HTML cargue antes de ejecutar el código
console.log("¡El archivo app.js está conectado correctamente!");
document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================
    // LÓGICA DE LA VISTA DEL ALUMNO (Modo Aula)
    // ==========================================
    
    const btnSos = document.querySelector('.btn-sos');
    const btnAudio = document.querySelector('.btn-audio');
    const btnClose = document.querySelector('.btn-close');

    // Funcionalidad del Botón de Emergencia (SOS)
    if (btnSos) {
        btnSos.addEventListener('click', () => {
            // Efecto visual rápido de pulsación
            btnSos.style.transform = 'scale(0.9)';
            setTimeout(() => btnSos.style.transform = 'scale(1)', 150);

            // Simulamos la alerta. (Nota para Brandon: Aquí irá el fetch() o WebSocket hacia el backend)
            alert('🚨 ¡Alerta SOS enviada al Ing. Roberto!\n\nTu profesor ha sido notificado y verá tu alerta en el panel principal.');
        });
    }

    // Funcionalidad del Botón de Audio
    if (btnAudio) {
        btnAudio.addEventListener('click', () => {
            // Animación del botón para indicar que está "reproduciendo"
            const textoOriginal = btnAudio.innerHTML;
            btnAudio.innerHTML = '🔊 Reproduciendo...';
            btnAudio.style.backgroundColor = '#1d4ed8'; // Azul más oscuro

            // Simulamos el tiempo que dura el audio (3 segundos) y lo regresamos a la normalidad
            setTimeout(() => {
                btnAudio.innerHTML = textoOriginal;
                btnAudio.style.backgroundColor = ''; // Regresa al color de CSS
            }, 3000);
        });
    }

    // Funcionalidad de Cerrar Lección
    if (btnClose) {
        btnClose.addEventListener('click', () => {
            const confirmacion = confirm('¿Estás seguro de que deseas salir de la lección actual? Tu progreso de "VARIABLES" se guardará.');
            
            if (confirmacion) {
                // Si acepta, simulamos cerrar sesión mandándolo al login
                window.location.href = '../../../public/index.html';
            }
        });
    }

});