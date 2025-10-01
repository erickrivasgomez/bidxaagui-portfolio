// Lightbox Gallery for Comunidad Page
(function() {
  const lightbox = document.getElementById('lightbox');
  const lightboxImage = document.getElementById('lightbox-image');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxPrev = document.getElementById('lightbox-prev');
  const lightboxNext = document.getElementById('lightbox-next');
  const lightboxCounter = document.getElementById('lightbox-counter');
  
  let currentGallery = [];
  let currentIndex = 0;
  
  // Inicializar galerías
  function initGalleries() {
    const galleries = document.querySelectorAll('.masonry-gallery');
    
    galleries.forEach(gallery => {
      const items = gallery.querySelectorAll('.masonry-item');
      
      items.forEach((item, index) => {
        item.addEventListener('click', () => {
          openLightbox(gallery, index);
        });
      });
    });
  }
  
  // Abrir lightbox
  function openLightbox(gallery, index) {
    const items = gallery.querySelectorAll('.masonry-item img');
    currentGallery = Array.from(items).map(img => img.src);
    currentIndex = index;
    
    showImage();
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
  
  // Mostrar imagen
  function showImage() {
    lightboxImage.src = currentGallery[currentIndex];
    lightboxCounter.textContent = `${currentIndex + 1} / ${currentGallery.length}`;
    
    // Ocultar botones si solo hay una imagen
    if (currentGallery.length === 1) {
      lightboxPrev.style.display = 'none';
      lightboxNext.style.display = 'none';
    } else {
      lightboxPrev.style.display = 'flex';
      lightboxNext.style.display = 'flex';
    }
  }
  
  // Cerrar lightbox
  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }
  
  // Navegación
  function nextImage() {
    currentIndex = (currentIndex + 1) % currentGallery.length;
    showImage();
  }
  
  function prevImage() {
    currentIndex = (currentIndex - 1 + currentGallery.length) % currentGallery.length;
    showImage();
  }
  
  // Event listeners
  lightboxClose.addEventListener('click', closeLightbox);
  lightboxNext.addEventListener('click', nextImage);
  lightboxPrev.addEventListener('click', prevImage);
  
  // Cerrar con ESC
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') nextImage();
    if (e.key === 'ArrowLeft') prevImage();
  });
  
  // Cerrar al hacer click fuera de la imagen
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  
  // Inicializar cuando el DOM esté listo
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGalleries);
  } else {
    initGalleries();
  }
})();
