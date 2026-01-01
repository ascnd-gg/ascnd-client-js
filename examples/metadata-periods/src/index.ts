import { AscndClient } from "@ascnd-gg/client";

const client = new AscndClient({
  baseUrl: "https://api.ascnd.gg",
  apiKey: process.env.ASCND_API_KEY!,
});

// Submit score with metadata
const result = await client.submitScore({
  leaderboardId: process.env.LEADERBOARD_ID!,
  playerId: "player_meta_001",
  score: 75000,
  metadata: {
    character: "warrior",
    level: 15,
    powerups: ["speed", "shield"],
  },
});

console.log(`Score submitted with metadata! Rank: #${result.rank}\n`);

// Fetch current period leaderboard
const leaderboard = await client.getLeaderboard({
  leaderboardId: process.env.LEADERBOARD_ID!,
  limit: 5,
  period: "current",
});

console.log(`Current Period: ${leaderboard.periodStart}`);
if (leaderboard.periodEnd) {
  console.log(`Ends: ${leaderboard.periodEnd}`);
}
console.log("\nTop 5 with metadata:\n");

for (const entry of leaderboard.entries) {
  console.log(`#${entry.rank} ${entry.playerId}: ${entry.score}`);
  if (entry.metadata) {
    console.log(`   Metadata: ${JSON.stringify(entry.metadata)}`);
  }
}
