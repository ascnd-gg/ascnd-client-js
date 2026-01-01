import { AscndClient } from "@ascnd-gg/client";

const client = new AscndClient({
  baseUrl: "https://api.ascnd.gg",
  apiKey: process.env.ASCND_API_KEY!,
});

const leaderboard = await client.getLeaderboard({
  leaderboardId: process.env.LEADERBOARD_ID!,
  limit: 10,
});

console.log(`Top 10 Leaderboard (${leaderboard.totalEntries} total players)\n`);
console.log("Rank  | Player             | Score");
console.log("------+--------------------+------------");

for (const entry of leaderboard.entries) {
  const rank = String(entry.rank).padStart(4);
  const player = entry.playerId.slice(0, 18).padEnd(18);
  const score = String(entry.score).padStart(10);
  console.log(`${rank}  | ${player} | ${score}`);
}

if (leaderboard.hasMore) {
  console.log("\n... and more entries");
}
