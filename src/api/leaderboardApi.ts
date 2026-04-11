import { apiInstance } from "./api";
import type { GlobalLeaderboardResponse, PersonalRankResponse } from "../interface/LeaderboardEntry";

export const fetchGlobalLeaderboard = async (): Promise<GlobalLeaderboardResponse> => {
  const { data } = await apiInstance.get<GlobalLeaderboardResponse>("/leaderboard/all");
  return data;
};

export const fetchPersonalRank = async (): Promise<PersonalRankResponse> => {
  const { data } = await apiInstance.get<PersonalRankResponse>("/leaderboard/me");
  return data;
};
