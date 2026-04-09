<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Leaderboard | The 2026 Masters Tournament</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Serif:wght@400;600&family=Inter:wght@300;400;600&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="CSS">
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

