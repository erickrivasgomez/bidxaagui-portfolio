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
    const closeBtn = document.querySelector('.reader-close');
    const overlay = document.querySelector('.reader-modal-overlay');
    const loading = document.querySelector('.reader-loading');

    // Estado
    let currentEditionId = null;

    /**
     * Abre el modal del lector con flipbook custom
     */
    async function openReader(editionId) {
        currentEditionId = editionId;

        // Mostrar modal
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Mostrar loading
        loading.style.display = 'flex';
        loading.innerHTML = `
            <div style="text-align: center;">
                <div class="loading-spinner"></div>
                <p style="margin-top: 16px;">Cargando edición...</p>
            </div>
        `;

        try {
            // Obtener páginas desde la API
            const apiUrl = window.location.hostname.includes('bidxaagui.com')
                ? 'https://api.bidxaagui.com'
                : 'http://localhost:8787';

            const response = await fetch(`${apiUrl}/api/ediciones/${editionId}/pages`);

            if (!response.ok) {
                throw new Error('Error al cargar las páginas');
            }

            const data = await response.json();
            const pages = data.data;

            if (!pages || pages.length === 0) {
                throw new Error('No se encontraron páginas');
            }

            // Preparar datos para el flipbook
            const pagesData = pages.map((page, index) => ({
                url: `${apiUrl}/api/images/${page.imagen_url}`,
                number: page.numero || index + 1
            }));

            // Ocultar loading
            loading.style.display = 'none';

            // Crear contenedor del flipbook si no existe
            let flipbookContainer = document.getElementById('flipbook-container');
            if (!flipbookContainer) {
                flipbookContainer = document.createElement('div');
                flipbookContainer.id = 'flipbook-container';
                flipbookContainer.className = 'reader-flipbook';
                modal.querySelector('.reader-modal-overlay').appendChild(flipbookContainer);
            }

            // Limpiar contenedor
            flipbookContainer.innerHTML = '';
            flipbookContainer.style.display = 'block';

            // Inicializar flipbook
            const flipbook = new window.Flipbook(flipbookContainer, {
                animationDuration: 1000,
                onPageFlip: (pageIndex) => {
                    console.log('Página actual:', pageIndex + 1);
                }
            });

            flipbook.loadPages(pagesData);

            // Guardar referencia
            window.currentFlipbook = flipbook;

        } catch (error) {
            console.error('Error al cargar edición:', error);
            loading.innerHTML = `
                <div style="text-align: center; color: #ff6b6b;">
                    <i class="fas fa-exclamation-triangle" style="font-size: 3rem; margin-bottom: 1rem;"></i>
                    <p>No se pudo cargar la edición</p>
                    <p style="font-size: 0.9rem; opacity: 0.8;">Por favor, intenta de nuevo más tarde</p>
                </div>
            `;
        }
    }

    /**
     * Cierra el modal del lector
     */
    function closeReader() {
        modal.classList.remove('active');
        document.body.style.overflow = ''; // Restaurar scroll

        // Pequeño delay antes de limpiar
        setTimeout(() => {
            // Destruir flipbook si existe
            if (window.currentFlipbook) {
                window.currentFlipbook.destroy();
                window.currentFlipbook = null;
            }

            // Limpiar contenedor
            const flipbookContainer = document.getElementById('flipbook-container');
            if (flipbookContainer) {
                flipbookContainer.style.display = 'none';
                flipbookContainer.innerHTML = '';
            }

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
