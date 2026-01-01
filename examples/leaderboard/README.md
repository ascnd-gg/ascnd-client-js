# Leaderboard Example

Demonstrates fetching and displaying a leaderboard from Ascnd.

## Setup

```bash
npm install
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `ASCND_API_KEY` | Your Ascnd API key |
| `LEADERBOARD_ID` | Target leaderboard ID |

## Run

```bash
export ASCND_API_KEY=your_api_key
export LEADERBOARD_ID=your_leaderboard_id
npm start
```

## Expected Output

```
Top 10 Leaderboard (1523 total players)

Rank  | Player             | Score
------+--------------------+------------
   1  | player_champion    |     999999
   2  | player_silver      |     875000
   3  | player_bronze      |     750000
...
```
