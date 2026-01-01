import { AscndClient } from "@ascnd-gg/client";

const client = new AscndClient({
  baseUrl: "https://api.ascnd.gg",
  apiKey: process.env.ASCND_API_KEY!,
});

const result = await client.submitScore({
  leaderboardId: process.env.LEADERBOARD_ID!,
  playerId: "player_example_001",
  score: 42500,
});

console.log("Score submitted!");
console.log(`  Rank: #${result.rank}`);
console.log(`  New personal best: ${result.isNewBest ? "Yes!" : "No"}`);
