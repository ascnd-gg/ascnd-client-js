/**
 * @ascnd-gg/client - TypeScript/JavaScript client for the Ascnd leaderboard API.
 *
 * @example
 * ```typescript
 * import { AscndClient, create, SubmitScoreRequestSchema } from "@ascnd-gg/client";
 *
 * const client = new AscndClient({
 *   baseUrl: "https://api.ascnd.gg",
 *   apiKey: "your-api-key",
 * });
 *
 * // Submit a score
 * const result = await client.submitScore(
 *   create(SubmitScoreRequestSchema, {
 *     leaderboardId: "high-scores",
 *     playerId: "player-123",
 *     score: 1000n,
 *   })
 * );
 *
 * console.log(`New rank: ${result.rank}`);
 * ```
 *
 * @packageDocumentation
 */

// Export the main client class
export { AscndClient } from "./client.js";

// Re-export create helper from protobuf for convenience
export { create } from "@bufbuild/protobuf";

// Export all types
export type {
  // Client configuration
  AscndClientConfig,

  // Submit Score
  SubmitScoreRequest,
  SubmitScoreResponse,

  // Get Leaderboard
  GetLeaderboardRequest,
  GetLeaderboardResponse,
  LeaderboardEntry,

  // Get Player Rank
  GetPlayerRankRequest,
  GetPlayerRankResponse,

  // Anticheat
  AnticheatResult,
  AnticheatViolation,

  // Bracket
  BracketInfo,

  // View
  ViewInfo,
} from "./types.js";

// Export error class
export { AscndError } from "./types.js";

// Export the service definition
export { AscndService } from "./types.js";

// Export schemas for creating messages
export {
  SubmitScoreRequestSchema,
  SubmitScoreResponseSchema,
  GetLeaderboardRequestSchema,
  GetLeaderboardResponseSchema,
  GetPlayerRankRequestSchema,
  GetPlayerRankResponseSchema,
  LeaderboardEntrySchema,
  AnticheatResultSchema,
  AnticheatViolationSchema,
  BracketInfoSchema,
  ViewInfoSchema,
} from "./types.js";
