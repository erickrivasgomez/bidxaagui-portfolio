/**
 * Edition Reader - Hybrid Engine v2 (Custom 3D + Native Slider)
 * Desktop/Landscape: Custom 3D CSS Engine (No external lib)
 * Mobile Portrait: Native Slider (Performance)
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
        mode: null,
        pages: [], // Array de objetos {imagen_url}
        currentPage: 0,
        totalPages: 0,
        engine: null, // Instancia de CustomFlipbook o referencia al slider
    };

    /**
     * Entry Point: Abrir el lector
     */
    async function openReader(editionId) {
        currentState = { mode: null, pages: [], currentPage: 0, totalPages: 0, engine: null };

        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        loading.style.display = 'flex';

        const container = getContainer();
        container.innerHTML = '';

        try {
            const response = await fetch(`${API_URL}/api/ediciones/${editionId}/pages`);
            if (!response.ok) throw new Error('Error de red');
            const data = await response.json();

            currentState.pages = data.data || [];
            currentState.totalPages = currentState.pages.length;

            if (currentState.pages.length === 0) throw new Error('Edición sin páginas');

            await preloadImages(currentState.pages.slice(0, 4)); // Cargar primeras 4

            loading.style.display = 'none';

            initEngine();

            window.addEventListener('resize', handleResize);

        } catch (error) {
            console.error(error);
            loading.innerHTML = `<p>Error. <button onclick="location.reload()">Reintentar</button></p>`;
        }
    }

    /**
     * Motor Select
     */
    function initEngine() {
        const isMobilePortrait = window.matchMedia("(max-width: 768px) and (orientation: portrait)").matches;
        // const targetMode = isMobilePortrait ? 'mobile' : 'desktop';
        // FORZAMOS DESKTOP ENGINE (CustomFlipbook) CON CONFIGURACIÓN SINGLE PARA MÓVIL
        const targetMode = 'custom_3d';

        if (currentState.mode === targetMode && currentState.engine) {
            // Si solo es resize pero mismo motor, actualizar layout
            currentState.engine.resize(isMobilePortrait);
            return;
        }

        destroyEngine();
        currentState.mode = targetMode;

        const container = getContainer();

        console.log('🚀 Iniciando Custom 3D Engine (Adaptativo)');
        const imageUrls = currentState.pages.map(p => `${API_URL}/api/images/${p.imagen_url}`);

        // Instanciar con modo single si es mobile portrait
        currentState.engine = new CustomFlipbook(container, imageUrls, currentState.currentPage, isMobilePortrait);

        createControls();
        updateUI(currentState.currentPage);
    }

    /**
     * (Eliminada función initMobileSlider antigua para usar siempre 3D)
     */

    /**
     * Class CustomFlipbook (Universal 3D Engine)
     */
    class CustomFlipbook {
        constructor(container, images, startIndex = 0, isSingleMode = false) {
            this.container = container;
            this.images = images;
            this.isSingleMode = isSingleMode;

            // En Single Mode: 1 imagen = 1 hoja (Leaf). Total Leafs = N imágenes.
            // En Spread Mode: 2 imágenes = 1 hoja (Front/Back). Total Leafs = N/2.
            this.totalLeafs = this.isSingleMode ? images.length : Math.ceil(images.length / 2);

            // Current Leaf Index (0..N)
            this.currentLeaf = 0;
            if (startIndex > 0) {
                this.currentLeaf = this.isSingleMode ? startIndex : Math.floor(startIndex / 2);
            }

            this.leafs = [];
            this.init();
        }

        init() {
            this.stage = document.createElement('div');
            this.stage.className = `book-stage ${this.isSingleMode ? 'single-mode' : 'spread-mode'}`;

            // Construir hojas (DOM structure only, no images yet)
            for (let i = 0; i < this.totalLeafs; i++) {
                const leaf = document.createElement('div');
                leaf.className = 'book-leaf';
                leaf.style.zIndex = this.totalLeafs - i + 10;

                // Ocultar hojas lejanas para ahorrar memoria GPU (CRÍTICO PARA IOS)
                // Solo mostramos las primeras 2 al inicio
                if (i > 1 && i !== this.currentLeaf) {
                    leaf.style.display = 'none';
                }

                const front = document.createElement('div');
                front.className = 'book-page front';
                const back = document.createElement('div');
                back.className = 'book-page back';

                // MODO SINGLE vs SPREAD (URLs mapping)
                // Guardamos la URL en dataset para carga lazy
                if (this.isSingleMode) {
                    front.dataset.src = this.images[i];
                    back.style.backgroundColor = '#ddd';
                } else {
                    front.dataset.src = this.images[i * 2];
                    back.dataset.src = this.images[i * 2 + 1];
                }

                leaf.appendChild(front);
                leaf.appendChild(back);
                this.stage.appendChild(leaf);
                this.leafs.push(leaf);

                if (i < this.currentLeaf) {
                    leaf.classList.add('flipped');
                    leaf.style.zIndex = 100 + i;
                }
            }

            this.container.appendChild(this.stage);
            this.resize(this.isSingleMode);

            // Actualizar visibilidad y cargar imágenes iniciales
            this.updateVisibility();

            setTimeout(() => this.stage.classList.add('loaded'), 50);
        }

        resize(isSingle) {
            this.isSingleMode = isSingle;
            if (this.stage) this.stage.className = `book-stage ${this.isSingleMode ? 'single-mode' : 'spread-mode'}`;
            // Recalcular dimensiones CSS si fuera necesario
            // CSS classes .single-mode vs .spread-mode manejan el layout (ver CSS)
        }

        // Carga diferida de imágenes
        updateVisibility() {
            // Rango de visibilidad: Current - 2 hasta Current + 2
            // Esto asegura que la animación tenga recursos listos pero no sature memoria
            const range = 2;
            const min = Math.max(0, this.currentLeaf - range);
            const max = Math.min(this.totalLeafs - 1, this.currentLeaf + range);

            this.leafs.forEach((leaf, i) => {
                // VISIBILIDAD DOM (GPU Memory)
                if (i >= min && i <= max) {
                    leaf.style.display = 'block';
                    // Cargar imágenes si no están cargadas
                    this.loadLeafImages(leaf);
                } else {
                    leaf.style.display = 'none';
                    // Opcional: Podríamos descargar imágenes aquí si la memoria es muy crítica
                }
            });
        }

        loadLeafImages(leaf) {
            const pages = leaf.querySelectorAll('.book-page');
            pages.forEach(page => {
                if (page.dataset.src && !page.querySelector('img')) {
                    const img = document.createElement('img');
                    img.src = page.dataset.src;
                    page.removeAttribute('data-src'); // Limpiar
                    page.appendChild(img);
                }
            });
        }

        mkImg(container, src) {
            if (!src) return;
            const img = document.createElement('img');
            img.src = src;
            container.appendChild(img);
        }

        flipNext() {
            if (this.currentLeaf >= this.totalLeafs) return;
            this.flipPage('next');
        }

        flipPrev() {
            if (this.currentLeaf <= 0) return;
            this.flipPage('prev');
        }

        flipPage(dir) {
            if (dir === 'next') {
                const leaf = this.leafs[this.currentLeaf];
                if (!leaf) return;

                // Asegurar que la hoja siguiente sea visible antes de animar
                if (this.currentLeaf + 1 < this.totalLeafs) {
                    this.leafs[this.currentLeaf + 1].style.display = 'block';
                    this.loadLeafImages(this.leafs[this.currentLeaf + 1]);
                }

                leaf.style.transition = 'transform 0.8s cubic-bezier(0.645, 0.045, 0.355, 1)';

                // Z-Index durante vuelo: ¡Debe estar encima de todo!
                leaf.style.zIndex = 1000;

                leaf.classList.add('flipped');

                // Al terminar, ajustar z-index para apilarse correctamente a la izquierda
                const myIndex = this.currentLeaf;
                setTimeout(() => {
                    leaf.style.zIndex = 100 + myIndex; // 100 base para flipped stack
                    // Limpieza post-animación
                    this.updateVisibility();
                }, 400); // A mitad de camino

                this.currentLeaf++;

            } else {
                this.currentLeaf--;
                const leaf = this.leafs[this.currentLeaf];
                if (!leaf) return;

                // Asegurar visible
                leaf.style.display = 'block';
                this.loadLeafImages(leaf);

                leaf.style.transition = 'transform 0.8s cubic-bezier(0.645, 0.045, 0.355, 1)';
                leaf.style.zIndex = 1000; // Vuelo retorno

                leaf.classList.remove('flipped');

                const myIndex = this.currentLeaf;
                setTimeout(() => {
                    leaf.style.zIndex = this.totalLeafs - myIndex + 10; // Restaurar orden original derecho
                    this.updateVisibility();
                }, 400);
            }

            // Callback UI
            const realPage = this.isSingleMode ? this.currentLeaf : this.currentLeaf * 2;
            if (window.updateExternalUI) window.updateExternalUI(realPage);
        }

        destroy() {
            this.container.innerHTML = '';
        }
    }

    /**
     * UI & Events
     */
    function createControls() {
        let controlsDiv = modal.querySelector('.flipbook-controls');
        if (controlsDiv) controlsDiv.remove();

        controlsDiv = document.createElement('div');
        controlsDiv.className = 'flipbook-controls';
        controlsDiv.innerHTML = `
            <div class="flipbook-nav-container">
                <button class="flipbook-nav prev" aria-label="Anterior">
                    <i class="fas fa-chevron-left"></i>
                </button>
                <div class="flipbook-counter">
                    <span id="page-curr">1</span> / <span id="page-total">${currentState.totalPages}</span>
                </div>
                <button class="flipbook-nav next" aria-label="Siguiente">
                    <i class="fas fa-chevron-right"></i>
                </button>
            </div>
        `;

        const prevBtn = controlsDiv.querySelector('.prev');
        const nextBtn = controlsDiv.querySelector('.next');

        prevBtn.onclick = (e) => { e.stopPropagation(); navigate('prev'); };
        nextBtn.onclick = (e) => { e.stopPropagation(); navigate('next'); };

        modal.querySelector('.reader-modal-content').appendChild(controlsDiv);
    }

    function navigate(dir) {
        if (currentState.mode === 'mobile') {
            const slider = currentState.engine;
            const targetPage = dir === 'next' ? currentState.currentPage + 1 : currentState.currentPage - 1;
            if (targetPage >= 0 && targetPage < currentState.totalPages) {
                slider.scrollTo({ left: targetPage * slider.clientWidth, behavior: 'smooth' });
            }
        } else {
            // Desktop Custom
            dir === 'next' ? currentState.engine.flipNext() : currentState.engine.flipPrev();
        }
    }

    function updateUI(idx) {
        const currEl = document.getElementById('page-curr');
        if (currEl) currEl.innerText = idx + 1;

        // Expose callback for class
        window.updateExternalUI = (newIdx) => {
            currentState.currentPage = newIdx;
            if (currEl) currEl.innerText = newIdx + 1;
            updateButtons(newIdx);
        };
        updateButtons(idx);
    }

    function updateButtons(idx) {
        const prev = modal.querySelector('.flipbook-nav.prev');
        const next = modal.querySelector('.flipbook-nav.next');
        if (prev) prev.disabled = idx === 0;
        if (next) next.disabled = idx >= currentState.totalPages - 1;
    }

    // Utilidades
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
        if (currentState.engine && currentState.engine.destroy) currentState.engine.destroy();
        const c = document.getElementById('flipbook-container');
        if (c) c.innerHTML = '';
        currentState.engine = null;
    }

    function closeReader() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
        window.removeEventListener('resize', handleResize);
        setTimeout(destroyEngine, 200);
    }

    function debounce(func, wait) {
        let timeout;
        return function (...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }

    let resizeTimer;
    function handleResize() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(initEngine, 200);
    }

    function preloadImages(pages) {
        return Promise.all(pages.map(p => {
            const i = new Image();
            i.src = `${API_URL}/api/images/${p.imagen_url}`;
            return new Promise(r => { i.onload = r; i.onerror = r; });
        }));
    }

    // Init Events
    document.querySelectorAll('.edition-card').forEach(card => {
        card.addEventListener('click', () => openReader(card.dataset.editionId));
    });

    closeBtn.addEventListener('click', closeReader);
    overlay.addEventListener('click', closeReader);
    document.addEventListener('keydown', (e) => {
        if (!modal.classList.contains('active')) return;
        if (e.key === 'Escape') closeReader();
        if (e.key === 'ArrowRight') navigate('next');
        if (e.key === 'ArrowLeft') navigate('prev');
    });

})();
