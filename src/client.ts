import { createClient, type Client, type Interceptor, ConnectError } from "@connectrpc/connect";
import { createGrpcWebTransport } from "@connectrpc/connect-web";
import {
  AscndService,
  type SubmitScoreRequest,
  type SubmitScoreResponse,
  type GetLeaderboardRequest,
  type GetLeaderboardResponse,
  type GetPlayerRankRequest,
  type GetPlayerRankResponse,
  AscndClientConfig,
  AscndError,
} from "./types.js";

/**
 * Client for the Ascnd leaderboard API using gRPC-Web.
 *
 * @example
 * ```typescript
 * import { AscndClient, create } from "@ascnd-gg/client";
 * import { SubmitScoreRequestSchema } from "@ascnd-gg/client";
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
 * console.log(`Rank: #${result.rank}`);
 * ```
 */
export class AscndClient {
  private readonly client: Client<typeof AscndService>;

  /**
   * Creates a new Ascnd client.
   *
   * @param config - Client configuration options.
   */
  constructor(config: AscndClientConfig) {
    if (!config.baseUrl) {
      throw new Error("baseUrl is required");
    }
    if (!config.apiKey) {
      throw new Error("apiKey is required");
    }

    // Create an interceptor to add the API key header
    const authInterceptor: Interceptor = (next) => async (req) => {
      req.header.set("x-api-key", config.apiKey);
      return await next(req);
    };

    // Create the gRPC-Web transport
    const transport = createGrpcWebTransport({
      baseUrl: config.baseUrl.replace(/\/$/, ""),
      interceptors: [authInterceptor],
      defaultTimeoutMs: config.timeout ?? 30000,
    });

    this.client = createClient(AscndService, transport);
  }

  /**
   * Submits a player's score to a leaderboard.
   *
   * @param request - The score submission request.
   * @returns The submission result including the player's new rank.
   * @throws {AscndError} If the API returns an error.
   *
   * @example
   * ```typescript
   * import { create } from "@bufbuild/protobuf";
   * import { SubmitScoreRequestSchema } from "@ascnd-gg/client";
   *
   * const result = await client.submitScore(
   *   create(SubmitScoreRequestSchema, {
   *     leaderboardId: "high-scores",
   *     playerId: "player-123",
   *     score: 1000n,
   *     metadata: new TextEncoder().encode(JSON.stringify({ level: 5 })),
   *   })
   * );
   *
   * console.log(`New rank: ${result.rank}`);
   * if (result.isNewBest) {
   *   console.log("New personal best!");
   * }
   * if (result.anticheat && !result.anticheat.passed) {
   *   console.log("Anticheat flagged:", result.anticheat.violations);
   * }
   * ```
   */
  async submitScore(request: SubmitScoreRequest): Promise<SubmitScoreResponse> {
    try {
      return await this.client.submitScore(request);
    } catch (error) {
      throw this.convertError(error);
    }
  }

  /**
   * Retrieves the top scores for a leaderboard.
   *
   * @param request - The leaderboard request parameters.
   * @returns The leaderboard entries and pagination info.
   * @throws {AscndError} If the API returns an error.
   *
   * @example
   * ```typescript
   * import { create } from "@bufbuild/protobuf";
   * import { GetLeaderboardRequestSchema } from "@ascnd-gg/client";
   *
   * const leaderboard = await client.getLeaderboard(
   *   create(GetLeaderboardRequestSchema, {
   *     leaderboardId: "high-scores",
   *     limit: 10,
   *     viewSlug: "platform-pc", // Filter by metadata view
   *   })
   * );
   *
   * for (const entry of leaderboard.entries) {
   *   console.log(`#${entry.rank}: ${entry.playerId} - ${entry.score}`);
   *   if (entry.bracket) {
   *     console.log(`  Bracket: ${entry.bracket.name}`);
   *   }
   * }
   * ```
   */
  async getLeaderboard(
    request: GetLeaderboardRequest
  ): Promise<GetLeaderboardResponse> {
    try {
      return await this.client.getLeaderboard(request);
    } catch (error) {
      throw this.convertError(error);
    }
  }

  /**
   * Retrieves a specific player's rank and score information.
   *
   * @param request - The player rank request parameters.
   * @returns The player's rank, score, and percentile information.
   * @throws {AscndError} If the API returns an error.
   *
   * @example
   * ```typescript
   * import { create } from "@bufbuild/protobuf";
   * import { GetPlayerRankRequestSchema } from "@ascnd-gg/client";
   *
   * const playerRank = await client.getPlayerRank(
   *   create(GetPlayerRankRequestSchema, {
   *     leaderboardId: "high-scores",
   *     playerId: "player-123",
   *     viewSlug: "platform-pc",
   *   })
   * );
   *
   * if (playerRank.rank !== undefined) {
   *   console.log(`Rank: #${playerRank.rank}`);
   *   console.log(`Score: ${playerRank.score}`);
   *   console.log(`Percentile: ${playerRank.percentile}`);
   *   if (playerRank.bracket) {
   *     console.log(`Bracket: ${playerRank.bracket.name}`);
   *   }
   *   if (playerRank.globalRank !== undefined) {
   *     console.log(`Global Rank: #${playerRank.globalRank}`);
   *   }
   * } else {
   *   console.log("Player not on leaderboard");
   * }
   * ```
   */
  async getPlayerRank(
    request: GetPlayerRankRequest
  ): Promise<GetPlayerRankResponse> {
    try {
      return await this.client.getPlayerRank(request);
    } catch (error) {
      throw this.convertError(error);
    }
  }

  /**
   * Converts a Connect error to an AscndError.
   */
  private convertError(error: unknown): AscndError {
    if (error instanceof ConnectError) {
      return new AscndError(
        error.message,
        error.code.toString(),
        error.details?.length ? { details: error.details } : undefined
      );
    }
    if (error instanceof Error) {
      return new AscndError(error.message, "UNKNOWN");
    }
    return new AscndError("Unknown error occurred", "UNKNOWN");
  }
}
