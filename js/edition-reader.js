/**
 * Edition Reader - Hybrid Engine
 * Desktop/Landscape: StPageFlip (3D)
 * Mobile Portrait: Native Slider (2D Performance)
 */

(function () {
    'use strict';

    // Configuración
    const API_URL = window.location.hostname.includes('bidxaagui.com')
        ? 'https://api.bidxaagui.com'
        : 'http://localhost:8787';

    // Elementos DOM Globales
    const modal = document.getElementById('reader-modal');
    const closeBtn = document.querySelector('.reader-close');
    const overlay = document.querySelector('.reader-modal-overlay');
    const loading = document.querySelector('.reader-loading');

    // Estado Global
    let currentState = {
        mode: null, // 'mobile' | 'desktop'
        pages: [],
        currentPage: 0,
        totalPages: 0,
        flipInstance: null, // Instancia de StPageFlip
        sliderElement: null // Referencia al slider móvil
    };

    /**
     * Entry Point: Abrir el lector
     */
    async function openReader(editionId) {
        // Reset Estado
        currentState = {
            mode: null,
            pages: [],
            currentPage: 0,
            totalPages: 0,
            flipInstance: null,
            sliderElement: null
        };

        // UI Inicial
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        loading.style.display = 'flex';

        // Limpiar contenedor previo
        const container = getContainer();
        container.innerHTML = '';

        try {
            // 1. Fetch Datos
            const response = await fetch(`${API_URL}/api/ediciones/${editionId}/pages`);
            if (!response.ok) throw new Error('Error de red');
            const data = await response.json();

            currentState.pages = data.data || [];
            currentState.totalPages = currentState.pages.length;

            if (currentState.pages.length === 0) throw new Error('Edición sin páginas');

            // 2. Precarga inteligente (primeras 3 páginas)
            await preloadImages(currentState.pages.slice(0, 3));

            loading.style.display = 'none';

            // 3. Decidir e iniciar motor
            initEngine();

            // 4. Listener de Resize (Rotación)
            window.addEventListener('resize', handleResize);

        } catch (error) {
            console.error(error);
            loading.innerHTML = `<p>Error al cargar. <button onclick="location.reload()">Reintentar</button></p>`;
        }
    }

    /**
     * Decide qué motor usar según el tamaño de pantalla
     */
    function initEngine() {
        const isMobilePortrait = window.matchMedia("(max-width: 768px) and (orientation: portrait)").matches;
        const targetMode = isMobilePortrait ? 'mobile' : 'desktop';

        // Si ya estamos en el modo correcto, no hacer nada (o solo resize)
        if (currentState.mode === targetMode && currentState.mode === 'desktop') {
            // StPageFlip maneja su propio resize, a veces requiere update
            if (currentState.flipInstance) currentState.flipInstance.updateFromHtml(document.querySelectorAll('.stf__item'));
            return;
        }

        // Si cambiamos de modo, destruir anterior
        destroyEngine();
        currentState.mode = targetMode;

        const container = getContainer();

        if (targetMode === 'mobile') {
            console.log('🚀 Iniciando Motor: Mobile Slider');
            initMobileSlider(container);
        } else {
            console.log('🚀 Iniciando Motor: Desktop 3D Flip');
            initDesktopFlip(container);
        }

        createControls(container);
        updateUI(0); // Empezar en pag 0
    }

    /**
     * Motor 1: Mobile Native Slider (Swipe nativo perfecto)
     */
    function initMobileSlider(container) {
        const slider = document.createElement('div');
        slider.className = 'mobile-slider-container';

        // Renderizar todas las páginas
        currentState.pages.forEach((page, index) => {
            const pageDiv = document.createElement('div');
            pageDiv.className = 'mobile-slider-page';

            // Lazy load simple
            const img = document.createElement('img');
            img.src = `${API_URL}/api/images/${page.imagen_url}`;
            if (index > 2) img.loading = "lazy";

            pageDiv.appendChild(img);
            slider.appendChild(pageDiv);
        });

        // Evento de Scroll para detectar cambio de página
        let scrollTimeout;
        slider.addEventListener('scroll', () => {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                const pageWidth = slider.clientWidth;
                const scrollLeft = slider.scrollLeft;
                const newIndex = Math.round(scrollLeft / pageWidth);

                if (newIndex !== currentState.currentPage) {
                    currentState.currentPage = newIndex;
                    updateUI(newIndex);
                }
            }, 50); // Debounce pequeño
        }, { passive: true });

        // Guardar referencia
        currentState.sliderElement = slider;
        container.appendChild(slider);
    }

    /**
     * Motor 2: StPageFlip (Desktop/Landscape)
     */
    function initDesktopFlip(container) {
        // Preparar HTML para StPageFlip
        container.innerHTML = ''; // Limpiar slider si había

        // Crear elementos requeridos por la librería
        currentState.pages.forEach((page, index) => {
            const div = document.createElement('div');
            div.className = 'stf__item';
            div.dataset.density = index === 0 ? 'hard' : 'soft';

            const img = document.createElement('img');
            img.src = `${API_URL}/api/images/${page.imagen_url}`;
            img.style.cssText = "width:100%; height:100%; object-fit: cover;";

            div.appendChild(img);
            container.appendChild(div);
        });

        // Configuración 3D
        const width = Math.min(600, window.innerWidth * 0.45);
        const height = width * 1.41; // A4 Ratio aprox

        try {
            const flip = new St.PageFlip(container, {
                width: width,
                height: height,
                size: 'fixed', // 'stretch' a veces falla en resize
                minWidth: 300,
                maxWidth: 1000,
                minHeight: 400,
                maxHeight: 1600,
                maxShadowOpacity: 0.5,
                showCover: true,
                mobileScrollSupport: false,
                flippingTime: 1000,
                usePortrait: false, // En desktop siempre queremos spread si es posible
                startPage: currentState.currentPage // Restaurar página si venimos de rotación
            });

            flip.loadFromHTML(container.querySelectorAll('.stf__item'));

            flip.on('flip', (e) => {
                currentState.currentPage = e.data;
                updateUI(e.data);
            });

            currentState.flipInstance = flip;
        } catch (e) {
            console.error("Fallo al iniciar StPageFlip", e);
        }
    }

    /**
     * UI: Controles y Actualización
     */
    function createControls(parent) {
        // Encontrar o crear wrapper de controles en el modal (fuera del container mutable)
        let controlsDiv = modal.querySelector('.flipbook-controls');
        if (controlsDiv) controlsDiv.remove();

        controlsDiv = document.createElement('div');
        controlsDiv.className = 'flipbook-controls';
        controlsDiv.innerHTML = `
            <div class="flipbook-nav-container">
                <button class="nav-btn prev" aria-label="Anterior">
                    <i class="fas fa-chevron-left"></i>
                </button>
                <div class="flipbook-counter">
                    <span id="page-curr">1</span> / <span id="page-total">${currentState.totalPages}</span>
                </div>
                <button class="nav-btn next" aria-label="Siguiente">
                    <i class="fas fa-chevron-right"></i>
                </button>
            </div>
        `;

        // Listeners Botones
        const prevBtn = controlsDiv.querySelector('.prev');
        const nextBtn = controlsDiv.querySelector('.next');

        prevBtn.onclick = () => navigate('prev');
        nextBtn.onclick = () => navigate('next');

        // Insertar controles en el modal content (no en el container del flipbook que se borra)
        modal.querySelector('.reader-modal-content').appendChild(controlsDiv);
    }

    function navigate(direction) {
        if (currentState.mode === 'mobile') {
            // Navegación Slider
            const slider = currentState.sliderElement;
            const pageWidth = slider.clientWidth;
            const targetPage = direction === 'next'
                ? currentState.currentPage + 1
                : currentState.currentPage - 1;

            if (targetPage >= 0 && targetPage < currentState.totalPages) {
                slider.scrollTo({
                    left: targetPage * pageWidth,
                    behavior: 'smooth'
                });
                // El evento scroll actualizará el estado
            }
        } else {
            // Navegación 3D
            if (currentState.flipInstance) {
                direction === 'next'
                    ? currentState.flipInstance.flipNext()
                    : currentState.flipInstance.flipPrev();
            }
        }
    }

    function updateUI(pageIndex) {
        // Actualizar Textos
        // Nota: página visual humana es index + 1
        const currEl = document.getElementById('page-curr');
        if (currEl) currEl.innerText = pageIndex + 1;

        // Actualizar botones (Deshabilitar extremos)
        const prevBtn = modal.querySelector('.nav-btn.prev');
        const nextBtn = modal.querySelector('.nav-btn.next');

        if (prevBtn) prevBtn.disabled = pageIndex === 0;
        if (nextBtn) {
            // En modo desktop 2 páginas, el final es complejo, simplificamos:
            nextBtn.disabled = pageIndex >= currentState.totalPages - 1;
        }
    }

    /**
     * Utilidades
     */
    function getContainer() {
        let el = document.getElementById('flipbook-container');
        if (!el) {
            el = document.createElement('div');
            el.id = 'flipbook-container';
            modal.querySelector('.reader-modal-content').appendChild(el);
        }
        return el;
    }

    function destroyEngine() {
        if (currentState.flipInstance) {
            currentState.flipInstance.destroy();
            currentState.flipInstance = null;
        }
        if (currentState.sliderElement) {
            currentState.sliderElement = null;
        }
        const container = document.getElementById('flipbook-container');
        if (container) container.innerHTML = '';
    }

    function closeReader() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
        window.removeEventListener('resize', handleResize);
        setTimeout(destroyEngine, 300); // Esperar animación cierre CSS
    }

    // Debounce resize
    let resizeTimer;
    function handleResize() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            initEngine(); // Re-evaluar qué motor usar
        }, 200);
    }

    function preloadImages(pagesSubset) {
        return Promise.all(pagesSubset.map(page => {
            return new Promise((resolve) => {
                const img = new Image();
                img.onload = resolve;
                img.onerror = resolve;
                img.src = `${API_URL}/api/images/${page.imagen_url}`;
            });
        }));
    }

    // --- Inicialización de Eventos Globales ---

    // Abrir (Delegación de eventos o directo si ya existen cards)
    document.querySelectorAll('.edition-card').forEach(card => {
        card.addEventListener('click', (e) => {
            // Buscar ID
            const id = card.dataset.editionId;
            if (id) openReader(id);
        });
    });

    // Cerrar
    closeBtn.addEventListener('click', closeReader);
    overlay.addEventListener('click', closeReader);
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeReader();
        if (!modal.classList.contains('active')) return;
        if (e.key === 'ArrowRight') navigate('next');
        if (e.key === 'ArrowLeft') navigate('prev');
    });

})();
