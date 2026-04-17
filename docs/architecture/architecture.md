# Architecture — Terry's Vinyl

## Overview

Terry's Vinyl is a zero-dependency, single-page local web app for tracking a personal vinyl record collection. It runs entirely on the local machine — no cloud, no accounts, no external services.

---

## Stack

| Layer | Technology |
|---|---|
| Frontend | Vanilla HTML5 / CSS3 / ES2020 JavaScript |
| Server | Node.js built-in `http`, `fs`, `path` modules |
| Storage | `data.json` flat file (JSON array) |
| Fonts | Google Fonts CDN (Playfair Display, Inter) |
| Dependencies | **Zero** npm dependencies |

---

## File Structure

```
├── index.html       — App shell, modals, semantic HTML
├── style.css        — All styles; CSS custom properties for theming
├── app.js           — All client-side logic (render, CRUD, modals)
├── server.js        — HTTP server: static file serving + /api/collection
├── data.json        — Persistent collection store (JSON array of records)
├── package.json     — npm start script only; no dependencies
├── CLAUDE.md        — Governance rules for AI-assisted development
├── CHANGELOG.md     — Version history (Keep a Changelog format)
├── README.md        — Setup and usage documentation
└── docs/
    ├── SPECS_INDEX.md
    ├── BACKLOG.md
    ├── architecture/
    │   ├── architecture.md   (this file)
    │   └── business_rules.md
    ├── features/
    │   └── collection.md
    ├── decisions/
    ├── learnings/
    └── walkthroughs/
```

---

## Request Flow

```
Browser → GET / or static asset  →  server.js reads file  →  response
Browser → GET /api/collection    →  server.js reads data.json  →  JSON response
Browser → POST /api/collection   →  server.js validates + writes data.json  →  {"ok":true}
```

---

## Architecture Decision Records

### ADR-001 — Zero npm dependencies (2026-04-16)

**Decision:** Use only Node.js built-in modules. No Express, no lodash, no anything.

**Reasoning:** This is a personal local tool. The fewer moving parts, the less maintenance burden. Node.js `http`, `fs`, and `path` are sufficient for the use case.

**Consequence:** Any future feature must be achievable with built-ins or vanilla browser APIs.

---

### ADR-002 — Flat JSON file over SQLite (2026-04-16)

**Decision:** Store the collection in `data.json` rather than a SQLite database.

**Reasoning:** A vinyl collection is a small, infrequently written dataset. A plain JSON file is directly editable, easily backed up, human-readable, and requires no additional tooling.

**Consequence:** No complex queries. If the collection grows to thousands of records and performance degrades, revisit with ADR.

---

### ADR-003 — Single-file client (app.js) (2026-04-16)

**Decision:** All client logic lives in one `app.js` file.

**Reasoning:** The app has one feature domain (the collection). Module splitting adds complexity with no benefit at this scale.

**Consequence:** If `app.js` exceeds ~400 lines, raise with the user before splitting.
