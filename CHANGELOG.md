# Changelog

All notable changes to **Terry's Vinyl** are documented here.

Format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

---

## [1.4.1] — 2026-04-17

### Added
- Sort options: Artist A–Z and Album A–Z (alongside existing Most Recently Added)

---

## [1.4.0] — 2026-04-17

### Added
- Shelf view: horizontally scrollable LP covers on a wooden shelf (default view)
- List view: compact table with artist, album, year, genre columns
- View toggle button in controls bar
- Sort by "Most Recently Added" (`addedAt` descending)
- Record detail modal: opens on shelf cover click, shows disc art + metadata
- Detail modal shows Edit/Remove in owner mode only

### Changed
- Full UI redesign: 80s warm lounge aesthetic — dark mahogany tones, amber accents, ambient ceiling-lamp glow
- Card grid view replaced by shelf view
- `docs/features/view-modes.md` spec added

---

## [1.3.0] — 2026-04-17

### Added
- Public read-only mode: app detects whether it's running locally or as a static site
- In public mode: CRUD controls hidden, collection loaded from static `data.json`
- Recommendation section (public mode only): friends can submit artist, album, and their name
- Recommendation form opens a pre-filled `mailto:` to liam.venables95@gmail.com
- New specs: `docs/features/public-view.md`, `docs/features/recommendations.md`

---

## [1.2.0] — 2026-04-17

### Added
- `CLAUDE.md` — governance rules and Principal Engineer persona for AI-assisted development
- `docs/SPECS_INDEX.md` — master index of all specifications
- `docs/BACKLOG.md` — prioritised product backlog
- `docs/architecture/architecture.md` — stack overview and ADRs (ADR-001 through ADR-003)
- `docs/architecture/business_rules.md` — system invariants (BR-001 through BR-012)
- `docs/features/collection.md` — full feature spec for the vinyl collection
- `docs/decisions/`, `docs/learnings/`, `docs/walkthroughs/` — governance folders

---

## [1.1.0] — 2026-04-16

### Changed
- Storage migrated from browser `localStorage` to a local `data.json` file
- App now runs via a Node.js HTTP server (`server.js`) — start with `npm start`
- `app.js` updated to load/save collection via `GET/POST /api/collection`

### Added
- `server.js` — zero-dependency Node.js server serving static files and the collection API
- `data.json` — persistent collection file written to disk on every change
- `package.json` — `npm start` script

---

## [1.0.0] — 2026-04-16

### Added
- Initial release of Terry's Vinyl collection tracker
- Record cards with artist, album, year, genre, and notes fields
- Add / Edit / Remove records via modal form
- Real-time search filtering by artist or album
- Genre dropdown filter (auto-populated from collection)
- Unique colour vinyl disc art per record (deterministic, seed-based)
- `localStorage` persistence — collection survives page refreshes
- Delete confirmation modal to prevent accidental removal
- Keyboard shortcut: `Escape` closes any open modal
- Click-outside-modal to dismiss
- Responsive layout for mobile and desktop
- Dark vinyl-themed UI with gold accent colour
