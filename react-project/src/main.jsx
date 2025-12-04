import { StrictMode, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';

// Import CSS files in the correct order
import './index.css';
import './css/buttons.css';
import './css/styles.css';
import './css/animations.css';
import './css/scroll-animations.css';
import './css/comunidad-animations.css';
import './css/consultorio-animations.css';

// Initialize animations
const initAnimations = () => {
  // Add any animation initialization code here
  if (typeof window !== 'undefined') {
    // Add scroll event listeners for animations
    const handleScroll = () => {
      const elements = document.querySelectorAll('.animate-on-scroll');
      elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        if (elementTop < windowHeight - 100) {
          element.classList.add('animate');
        }
      });
    };

    // Initial check
    handleScroll();
    
    // Add scroll event listener
    window.addEventListener('scroll', handleScroll);
    
    // Cleanup
    return () => window.removeEventListener('scroll', handleScroll);
  }
};

const root = createRoot(document.getElementById('root'));

// Render the app
root.render(
  <StrictMode>
    <App onMount={initAnimations} />
  </StrictMode>
);
