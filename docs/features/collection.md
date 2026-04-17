# Feature Spec: Vinyl Collection

**Status:** ✅ Live — v1.0.0  
**Last updated:** 2026-04-17

---

## Overview

The core feature of Terry's Vinyl. Allows the user to maintain a personal catalogue of vinyl records — adding, editing, removing, searching, and filtering.

---

## Data Model

Each record stored in `data.json`:

```json
{
  "id":               "uuid-v4",
  "artist":           "string (required)",
  "album":            "string (required)",
  "year":             "string (optional, e.g. '1977')",
  "genre":            "string (optional, e.g. 'Rock')",
  "notes":            "string (optional)",
  "skunkRecommended": "boolean (optional, defaults false)",
  "addedAt":          "ISO 8601 timestamp"
}
```

---

## Behaviours

### Add Record
- User clicks **+ Add Record**
- Modal opens with empty form
- Required fields: Artist, Album
- On save: record appended to collection, written to `data.json`, grid re-renders
- Modal closes after successful save

### Edit Record
- User clicks **Edit** on a card
- Modal opens pre-populated with existing values
- On save: record replaced in-place in the array (by `id`), `addedAt` preserved
- Written to `data.json`, grid re-renders

### Remove Record
- User clicks **Remove** on a card
- Confirmation modal appears with record name
- On confirm: record removed from array, written to `data.json`, grid re-renders
- On cancel: no change

### Search
- Real-time filter on `artist` and `album` fields (case-insensitive substring match)
- Record count updates to show "N of M records" when filtered
- Empty search shows full collection

### Genre Filter
- Dropdown populated from unique `genre` values in the current collection
- Combined with search (both filters apply simultaneously)
- Selecting "All Genres" clears the genre filter

### Disc Art
- SVG disc rendered per card
- Colour palette selected deterministically from `artist + album` string hash
- 8 palettes available; palette index = `charCodeSum % 8`

---

## Success Criteria

- [ ] A record can be added, edited, and removed without page refresh
- [ ] Collection persists across server restarts (read from `data.json` on load)
- [ ] Search filters in real time with no perceptible lag
- [ ] Genre filter updates automatically when genres are added/removed
- [ ] Disc art is consistent — same record always shows same colours
- [ ] Removing a record requires confirmation

---

## Known Limitations

- No sort order control (records display in insertion order)
- No album art / cover image support
- No export/import UI (data.json can be edited manually)
