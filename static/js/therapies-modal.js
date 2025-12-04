// Inicializar terapias modal
document.addEventListener('DOMContentLoaded', function() {
  const therapiesGrid = document.querySelector('.therapies-grid');
  if (!therapiesGrid) return;

  // Crear cards
  therapiesData.forEach(therapy => {
    const card = document.createElement('div');
    card.className = 'therapy-card animate-on-scroll';
    card.innerHTML = `
      <div class="therapy-card-emoji">${therapy.emoji}</div>
      <h3>${therapy.title}</h3>
      <p>${therapy.subtitle}</p>
      <button class="therapy-card-btn">Ver más</button>
    `;
    card.addEventListener('click', () => openTherapyModal(therapy));
    therapiesGrid.appendChild(card);
  });

  // Crear modal
  const modal = document.createElement('div');
  modal.className = 'therapy-modal';
  modal.id = 'therapyModal';
  modal.innerHTML = `
    <div class="therapy-modal-overlay"></div>
    <div class="therapy-modal-content">
      <button class="therapy-modal-close" aria-label="Cerrar">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
      <div class="therapy-modal-body"></div>
    </div>
  `;
  document.body.appendChild(modal);

  // Event listeners
  const closeBtn = modal.querySelector('.therapy-modal-close');
  const overlay = modal.querySelector('.therapy-modal-overlay');
  
  closeBtn.addEventListener('click', closeTherapyModal);
  overlay.addEventListener('click', closeTherapyModal);
  
  // ESC key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeTherapyModal();
    }
  });
});

function openTherapyModal(therapy) {
  const modal = document.getElementById('therapyModal');
  const modalBody = modal.querySelector('.therapy-modal-body');
  
  modalBody.innerHTML = `
    <div class="therapy-modal-emoji">${therapy.emoji}</div>
    <h2>${therapy.title}</h2>
    <h3>${therapy.subtitle}</h3>
    <div class="therapy-modal-text">${therapy.content}</div>
  `;
  
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeTherapyModal() {
  const modal = document.getElementById('therapyModal');
  modal.classList.remove('active');
  document.body.style.overflow = '';
}
