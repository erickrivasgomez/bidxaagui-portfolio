/**
 * Edition Lightbox - Maneja la visualización de ediciones en pantalla completa
 */

document.addEventListener('DOMContentLoaded', function() {
  // Elementos del DOM
  const lightbox = document.getElementById('edition-lightbox');
  const lightboxClose = lightbox.querySelector('.lightbox-close');
  const lightboxContent = lightbox.querySelector('.edition-content');
  const loader = lightbox.querySelector('.edition-loader');
  const titleElement = lightbox.querySelector('.edition-title');
  const descriptionElement = lightbox.querySelector('.edition-description');
  const pagesContainer = lightbox.querySelector('.edition-pages');
  const prevButton = lightbox.querySelector('.prev-page');
  const nextButton = lightbox.querySelector('.next-page');
  const currentPageElement = lightbox.querySelector('.current-page');
  const totalPagesElement = lightbox.querySelector('.total-pages');
  
  // Variables de estado
  let currentPage = 1;
  let totalPages = 0;
  let currentEdition = null;
  
  // Manejador para abrir el lightbox
  function openLightbox(editionId) {
    // Mostrar el lightbox
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden'; // Evitar scroll en el fondo
    
    // Resetear estado
    resetLightbox();
    
    // Cargar los datos de la edición
    loadEdition(editionId);
    
    // Agregar event listener para cerrar con ESC
    document.addEventListener('keydown', handleKeyDown);
  }
  
  // Manejador para cerrar el lightbox
  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = ''; // Restaurar scroll
    document.removeEventListener('keydown', handleKeyDown);
  }
  
  // Manejador de teclado
  function handleKeyDown(e) {
    if (e.key === 'Escape') {
      closeLightbox();
    } else if (e.key === 'ArrowLeft') {
      prevPage();
    } else if (e.key === 'ArrowRight') {
      nextPage();
    }
  }
  
  // Resetear el estado del lightbox
  function resetLightbox() {
    currentPage = 1;
    totalPages = 0;
    currentEdition = null;
    
    // Limpiar contenido
    titleElement.textContent = '';
    descriptionElement.textContent = '';
    pagesContainer.innerHTML = '';
    currentPageElement.textContent = '1';
    totalPagesElement.textContent = '0';
    
    // Mostrar loader y ocultar contenido
    loader.style.display = 'block';
    lightboxContent.style.display = 'none';
    
    // Deshabilitar botones de navegación
    prevButton.disabled = true;
    nextButton.disabled = true;
  }
  
  // Cargar los datos de la edición desde el backend
  async function loadEdition(editionId) {
    try {
      // Usar la URL proporcionada para obtener las páginas de la edición
      const response = await fetch(`https://api.bidxaagui.com/api/ediciones/${editionId}/pages`);
      
      if (!response.ok) {
        throw new Error('No se pudo cargar la edición');
      }
      
      const result = await response.json();
      console.log('API Response:', result); // Para depuración
      
      if (result.success && Array.isArray(result.data)) {
        // Crear un objeto de edición con los datos necesarios
        currentEdition = {
          id: editionId,
          titulo: 'Edición ' + editionId,  // Título por defecto
          paginas: result.data.map(page => ({
            id: page.id,
            numero: page.numero,
            // Asegurarse de que la URL sea absoluta y no tenga doble barra
            imagen_url: page.imagen_url.startsWith('http') ? page.imagen_url : 
                       `https://api.bidxaagui.com/${page.imagen_url.replace(/^\/+/, '')}`
          }))
        };
        console.log('Processed Edition:', currentEdition); // Para depuración
        displayEdition(currentEdition);
      } else {
        throw new Error(data.error || 'Error al cargar la edición');
      }
    } catch (error) {
      console.error('Error al cargar la edición:', error);
      loader.innerHTML = `
        <div class="error-message">
          <p>No se pudo cargar la edición. Por favor, inténtalo de nuevo más tarde.</p>
          <button class="btn btn-green" onclick="location.reload()">Reintentar</button>
        </div>
      `;
    }
  }
  
  // Mostrar los datos de la edición en el lightbox
  function displayEdition(edition) {
    console.log('Displaying edition:', edition); // Para depuración
    
    // Actualizar título
    titleElement.textContent = edition.titulo || 'Edición sin título';
    
    // Ocultar el elemento de descripción ya que no lo tenemos en la respuesta
    descriptionElement.style.display = 'none';
    
    // Cargar las páginas de la edición
    if (edition.paginas && Array.isArray(edition.paginas) && edition.paginas.length > 0) {
      console.log('Pages found:', edition.paginas); // Para depuración
      
      // Ordenar las páginas por número
      const sortedPages = [...edition.paginas].sort((a, b) => a.numero - b.numero);
      edition.paginas = sortedPages;
      
      totalPages = edition.paginas.length;
      totalPagesElement.textContent = totalPages;
      
      // Mostrar la primera página
      displayPage(1);
      
      // Actualizar estado de los botones de navegación
      updateNavigationButtons();
      
      // Mostrar el contenido y ocultar el loader
      loader.style.display = 'none';
      lightboxContent.style.display = 'block';
    } else {
      // No hay páginas disponibles
      loader.innerHTML = '<p>No hay páginas disponibles para esta edición.</p>';
    }
  }
  
  // Mostrar una página específica
  function displayPage(pageNumber) {
    if (!currentEdition || !currentEdition.paginas || pageNumber < 1 || pageNumber > totalPages) {
      return;
    }
    
    currentPage = pageNumber;
    currentPageElement.textContent = currentPage;
    
    // Obtener la página actual
    const page = currentEdition.paginas[pageNumber - 1];
    
    // Crear elemento de imagen
    const img = document.createElement('img');
    img.src = page.imagen_url;
    img.alt = `Página ${pageNumber} de ${currentEdition.titulo}`;
    img.className = 'edition-page';
    img.loading = 'lazy';
    
    // Limpiar contenedor y agregar la imagen
    pagesContainer.innerHTML = '';
    pagesContainer.appendChild(img);
    
    // Actualizar estado de los botones de navegación
    updateNavigationButtons();
  }
  
  // Actualizar el estado de los botones de navegación
  function updateNavigationButtons() {
    prevButton.disabled = currentPage <= 1;
    nextButton.disabled = currentPage >= totalPages;
  }
  
  // Navegación entre páginas
  function nextPage() {
    if (currentPage < totalPages) {
      displayPage(currentPage + 1);
    }
  }
  
  function prevPage() {
    if (currentPage > 1) {
      displayPage(currentPage - 1);
    }
  }
  
  // Event Listeners
  lightboxClose.addEventListener('click', closeLightbox);
  prevButton.addEventListener('click', prevPage);
  nextButton.addEventListener('click', nextPage);
  
  // Cerrar al hacer clic fuera del contenido
  lightbox.addEventListener('click', function(e) {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });
  
  // Inicializar los botones de apertura del lightbox
  function initEditionButtons() {
    const buttons = document.querySelectorAll('.edition-lightbox-trigger');
    
    buttons.forEach(button => {
      button.addEventListener('click', function(e) {
        e.preventDefault();
        const editionId = this.getAttribute('data-edition-id');
        if (editionId) {
          openLightbox(editionId);
        }
      });
    });
  }
  
  // Inicializar cuando el DOM esté listo
  initEditionButtons();
});
