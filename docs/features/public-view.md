# Feature Spec: Public View

**Status:** ✅ Live  
**Last updated:** 2026-04-17

---

## Overview

When Terry's Vinyl is served statically (GitHub Pages) rather than via the local Node.js server, the app switches to a read-only public mode. Visitors can browse the full collection but cannot add, edit, or remove records.

---

## Mode Detection

On load, `app.js` attempts `GET /api/collection`:

- **Success (local server running):** owner mode — full CRUD controls visible, recommendation section hidden.
- **Failure (static host / no server):** public mode — management controls hidden, collection loaded from `GET /data.json`, recommendation section visible.

---

## Public Mode Behaviour

| Element | Owner mode | Public mode |
|---|---|---|
| **+ Add Record** button | Visible | Hidden |
| **Edit** button on cards | Visible | Hidden |
| **Remove** button on cards | Visible | Hidden |
| Recommendation section | Hidden | Visible |
| Search + genre filter | Visible | Visible |
| Record count | Visible | Visible |

---

## Data Source

- **Owner mode:** `GET /api/collection` (Node.js server reads `data.json`)
- **Public mode:** `GET /data.json` (static file fetch)

`data.json` must be committed to the repository for the public site to reflect the latest collection.

---

## Success Criteria

- [ ] App loads and displays collection correctly in both modes
- [ ] No CRUD controls are visible or reachable in public mode
- [ ] Search and genre filter work identically in both modes
- [ ] Switching from local to static requires no code changes — only a `git push`
