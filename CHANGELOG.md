# Changelog

All notable changes to **Terry's Vinyl** are documented here.

Format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

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
