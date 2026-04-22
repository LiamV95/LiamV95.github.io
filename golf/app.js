'use strict';

let courses = [];
let currentView = 'dashboard';
let editingId = null;
let playDate = offsetDate(7);

// ─── Date helpers ──────────────────────────────────

function offsetDate(days) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return toDateStr(d);
}

function toDateStr(d) {
  return d.toISOString().slice(0, 10);
}

function todayStr() {
  return toDateStr(new Date());
}

// ─── API ───────────────────────────────────────────

async function loadCourses() {
  const res = await fetch('/api/courses');
  courses = await res.json();
}

async function saveCourses() {
  await fetch('/api/courses', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(courses),
  });
}

// ─── Booking window logic ──────────────────────────

function calcBookingOpens(course, playDateStr) {
  const play = new Date(playDateStr + 'T00:00:00');
  const opens = new Date(play);
  opens.setDate(opens.getDate() - course.leadDays);
  const [h, m] = (course.bookingOpenTime || '06:00').split(':').map(Number);
  opens.setHours(h, m, 0, 0);
  return opens;
}

function getStatus(course, playDateStr) {
  const now = new Date();
  const play = new Date(playDateStr + 'T00:00:00');
  const opens = calcBookingOpens(course, playDateStr);
  const msUntil = opens - now;

  const playIsPast = play < now && toDateStr(play) !== todayStr();
  if (playIsPast) return { type: 'passed', label: 'Date passed' };

  if (msUntil <= 0) return { type: 'open', label: 'Open now' };

  const label = 'Opens in ' + formatCountdown(msUntil);
  const type = msUntil < 86400000 ? 'soon' : 'future';
  return { type, label };
}

function formatCountdown(ms) {
  const totalMins = Math.floor(ms / 60000);
  const totalHrs = Math.floor(totalMins / 60);
  const days = Math.floor(totalHrs / 24);
  const hrs = totalHrs % 24;
  const mins = totalMins % 60;

  if (days > 0 && hrs > 0) return `${days}d ${hrs}h`;
  if (days > 0) return `${days}d`;
  if (hrs > 0 && mins > 0) return `${hrs}h ${mins}m`;
  if (hrs > 0) return `${hrs}h`;
  return `${mins}m`;
}

function formatOpensAt(d) {
  const date = d.toLocaleDateString('en-CA', { weekday: 'short', month: 'short', day: 'numeric' });
  const time = d.toLocaleTimeString('en-CA', { hour: '2-digit', minute: '2-digit', hour12: true });
  return `${date} at ${time}`;
}

// ─── XSS escape ────────────────────────────────────

function esc(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ─── Dashboard ─────────────────────────────────────

function renderDashboard() {
  const sorted = [...courses].sort((a, b) => {
    const now = new Date();
    return (calcBookingOpens(a, playDate) - now) - (calcBookingOpens(b, playDate) - now);
  });

  const cardsHtml = sorted.map(course => {
    const opens = calcBookingOpens(course, playDate);
    const status = getStatus(course, playDate);
    const linkHtml = course.bookingUrl
      ? `<div class="card-link"><a href="${esc(course.bookingUrl)}" target="_blank" rel="noopener">Book online →</a></div>`
      : '';
    const lead = course.leadDays === 1 ? '1 day' : `${course.leadDays} days`;
    return `
      <div class="course-card">
        <div class="card-info">
          <div class="card-name">${esc(course.name)}</div>
          <div class="card-rule">Books ${lead} in advance · opens at ${course.bookingOpenTime || '06:00'}</div>
          <div class="card-opens">Booking opens: <strong>${formatOpensAt(opens)}</strong></div>
          ${linkHtml}
        </div>
        <span class="badge badge-${status.type}">${status.label}</span>
      </div>`;
  }).join('');

  const bodyHtml = courses.length === 0
    ? `<div class="empty-state">
        <p>No courses yet.</p>
        <button class="btn-primary" onclick="switchView('manage')">Add your first course</button>
      </div>`
    : `<div class="course-cards">${cardsHtml}</div>`;

  document.getElementById('main').innerHTML = `
    <div class="date-row">
      <label for="play-date">When do you want to play?</label>
      <input type="date" id="play-date" value="${playDate}">
    </div>
    ${bodyHtml}`;

  document.getElementById('play-date').addEventListener('change', e => {
    playDate = e.target.value;
    renderDashboard();
  });
}

// ─── Manage Courses ────────────────────────────────

function renderManage() {
  const rowsHtml = courses.map(c => `
    <tr>
      <td>${esc(c.name)}</td>
      <td>${c.leadDays}d</td>
      <td>${c.bookingOpenTime || '06:00'}</td>
      <td>${c.bookingUrl ? `<a href="${esc(c.bookingUrl)}" target="_blank" rel="noopener">Link</a>` : '—'}</td>
      <td>
        <button class="btn-sm btn-edit" onclick="openModal('${c.id}')">Edit</button>
        <button class="btn-sm btn-delete" onclick="deleteCourse('${c.id}')">Delete</button>
      </td>
    </tr>`).join('');

  const tableHtml = courses.length === 0
    ? '<p style="color:var(--muted);margin-top:0.75rem;font-size:0.9rem;">No courses yet. Add one to get started.</p>'
    : `<table>
        <thead>
          <tr>
            <th>Course</th>
            <th>Lead time</th>
            <th>Opens at</th>
            <th>URL</th>
            <th></th>
          </tr>
        </thead>
        <tbody>${rowsHtml}</tbody>
      </table>`;

  document.getElementById('main').innerHTML = `
    <div class="manage-header">
      <h2>Courses</h2>
      <button class="btn-primary" onclick="openModal(null)">+ Add Course</button>
    </div>
    ${tableHtml}`;
}

// ─── Render ────────────────────────────────────────

function render() {
  document.getElementById('btn-dashboard').classList.toggle('active', currentView === 'dashboard');
  document.getElementById('btn-manage').classList.toggle('active', currentView === 'manage');

  if (currentView === 'dashboard') renderDashboard();
  else renderManage();
}

function switchView(v) {
  currentView = v;
  render();
}

// ─── Modal ─────────────────────────────────────────

function openModal(id) {
  editingId = id;
  const course = id ? courses.find(c => c.id === id) : null;

  document.getElementById('modal-title').textContent = course ? 'Edit Course' : 'Add Course';
  document.getElementById('f-name').value = course ? course.name : '';
  document.getElementById('f-lead').value = course ? course.leadDays : '';
  document.getElementById('f-time').value = course ? (course.bookingOpenTime || '06:00') : '06:00';
  document.getElementById('f-url').value = course ? (course.bookingUrl || '') : '';
  document.getElementById('f-notes').value = course ? (course.notes || '') : '';
  document.getElementById('form-error').classList.add('hidden');

  document.getElementById('modal-overlay').classList.remove('hidden');
  document.getElementById('f-name').focus();
}

function closeModal() {
  document.getElementById('modal-overlay').classList.add('hidden');
  editingId = null;
}

function showFormError(msg) {
  const el = document.getElementById('form-error');
  el.textContent = msg;
  el.classList.remove('hidden');
}

// ─── Event listeners ───────────────────────────────

document.getElementById('btn-dashboard').addEventListener('click', () => switchView('dashboard'));
document.getElementById('btn-manage').addEventListener('click', () => switchView('manage'));

document.getElementById('btn-cancel').addEventListener('click', closeModal);

document.getElementById('modal-overlay').addEventListener('click', e => {
  if (e.target === document.getElementById('modal-overlay')) closeModal();
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeModal();
});

document.getElementById('course-form').addEventListener('submit', async e => {
  e.preventDefault();

  const name = document.getElementById('f-name').value.trim();
  const leadDays = parseInt(document.getElementById('f-lead').value, 10);
  const bookingOpenTime = document.getElementById('f-time').value;
  const bookingUrl = document.getElementById('f-url').value.trim();
  const notes = document.getElementById('f-notes').value.trim();

  if (!name) return showFormError('Course name is required.');
  if (!leadDays || leadDays < 1 || leadDays > 365) return showFormError('Lead time must be between 1 and 365 days.');

  if (editingId) {
    const idx = courses.findIndex(c => c.id === editingId);
    courses[idx] = { ...courses[idx], name, leadDays, bookingOpenTime, bookingUrl, notes };
  } else {
    courses.push({
      id: crypto.randomUUID(),
      name,
      leadDays,
      bookingOpenTime,
      bookingUrl,
      notes,
      addedAt: new Date().toISOString(),
    });
  }

  await saveCourses();
  closeModal();
  render();
});

// ─── Delete ────────────────────────────────────────

async function deleteCourse(id) {
  const course = courses.find(c => c.id === id);
  if (!course) return;
  if (!confirm(`Remove "${course.name}"?`)) return;
  courses = courses.filter(c => c.id !== id);
  await saveCourses();
  render();
}

// ─── Boot ──────────────────────────────────────────

loadCourses().then(() => render());
