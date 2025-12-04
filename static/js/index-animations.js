// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
  // Configuration for the Intersection Observer
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  // Function to handle intersection
  const handleIntersect = (entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Add the animate-in class to trigger the animation
        entry.target.classList.add('animate-in');
        // Stop observing after the first animation
        observer.unobserve(entry.target);
      }
    });
  };

  // Create the observer
  const observer = new IntersectionObserver(handleIntersect, observerOptions);

  // Add initial classes for animation
  const addInitialClasses = () => {
    // Small timeout to ensure CSS is loaded
    setTimeout(() => {
      // Profile image animation
      const profileImage = document.querySelector('.hero-image');
      if (profileImage) {
        profileImage.classList.add('animate-on-scroll');
        // Force reflow to ensure the initial state is applied
        void profileImage.offsetWidth;
        observer.observe(profileImage);
      }

      // Hero right section animation
      const heroRight = document.querySelector('.hero-right');
      if (heroRight) {
        heroRight.classList.add('animate-on-scroll');
        void heroRight.offsetWidth;
        observer.observe(heroRight);
      }

      // Bio sections animation
      const bioSections = document.querySelectorAll('.bio-section');
      bioSections.forEach((section, index) => {
        section.classList.add('animate-on-scroll');
        section.style.transitionDelay = `${0.3 + (index * 0.1)}s`;
        void section.offsetWidth;
        observer.observe(section);
      });
    }, 50);
  };

  // Initialize animations
  addInitialClasses();

  // Function to check if elements are in viewport
  const checkIfInView = () => {
    const animateElements = document.querySelectorAll('.animate-on-scroll:not(.animate-in)');
    
    animateElements.forEach(element => {
      const elementTop = element.getBoundingClientRect().top;
      const elementVisible = 150;
      
      if (elementTop < window.innerHeight - elementVisible) {
        element.classList.add('animate-in');
      }
    });
  };

  // Check on load with a small delay to ensure CSS is applied
  setTimeout(() => {
    checkIfInView();
  }, 100);
  
  // Check on scroll
  window.addEventListener('scroll', checkIfInView);
});
