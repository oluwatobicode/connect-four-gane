export interface LeaderboardEntry {
  id: string;
  username: string;
  eloRating: number;
  rank: number;
  avatar: string | null;
}

export interface GlobalLeaderboardResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: LeaderboardEntry[];
}

export interface PersonalRankResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: LeaderboardEntry; // The endpoint for /me returns a single entry
}
