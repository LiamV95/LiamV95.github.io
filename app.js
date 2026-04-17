const RECOMMEND_EMAIL = 'liam.venables95@gmail.com';

// ── State ────────────────────────────────────────────────────
let collection      = [];
let editingId       = null;
let pendingDeleteId = null;
let isOwnerMode     = false;
let currentView     = 'shelf';
let currentSort     = 'recent';
let detailRecordId  = null;

// ── Persistence ──────────────────────────────────────────────
async function loadCollection() {
  try {
    const res = await fetch('/api/collection');
    if (!res.ok) throw new Error();
    collection = await res.json();
    setMode('owner');
  } catch {
    try {
      const res = await fetch('/data.json');
      collection = await res.json();
    } catch {
      collection = [];
    }
    setMode('public');
  }
}

async function saveCollection() {
  await fetch('/api/collection', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(collection),
  });
}

// ── Mode ─────────────────────────────────────────────────────
function setMode(mode) {
  isOwnerMode = mode === 'owner';
  document.getElementById('add-btn').classList.toggle('hidden', !isOwnerMode);
  document.getElementById('recommend-section').classList.toggle('hidden', isOwnerMode);
  const actTh = document.getElementById('list-actions-th');
  if (actTh) actTh.textContent = isOwnerMode ? '' : '';
}

// ── Sorting ──────────────────────────────────────────────────
function sorted(arr) {
  const copy = [...arr];
  if (currentSort === 'recent') {
    copy.sort((a, b) => new Date(b.addedAt || 0) - new Date(a.addedAt || 0));
  } else if (currentSort === 'artist') {
    copy.sort((a, b) => a.artist.localeCompare(b.artist));
  } else if (currentSort === 'album') {
    copy.sort((a, b) => a.album.localeCompare(b.album));
  }
  return copy;
}

// ── Disc SVG ─────────────────────────────────────────────────
function discSVG(record) {
  const seed = (record.artist + record.album).split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  const palette = [
    ['#1a003a','#FF3CAC'], ['#00204a','#00D4FF'], ['#1a3a00','#AAFF00'],
    ['#3a0010','#FF6B1A'], ['#1a1a00','#FFD700'], ['#00003a','#7B61FF'],
    ['#3a001a','#FF61A6'], ['#003a3a','#00FFD1'],
  ];
  const [bg, accent] = palette[seed % palette.length];
  return `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
    <circle cx="60" cy="60" r="60" fill="${bg}"/>
    <circle cx="60" cy="60" r="48" fill="none" stroke="#ffffff0d" stroke-width="2"/>
    <circle cx="60" cy="60" r="40" fill="none" stroke="#ffffff0d" stroke-width="2"/>
    <circle cx="60" cy="60" r="32" fill="none" stroke="#ffffff0d" stroke-width="2"/>
    <circle cx="60" cy="60" r="24" fill="none" stroke="#ffffff0d" stroke-width="2"/>
    <circle cx="60" cy="60" r="18" fill="${accent}" opacity="0.95"/>
    <circle cx="60" cy="60" r="5"  fill="#0a0603"/>
  </svg>`;
}

// ── Shelf Render ─────────────────────────────────────────────
function renderShelf(records) {
  const shelf = document.getElementById('shelf-records');
  shelf.innerHTML = '';

  if (records.length === 0) return;

  records.forEach(r => {
    const el = document.createElement('div');
    el.className = 'record-cover';
    el.dataset.id = r.id;
    el.innerHTML = `
      <div class="cover-art">
        ${discSVG(r)}
        ${r.skunkRecommended ? '<span class="skunk-badge">🦨</span>' : ''}
      </div>
      <div class="cover-label">
        <span class="cover-album">${r.album}</span>
        <span class="cover-artist">${r.artist}</span>
      </div>`;
    el.addEventListener('click', () => openDetail(r.id));
    shelf.appendChild(el);
  });
}

// ── List Render ──────────────────────────────────────────────
function renderList(records) {
  const tbody = document.getElementById('list-body');
  tbody.innerHTML = '';

  records.forEach(r => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td class="list-artist">${r.artist}${r.skunkRecommended ? ' 🦨' : ''}</td>
      <td class="list-album">${r.album}</td>
      <td class="list-year">${r.year || '—'}</td>
      <td class="list-genre">${r.genre || '—'}</td>
      <td class="list-actions">${isOwnerMode ? `
        <button class="btn-secondary edit-btn" data-id="${r.id}">Edit</button>
        <button class="btn-danger delete-btn" data-id="${r.id}">Remove</button>` : ''}
      </td>`;
    tbody.appendChild(tr);
  });
}

// ── Main Render ──────────────────────────────────────────────
function render() {
  const query = document.getElementById('search').value.trim().toLowerCase();
  const genre = document.getElementById('filter-genre').value;

  const filtered = sorted(collection).filter(r => {
    const matchSearch = !query ||
      r.artist.toLowerCase().includes(query) ||
      r.album.toLowerCase().includes(query);
    const matchGenre = !genre || r.genre === genre;
    return matchSearch && matchGenre;
  });

  const total = collection.length;
  const count = filtered.length;
  document.getElementById('record-count').textContent = (query || genre)
    ? `${count} of ${total} record${total !== 1 ? 's' : ''}`
    : `${total} record${total !== 1 ? 's' : ''}`;

  document.getElementById('empty-msg').classList.toggle('hidden', count > 0);

  if (currentView === 'shelf') {
    renderShelf(filtered);
  } else {
    renderList(filtered);
  }
}

function refreshGenreFilter() {
  const current = document.getElementById('filter-genre').value;
  const genres  = [...new Set(collection.map(r => r.genre).filter(Boolean))].sort();
  document.getElementById('filter-genre').innerHTML =
    '<option value="">All Genres</option>' +
    genres.map(g => `<option value="${g}"${g === current ? ' selected' : ''}>${g}</option>`).join('');
}

// ── View Toggle ──────────────────────────────────────────────
function setView(view) {
  currentView = view;
  document.getElementById('shelf-view').classList.toggle('hidden', view !== 'shelf');
  document.getElementById('list-view').classList.toggle('hidden',  view !== 'list');
  document.getElementById('view-shelf').classList.toggle('active', view === 'shelf');
  document.getElementById('view-list').classList.toggle('active',  view === 'list');
  render();
}

document.getElementById('view-shelf').addEventListener('click', () => setView('shelf'));
document.getElementById('view-list').addEventListener('click',  () => setView('list'));
document.getElementById('sort-select').addEventListener('change', e => {
  currentSort = e.target.value;
  render();
});

// ── Detail Modal ─────────────────────────────────────────────
function openDetail(id) {
  const r = collection.find(rec => rec.id === id);
  if (!r) return;
  detailRecordId = id;

  document.getElementById('detail-disc').innerHTML   = discSVG(r);
  document.getElementById('detail-artist').textContent = r.skunkRecommended
    ? `🦨 ${r.artist}` : r.artist;
  document.getElementById('detail-album').textContent  = r.album;

  const meta = [r.year, r.genre].filter(Boolean)
    .map(v => `<span class="tag">${v}</span>`).join('');
  document.getElementById('detail-meta').innerHTML = meta;

  const notesEl = document.getElementById('detail-notes');
  notesEl.textContent  = r.notes || '';
  notesEl.style.display = r.notes ? '' : 'none';

  document.getElementById('detail-edit').classList.toggle('hidden', !isOwnerMode);
  document.getElementById('detail-delete').classList.toggle('hidden', !isOwnerMode);

  document.getElementById('detail-modal').classList.remove('hidden');
}

function closeDetail() {
  document.getElementById('detail-modal').classList.add('hidden');
  detailRecordId = null;
}

document.getElementById('detail-close').addEventListener('click', closeDetail);
document.getElementById('detail-modal').addEventListener('click', e => {
  if (e.target === document.getElementById('detail-modal')) closeDetail();
});

document.getElementById('detail-edit').addEventListener('click', () => {
  closeDetail();
  const r = collection.find(rec => rec.id === detailRecordId);
  if (r) openModal(r);
});

document.getElementById('detail-delete').addEventListener('click', () => {
  closeDetail();
  openConfirm(detailRecordId);
});

// ── Add/Edit Modal ────────────────────────────────────────────
function openModal(record = null) {
  editingId = record ? record.id : null;
  document.getElementById('modal-title').textContent = record ? 'Edit Record' : 'Add Record';
  document.getElementById('f-artist').value   = record?.artist || '';
  document.getElementById('f-album').value    = record?.album  || '';
  document.getElementById('f-year').value     = record?.year   || '';
  document.getElementById('f-genre').value    = record?.genre  || '';
  document.getElementById('f-notes').value    = record?.notes  || '';
  document.getElementById('f-skunk').checked  = record?.skunkRecommended || false;
  document.getElementById('modal').classList.remove('hidden');
  document.getElementById('f-artist').focus();
}

function closeModal() {
  document.getElementById('modal').classList.add('hidden');
  document.getElementById('record-form').reset();
  editingId = null;
}

function openConfirm(id) {
  const r = collection.find(rec => rec.id === id);
  if (!r) return;
  pendingDeleteId = id;
  document.getElementById('confirm-msg').textContent =
    `Remove "${r.album}" by ${r.artist} from the collection?`;
  document.getElementById('confirm-modal').classList.remove('hidden');
}

function closeConfirm() {
  document.getElementById('confirm-modal').classList.add('hidden');
  pendingDeleteId = null;
}

// ── CRUD ─────────────────────────────────────────────────────
document.getElementById('record-form').addEventListener('submit', async e => {
  e.preventDefault();
  const artist = document.getElementById('f-artist').value.trim();
  const album  = document.getElementById('f-album').value.trim();
  if (!artist || !album) return;

  const record = {
    id:      editingId || crypto.randomUUID(),
    artist,
    album,
    year:             document.getElementById('f-year').value.trim(),
    genre:            document.getElementById('f-genre').value.trim(),
    notes:            document.getElementById('f-notes').value.trim(),
    skunkRecommended: document.getElementById('f-skunk').checked,
    addedAt: editingId
      ? collection.find(r => r.id === editingId)?.addedAt
      : new Date().toISOString(),
  };

  collection = editingId
    ? collection.map(r => r.id === editingId ? record : r)
    : [...collection, record];

  await saveCollection();
  refreshGenreFilter();
  render();
  closeModal();
});

document.getElementById('list-body').addEventListener('click', e => {
  const editBtn   = e.target.closest('.edit-btn');
  const deleteBtn = e.target.closest('.delete-btn');
  if (editBtn)   openModal(collection.find(r => r.id === editBtn.dataset.id));
  if (deleteBtn) openConfirm(deleteBtn.dataset.id);
});

document.getElementById('confirm-delete').addEventListener('click', async () => {
  if (!pendingDeleteId) return;
  collection = collection.filter(r => r.id !== pendingDeleteId);
  await saveCollection();
  refreshGenreFilter();
  render();
  closeConfirm();
});

// ── Global listeners ─────────────────────────────────────────
document.getElementById('add-btn').addEventListener('click', () => openModal());
document.getElementById('cancel-btn').addEventListener('click', closeModal);
document.getElementById('confirm-cancel').addEventListener('click', closeConfirm);

document.getElementById('modal').addEventListener('click', e => {
  if (e.target === document.getElementById('modal')) closeModal();
});
document.getElementById('confirm-modal').addEventListener('click', e => {
  if (e.target === document.getElementById('confirm-modal')) closeConfirm();
});

document.getElementById('search').addEventListener('input', render);
document.getElementById('filter-genre').addEventListener('change', render);

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') { closeModal(); closeConfirm(); closeDetail(); }
});

// ── Recommendations ──────────────────────────────────────────
document.getElementById('recommend-form').addEventListener('submit', e => {
  e.preventDefault();
  const name   = document.getElementById('r-name').value.trim();
  const artist = document.getElementById('r-artist').value.trim();
  const album  = document.getElementById('r-album').value.trim();
  if (!name || !artist || !album) return;

  const subject = encodeURIComponent(`Vinyl Recommendation: ${artist} - ${album}`);
  const body    = encodeURIComponent(`Hey Terry,\n\n${name} thinks you'd enjoy "${album}" by ${artist}.\n\n— Sent from Terry's Vinyl`);
  window.location.href = `mailto:${RECOMMEND_EMAIL}?subject=${subject}&body=${body}`;
});

// ── Init ─────────────────────────────────────────────────────
loadCollection().then(() => {
  refreshGenreFilter();
  render();
});
