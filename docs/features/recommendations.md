# Feature Spec: Album Recommendations

**Status:** 🚧 In Progress  
**Last updated:** 2026-04-17

---

## Overview

Visitors to the public site can recommend an album to Terry via a simple form. Submitting the form opens the visitor's email client with a pre-filled message addressed to Terry.

---

## Behaviour

- Recommendation section is shown **only in public mode** (hidden when running locally)
- Form fields: **Your name** (required), **Artist** (required), **Album** (required)
- On submit: opens `mailto:` link with pre-filled subject and body
- No server-side processing — no data is stored anywhere by the app

### mailto format

```
To:      liam.venables95@gmail.com
Subject: Vinyl Recommendation: [Artist] - [Album]
Body:    Hey Terry,

         [Name] thinks you'd enjoy "[Album]" by [Artist].

         — Sent from Terry's Vinyl
```

---

## UI Placement

- Below the collection grid as a distinct section
- Visually separated with a heading: "Recommend an album"
- Matches the existing dark vinyl theme

---

## Success Criteria

- [ ] Form is not visible when running locally (`npm start`)
- [ ] Form is visible on the public static site
- [ ] Submitting with valid artist + album opens the email client with correct pre-filled content
- [ ] Submit is blocked if any field is empty
- [ ] Section is responsive on mobile
