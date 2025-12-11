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
        const targetMode = isMobilePortrait ? 'mobile' : 'desktop';

        if (currentState.mode === targetMode) return;

        destroyEngine();
        currentState.mode = targetMode;

        const container = getContainer();

        if (targetMode === 'mobile') {
            initMobileSlider(container);
        } else {
            console.log('🚀 Iniciando Custom 3D Engine');
            // Mapear solo URLs para el constructor
            const imageUrls = currentState.pages.map(p => `${API_URL}/api/images/${p.imagen_url}`);
            currentState.engine = new CustomFlipbook(container, imageUrls, currentState.currentPage);
        }

        createControls();
        updateUI(currentState.currentPage);
    }

    /**
     * Motor 1: Mobile Native Slider
     */
    function initMobileSlider(container) {
        const slider = document.createElement('div');
        slider.className = 'mobile-slider-container';

        currentState.pages.forEach((page, index) => {
            const pageDiv = document.createElement('div');
            pageDiv.className = 'mobile-slider-page';
            const img = document.createElement('img');
            img.src = `${API_URL}/api/images/${page.imagen_url}`;
            if (index > 2) img.loading = "lazy";

            pageDiv.appendChild(img);
            slider.appendChild(pageDiv);
        });

        slider.addEventListener('scroll', debounce(() => {
            const pageWidth = slider.clientWidth;
            const scrollLeft = slider.scrollLeft;
            const newIndex = Math.round(scrollLeft / pageWidth);

            if (newIndex !== currentState.currentPage) {
                currentState.currentPage = newIndex;
                updateUI(newIndex);
            }
        }, 50), { passive: true });

        currentState.engine = slider;
        container.appendChild(slider);

        // Restaurar posición si aplica
        if (currentState.currentPage > 0) {
            setTimeout(() => {
                slider.scrollTo({ left: currentState.currentPage * slider.clientWidth });
            }, 50);
        }
    }

    /**
     * Class CustomFlipbook (Desktop Engine)
     */
    class CustomFlipbook {
        constructor(container, images, startIndex = 0) {
            this.container = container;
            this.images = images;
            this.currentLeaf = 0;
            this.totalLeafs = Math.ceil(images.length / 2);
            this.leafs = [];

            this.init(startIndex);
        }

        init(startIndex) {
            this.stage = document.createElement('div');
            this.stage.className = 'book-stage';

            // Calcular tamaño óptimo (Mantiene ratio A4 aprox)
            const stageHeight = Math.min(window.innerHeight * 0.9, 800);
            const stageWidth = stageHeight * 0.70 * 2; // *2 porque son 2 páginas abiertas
            // Pero en CSS la "leaf" es width 50% de stage?
            // MI ESTRATEGIA: El stage es el "libro abierto".
            // Una "leaf" es la mitad derecha.

            this.stage.style.width = `${stageWidth}px`;
            this.stage.style.height = `${stageHeight}px`;

            // Construir hojas (Leaves)
            // Leaf 0: Front=Img0, Back=Img1. (En libro real: Leaf 0 Front es Portada Derecha. Leaf 0 Back es Pag 2 Izquierda)
            // Espera, estructura libro:
            // Spread 0: [Vacío | Portada(0)] -> Leaf 0
            // Spread 1: [Pag 1 | Pag 2] -> Leaf 1?

            // Simplicidad:
            // Leaf 0: Recto=Img0 (Portada), Verso=Img1
            // Leaf 1: Recto=Img2, Verso=Img3
            // ...
            // Inicialmente todas están a la derecha (stack).
            // Flip Leaf 0 -> Img0 se va a la izquierda (oculta), vemos Img1 a la izquierda.

            for (let i = 0; i < this.totalLeafs; i++) {
                const leaf = document.createElement('div');
                leaf.className = 'book-leaf';
                // Leaf position: Absolute Right side (50% left, 50% width)
                leaf.style.left = '50%';
                leaf.style.width = '50%';
                leaf.style.zIndex = this.totalLeafs - i; // Stack order: 0 on top

                // Front Face (Recto)
                const front = document.createElement('div');
                front.className = 'book-page front';
                this.mkImg(front, this.images[i * 2]);

                // Back Face (Verso)
                const back = document.createElement('div');
                back.className = 'book-page back';
                this.mkImg(back, this.images[i * 2 + 1]);

                leaf.appendChild(front);
                leaf.appendChild(back);
                this.stage.appendChild(leaf);
                this.leafs.push(leaf);
            }

            this.container.appendChild(this.stage);
            setTimeout(() => this.stage.classList.add('loaded'), 10);

            // Ir a página inicial si necesario
            if (startIndex > 0) {
                // Approximate spread
                const targetLeaf = Math.floor(startIndex / 2);
                for (let i = 0; i < targetLeaf; i++) {
                    this.flipPage('next', false); // No animation
                }
            }
        }

        mkImg(container, src) {
            if (!src) {
                container.style.backgroundColor = '#f3f3f3'; // End paper
                return;
            }
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

        flipPage(dir, animate = true) {
            if (dir === 'next') {
                const leaf = this.leafs[this.currentLeaf];

                if (animate) {
                    leaf.style.transition = 'transform 1s cubic-bezier(0.645, 0.045, 0.355, 1)';
                    // Z-index High during flight
                    const baseZ = this.totalLeafs - this.currentLeaf;
                    leaf.style.zIndex = baseZ + 100;

                    setTimeout(() => {
                        // Landed on left stack
                        // Left stack order: 0 bottom, 1 top.
                        // zIndex = currentLeaf.
                        leaf.style.zIndex = this.currentLeaf;
                    }, 500); // Mitad de la animación
                } else {
                    leaf.style.transition = 'none';
                    leaf.style.zIndex = this.currentLeaf; // Instant land
                }

                leaf.classList.add('flipped');
                this.currentLeaf++;

            } else {
                this.currentLeaf--;
                const leaf = this.leafs[this.currentLeaf];

                if (animate) {
                    leaf.style.transition = 'transform 1s cubic-bezier(0.645, 0.045, 0.355, 1)';
                    // Flight Z handling
                    leaf.style.zIndex = this.totalLeafs + 100;

                    setTimeout(() => {
                        // Landed on right stack
                        leaf.style.zIndex = this.totalLeafs - this.currentLeaf;
                    }, 500);
                } else {
                    leaf.style.transition = 'none';
                    leaf.style.zIndex = this.totalLeafs - this.currentLeaf;
                }

                leaf.classList.remove('flipped');
            }

            // Callback externo para UI
            if (window.updateExternalUI) window.updateExternalUI(this.currentLeaf * 2);
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
