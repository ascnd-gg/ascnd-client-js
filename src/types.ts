/**
 * TypeScript types for the Ascnd gRPC API.
 *
 * Types are generated from the proto file and re-exported here.
 */

// Re-export all generated types
export type {
  SubmitScoreRequest,
  SubmitScoreResponse,
  GetLeaderboardRequest,
  GetLeaderboardResponse,
  GetPlayerRankRequest,
  GetPlayerRankResponse,
  LeaderboardEntry,
  AnticheatResult,
  AnticheatViolation,
  BracketInfo,
  ViewInfo,
} from "./gen/ascnd_pb.js";

// Re-export the service definition
export { AscndService } from "./gen/ascnd_pb.js";

// Re-export schemas for creating messages
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
} from "./gen/ascnd_pb.js";

// ============================================================================
// Client Configuration
// ============================================================================

/**
 * Configuration options for the Ascnd client.
 */
export interface AscndClientConfig {
  /** The base URL of the Ascnd API (e.g., "https://api.ascnd.gg"). */
  baseUrl: string;

  /** Your API key for authentication. */
  apiKey: string;

  /** Optional request timeout in milliseconds (default: 30000). */
  timeout?: number;
}

// ============================================================================
// Error Types
// ============================================================================

/**
 * Custom error class for Ascnd API errors.
 */
export class AscndError extends Error {
  /** gRPC/Connect error code. */
  readonly code: string;

  /** Additional error details. */
  readonly details?: Record<string, unknown>;

  constructor(
    message: string,
    code: string,
    details?: Record<string, unknown>
  ) {
    super(message);
    this.name = "AscndError";
    this.code = code;
    this.details = details;
  }
}
