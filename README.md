<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Live Leaderboard | The Masters</title>
    <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Serif:wght@600&family=Inter:wght@400;700&display=swap" rel="stylesheet">
    <style>
        :root {
            --masters-green: #006747;
            --text-dark: #1a1a1a;
            --score-red: #d0021b;
            --border: #eeeeee;
        }

        body {
            font-family: 'Inter', sans-serif;
            background-color: #f9f9f9;
            margin: 0;
            color: var(--text-dark);
        }

        .header {
            background: #fff;
            border-bottom: 1px solid var(--border);
            padding: 15px 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            position: sticky;
            top: 0;
            z-index: 10;
        }

        .logo { height: 40px; }

        .container {
            max-width: 800px;
            margin: 20px auto;
            padding: 0 15px;
        }

        h1 {
            font-family: 'IBM Plex Serif', serif;
            font-size: 28px;
            color: var(--masters-green);
            margin-bottom: 20px;
            text-align: center;
        }

        .card {
            background: #fff;
            border-radius: 4px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.05);
            overflow: hidden;
        }

        table {
            width: 100%;
            border-collapse: collapse;
        }

        th {
            text-align: left;
            padding: 15px;
            font-size: 11px;
            text-transform: uppercase;
            color: #888;
            border-bottom: 2px solid var(--masters-green);
            background: #fff;
        }

        td {
            padding: 14px 15px;
            border-bottom: 1px solid var(--border);
            font-size: 15px;
        }

        tr:nth-child(even) { background-color: #fafafa; }

        .pos-cell { font-weight: 700; color: #666; width: 60px; }
        .player-name { font-family: 'IBM Plex Serif', serif; font-weight: 600; font-size: 16px; color: #111; }
        .score-cell { font-weight: 700; text-align: right; font-size: 17px; width: 90px; }
        .thru-cell { color: #666; text-align: right; font-size: 14px; }
        .under-par { color: var(--score-red); }

        .loading { padding: 60px; text-align: center; color: #999; font-style: italic; }
    </style>
</head>
<body>

    <div class="header">
        <img src="https://upload.wikimedia.org/wikipedia/en/thumb/7/7e/Masters_Tournament_logo.svg/1200px-Masters_Tournament_logo.svg.png" class="logo">
    </div>

    <div class="container">
        <h1 id="event-name">Masters Tournament</h1>
        
        <div class="card">
            <table id="leaderboard">
                <thead>
                    <tr>
                        <th>Pos</th>
                        <th>Player</th>
                        <th style="text-align: right;">Thru</th>
                        <th style="text-align: right;">Total</th>
                    </tr>
                </thead>
                <tbody id="table-body">
                    <tr><td colspan="4" class="loading">Fetching live leaderboard...</td></tr>
                </tbody>
            </table>
        </div>
    </div>

    <script>
        const API_URL = 'https://site.api.espn.com/apis/site/v2/sports/golf/leaderboard?league=pga';

        async function fetchScores() {
            try {
                const response = await fetch(API_URL);
                const data = await response.json();
                
                if (!data.events || data.events.length === 0) return;

                const event = data.events[0];
                const competitors = event.competitions[0].competitors;

                // 1. SORT BY POSITION
                // We use sortOrder to ensure 1 is above 2, T3 is above T5, etc.
                competitors.sort((a, b) => {
                    const rankA = a.status?.position?.sortOrder || 999;
                    const rankB = b.status?.position?.sortOrder || 999;
                    return rankA - rankB;
                });

                document.getElementById('event-name').innerText = event.name;

                const tbody = document.getElementById('table-body');
                tbody.innerHTML = '';

                competitors.forEach(p => {
                    // 2. POSITION DISPLAY
                    const position = p.status?.position?.abbreviation || p.status?.position?.displayName || "-";

                    // 3. LIVE SCORE (TO PAR)
                    // We prioritize displayValue to get "-5" or "E" instead of raw numbers
                    let liveScore = "E";
                    if (p.score) {
                        liveScore = (typeof p.score === 'object') ? p.score.displayValue : p.score;
                    }
                    
                    // Logic to color score red if there's a minus sign
                    const isUnderPar = String(liveScore).includes('-');
                    const scoreClass = isUnderPar ? 'under-par' : '';

                    // 4. THRU STATUS
                    const thru = p.status?.displayValue || "-";

                    tbody.innerHTML += `
                        <tr>
                            <td class="pos-cell">${position}</td>
                            <td>
                                <span class="player-name">${p.athlete.displayName}</span>
                            </td>
                            <td class="thru-cell">${thru}</td>
                            <td class="score-cell ${scoreClass}">${liveScore === "0" ? "E" : liveScore}</td>
                        </tr>
                    `;
                });
            } catch (e) {
                console.error("Fetch Error:", e);
                document.getElementById('table-body').innerHTML = `<tr><td colspan="4" class="loading">Leaderboard is currently unavailable.</td></tr>`;
            }
        }

        // Initial fetch
        fetchScores();
        
        // Refresh every 30 seconds for live feel
        setInte
