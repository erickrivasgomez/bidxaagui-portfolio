/**
 * Edition Reader Modal
 * Maneja el modal fullscreen para leer ediciones usando el admin portal público
 */

(function () {
    'use strict';

    // URLs del admin portal
    const ADMIN_URL = window.location.hostname.includes('bidxaagui.com')
        ? 'https://admin.bidxaagui.com'
        : 'http://localhost:5173';

    // Elementos del DOM
    const modal = document.getElementById('reader-modal');
    const iframe = document.getElementById('reader-iframe');
    const closeBtn = document.querySelector('.reader-close');
    const overlay = document.querySelector('.reader-modal-overlay');
    const loading = document.querySelector('.reader-loading');

    // Estado
    let currentEditionId = null;

    /**
     * Abre el modal del lector
     */
    function openReader(editionId) {
        currentEditionId = editionId;

        // Construir URL del admin público (sin autenticación requerida)
        const readerUrl = `${ADMIN_URL}/public/editions/${editionId}/preview`;

        // Mostrar modal
        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevenir scroll del body

        // Mostrar loading
        loading.style.display = 'flex';

        // Configurar iframe
        iframe.src = readerUrl;

        // Esperar a que cargue el iframe
        iframe.onload = function () {
            setTimeout(() => {
                loading.style.display = 'none';
                iframe.classList.add('loaded');
            }, 800); // Delay para permitir que el flipbook se inicialice
        };

        // Manejar errores de carga
        iframe.onerror = function () {
            loading.innerHTML = `
                <div style="text-align: center; color: #ff6b6b;">
                    <i class="fas fa-exclamation-triangle" style="font-size: 3rem; margin-bottom: 1rem;"></i>
                    <p>No se pudo cargar la edición</p>
                    <p style="font-size: 0.9rem; opacity: 0.8;">Por favor, intenta de nuevo más tarde</p>
                </div>
            `;
        };
    }

    /**
     * Cierra el modal del lector
     */
    function closeReader() {
        modal.classList.remove('active');
        document.body.style.overflow = ''; // Restaurar scroll

        // Pequeño delay antes de limpiar el iframe
        setTimeout(() => {
            iframe.src = '';
            iframe.classList.remove('loaded');
            currentEditionId = null;
        }, 300);
    }

    /**
     * Event Listeners
     */

    // Cards de ediciones clickeables
    const editionCards = document.querySelectorAll('.edition-card');
    editionCards.forEach(card => {
        card.addEventListener('click', function (e) {
            e.preventDefault();
            const editionId = this.dataset.editionId;
            if (editionId) {
                openReader(editionId);
            }
        });

        // Accesibilidad: permitir Enter y Space
        card.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const editionId = this.dataset.editionId;
                if (editionId) {
                    openReader(editionId);
                }
            }
        });

        // Hacer las cards tabbable
        card.setAttribute('tabindex', '0');
        card.setAttribute('role', 'button');
        card.setAttribute('aria-label', `Abrir ${card.querySelector('span')?.textContent}`);
    });

    // Botón cerrar
    if (closeBtn) {
        closeBtn.addEventListener('click', closeReader);
    }

    // Click en overlay
    if (overlay) {
        overlay.addEventListener('click', closeReader);
    }

    // Tecla ESC
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeReader();
        }
    });

    // Prevenir cierre accidental
    window.addEventListener('beforeunload', function (e) {
        if (modal.classList.contains('active')) {
            // Opcional: mostrar confirmación si hay una edición abierta
            // e.preventDefault();
            // e.returnValue = '';
        }
    });

    // Mensaje del iframe (comunicación cross-origin si es necesario)
    window.addEventListener('message', function (e) {
        // Validar origen por seguridad
        if (e.origin === ADMIN_URL) {
            // Aquí puedes manejar mensajes del iframe si lo necesitas en el futuro
            // Por ejemplo: cerrar modal, tracking de páginas, etc.
            if (e.data.type === 'closeReader') {
                closeReader();
            }
        }
    });

})();
