/**
 * Custom Flipbook Component
 * Flipbook nativo sin dependencias externas
 */

class Flipbook {
    constructor(container, options = {}) {
        this.container = container;
        this.pages = [];
        this.currentPage = 0;
        this.isAnimating = false;
        this.isMobile = window.innerWidth < 768;
        this.isPortrait = window.innerHeight > window.innerWidth;

        // Opciones
        this.options = {
            animationDuration: options.animationDuration || 1000,
            onPageFlip: options.onPageFlip || (() => { }),
            ...options
        };

        this.init();
    }

    init() {
        this.container.classList.add('flipbook-container');
        this.createStructure();
        this.attachEvents();

        // Responsive listener
        window.addEventListener('resize', this.handleResize.bind(this));
    }

    createStructure() {
        this.container.innerHTML = `
            <div class="flipbook-stage">
                <div class="flipbook-pages"></div>
            </div>
            <button class="flipbook-nav flipbook-prev" aria-label="Página anterior">‹</button>
            <button class="flipbook-nav flipbook-next" aria-label="Página siguiente">›</button>
            <div class="flipbook-counter">
                <span class="current-page">1</span> / <span class="total-pages">0</span>
            </div>
        `;

        this.pagesContainer = this.container.querySelector('.flipbook-pages');
        this.prevBtn = this.container.querySelector('.flipbook-prev');
        this.nextBtn = this.container.querySelector('.flipbook-next');
        this.currentPageEl = this.container.querySelector('.current-page');
        this.totalPagesEl = this.container.querySelector('.total-pages');
    }

    loadPages(pagesData) {
        this.pages = pagesData;
        this.totalPagesEl.textContent = pagesData.length;

        // Crear elementos de página
        pagesData.forEach((pageData, index) => {
            const pageEl = document.createElement('div');
            pageEl.className = 'flipbook-page';
            pageEl.dataset.pageIndex = index;

            const img = document.createElement('img');
            img.src = pageData.url;
            img.alt = `Página ${index + 1}`;
            img.loading = 'lazy';

            pageEl.appendChild(img);
            this.pagesContainer.appendChild(pageEl);
        });

        this.showPage(0);
    }

    showPage(index) {
        if (index < 0 || index >= this.pages.length || this.isAnimating) return;

        this.currentPage = index;
        this.currentPageEl.textContent = index + 1;

        // Actualizar clases de páginas
        const allPages = this.pagesContainer.querySelectorAll('.flipbook-page');
        allPages.forEach((page, i) => {
            page.classList.remove('active', 'previous', 'next');

            if (i === index) {
                page.classList.add('active');
            } else if (i === index - 1) {
                page.classList.add('previous');
            } else if (i === index + 1) {
                page.classList.add('next');
            }
        });

        // Actualizar botones
        this.prevBtn.disabled = index === 0;
        this.nextBtn.disabled = index === this.pages.length - 1;

        this.options.onPageFlip(index);
    }

    nextPage() {
        if (this.isAnimating || this.currentPage >= this.pages.length - 1) return;

        this.animateFlip('forward');
    }

    prevPage() {
        if (this.isAnimating || this.currentPage <= 0) return;

        this.animateFlip('backward');
    }

    animateFlip(direction) {
        this.isAnimating = true;
        const currentPageEl = this.pagesContainer.querySelector(`[data-page-index="${this.currentPage}"]`);
        const isBackward = direction === 'backward';

        // Aplicar clase de animación
        if (isBackward) {
            currentPageEl.classList.add('flipping-backward');
        } else {
            currentPageEl.classList.add('flipping-forward');
        }

        // Cambiar de página después de la animación
        setTimeout(() => {
            const newIndex = isBackward ? this.currentPage - 1 : this.currentPage + 1;
            this.showPage(newIndex);

            currentPageEl.classList.remove('flipping-backward', 'flipping-forward');
            this.isAnimating = false;
        }, this.options.animationDuration);
    }

    attachEvents() {
        this.prevBtn.addEventListener('click', () => this.prevPage());
        this.nextBtn.addEventListener('click', () => this.nextPage());

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') this.prevPage();
            if (e.key === 'ArrowRight') this.nextPage();
        });

        // Touch swipe
        let touchStartX = 0;
        let touchEndX = 0;

        this.pagesContainer.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        });

        this.pagesContainer.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            this.handleSwipe();
        });

        const handleSwipe = () => {
            const swipeThreshold = 50;
            const diff = touchStartX - touchEndX;

            if (Math.abs(diff) > swipeThreshold) {
                if (diff > 0) {
                    this.nextPage(); // Swipe left
                } else {
                    this.prevPage(); // Swipe right
                }
            }
        };

        this.handleSwipe = handleSwipe;
    }

    handleResize() {
        this.isMobile = window.innerWidth < 768;
        this.isPortrait = window.innerHeight > window.innerWidth;
    }

    destroy() {
        window.removeEventListener('resize', this.handleResize);
        this.container.innerHTML = '';
    }
}

// Export para uso global
window.Flipbook = Flipbook;
