# Terry's Vinyl

A personal vinyl record collection tracker, built as a static web app hosted on GitHub Pages.

## Features

- **Add records** — store artist, album, year, genre, and personal notes
- **Edit / remove** — update any record or remove it from the collection
- **Search** — filter by artist or album name in real time
- **Genre filter** — dropdown auto-populates from the genres in your collection
- **Persistent storage** — collection saved in the browser via `localStorage`
- **Visual disc art** — each record gets a unique colour disc based on its title

## Project Structure

```
├── index.html   — App shell and modal markup
├── style.css    — All styling (dark vinyl theme)
├── app.js       — Collection logic, CRUD, rendering
├── README.md    — This file
└── CHANGELOG.md — Version history
```

## Usage

Open the site in a browser (GitHub Pages URL or local file). No build step or server required.

| Action | How |
|---|---|
| Add a record | Click **+ Add Record**, fill in the form, click **Save** |
| Edit a record | Click **Edit** on a card |
| Remove a record | Click **Remove** on a card and confirm |
| Search | Type in the search box |
| Filter by genre | Use the genre dropdown |

## Local Development

Just open `index.html` in a browser — no dependencies or build tools needed.

## Data

All data is stored in `localStorage` under the key `terrys-vinyl-collection`. Clearing browser storage will reset the collection. To back up or transfer your collection, you can copy the raw JSON from DevTools → Application → Local Storage.
