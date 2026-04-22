# Feature: Golf Booking Reminders

**Status**: ✅ Live
**Location**: `/golf/` subdirectory
**Port**: 3001

---

## Overview

A standalone web app for tracking Vancouver golf course booking windows. The user maintains a list of courses, each with its own lead time (how many days in advance bookings open). The dashboard shows, for any chosen play date, exactly when each course's booking window opens and how long until that moment.

---

## User Stories

1. As a golfer, I want to see how long until I can book a specific course for a specific date, so I don't miss the booking window.
2. As a golfer, I want to manage a list of courses with their individual booking rules, so the app reflects real Vancouver booking windows accurately.

---

## Data Model

### Course

```json
{
  "id": "uuid-v4",
  "name": "Langara Golf Course",
  "leadDays": 3,
  "bookingOpenTime": "06:00",
  "bookingUrl": "https://...",
  "notes": "",
  "addedAt": "ISO-8601"
}
```

| Field | Type | Required | Notes |
|---|---|---|---|
| id | string (UUID) | Yes | Immutable, set at creation |
| name | string | Yes | Non-empty |
| leadDays | integer | Yes | 1–365; days before play date that booking opens |
| bookingOpenTime | string (HH:MM) | Yes | Time of day window opens; defaults to `"06:00"` |
| bookingUrl | string (URL) | No | Online booking link |
| notes | string | No | Free-text |
| addedAt | ISO-8601 string | Yes | Set at creation, never mutated |

---

## Booking Window Calculation

```
bookingOpensAt = (playDate − leadDays days) at bookingOpenTime (local time)
```

**Example**: play date = 2026-04-25, leadDays = 3, bookingOpenTime = "06:00"
→ booking opens at **2026-04-22 06:00 local time**

All calculations use the user's local timezone — no UTC conversion.

---

## Dashboard

- Date picker defaulting to today + 7 days
- One card per course showing:
  - Course name and booking rule summary
  - Calculated booking-opens datetime
  - Status badge (see below)
  - Optional booking URL link
- Cards sorted by time-until-opens ascending (soonest first; already-open courses rise to top)

### Status Badge States

| State | Condition | Colour |
|---|---|---|
| Open now | bookingOpensAt ≤ now AND playDate ≥ today | Green |
| Opens in Xh Ym | 0 < time remaining < 24h | Amber |
| Opens in Xd Yh | time remaining ≥ 24h | Blue |
| Date passed | playDate is in the past | Grey |

---

## Manage Courses

- Table listing all courses (name, lead days, opens-at time, URL)
- **Add Course** button → modal form
- **Edit** / **Delete** actions per row
- Delete requires `confirm()` before removing

---

## API

| Method | Path | Description |
|---|---|---|
| GET | /api/courses | Returns full courses array as JSON |
| POST | /api/courses | Full-replace of courses array |

---

## Business Rules

- **GBR-001** — Every course must have a non-empty `name` and a positive integer `leadDays` (1–365).
- **GBR-002** — Every course has a unique `id` assigned at creation via `crypto.randomUUID()`. IDs are immutable.
- **GBR-003** — `addedAt` is set at creation and never mutated on edit.
- **GBR-004** — `bookingOpenTime` defaults to `"06:00"` if not provided by the user.
- **GBR-005** — The server performs a full-replace write on every POST (same pattern as Terry's Vinyl BR-007).
- **GBR-006** — The server rejects any POST body that is not parseable JSON or not an array, with HTTP 400.
- **GBR-007** — All booking window calculations use local time (not UTC) to match what the user sees on a calendar.

---

## Success Criteria

- User can add, edit, and delete courses
- Dashboard correctly calculates and displays booking open datetime for any chosen play date
- Status badge reflects the correct state on every page load
- Empty state prompts user to add their first course
- Booking URL renders as a clickable link when present
