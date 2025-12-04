// Animaciones suaves para la página de Consultorio
document.addEventListener('DOMContentLoaded', () => {
  // Función para manejar las entradas del Intersection Observer
  const handleIntersection = (entries, observer) => {
    entries.forEach(entry => {
      // Si el elemento está en el viewport
      if (entry.isIntersecting) {
        // Para listas de elementos (como la lista de autocuidado)
        if (entry.target.classList.contains('autocuidado-list')) {
          const items = entry.target.querySelectorAll('li');
          items.forEach((item, index) => {
            // Aplicar un pequeño retraso a cada elemento para un efecto escalonado
            setTimeout(() => {
              item.classList.add('visible');
            }, 100 * index);
          });
        } 
        // Para tarjetas de terapias
        else if (entry.target.classList.contains('therapy-card')) {
          entry.target.classList.add('visible');
        }
        // Para otros elementos con animación
        else if (entry.target.classList.contains('animate-on-scroll')) {
          entry.target.classList.add('visible');
        }
      } else {
        // Opcional: remover la clase 'visible' cuando el elemento sale del viewport
        // para que la animación se active nuevamente al volver a hacer scroll
        // entry.target.classList.remove('visible');
      }
    });
  };

  // Configuración del Intersection Observer con opciones mejoradas
  const observerOptions = {
    root: null, // usa el viewport
    rootMargin: '0px',
    threshold: 0.1 // dispara cuando al menos el 10% del elemento es visible
  };

  // Crear el Intersection Observer
  const observer = new IntersectionObserver(handleIntersection, observerOptions);

  // Función para observar elementos dinámicos (como las tarjetas de terapia)
  const observeElements = () => {
    // Seleccionar todos los elementos que deben animarse
    const elementsToAnimate = document.querySelectorAll(
      '.therapy-card, .autocuidado-list, .animate-on-scroll:not(.therapy-card):not(.autocuidado-list)'
    );
    
    // Observar cada elemento
    elementsToAnimate.forEach(element => {
      // Solo observar si no está siendo observado ya
      if (!element.hasAttribute('data-observed')) {
        observer.observe(element);
        element.setAttribute('data-observed', 'true');
      }
    });
  };

  // Observar elementos iniciales
  observeElements();

  // Crear un MutationObserver para detectar cambios en el DOM (útil para contenido dinámico)
  const mutationObserver = new MutationObserver((mutations) => {
    let shouldReObserve = false;
    
    mutations.forEach((mutation) => {
      if (mutation.addedNodes.length) {
        shouldReObserve = true;
      }
    });
    
    if (shouldReObserve) {
      observeElements();
    }
  });

  // Comenzar a observar cambios en el cuerpo del documento
  mutationObserver.observe(document.body, {
    childList: true,
    subtree: true
  });

  // Asegurarse de que las tarjetas y botones tengan las clases necesarias
  const ensureAnimationClasses = () => {
    // Tarjetas
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
      if (!card.classList.contains('animate-on-scroll')) {
        card.classList.add('animate-on-scroll');
      }
    });

    // Botones
    const buttons = document.querySelectorAll('.btn:not(.therapy-card-btn)');
    buttons.forEach(button => {
      if (!button.classList.contains('animate-on-scroll')) {
        button.classList.add('animate-on-scroll');
      }
    });
  };

  // Ejecutar al cargar y después de un pequeño retraso para contenido dinámico
  ensureAnimationClasses();
  setTimeout(ensureAnimationClasses, 1000);
});
