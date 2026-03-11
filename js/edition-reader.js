/**
 * Edition Reader - Powered by PageFlip (nodep-st/page-flip)
 * Implements a responsive modal flipbook.
 */

(function () {
    'use strict';

    // ==========================================
    // CONFIGURACIÓN
    // ==========================================
    const API_URL = window.location.hostname.includes('bidxaagui.com')
        ? 'https://api.bidxaagui.com'
        : 'http://localhost:8787';

    // Referencias DOM
    const modal = document.getElementById('reader-modal');
    const closeBtn = document.querySelector('.reader-close');
    const overlay = document.querySelector('.reader-modal-overlay');
    const loading = document.querySelector('.reader-loading');
    const contentContainer = modal.querySelector('.reader-modal-content');

    let pageFlip = null;
    let flipbookEl = null;

    /**
     * Entry Point: Abrir el lector
     * @param {string} editionId 
     */
    async function openReader(editionId) {
        // Reset state
        if (pageFlip) {
            pageFlip.destroy();
            pageFlip = null;
        }

        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        loading.style.display = 'flex';
        loading.innerHTML = '<div class="loading-spinner"></div><p>Cargando edición...</p>';

        // Limpiar contenedor anterior (manteniendo controles si los hubiera, pero aquí limpiamos todo el area de libro)
        // Buscamos si ya existe el elemento, si no lo creamos limpio
        let bookContainer = document.getElementById('book-container');
        if (bookContainer) bookContainer.remove();

        bookContainer = document.createElement('div');
        bookContainer.id = 'book-container';
        // Estilos base para el contenedor del libro dentro del modal
        bookContainer.style.position = 'relative';
        bookContainer.style.width = '100%';
        bookContainer.style.height = '100%';
        bookContainer.style.display = 'flex';
        bookContainer.style.alignItems = 'center';
        bookContainer.style.justifyContent = 'center';

        contentContainer.appendChild(bookContainer);

        try {
            // 1. Obtener datos de la API
            const response = await fetch(`${API_URL}/api/ediciones/${editionId}/pages`);
            if (!response.ok) throw new Error('Error al cargar la edición');

            const json = await response.json();
            const pages = json.data || [];

            if (pages.length === 0) throw new Error('Esta edición no tiene páginas disponibles aún.');

            // 2. Crear elementos HTML para las páginas
            // PageFlip necesita elementos en el DOM antes de inicializar
            // Creamos un div interno que será el "libro"
            const bookEl = document.createElement('div');
            bookEl.id = 'my-flipbook';
            bookEl.style.display = 'none'; // Oculto hasta cargar imágenes clave
            bookContainer.appendChild(bookEl);

            // Generar HTML de las páginas
            // IMPORTANTE: PageFlip maneja Cover (portada) como la primera página si showCover: true
            pages.forEach((page, index) => {
                const pageDiv = document.createElement('div');
                pageDiv.className = 'page';
                if (index === 0) pageDiv.className += ' page-cover'; // Portada

                // Usamos data-src para evitar carga masiva inmediata (opcional), 
                // pero PageFlip maneja bien la carga si son imágenes simples.
                // Para simplificar y asegurar calidad:
                const img = document.createElement('img');
                img.src = `${API_URL}/api/images/${page.imagen_url}`;
                img.loading = 'lazy'; // Nativo
                img.className = 'page-image';
                img.alt = `Página ${index + 1}`;

                // Styling básico para la imagen dentro de la página
                // height/width 100% lo manejará el CSS

                pageDiv.appendChild(img);
                bookEl.appendChild(pageDiv);
            });

            // 3. Esperar a que la primera imagen (portada) cargue
            const firstImg = bookEl.querySelector('img');
            if (firstImg) {
                console.log('Esperando carga de portada:', firstImg.src);
                await new Promise(resolve => {
                    if (firstImg.complete) {
                        resolve();
                        return;
                    }

                    const finish = () => {
                        resolve();
                        clearTimeout(timeout);
                    };

                    firstImg.onload = finish;
                    firstImg.onerror = () => {
                        console.error('Error cargando imagen portada, continuando de todos modos');
                        finish();
                    };

                    // Timeout de seguridad de 3 segundos
                    const timeout = setTimeout(() => {
                        console.warn('Timeout cargando portada');
                        finish();
                    }, 3000);
                });
            }

            loading.style.display = 'none';
            bookEl.style.display = 'block';

            // 4. Inicializar PageFlip
            initPageFlip(bookEl, pages.length);

        } catch (error) {
            console.error(error);
            loading.style.display = 'flex';
            loading.innerHTML = `<p style="color:#ff6b6b">Error: ${error.message} <br><br> <button class="btn btn-small" onclick="location.reload()">Reintentar</button></p>`;
        }
    }

    function initPageFlip(element, totalPages) {
        // Detectar si es móvil para ajustar dimensiones iniciales
        const isMobile = window.innerWidth < 768;

        // Configuración de dimensiones base (Ratio A4 aprox o cuadrado)
        // Esto define el aspect ratio. Si las imágenes son A4 (210x297), usar esa proporción.
        // Asumo vertical estándar.
        const width = 600;
        const height = 800; // 3:4 aspect ratio approx

        try {
            // @ts-ignore
            pageFlip = new St.PageFlip(element, {
                width: width,
                height: height,
                // Size: stretch permite que se ajuste al contenedor padre (modal)
                size: 'stretch',
                // Min/Max constraints
                minWidth: 300,
                maxWidth: 1000,
                minHeight: 400,
                maxHeight: 1200,

                // Configuración de vista
                showCover: true, // La primera página es portada (Single view en desktop init, después spread)
                drawShadow: true,
                maxShadowOpacity: 0.2, // Sutil
                showPageCorners: true, // Muestra dobles de página al hover
                usePortrait: true, // Permite modo portrait (una página) si el espacio es reducido
                startPage: 0,
                mobileScrollSupport: true, // Gestos en móvil
                clickEventForward: true,
                useMouseEvents: true
            });

            // Cargar las páginas desde el DOM que acabamos de crear (element children)
            const pagesNodes = element.querySelectorAll('.page');
            pageFlip.loadFromHTML(pagesNodes);

            flipbookEl = element;

        } catch (e) {
            console.error('Error inicializando PageFlip:', e);
        }
    }

    function closeReader() {
        modal.classList.remove('active');
        document.body.style.overflow = ''; // Restaurar scroll

        // Timeout para permitir animación de cierre
        setTimeout(() => {
            if (pageFlip) {
                pageFlip.destroy();
                pageFlip = null;
            }
            const c = document.getElementById('book-container');
            if (c) c.innerHTML = '';
        }, 300);
    }

    // Event Delegation para clics en tarjetas (soporta carga dinámica)
    document.addEventListener('click', (e) => {
        const card = e.target.closest('.edition-card');
        if (!card) return;

        // Evitar que el clic en el botón de descarga abra el lector
        if (e.target.closest('.download-button')) return;

        // Check if disabled
        if (card.classList.contains('edition-card-disabled')) return;

        // Get ID
        const id = card.getAttribute('data-edition-id');
        if (id) openReader(id);
    });

    if (closeBtn) closeBtn.addEventListener('click', closeReader);
    if (overlay) overlay.addEventListener('click', closeReader);

    // Teclado
    document.addEventListener('keydown', (e) => {
        if (!modal.classList.contains('active') || !pageFlip) return;

        if (e.key === 'Escape') closeReader();
        if (e.key === 'ArrowRight') pageFlip.flipNext();
        if (e.key === 'ArrowLeft') pageFlip.flipPrev();
    });

})();
