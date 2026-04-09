<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Leaderboard | The 2026 Masters Tournament</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Serif:wght@400;600&family=Inter:wght@300;400;600&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="style.css">
</head>
<body>

    <nav class="navbar">
        <div class="nav-content">
            <img src="https://upload.wikimedia.org/wikipedia/en/thumb/7/7e/Masters_Tournament_logo.svg/1200px-Masters_Tournament_logo.svg.png" alt="Masters Logo" class="nav-logo">
            <div class="nav-links">
                <span>April 9 - 12, 2026</span>
            </div>
        </div>
    </nav>

    <header class="hero">
        <div class="container">
            <div class="live-indicator">
                <span class="dot"></span> LIVE UPDATES
            </div>
            <h1>Leaderboard</h1>
        </div>
    </header>

    <main class="container">
        <div class="table-wrapper">
            <table id="masters-table">
                <thead>
                    <tr>
                        <th class="col-rank">Pos</th>
                        <th class="col-player">Player</th>
                        <th class="col-score">To Par</th>
                        <th class="col-thru">Thru</th>
                        <th class="col-today">Today</th>
                        <th class="col-round">R1</th>
                        <th class="col-round">R2</th>
                        <th class="col-round">R3</th>
                        <th class="col-round">R4</th>
                        <th class="col-tot">Total</th>
                    </tr>
                </thead>
                <tbody id="leaderboard-body">
                    <!-- Data will be injected here -->
                </tbody>
            </table>
        </div>
        <div id="loader" class="masters-loader"></div>
    </main>

    <script src="script.js"></script>
</body>
</html>

:root {
    --masters-green: #006747;
    --masters-yellow: #ffcc00;
    --bg-grey: #f9f9f9;
    --text-main: #1a1a1a;
    --border-color: #e0e0e0;
}

body {
    font-family: 'Inter', sans-serif;
    background-color: var(--bg-grey);
    color: var(--text-main);
    margin: 0;
    -webkit-font-smoothing: antialiased;
}

/* Navbar */
.navbar {
    background: #fff;
    border-bottom: 1px solid var(--border-color);
    padding: 10px 0;
    position: sticky;
    top: 0;
    z-index: 100;
}

.nav-content {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 20px;
}

.nav-logo {
    height: 50px;
}

/* Hero Section */
.hero {
    background: white;
    padding: 60px 0 20px 0;
    border-bottom: 1px solid var(--border-color);
}

.container {
    max-width: 1100px;
    margin: 0 auto;
    padding: 0 20px;
}

h1 {
    font-family: 'IBM Plex Serif', serif;
    font-size: 42px;
    font-weight: 600;
    margin: 10px 0;
    color: var(--masters-green);
}

.live-indicator {
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 1px;
    display: flex;
    align-items: center;
    color: #666;
}

.dot {
    height: 8px;
    width: 8px;
    background-color: #d0021b;
    border-radius: 50%;
    display: inline-block;
    margin-right: 8px;
    animation: blink 1.5s infinite;
}

@keyframes blink {
    0% { opacity: 1; } 50% { opacity: 0.3; } 100% { opacity: 1; }
}

/* Table Design */
.table-wrapper {
    margin-top: 30px;
    background: white;
    box-shadow: 0 2px 15px rgba(0,0,0,0.05);
    border-radius: 4px;
    overflow-x: auto;
}

table {
    width: 100%;
    border-collapse: collapse;
}

th {
    background: #fff;
    text-align: left;
    padding: 15px;
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 1px;
    border-bottom: 2px solid var(--masters-green);
    color: #666;
}

td {
    padding: 12px 15px;
    border-bottom: 1px solid var(--border-color);
    font-size: 15px;
}

tr:hover {
    background-color: #fcfcfc;
}

/* Player Info Cell */
.player-cell {
    display: flex;
    align-items: center;
}

.player-img {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: #eee;
    margin-right: 12px;
    object-fit: cover;
    border: 1px solid #ddd;
}

.player-name {
    font-weight: 600;
    font-family: 'IBM Plex Serif', serif;
}

/* Scoring Colors */
.score-cell {
    font-weight: 700;
    font-size: 16px;
}

.under-par { color: #d0021b; }
.even-par { color: #1a1a1a; }

/* Loader */
.masters-loader {
    width: 40px;
    height: 40px;
    border: 3px solid #eee;
    border-top: 3px solid var(--masters-green);
    border-radius: 50%;
    margin: 50px auto;
    animation: spin 1s linear infinite;
}

@keyframes spin { 100% { transform: rotate(360deg); } }
