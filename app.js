// ==============================
//  APP.JS — Lógica principal
// ==============================

const ITEMS_PER_PAGE = 8;
let currentPage = 1;
let currentFilter = 'all';
let currentSort   = null;

// ——— Lazy load via IntersectionObserver ———
const imgObserver = new IntersectionObserver((entries, obs) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const img = entry.target;
    const src = img.dataset.src;
    if (!src) return;

    // Decode off-main-thread before showing
    const temp = new Image();
    temp.onload = () => {
      img.src = src;
      img.classList.add('loaded');
      img.closest('.card-image-wrap')?.classList.remove('loading');
    };
    temp.src = src;
    obs.unobserve(img);
  });
}, {
  rootMargin: '200px 0px',  // start loading 200px before visible
  threshold: 0
});

// ——— Lightbox ———
function openLightbox(itemId) {
  const item = AMIGURUMIS.find(a => a.id === itemId);
  if (!item) return;
  const lb = document.getElementById('lightbox');
  const img = document.getElementById('lightbox-img');

  // Reset & show loading state
  img.style.opacity = '0';
  document.getElementById('lightbox-name').textContent  = item.name;
  document.getElementById('lightbox-price').textContent = `$${item.price.toFixed(2)} MXN`;
  lb.classList.add('open');
  document.body.style.overflow = 'hidden';

  // Load full image
  const full = new Image();
  full.onload = () => {
    img.src = full.src;
    img.alt = item.name;
    img.style.opacity = '1';
    img.style.transition = 'opacity 0.3s';
  };
  full.src = item.image;
}

function closeLightbox() {
  document.getElementById('lightbox').classList.remove('open');
  // Only restore scroll if modal is also closed
  if (!document.getElementById('modal-overlay').classList.contains('open')) {
    document.body.style.overflow = '';
  }
}

// ——— WhatsApp ———
function sendWhatsApp(itemName, message, imageUrl) {
  const fullMessage = `*${itemName}* — ${message}\nImagen: ${imageUrl}`;
  const encoded = encodeURIComponent(fullMessage);
  window.open(`https://wa.me/${PHONE_NUMBER}?text=${encoded}`, '_blank');
}

// ——— Modal ———
let modalCurrentItem = null;

function openModal(itemId) {
  const item = AMIGURUMIS.find(a => a.id === itemId);
  if (!item) return;
  modalCurrentItem = item;
  document.getElementById('modal-item-name').textContent = item.name;
  document.getElementById('modal-item-sub').textContent = `$${item.price.toFixed(2)} MXN • ${item.available ? 'Disponible' : 'No disponible'}`;
  document.getElementById('modal-overlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  document.getElementById('modal-overlay').classList.remove('open');
  if (!document.getElementById('lightbox').classList.contains('open')) {
    document.body.style.overflow = '';
  }
  modalCurrentItem = null;
}

function modalAction(type) {
  if (!modalCurrentItem) return;
  const item = modalCurrentItem;
  const messages = {
    available: `Hola Rosy! 👋 ¿Sigue disponible el ${item.name}?`,
    order:     `Hola Rosy! 🛍️ Me gustaría hacer un pedido del ${item.name}.`,
    info:      `Hola Rosy! ✨ Quisiera más información sobre el ${item.name}.`
  };
  sendWhatsApp(item.name, messages[type], item.image);
  closeModal();
}

// ——— Filter / Sort ———
function setFilter(filter) {
  currentFilter = filter;
  currentPage = 1;
  document.querySelectorAll('.filter-pill[data-filter]').forEach(p => {
    p.classList.toggle('active', p.dataset.filter === filter);
  });
  renderGrid();
}

function setSort(sort) {
  if (currentSort === sort) {
    currentSort = null;
    document.querySelectorAll('.filter-pill[data-sort]').forEach(p => p.classList.remove('active'));
  } else {
    currentSort = sort;
    document.querySelectorAll('.filter-pill[data-sort]').forEach(p => {
      p.classList.toggle('active', p.dataset.sort === sort);
    });
  }
  currentPage = 1;
  renderGrid();
}

function getFiltered() {
  let list = [...AMIGURUMIS];
  if (currentFilter === 'available')   list = list.filter(a => a.available);
  if (currentFilter === 'unavailable') list = list.filter(a => !a.available);
  if (currentSort === 'price-asc')  list.sort((a, b) => a.price - b.price);
  if (currentSort === 'price-desc') list.sort((a, b) => b.price - a.price);
  if (currentSort === 'name-asc')   list.sort((a, b) => a.name.localeCompare(b.name, 'es'));
  if (currentSort === 'name-desc')  list.sort((a, b) => b.name.localeCompare(a.name, 'es'));
  return list;
}

// ——— Render cards ———
function renderGrid() {
  const filtered  = getFiltered();
  const total     = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / ITEMS_PER_PAGE));
  if (currentPage > totalPages) currentPage = totalPages;

  const start     = (currentPage - 1) * ITEMS_PER_PAGE;
  const pageItems = filtered.slice(start, start + ITEMS_PER_PAGE);

  document.getElementById('section-count').textContent = `${total} piezas`;

  const container = document.getElementById('catalog-grid');
  container.innerHTML = '';

  pageItems.forEach((item, idx) => {
    const card = document.createElement('div');
    card.className = 'card';
    card.setAttribute('tabindex', '0');
    card.style.animationDelay = `${idx * 0.06}s`;

    // WA icon SVG reusable string
    const waSVG = `<svg class="wa-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.1.546 4.073 1.5 5.787L0 24l6.387-1.478A11.955 11.955 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.886 0-3.65-.498-5.18-1.37l-.37-.22-3.795.878.904-3.694-.242-.382A9.943 9.943 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/></svg>`;

    // Magnifier icon
    const zoomSVG = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>`;

    card.innerHTML = `
      <div class="card-inner">
        <!-- FRONT -->
        <div class="card-face card-front-face">
          <div class="card-image-wrap loading">
            <img class="lazy"
                 data-src="${item.image}"
                 alt="${item.name}"
                 width="400" height="260">
            <div class="badge ${item.available ? 'available' : 'unavailable'}">
              ${item.available ? '● Disponible' : '● Agotado'}
            </div>
            <button class="btn-zoom" onclick="event.stopPropagation(); openLightbox(${item.id})" aria-label="Ver imagen completa">
              ${zoomSVG}
            </button>
            <div class="flip-hint">↻ &nbsp;Ver detalles</div>
          </div>
          <div class="card-body">
            <div class="card-name">${item.name}</div>
            <div class="card-price">$${item.price.toFixed(2)} <span>MXN</span></div>
            <div class="card-desc">${item.description}</div>
            <button class="btn-ask" onclick="event.stopPropagation(); openModal(${item.id})">
              ${waSVG}
              Preguntar por WhatsApp
            </button>
          </div>
        </div>

        <!-- BACK -->
        <div class="card-face card-back-face">
          <div class="back-header">
            <div class="back-eyebrow">Especificaciones</div>
            <div class="back-title">${item.name}</div>
          </div>
          <div class="back-specs">
            <div class="spec-item">
              <div class="spec-label">Altura</div>
              <div class="spec-value">${item.height}</div>
            </div>
            <div class="spec-item">
              <div class="spec-label">Anchura</div>
              <div class="spec-value">${item.width}</div>
            </div>
            <div class="spec-item">
              <div class="spec-label">Material</div>
              <div class="spec-value">${item.material}</div>
            </div>
            <div class="spec-item">
              <div class="spec-label">Precio</div>
              <div class="spec-value">$${item.price.toFixed(2)} MXN</div>
            </div>
          </div>
          <div class="back-actions">
            <button class="btn-wa primary" onclick="event.stopPropagation(); sendWhatsApp('${item.name}', '¿Sigue disponible el ${item.name}?', '${item.image}')">
              ${waSVG} Contactar por WhatsApp
            </button>
            <button class="btn-wa secondary" onclick="event.stopPropagation(); openLightbox(${item.id})">
              🔍 Ver imagen completa
            </button>
            <button class="btn-wa secondary" onclick="event.stopPropagation(); openModal(${item.id})">
              Ver opciones de contacto
            </button>
          </div>
        </div>
      </div>
    `;

    card.addEventListener('click', (e) => {
      if (!e.target.closest('button') && !e.target.closest('a')) {
        card.classList.toggle('flipped');
      }
    });
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') card.classList.toggle('flipped');
    });

    container.appendChild(card);

    // Register lazy images with observer
    card.querySelectorAll('img.lazy').forEach(img => imgObserver.observe(img));
  });

  renderPagination(totalPages);
}

// ——— Pagination ———
function renderPagination(totalPages) {
  const pag = document.getElementById('pagination');
  pag.innerHTML = '';

  const prev = document.createElement('button');
  prev.className = 'page-btn arrow';
  prev.textContent = '‹';
  prev.disabled = currentPage === 1;
  prev.addEventListener('click', () => { currentPage--; renderGrid(); window.scrollTo({top:0,behavior:'smooth'}); });
  pag.appendChild(prev);

  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement('button');
    btn.className = 'page-btn' + (i === currentPage ? ' active' : '');
    btn.textContent = i;
    btn.addEventListener('click', () => { currentPage = i; renderGrid(); window.scrollTo({top:0,behavior:'smooth'}); });
    pag.appendChild(btn);
  }

  const next = document.createElement('button');
  next.className = 'page-btn arrow';
  next.textContent = '›';
  next.disabled = currentPage === totalPages;
  next.addEventListener('click', () => { currentPage++; renderGrid(); window.scrollTo({top:0,behavior:'smooth'}); });
  pag.appendChild(next);
}

// ——— Init ———
document.addEventListener('DOMContentLoaded', () => {
  // Filter pills
  document.querySelectorAll('.filter-pill[data-filter]').forEach(pill => {
    pill.addEventListener('click', () => setFilter(pill.dataset.filter));
  });
  document.querySelectorAll('.filter-pill[data-sort]').forEach(pill => {
    pill.addEventListener('click', () => setSort(pill.dataset.sort));
  });

  // Filter bar toggle
  const filterBar    = document.getElementById('filter-bar');
  const filterToggle = document.getElementById('filter-toggle');
  filterToggle.addEventListener('click', () => filterBar.classList.toggle('expanded'));

  // Lightbox close
  document.getElementById('lightbox-close').addEventListener('click', closeLightbox);
  document.getElementById('lightbox').addEventListener('click', (e) => {
    if (e.target === document.getElementById('lightbox')) closeLightbox();
  });

  // Modal close
  document.getElementById('modal-overlay').addEventListener('click', (e) => {
    if (e.target === document.getElementById('modal-overlay')) closeModal();
  });
  document.querySelectorAll('.modal-action-btn').forEach(btn => {
    btn.addEventListener('click', () => modalAction(btn.dataset.action));
  });
  document.getElementById('modal-close-btn').addEventListener('click', closeModal);

  // Global Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeLightbox();
      closeModal();
    }
  });

  renderGrid();
});

const ITEMS_PER_PAGE = 8;
let currentPage = 1;
let currentFilter = 'all'; // 'all' | 'available' | 'unavailable'
let currentSort   = null;  // null | 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc'

// ——— WhatsApp ———
function sendWhatsApp(itemName, message, imageUrl) {
  const fullMessage = `*${itemName}* — ${message}\nImagen: ${imageUrl}`;
  const encoded = encodeURIComponent(fullMessage);
  window.open(`https://wa.me/${PHONE_NUMBER}?text=${encoded}`, '_blank');
}

// ——— Modal ———
let modalCurrentItem = null;

function openModal(itemId) {
  const item = AMIGURUMIS.find(a => a.id === itemId);
  if (!item) return;
  modalCurrentItem = item;
  document.getElementById('modal-item-name').textContent = item.name;
  document.getElementById('modal-item-sub').textContent = `$${item.price.toFixed(2)} MXN • ${item.available ? 'Disponible' : 'No disponible'}`;
  document.getElementById('modal-overlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  document.getElementById('modal-overlay').classList.remove('open');
  document.body.style.overflow = '';
  modalCurrentItem = null;
}

function modalAction(type) {
  if (!modalCurrentItem) return;
  const item = modalCurrentItem;
  const messages = {
    available: `Hola Rosy! 👋 ¿Sigue disponible el ${item.name}?`,
    order:     `Hola Rosy! 🛍️ Me gustaría hacer un pedido del ${item.name}.`,
    info:      `Hola Rosy! ✨ Quisiera más información sobre el ${item.name}.`
  };
  sendWhatsApp(item.name, messages[type], item.image);
  closeModal();
}

// ——— Filter / Sort logic ———
function setFilter(filter) {
  currentFilter = filter;
  currentPage = 1;
  // mark active
  document.querySelectorAll('.filter-pill[data-filter]').forEach(p => {
    p.classList.toggle('active', p.dataset.filter === filter);
  });
  renderGrid();
}

function setSort(sort) {
  // toggle off if same
  if (currentSort === sort) {
    currentSort = null;
    document.querySelectorAll('.filter-pill[data-sort]').forEach(p => p.classList.remove('active'));
  } else {
    currentSort = sort;
    document.querySelectorAll('.filter-pill[data-sort]').forEach(p => {
      p.classList.toggle('active', p.dataset.sort === sort);
    });
  }
  currentPage = 1;
  renderGrid();
}

function getFiltered() {
  let list = [...AMIGURUMIS];
  // filter
  if (currentFilter === 'available')   list = list.filter(a => a.available);
  if (currentFilter === 'unavailable') list = list.filter(a => !a.available);
  // sort
  if (currentSort === 'price-asc')  list.sort((a, b) => a.price - b.price);
  if (currentSort === 'price-desc') list.sort((a, b) => b.price - a.price);
  if (currentSort === 'name-asc')   list.sort((a, b) => a.name.localeCompare(b.name, 'es'));
  if (currentSort === 'name-desc')  list.sort((a, b) => b.name.localeCompare(a.name, 'es'));
  return list;
}

// ——— Render cards ———
function renderGrid() {
  const filtered = getFiltered();
  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / ITEMS_PER_PAGE));
  if (currentPage > totalPages) currentPage = totalPages;

  const start = (currentPage - 1) * ITEMS_PER_PAGE;
  const pageItems = filtered.slice(start, start + ITEMS_PER_PAGE);

  document.getElementById('section-count').textContent = `${total} piezas`;

  const container = document.getElementById('catalog-grid');
  container.innerHTML = '';

  pageItems.forEach((item, idx) => {
    const card = document.createElement('div');
    card.className = 'card';
    card.setAttribute('tabindex', '0');
    card.style.animationDelay = `${idx * 0.06}s`;

    card.innerHTML = `
      <div class="card-inner">
        <!-- FRONT -->
        <div class="card-face card-front-face">
          <div class="card-image-wrap">
            <img src="${item.image}" alt="${item.name}" loading="lazy">
            <div class="badge ${item.available ? 'available' : 'unavailable'}">
              ${item.available ? '● Disponible' : '● Agotado'}
            </div>
            <div class="flip-hint">↻ &nbsp;Ver detalles</div>
          </div>
          <div class="card-body">
            <div class="card-name">${item.name}</div>
            <div class="card-price">$${item.price.toFixed(2)} <span>MXN</span></div>
            <div class="card-desc">${item.description}</div>
            <button class="btn-ask" onclick="event.stopPropagation(); openModal(${item.id})">
              <svg class="wa-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.1.546 4.073 1.5 5.787L0 24l6.387-1.478A11.955 11.955 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.886 0-3.65-.498-5.18-1.37l-.37-.22-3.795.878.904-3.694-.242-.382A9.943 9.943 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
              </svg>
              Preguntar por WhatsApp
            </button>
          </div>
        </div>

        <!-- BACK -->
        <div class="card-face card-back-face">
          <div class="back-header">
            <div class="back-eyebrow">Especificaciones</div>
            <div class="back-title">${item.name}</div>
          </div>
          <div class="back-specs">
            <div class="spec-item">
              <div class="spec-label">Altura</div>
              <div class="spec-value">${item.height}</div>
            </div>
            <div class="spec-item">
              <div class="spec-label">Anchura</div>
              <div class="spec-value">${item.width}</div>
            </div>
            <div class="spec-item">
              <div class="spec-label">Material</div>
              <div class="spec-value">${item.material}</div>
            </div>
            <div class="spec-item">
              <div class="spec-label">Precio</div>
              <div class="spec-value">$${item.price.toFixed(2)} MXN</div>
            </div>
          </div>
          <div class="back-actions">
            <button class="btn-wa primary" onclick="event.stopPropagation(); sendWhatsApp('${item.name}', '¿Sigue disponible el ${item.name}?', '${item.image}')">
              <svg class="wa-icon" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.1.546 4.073 1.5 5.787L0 24l6.387-1.478A11.955 11.955 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.886 0-3.65-.498-5.18-1.37l-.37-.22-3.795.878.904-3.694-.242-.382A9.943 9.943 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/></svg>
              Contactar por WhatsApp
            </button>
            <button class="btn-wa secondary" onclick="event.stopPropagation(); openModal(${item.id})">
              Ver opciones de contacto
            </button>
          </div>
        </div>
      </div>
    `;

    card.addEventListener('click', (e) => {
      if (!e.target.closest('button') && !e.target.closest('a')) {
        card.classList.toggle('flipped');
      }
    });
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') card.classList.toggle('flipped');
    });

    container.appendChild(card);
  });

  renderPagination(totalPages);
}

// ——— Pagination ———
function renderPagination(totalPages) {
  const pag = document.getElementById('pagination');
  pag.innerHTML = '';

  const prev = document.createElement('button');
  prev.className = 'page-btn arrow';
  prev.textContent = '‹';
  prev.disabled = currentPage === 1;
  prev.addEventListener('click', () => { currentPage--; renderGrid(); window.scrollTo({top:0,behavior:'smooth'}); });
  pag.appendChild(prev);

  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement('button');
    btn.className = 'page-btn' + (i === currentPage ? ' active' : '');
    btn.textContent = i;
    btn.addEventListener('click', () => { currentPage = i; renderGrid(); window.scrollTo({top:0,behavior:'smooth'}); });
    pag.appendChild(btn);
  }

  const next = document.createElement('button');
  next.className = 'page-btn arrow';
  next.textContent = '›';
  next.disabled = currentPage === totalPages;
  next.addEventListener('click', () => { currentPage++; renderGrid(); window.scrollTo({top:0,behavior:'smooth'}); });
  pag.appendChild(next);
}

// ——— Init ———
document.addEventListener('DOMContentLoaded', () => {
  // Filter pills — availability
  document.querySelectorAll('.filter-pill[data-filter]').forEach(pill => {
    pill.addEventListener('click', () => setFilter(pill.dataset.filter));
  });

  // Filter pills — sort
  document.querySelectorAll('.filter-pill[data-sort]').forEach(pill => {
    pill.addEventListener('click', () => setSort(pill.dataset.sort));
  });

  // Filter bar toggle
  const filterBar    = document.getElementById('filter-bar');
  const filterToggle = document.getElementById('filter-toggle');
  filterToggle.addEventListener('click', () => {
    filterBar.classList.toggle('expanded');
  });

  // Modal close
  document.getElementById('modal-overlay').addEventListener('click', (e) => {
    if (e.target === document.getElementById('modal-overlay')) closeModal();
  });
  document.querySelectorAll('.modal-action-btn').forEach(btn => {
    btn.addEventListener('click', () => modalAction(btn.dataset.action));
  });
  document.getElementById('modal-close-btn').addEventListener('click', closeModal);

  renderGrid();
});
