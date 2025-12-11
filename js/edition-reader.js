/**
 * Edition Reader usando StPageFlip
 * Implementación con librería page-flip para animaciones realistas
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
    let pageFlipInstance = null;

    /**
     * Abre el modal del lector con StPageFlip
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

            // Ocultar loading
            loading.style.display = 'none';

            // Crear contenedor del flipbook si no existe
            let flipbookContainer = document.getElementById('flipbook-container');
            if (!flipbookContainer) {
                flipbookContainer = document.createElement('div');
                flipbookContainer.id = 'flipbook-container';
                flipbookContainer.className = 'stf__parent';
                modal.querySelector('.reader-modal-content').appendChild(flipbookContainer);
            }

            console.log('Flipbook container:', flipbookContainer);

            // Limpiar contenedor
            flipbookContainer.innerHTML = '';
            flipbookContainer.style.display = 'flex';
            flipbookContainer.style.width = '100%';
            flipbookContainer.style.height = '100%';

            // Crear elementos de página
            console.log('Creando', pages.length, 'páginas');
            pages.forEach((page, index) => {
                const pageEl = document.createElement('div');
                pageEl.className = 'stf__item';
                pageEl.dataset.density = index === 0 ? 'hard' : 'soft';

                const img = document.createElement('img');
                img.src = `${apiUrl}/api/images/${page.imagen_url}`;
                img.alt = `Página ${index + 1}`;
                img.style.width = '100%';
                img.style.height = '100%';
                img.style.objectFit = 'cover';

                console.log('Página', index + 1, 'URL:', img.src);

                pageEl.appendChild(img);
                flipbookContainer.appendChild(pageEl);
            });

            // Esperar a que las imágenes carguen antes de inicializar
            console.log('Esperando carga de imágenes...');
            await waitForImagesToLoad(flipbookContainer);
            console.log('Imágenes cargadas, inicializando StPageFlip...');

            // Inicializar StPageFlip
            initializePageFlip(flipbookContainer, pages.length);

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
     * Esperar a que las imágenes se carguen
     */
    function waitForImagesToLoad(container) {
        const images = container.querySelectorAll('img');
        const promises = Array.from(images).map(img => {
            return new Promise((resolve) => {
                if (img.complete) {
                    resolve();
                } else {
                    img.onload = () => resolve();
                    img.onerror = () => resolve(); // Resolver incluso si hay error
                }
            });
        });
        return Promise.all(promises);
    }

    /**
     * Inicializar StPageFlip con configuración adaptativa
     */
    function initializePageFlip(container, totalPages) {
        console.log('=== Inicializando StPageFlip ===');
        console.log('Container:', container);
        console.log('Total páginas:', totalPages);
        console.log('Librería disponible:', typeof St !== 'undefined');

        if (typeof St === 'undefined' || typeof St.PageFlip === 'undefined') {
            console.error('StPageFlip no está cargado!');
            alert('Error: La librería StPageFlip no se cargó correctamente.');
            return;
        }

        // Detectar modo
        const isMobile = window.innerWidth < 768;
        const isPortrait = window.innerHeight > window.innerWidth;

        console.log('isMobile:', isMobile, 'isPortrait:', isPortrait);

        // Calcular dimensiones
        const containerW = window.innerWidth;
        const containerH = window.innerHeight;

        let width, height;

        if (isMobile && isPortrait) {
            // Mobile Portrait: 1 página
            width = Math.floor(containerW * 0.9);
            height = Math.floor(width / 0.7);

            if (height > containerH * 0.85) {
                height = Math.floor(containerH * 0.85);
                width = Math.floor(height * 0.7);
            }
        } else {
            // Desktop y Mobile Landscape: 2 páginas
            height = Math.floor(containerH * 0.9);
            width = Math.floor(height * 0.7);

            if ((width * 2) > containerW * 0.9) {
                width = Math.floor((containerW * 0.9) / 2);
                height = Math.floor(width / 0.7);
            }
        }

        console.log('Dimensiones calculadas - width:', width, 'height:', height);

        // Configuración de StPageFlip - CORREGIDA PARA IOS
        const config = {
            width: width,
            height: height,
            size: 'fixed',
            minWidth: 300,
            maxWidth: 1000,
            minHeight: 400,
            maxHeight: 1600,
            maxShadowOpacity: 0.5,
            showCover: true,
            mobileScrollSupport: false, // Mantener desactivado para control manual
            usePortrait: isMobile && isPortrait,
            startPage: 0,
            drawShadow: true,
            flippingTime: 800,
            useMouseEvents: true, // REACTIVAR: Necesario para que el motor interno funcione en iOS
            swipeDistance: 30, // Restaurar valor razonable
            clickEventForward: true,
            disableFlipByClick: true // Pero desactivar el flip por click nativo
        };

        console.log('Configuración:', config);

        try {
            // Obtener todos los elementos de página
            const pageElements = container.querySelectorAll('.stf__item, div[data-density]');

            if (pageElements.length === 0) return;

            // Crear instancia
            pageFlipInstance = new St.PageFlip(container, config);
            pageFlipInstance.loadFromHTML(pageElements);

            // Event listeners DE LA INSTANCIA
            pageFlipInstance.on('flip', (e) => {
                updatePageCounter(e.data, totalPages);
                updateButtonsState(e.data, totalPages);
            });

            // Crear controles visuales
            createNavigationControls();

            // Actualizar estado inicial
            updatePageCounter(0, totalPages);
            updateButtonsState(0, totalPages);

            // === CONTROLADOR TÁCTIL HÍBRIDO ===
            // Usamos un overlay transparente para capturar gestos sin interferir con el canvas subyacente

            // Crear overlay de gestos
            const gestureOverlay = document.createElement('div');
            gestureOverlay.style.position = 'absolute';
            gestureOverlay.style.top = '0';
            gestureOverlay.style.left = '0';
            gestureOverlay.style.width = '100%';
            gestureOverlay.style.height = '100%';
            gestureOverlay.style.zIndex = '20'; // Encima del canvas del flipbook
            // Importante: touch-action: pan-y permite scroll vertical del navegador pero captura horizontal
            gestureOverlay.style.touchAction = 'pan-y';

            // Insertar overlay DENTRO del stf__parent pero ENCIMA del wrapper
            container.appendChild(gestureOverlay);

            let touchStartX = 0;
            let touchStartY = 0;
            const touchThreshold = 30;

            gestureOverlay.addEventListener('touchstart', (e) => {
                touchStartX = e.changedTouches[0].screenX;
                touchStartY = e.changedTouches[0].screenY;
            }, { passive: true });

            gestureOverlay.addEventListener('touchend', (e) => {
                const touchEndX = e.changedTouches[0].screenX;
                const touchEndY = e.changedTouches[0].screenY;

                const diffX = touchStartX - touchEndX;
                const diffY = touchStartY - touchEndY;

                // Si es un movimiento horizontal claro
                if (Math.abs(diffX) > Math.abs(diffY)) {
                    if (Math.abs(diffX) > touchThreshold) {
                        e.preventDefault(); // Evitar scroll horizontal del navegador si lo hubiera
                        if (diffX > 0) {
                            pageFlipInstance.flipNext();
                        } else {
                            pageFlipInstance.flipPrev();
                        }
                    }
                } else if (Math.abs(diffX) < 10 && Math.abs(diffY) < 10) {
                    // Tap setup
                    const screenWidth = window.innerWidth;
                    const touchX = e.changedTouches[0].clientX;

                    // Zona de retroceso expandida (40%)
                    if (touchX < (screenWidth * 0.40)) {
                        pageFlipInstance.flipPrev();
                    } else {
                        pageFlipInstance.flipNext();
                    }
                }
            }, { passive: false }); // passive: false para poder llamar preventDefault si es necesario

            console.log('=== StPageFlip con Gesture Overlay Inicializado ===');

        } catch (error) {
            console.error('Error al inicializar PageFlip:', error);
            alert('Error al inicializar el lector: ' + error.message);
        }
    }

    /**
     * Crear controles de navegación
     */
    function createNavigationControls() {
        // Eliminar controles anteriores si existen
        const oldControls = document.querySelector('.flipbook-controls');
        if (oldControls) oldControls.remove();

        const controls = document.createElement('div');
        controls.className = 'flipbook-controls';
        controls.innerHTML = `
            <div class="flipbook-nav-container">
                <button class="flipbook-nav flipbook-prev" aria-label="Página anterior">
                    <i class="fas fa-chevron-left"></i>
                </button>
                <div class="flipbook-counter">
                    <span class="current-page">1</span> / <span class="total-pages">0</span>
                </div>
                <button class="flipbook-nav flipbook-next" aria-label="Página siguiente">
                    <i class="fas fa-chevron-right"></i>
                </button>
            </div>
        `;

        modal.querySelector('.reader-modal-content').appendChild(controls);

        // Event listeners para botones (asegurando la dirección correcta)
        const prevBtn = controls.querySelector('.flipbook-prev');
        const nextBtn = controls.querySelector('.flipbook-next');

        prevBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // Evitar que burbujee al overlay
            console.log('Click Anterior');
            if (pageFlipInstance) pageFlipInstance.flipPrev();
        });

        nextBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            console.log('Click Siguiente');
            if (pageFlipInstance) pageFlipInstance.flipNext();
        });
    }

    /**
     * Actualizar estado visual de los botones
     */
    function updateButtonsState(pageIndex, totalPages) {
        const prevBtn = document.querySelector('.flipbook-prev');
        const nextBtn = document.querySelector('.flipbook-next');

        if (prevBtn && nextBtn) {
            // Deshabilitar prev si es la primera página
            prevBtn.disabled = pageIndex === 0;
            prevBtn.style.opacity = pageIndex === 0 ? '0.2' : '';

            // Deshabilitar next si es la última
            // Nota: en modo portrait totalPages puede variar según cómo cuenta la librería, 
            // pero pageIndex llega hasta total-1 (o total-2 si es spread)
            // Simplificamos chequeando si es la última o penúltima
            nextBtn.disabled = pageIndex >= totalPages - 1;
            nextBtn.style.opacity = pageIndex >= totalPages - 1 ? '0.2' : '';
        }
    }

    /**
     * Actualizar contador de páginas
     */
    function updatePageCounter(currentPage, totalPages) {
        const currentEl = document.querySelector('.flipbook-counter .current-page');
        const totalEl = document.querySelector('.flipbook-counter .total-pages');

        if (currentEl && totalEl) {
            currentEl.textContent = currentPage + 1;
            totalEl.textContent = totalPages;
        }
    }

    /**
     * Cierra el modal del lector
     */
    function closeReader() {
        modal.classList.remove('active');
        document.body.style.overflow = '';

        setTimeout(() => {
            // Destruir instancia de PageFlip
            if (pageFlipInstance) {
                pageFlipInstance.destroy();
                pageFlipInstance = null;
            }

            // Limpiar contenedor
            const flipbookContainer = document.getElementById('flipbook-container');
            if (flipbookContainer) {
                flipbookContainer.style.display = 'none';
                flipbookContainer.innerHTML = '';
            }

            // Limpiar controles
            const controls = document.querySelector('.flipbook-controls');
            if (controls) controls.remove();

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

        // Accesibilidad
        card.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const editionId = this.dataset.editionId;
                if (editionId) {
                    openReader(editionId);
                }
            }
        });

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

    // Navegación con teclas de flecha
    document.addEventListener('keydown', function (e) {
        if (modal.classList.contains('active') && pageFlipInstance) {
            if (e.key === 'ArrowLeft') {
                pageFlipInstance.flipPrev();
            } else if (e.key === 'ArrowRight') {
                pageFlipInstance.flipNext();
            }
        }
    });

})();
