# @ascnd-gg/client

TypeScript/JavaScript client library for the [Ascnd](https://ascnd.gg) leaderboard API. Uses gRPC-Web for efficient, type-safe communication.

## Installation

```bash
npm install @ascnd-gg/client
# or
yarn add @ascnd-gg/client
# or
pnpm add @ascnd-gg/client
```

## Quick Start

```typescript
import { AscndClient, create, SubmitScoreRequestSchema } from "@ascnd-gg/client";

const client = new AscndClient({
  baseUrl: "https://api.ascnd.gg",
  apiKey: "your-api-key",
});

// Submit a score
const result = await client.submitScore(
  create(SubmitScoreRequestSchema, {
    leaderboardId: "high-scores",
    playerId: "player-123",
    score: 1000n,
  })
);

console.log(`Rank: #${result.rank}`);
```

## Examples

Stand-alone example projects are available in the [`examples/`](./examples) directory:

| Example | Description |
|---------|-------------|
| [`submit-score`](./examples/submit-score) | Submit a score and display the resulting rank |
| [`leaderboard`](./examples/leaderboard) | Fetch and display the top 10 leaderboard entries |
| [`metadata-periods`](./examples/metadata-periods) | Submit scores with metadata and query by time period |

Each example is a self-contained project. To run:

```bash
cd examples/submit-score
npm install
export ASCND_API_KEY=your_api_key
export LEADERBOARD_ID=your_leaderboard_id
npm start
```

## Usage

### Creating a Client

```typescript
import { AscndClient } from "@ascnd-gg/client";

const client = new AscndClient({
  baseUrl: "https://api.ascnd.gg", // API base URL
  apiKey: "your-api-key",          // Your API key
  timeout: 30000,                  // Optional: request timeout in ms (default: 30000)
});
```

### Submit a Score

Submit a player's score to a leaderboard:

```typescript
import { create, SubmitScoreRequestSchema } from "@ascnd-gg/client";

const result = await client.submitScore(
  create(SubmitScoreRequestSchema, {
    leaderboardId: "high-scores",
    playerId: "player-123",
    score: 1000n,
    metadata: new TextEncoder().encode(JSON.stringify({
      level: 5,
      character: "warrior",
    })),
    idempotencyKey: "unique-key",  // Optional: prevent duplicate submissions
  })
);

console.log(`Score ID: ${result.scoreId}`);
console.log(`Rank: #${result.rank}`);
console.log(`New personal best: ${result.isNewBest}`);
console.log(`Was deduplicated: ${result.wasDeduplicated}`);

// Check anticheat results (if enabled)
if (result.anticheat) {
  console.log(`Anticheat passed: ${result.anticheat.passed}`);
  if (!result.anticheat.passed) {
    console.log(`Action taken: ${result.anticheat.action}`);
    for (const violation of result.anticheat.violations) {
      console.log(`  - ${violation.flagType}: ${violation.reason}`);
    }
  }
}
```

### Get Leaderboard

Retrieve the top scores for a leaderboard:

```typescript
import { create, GetLeaderboardRequestSchema } from "@ascnd-gg/client";

const leaderboard = await client.getLeaderboard(
  create(GetLeaderboardRequestSchema, {
    leaderboardId: "high-scores",
    limit: 10,                     // Optional: max entries (default: 10, max: 100)
    offset: 0,                     // Optional: pagination offset
    period: "current",             // Optional: "current", "previous", or timestamp
    viewSlug: "platform-pc",       // Optional: filter by metadata view
  })
);

console.log(`Total players: ${leaderboard.totalEntries}`);
console.log(`Period: ${leaderboard.periodStart} - ${leaderboard.periodEnd}`);

for (const entry of leaderboard.entries) {
  console.log(`#${entry.rank}: ${entry.playerId} - ${entry.score}`);
  if (entry.bracket) {
    console.log(`  Bracket: ${entry.bracket.name} (${entry.bracket.color})`);
  }
}

if (leaderboard.hasMore) {
  // Fetch next page with offset: 10
}

// View info (if filtering by viewSlug)
if (leaderboard.view) {
  console.log(`Viewing: ${leaderboard.view.name}`);
}
```

### Get Player Rank

Get a specific player's rank and score:

```typescript
import { create, GetPlayerRankRequestSchema } from "@ascnd-gg/client";

const playerRank = await client.getPlayerRank(
  create(GetPlayerRankRequestSchema, {
    leaderboardId: "high-scores",
    playerId: "player-123",
    period: "current",             // Optional
    viewSlug: "platform-pc",       // Optional: filter by metadata view
  })
);

if (playerRank.rank !== undefined) {
  console.log(`Rank: #${playerRank.rank}`);
  console.log(`Score: ${playerRank.score}`);
  console.log(`Best score: ${playerRank.bestScore}`);
  console.log(`Percentile: ${playerRank.percentile}`);
  console.log(`Total players: ${playerRank.totalEntries}`);

  // Bracket info (if brackets are enabled)
  if (playerRank.bracket) {
    console.log(`Bracket: ${playerRank.bracket.name}`);
  }

  // Global rank when filtering by view
  if (playerRank.globalRank !== undefined) {
    console.log(`Global Rank: #${playerRank.globalRank}`);
  }
} else {
  console.log("Player has no score on this leaderboard");
}
```

## Features

### Anticheat

When anticheat is enabled for a leaderboard, the `submitScore` response includes validation results:

```typescript
const result = await client.submitScore(request);

if (result.anticheat && !result.anticheat.passed) {
  console.log(`Score flagged: ${result.anticheat.action}`);
  // Possible actions: "none", "flag", "shadow_ban", "reject"

  for (const violation of result.anticheat.violations) {
    console.log(`  ${violation.flagType}: ${violation.reason}`);
    // Flag types: "bounds_exceeded", "velocity_exceeded",
    //             "duplicate_idempotency", "missing_idempotency_key"
  }
}
```

### Brackets

Leaderboards with brackets enabled include tier information for each entry:

```typescript
const leaderboard = await client.getLeaderboard(request);

for (const entry of leaderboard.entries) {
  if (entry.bracket) {
    console.log(`${entry.playerId} is in ${entry.bracket.name}`);
    // entry.bracket.color contains hex color code like "#FFD700"
  }
}
```

### Metadata Views

Filter leaderboards by metadata views to create segmented rankings:

```typescript
import { create, GetLeaderboardRequestSchema } from "@ascnd-gg/client";

// Get PC-only leaderboard
const pcLeaderboard = await client.getLeaderboard(
  create(GetLeaderboardRequestSchema, {
    leaderboardId: "high-scores",
    viewSlug: "platform-pc",
  })
);

// Rankings are within the view
// Use globalRank in GetPlayerRank to see overall position
```

## Error Handling

The client throws `AscndError` for API errors:

```typescript
import { AscndClient, AscndError } from "@ascnd-gg/client";

try {
  await client.submitScore(request);
} catch (error) {
  if (error instanceof AscndError) {
    console.error(`API Error: ${error.message}`);
    console.error(`Code: ${error.code}`);
    console.error(`Details:`, error.details);
  } else {
    throw error;
  }
}
```

## API Reference

### AscndClient

#### Constructor

```typescript
new AscndClient(config: AscndClientConfig)
```

| Option | Type | Required | Description |
|--------|------|----------|-------------|
| `baseUrl` | `string` | Yes | The base URL of the Ascnd API |
| `apiKey` | `string` | Yes | Your API key for authentication |
| `timeout` | `number` | No | Request timeout in milliseconds (default: 30000) |

#### Methods

##### `submitScore(request: SubmitScoreRequest): Promise<SubmitScoreResponse>`

Submit a player's score to a leaderboard.

##### `getLeaderboard(request: GetLeaderboardRequest): Promise<GetLeaderboardResponse>`

Retrieve the top scores for a leaderboard.

##### `getPlayerRank(request: GetPlayerRankRequest): Promise<GetPlayerRankResponse>`

Get a specific player's rank and score.

### Message Creation

Use `create()` with schemas to create properly typed request messages:

```typescript
import { create, SubmitScoreRequestSchema } from "@ascnd-gg/client";

const request = create(SubmitScoreRequestSchema, {
  leaderboardId: "high-scores",
  playerId: "player-123",
  score: 1000n, // Note: scores are bigint
});
```

## Requirements

- Node.js 18+ (for native fetch support)
- Or any runtime with `fetch` available (browsers, Deno, Bun, Cloudflare Workers, etc.)

## Links

- [Documentation](https://ascnd.gg/docs/sdks/typescript)
- [GitHub](https://github.com/ascnd-gg/ascnd-client-js)
- [npm](https://www.npmjs.com/package/@ascnd-gg/client)

## License

MIT
