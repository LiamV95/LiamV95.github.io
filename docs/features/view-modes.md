# Feature Spec: View Modes & Sorting

**Status:** ✅ Live  
**Last updated:** 2026-04-17

---

## Overview

The collection can be viewed in two modes: a **shelf view** (default) that presents records as LP covers on a scrollable wooden shelf, and a **list view** that presents records in a compact table. A sort control orders records within either view.

---

## View Modes

### Shelf View (default)
- Records displayed as square LP covers arranged horizontally on a wooden shelf
- The shelf scrolls horizontally; the rest of the page scrolls vertically as normal
- Each cover shows the record's unique disc art (SVG) with album and artist below
- Hovering a cover lifts it off the shelf (CSS transform)
- Clicking a cover opens a detail modal

### List View
- Records displayed as compact table rows: Artist · Album · Year · Genre
- In owner mode, each row has Edit and Remove buttons
- Same search/filter/sort controls apply

---

## Sort Options

| Value | Behaviour |
|---|---|
| `recent` (default) | Sort by `addedAt` descending — newest first |
| `artist` | Artist name A–Z (`localeCompare`) |
| `album` | Album name A–Z (`localeCompare`) |

---

## Detail Modal (shelf view click)

- Shows: disc art, artist, album, year, genre, notes
- Owner mode: includes Edit and Remove buttons
- Public mode: read-only, no management controls

---

## Visual Design

- **Theme**: 80s lounge room — dark warm wood tones, amber accents, warm ambient glow
- **Shelf**: wood grain background, visible wooden plank at base, horizontal scroll
- **Record covers**: square, SVG disc as cover art, label strip at bottom
- **List view**: vintage catalog aesthetic, amber artist names, cream album titles

---

## Success Criteria

- [ ] Shelf view is the default on load
- [ ] Toggling between shelf and list preserves current search/filter/sort
- [ ] Sort by "Most Recently Added" works correctly in both views
- [ ] Clicking a record in shelf view opens a detail modal
- [ ] Detail modal shows edit/remove controls in owner mode only
- [ ] Shelf scrolls horizontally; page scrolls normally outside the shelf
- [ ] Both views are responsive on mobile
