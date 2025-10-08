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

// Color Customizer
const themeToggle = document.getElementById('themeToggle');
const themePanel = document.getElementById('themePanel');
const resetBtn = document.getElementById('resetColors');
const presetBtns = document.querySelectorAll('.preset-btn');

// Color input elements
const colorInputs = {
  bg: document.getElementById('colorBg'),
  bgAlt: document.getElementById('colorBgAlt'),
  text: document.getElementById('colorText'),
  muted: document.getElementById('colorMuted'),
  accent: document.getElementById('colorAccent'),
  card: document.getElementById('colorCard'),
  line: document.getElementById('colorLine')
};

// Color presets
const presets = {
  sage: {
    bg: '#faf7f0',
    bgAlt: '#4a5239',
    text: '#4a5239',
    muted: '#7a8264',
    accent: '#b85c3c',
    card: '#ffffff',
    line: '#d4b5a8'
  },
  terracotta: {
    bg: '#f4e8d8',
    bgAlt: '#faf1e6',
    text: '#5d3a2e',
    muted: '#8b5a45',
    accent: '#c97d60',
    card: '#ffffff',
    line: '#e0d0c0'
  },
  lavender: {
    bg: '#e8e4f3',
    bgAlt: '#f0edf7',
    text: '#3d2b52',
    muted: '#5d4a73',
    accent: '#7d5ba6',
    card: '#ffffff',
    line: '#d4cce0'
  },
  ocean: {
    bg: '#d9e8e8',
    bgAlt: '#e5f0f0',
    text: '#2a4545',
    muted: '#3d6b6b',
    accent: '#4a8585',
    card: '#ffffff',
    line: '#c0d5d5'
  },
  sand: {
    bg: '#f5f0e8',
    bgAlt: '#faf7f0',
    text: '#5a4d3d',
    muted: '#7a6a54',
    accent: '#9d8b73',
    card: '#ffffff',
    line: '#e5ddd0'
  },
  rose: {
    bg: '#f5e6e8',
    bgAlt: '#faf0f2',
    text: '#5d2e3d',
    muted: '#7d4556',
    accent: '#a8556f',
    card: '#ffffff',
    line: '#e5d0d5'
  }
};

// Apply colors to CSS variables
function applyColors(colors) {
  document.documentElement.style.setProperty('--bg', colors.bg);
  document.documentElement.style.setProperty('--bg-alt', colors.bgAlt);
  document.documentElement.style.setProperty('--text', colors.text);
  document.documentElement.style.setProperty('--muted', colors.muted);
  document.documentElement.style.setProperty('--accent', colors.accent);
  document.documentElement.style.setProperty('--card', colors.card);
  document.documentElement.style.setProperty('--line', colors.line);
}

// Update color inputs
function updateInputs(colors) {
  colorInputs.bg.value = colors.bg;
  colorInputs.bgAlt.value = colors.bgAlt;
  colorInputs.text.value = colors.text;
  colorInputs.muted.value = colors.muted;
  colorInputs.accent.value = colors.accent;
  colorInputs.card.value = colors.card;
  colorInputs.line.value = colors.line;
}

// Save colors to localStorage
function saveColors() {
  const colors = {
    bg: colorInputs.bg.value,
    bgAlt: colorInputs.bgAlt.value,
    text: colorInputs.text.value,
    muted: colorInputs.muted.value,
    accent: colorInputs.accent.value,
    card: colorInputs.card.value,
    line: colorInputs.line.value
  };
  localStorage.setItem('bidxaagui-colors', JSON.stringify(colors));
}

// Load saved colors or default
function loadColors() {
  const saved = localStorage.getItem('bidxaagui-colors');
  if (saved) {
    const colors = JSON.parse(saved);
    applyColors(colors);
    updateInputs(colors);
  } else {
    applyColors(presets.sage);
  }
}

// Initialize on load
loadColors();

// Toggle panel
if (themeToggle && themePanel) {
  themeToggle.addEventListener('click', () => {
    themePanel.classList.toggle('open');
  });

  // Close panel when clicking outside
  document.addEventListener('click', (e) => {
    if (!themeToggle.contains(e.target) && !themePanel.contains(e.target)) {
      themePanel.classList.remove('open');
    }
  });
}

// Listen to color input changes
Object.values(colorInputs).forEach(input => {
  input.addEventListener('input', () => {
    const colors = {
      bg: colorInputs.bg.value,
      bgAlt: colorInputs.bgAlt.value,
      text: colorInputs.text.value,
      muted: colorInputs.muted.value,
      accent: colorInputs.accent.value,
      card: colorInputs.card.value,
      line: colorInputs.line.value
    };
    applyColors(colors);
    saveColors();
  });
});

// Preset buttons
presetBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const preset = btn.dataset.preset;
    const colors = presets[preset];
    applyColors(colors);
    updateInputs(colors);
    saveColors();
  });
});

// Reset button
if (resetBtn) {
  resetBtn.addEventListener('click', () => {
    applyColors(presets.sage);
    updateInputs(presets.sage);
    saveColors();
  });
}
