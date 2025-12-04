// Animaciones al hacer scroll
document.addEventListener('DOMContentLoaded', () => {
  // Configuración de Intersection Observer para animaciones
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  // Función para el callback del observer
  const handleIntersect = (entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Añadir clase de animación cuando el elemento es visible
        entry.target.classList.add('animate-in');
        // Opcional: Dejar de observar después de la primera animación
        observer.unobserve(entry.target);
      }
    });
  };

  // Crear el observer
  const observer = new IntersectionObserver(handleIntersect, observerOptions);

  // Elementos a animar
  const animatables = document.querySelectorAll('.scroll-animate');
  
  // Observar cada elemento
  animatables.forEach(element => {
    observer.observe(element);
  });

  // Animación específica para los botones de Antroponómadas
  const antroponomadasButtons = document.querySelectorAll('.antroponomadas-content .btn, .antroponomadas-header .btn');
  
  if (antroponomadasButtons.length > 0) {
    // Agregar clase inicial
    antroponomadasButtons.forEach((btn, index) => {
      btn.style.opacity = '0';
      btn.style.transform = 'translateY(20px)';
      btn.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      
      // Aplicar un pequeño retraso para cada botón
      setTimeout(() => {
        btn.style.transitionDelay = `${index * 0.1}s`;
        btn.classList.add('scroll-animate');
      }, 100);
    });
  }
});
