/**
 * Custom Flipbook Component - Modo Libro Real (2 páginas en desktop/landscape)
 * Flipbook nativo sin dependencias externas
 */

class Flipbook {
    constructor(container, options = {}) {
        this.container = container;
        this.pages = [];
        this.currentSpread = 0; // Índice del spread actual
        this.isAnimating = false;
        this.isMobile = window.innerWidth < 768;
        this.isPortrait = window.innerHeight > window.innerWidth;

        // Determinar modo de vista (spread = 2 páginas, single = 1 página)
        this.viewMode = this.getViewMode();

        // Opciones
        this.options = {
            animationDuration: options.animationDuration || 1000,
            onPageFlip: options.onPageFlip || (() => { }),
            ...options
        };

        this.init();
    }

    getViewMode() {
        // Desktop o Mobile Landscape = 2 páginas (spread)
        // Mobile Portrait = 1 página (single)
        if (!this.isMobile || (this.isMobile && !this.isPortrait)) {
            return 'spread'; // 2 páginas lado a lado
        }
        return 'single'; // 1 página
    }

    init() {
        this.container.classList.add('flipbook-container');
        this.container.classList.add(`mode-${this.viewMode}`);
        this.createStructure();
        this.attachEvents();

        // Responsive listener
        window.addEventListener('resize', this.handleResize.bind(this));
    }

    createStructure() {
        this.container.innerHTML = `
            <div class="flipbook-stage">
                <div class="flipbook-book">
                    <div class="flipbook-left-page"></div>
                    <div class="flipbook-right-page"></div>
                </div>
            </div>
            <button class="flipbook-nav flipbook-prev" aria-label="Página anterior">‹</button>
            <button class="flipbook-nav flipbook-next" aria-label="Página siguiente">›</button>
            <div class="flipbook-counter">
                <span class="current-page">1</span> / <span class="total-pages">0</span>
            </div>
        `;

        this.leftPageEl = this.container.querySelector('.flipbook-left-page');
        this.rightPageEl = this.container.querySelector('.flipbook-right-page');
        this.prevBtn = this.container.querySelector('.flipbook-prev');
        this.nextBtn = this.container.querySelector('.flipbook-next');
        this.currentPageEl = this.container.querySelector('.current-page');
        this.totalPagesEl = this.container.querySelector('.total-pages');
    }

    loadPages(pagesData) {
        this.pages = pagesData;
        this.totalPagesEl.textContent = pagesData.length;
        this.showSpread(0);
    }

    showSpread(spreadIndex) {
        if (this.isAnimating) return;

        this.currentSpread = spreadIndex;

        if (this.viewMode === 'spread') {
            // Modo 2 páginas: Mostrar página izquierda y derecha
            const leftIndex = spreadIndex * 2;
            const rightIndex = leftIndex + 1;

            this.renderPage(this.leftPageEl, leftIndex, 'left');
            this.renderPage(this.rightPageEl, rightIndex, 'right');

            // Actualizar contador (mostrar página derecha si existe, si no la izquierda)
            const displayPage = rightIndex < this.pages.length ? rightIndex + 1 : leftIndex + 1;
            this.currentPageEl.textContent = displayPage;

            // Actualizar botones
            this.prevBtn.disabled = spreadIndex === 0;
            this.nextBtn.disabled = rightIndex >= this.pages.length - 1;
        } else {
            // Modo 1 página: Solo mostrar en página derecha
            this.leftPageEl.innerHTML = '';
            this.renderPage(this.rightPageEl, spreadIndex, 'single');

            this.currentPageEl.textContent = spreadIndex + 1;
            this.prevBtn.disabled = spreadIndex === 0;
            this.nextBtn.disabled = spreadIndex >= this.pages.length - 1;
        }

        this.options.onPageFlip(this.currentSpread);
    }

    renderPage(container, pageIndex, position) {
        container.innerHTML = '';
        container.className = `flipbook-${position}-page`;

        if (pageIndex >= this.pages.length) {
            // Página vacía
            container.classList.add('empty');
            return;
        }

        const pageData = this.pages[pageIndex];
        const img = document.createElement('img');
        img.src = pageData.url;
        img.alt = `Página ${pageIndex + 1}`;
        img.loading = pageIndex < 4 ? 'eager' : 'lazy';

        container.appendChild(img);
    }

    nextPage() {
        if (this.isAnimating) return;

        if (this.viewMode === 'spread') {
            const nextSpread = this.currentSpread + 1;
            const maxSpread = Math.ceil(this.pages.length / 2) - 1;

            if (nextSpread > maxSpread) return;

            this.animateFlip('forward', nextSpread);
        } else {
            if (this.currentSpread >= this.pages.length - 1) return;
            this.animateFlip('forward', this.currentSpread + 1);
        }
    }

    prevPage() {
        if (this.isAnimating || this.currentSpread <= 0) return;

        const prevSpread = this.currentSpread - 1;
        this.animateFlip('backward', prevSpread);
    }

    animateFlip(direction, targetSpread) {
        this.isAnimating = true;
        const isForward = direction === 'forward';

        // Aplicar clase de animación
        if (isForward) {
            this.rightPageEl.classList.add('flipping-forward');
        } else {
            this.leftPageEl.classList.add('flipping-backward');
        }

        // Cambiar de spread después de la animación
        setTimeout(() => {
            this.showSpread(targetSpread);
            this.rightPageEl.classList.remove('flipping-forward');
            this.leftPageEl.classList.remove('flipping-backward');
            this.isAnimating = false;
        }, this.options.animationDuration);
    }

    attachEvents() {
        this.prevBtn.addEventListener('click', () => this.prevPage());
        this.nextBtn.addEventListener('click', () => this.nextPage());

        // Keyboard navigation
        const handleKeyboard = (e) => {
            if (e.key === 'ArrowLeft') this.prevPage();
            if (e.key === 'ArrowRight') this.nextPage();
        };
        document.addEventListener('keydown', handleKeyboard);
        this.handleKeyboard = handleKeyboard;

        // Touch swipe
        let touchStartX = 0;
        let touchEndX = 0;

        const handleTouchStart = (e) => {
            touchStartX = e.changedTouches[0].screenX;
        };

        const handleTouchEnd = (e) => {
            touchEndX = e.changedTouches[0].screenX;
            const swipeThreshold = 50;
            const diff = touchStartX - touchEndX;

            if (Math.abs(diff) > swipeThreshold) {
                if (diff > 0) {
                    this.nextPage();
                } else {
                    this.prevPage();
                }
            }
        };

        this.container.addEventListener('touchstart', handleTouchStart);
        this.container.addEventListener('touchend', handleTouchEnd);

        this.handleTouchStart = handleTouchStart;
        this.handleTouchEnd = handleTouchEnd;
    }

    handleResize() {
        const wasMobile = this.isMobile;
        const wasPortrait = this.isPortrait;

        this.isMobile = window.innerWidth < 768;
        this.isPortrait = window.innerHeight > window.innerWidth;

        const oldViewMode = this.viewMode;
        this.viewMode = this.getViewMode();

        // Si cambió el modo de vista, reiniciar
        if (oldViewMode !== this.viewMode) {
            this.container.classList.remove(`mode-${oldViewMode}`);
            this.container.classList.add(`mode-${this.viewMode}`);

            // Recalcular spread actual
            if (this.viewMode === 'spread' && oldViewMode === 'single') {
                // De single a spread
                this.currentSpread = Math.floor(this.currentSpread / 2);
            } else if (this.viewMode === 'single' && oldViewMode === 'spread') {
                // De spread a single
                this.currentSpread = this.currentSpread * 2;
            }

            this.showSpread(this.currentSpread);
        }
    }

    destroy() {
        document.removeEventListener('keydown', this.handleKeyboard);
        window.removeEventListener('resize', this.handleResize);
        this.container.innerHTML = '';
    }
}

// Export para uso global
window.Flipbook = Flipbook;
