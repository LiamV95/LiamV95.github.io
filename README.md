# Terry's Vinyl

A personal vinyl record collection tracker — runs locally via Node.js, stores data in `data.json`.

## Features

- **Add records** — store artist, album, year, genre, and personal notes
- **Edit / remove** — update any record or remove it from the collection
- **Search** — filter by artist or album name in real time
- **Genre filter** — dropdown auto-populates from the genres in your collection
- **File-based storage** — collection saved to `data.json` in the project folder
- **Visual disc art** — each record gets a unique colour disc based on its title

## Project Structure

```
├── index.html   — App shell and modal markup
├── style.css    — All styling (dark vinyl theme)
├── app.js       — Collection logic, CRUD, rendering
├── server.js    — Local Node.js HTTP server + file API
├── data.json    — Collection data (auto-updated on every change)
├── package.json — Project metadata and start script
├── README.md    — This file
└── CHANGELOG.md — Version history
```

## Getting Started

**Requirements:** Node.js 14 or higher.

```bash
# Install nothing — no dependencies required
npm start
```

Then open **http://localhost:3000** in your browser.

## Usage

| Action | How |
|---|---|
| Add a record | Click **+ Add Record**, fill in the form, click **Save** |
| Edit a record | Click **Edit** on a card |
| Remove a record | Click **Remove** on a card and confirm |
| Search | Type in the search box |
| Filter by genre | Use the genre dropdown |

## Data

The collection is stored in `data.json` at the root of the project. Every add, edit, or remove is written to disk immediately. You can open, edit, or back up `data.json` directly in any text editor.
