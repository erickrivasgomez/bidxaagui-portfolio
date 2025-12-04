// Year in footer
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Mobile menu toggle
const toggle = document.querySelector('.menu-toggle');
const nav = document.getElementById('site-nav');
if (toggle && nav){
  toggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(isOpen));
  });
}

// Instagram Dropdown Toggle
const instagramToggle = document.querySelector('.instagram-toggle');
const instagramMenu = document.querySelector('.instagram-menu');

if (instagramToggle && instagramMenu) {
  // Toggle menu on click for mobile
  instagramToggle.addEventListener('click', (e) => {
    if (window.innerWidth <= 768) {
      e.preventDefault();
      const isExpanded = instagramToggle.getAttribute('aria-expanded') === 'true';
      instagramToggle.setAttribute('aria-expanded', String(!isExpanded));
      instagramMenu.classList.toggle('active');
    }
  });

  // Close menu when clicking outside on desktop
  document.addEventListener('click', (e) => {
    if (window.innerWidth > 768 && 
        !instagramToggle.contains(e.target) && 
        !instagramMenu.contains(e.target)) {
      instagramToggle.setAttribute('aria-expanded', 'false');
    }
  });

  // Handle window resize
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (window.innerWidth > 768) {
        instagramMenu.classList.remove('active');
        instagramToggle.setAttribute('aria-expanded', 'false');
      }
    }, 250);
  });
}
