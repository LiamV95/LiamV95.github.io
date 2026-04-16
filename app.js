const STORAGE_KEY = 'terrys-vinyl-collection';

// ── State ────────────────────────────────────────────────────
let collection = load();
let editingId  = null;
let pendingDeleteId = null;

// ── Persistence ──────────────────────────────────────────────
function load() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; }
  catch { return []; }
}

function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(collection));
}

// ── DOM refs ─────────────────────────────────────────────────
const collectionEl   = document.getElementById('collection');
const emptyMsg       = document.getElementById('empty-msg');
const recordCount    = document.getElementById('record-count');
const searchInput    = document.getElementById('search');
const genreFilter    = document.getElementById('filter-genre');

const modal          = document.getElementById('modal');
const modalTitle     = document.getElementById('modal-title');
const form           = document.getElementById('record-form');
const fArtist        = document.getElementById('f-artist');
const fAlbum         = document.getElementById('f-album');
const fYear          = document.getElementById('f-year');
const fGenre         = document.getElementById('f-genre');
const fNotes         = document.getElementById('f-notes');

const confirmModal   = document.getElementById('confirm-modal');
const confirmMsg     = document.getElementById('confirm-msg');
const confirmDelete  = document.getElementById('confirm-delete');
const confirmCancel  = document.getElementById('confirm-cancel');

// ── Render ───────────────────────────────────────────────────
function discColors() {
  const palettes = [
    ['#1a1a2e','#e94560'], ['#0f3460','#e94560'], ['#533483','#e8b86d'],
    ['#2d4a22','#a8d5a2'], ['#4a1942','#f7c5d5'], ['#1b1b2f','#e43f5a'],
    ['#16213e','#0f3460'], ['#3d2b1f','#c4a882'],
  ];
  return palettes[Math.floor(Math.random() * palettes.length)];
}

function discSVG(record) {
  const seed = (record.artist + record.album).split('').reduce((a,c)=>a+c.charCodeAt(0),0);
  const palette = [
    ['#1a1a2e','#e94560'], ['#0f3460','#e94560'], ['#533483','#e8b86d'],
    ['#2d4a22','#a8d5a2'], ['#4a1942','#f7c5d5'], ['#1b1b2f','#e43f5a'],
    ['#16213e','#0f3460'], ['#3d2b1f','#c4a882'],
  ];
  const [bg, accent] = palette[seed % palette.length];

  return `<svg class="disc-svg" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
    <circle cx="60" cy="60" r="58" fill="${bg}" stroke="#111" stroke-width="2"/>
    <circle cx="60" cy="60" r="46" fill="none" stroke="#ffffff10" stroke-width="1.5"/>
    <circle cx="60" cy="60" r="38" fill="none" stroke="#ffffff10" stroke-width="1.5"/>
    <circle cx="60" cy="60" r="30" fill="none" stroke="#ffffff10" stroke-width="1.5"/>
    <circle cx="60" cy="60" r="22" fill="none" stroke="#ffffff10" stroke-width="1.5"/>
    <circle cx="60" cy="60" r="18" fill="${accent}" opacity="0.9"/>
    <circle cx="60" cy="60" r="5"  fill="#111"/>
  </svg>`;
}

function renderCard(record) {
  const card = document.createElement('div');
  card.className = 'record-card';
  card.dataset.id = record.id;

  const meta = [record.year, record.genre].filter(Boolean).map(
    v => `<span class="tag">${v}</span>`
  ).join('');

  const notes = record.notes
    ? `<p class="card-notes">${record.notes}</p>`
    : '';

  card.innerHTML = `
    <div class="card-disc">${discSVG(record)}</div>
    <div class="card-body">
      <span class="card-artist">${record.artist}</span>
      <span class="card-album">${record.album}</span>
      ${meta ? `<div class="card-meta">${meta}</div>` : ''}
      ${notes}
    </div>
    <div class="card-actions">
      <button class="btn-secondary edit-btn" data-id="${record.id}">Edit</button>
      <button class="btn-danger delete-btn"  data-id="${record.id}">Remove</button>
    </div>`;

  return card;
}

function render() {
  const query = searchInput.value.trim().toLowerCase();
  const genre = genreFilter.value;

  const filtered = collection.filter(r => {
    const matchesSearch = !query ||
      r.artist.toLowerCase().includes(query) ||
      r.album.toLowerCase().includes(query);
    const matchesGenre = !genre || r.genre === genre;
    return matchesSearch && matchesGenre;
  });

  collectionEl.innerHTML = '';
  filtered.forEach(r => collectionEl.appendChild(renderCard(r)));

  const count = filtered.length;
  const total = collection.length;
  recordCount.textContent = query || genre
    ? `${count} of ${total} record${total !== 1 ? 's' : ''}`
    : `${total} record${total !== 1 ? 's' : ''}`;

  emptyMsg.classList.toggle('hidden', count > 0);
}

function refreshGenreFilter() {
  const current = genreFilter.value;
  const genres = [...new Set(collection.map(r => r.genre).filter(Boolean))].sort();
  genreFilter.innerHTML = '<option value="">All Genres</option>' +
    genres.map(g => `<option value="${g}"${g === current ? ' selected' : ''}>${g}</option>`).join('');
}

// ── Modal helpers ────────────────────────────────────────────
function openModal(record = null) {
  editingId = record ? record.id : null;
  modalTitle.textContent = record ? 'Edit Record' : 'Add Record';
  fArtist.value = record?.artist || '';
  fAlbum.value  = record?.album  || '';
  fYear.value   = record?.year   || '';
  fGenre.value  = record?.genre  || '';
  fNotes.value  = record?.notes  || '';
  modal.classList.remove('hidden');
  fArtist.focus();
}

function closeModal() {
  modal.classList.add('hidden');
  form.reset();
  editingId = null;
}

function openConfirm(id) {
  const rec = collection.find(r => r.id === id);
  if (!rec) return;
  pendingDeleteId = id;
  confirmMsg.textContent = `Remove "${rec.album}" by ${rec.artist} from the collection?`;
  confirmModal.classList.remove('hidden');
}

function closeConfirm() {
  confirmModal.classList.add('hidden');
  pendingDeleteId = null;
}

// ── CRUD ─────────────────────────────────────────────────────
form.addEventListener('submit', e => {
  e.preventDefault();
  const artist = fArtist.value.trim();
  const album  = fAlbum.value.trim();
  if (!artist || !album) return;

  const record = {
    id:     editingId || crypto.randomUUID(),
    artist,
    album,
    year:   fYear.value.trim(),
    genre:  fGenre.value.trim(),
    notes:  fNotes.value.trim(),
    addedAt: editingId
      ? collection.find(r => r.id === editingId)?.addedAt
      : new Date().toISOString(),
  };

  if (editingId) {
    collection = collection.map(r => r.id === editingId ? record : r);
  } else {
    collection.push(record);
  }

  save();
  refreshGenreFilter();
  render();
  closeModal();
});

collectionEl.addEventListener('click', e => {
  const editBtn   = e.target.closest('.edit-btn');
  const deleteBtn = e.target.closest('.delete-btn');

  if (editBtn) {
    const rec = collection.find(r => r.id === editBtn.dataset.id);
    if (rec) openModal(rec);
  }

  if (deleteBtn) {
    openConfirm(deleteBtn.dataset.id);
  }
});

confirmDelete.addEventListener('click', () => {
  if (!pendingDeleteId) return;
  collection = collection.filter(r => r.id !== pendingDeleteId);
  save();
  refreshGenreFilter();
  render();
  closeConfirm();
});

// ── Event listeners ──────────────────────────────────────────
document.getElementById('add-btn').addEventListener('click', () => openModal());
document.getElementById('cancel-btn').addEventListener('click', closeModal);
confirmCancel.addEventListener('click', closeConfirm);

modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
confirmModal.addEventListener('click', e => { if (e.target === confirmModal) closeConfirm(); });

searchInput.addEventListener('input', render);
genreFilter.addEventListener('change', render);

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') { closeModal(); closeConfirm(); }
});

// ── Init ─────────────────────────────────────────────────────
refreshGenreFilter();
render();
