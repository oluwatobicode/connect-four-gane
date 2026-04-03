import { useQuery } from "@tanstack/react-query";
import { fetchGlobalLeaderboard, fetchPersonalRank } from "../api/leaderboardApi";

/**
 * useLeaderboard hook fetches the global top players and the current user's personal rank.
 */
export const useLeaderboard = () => {
  const globalQuery = useQuery({
    queryKey: ["leaderboard", "all"],
    queryFn: fetchGlobalLeaderboard,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const personalQuery = useQuery({
    queryKey: ["leaderboard", "me"],
    queryFn: fetchPersonalRank,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return {
    globalLeaderboard: globalQuery.data?.data || [],
    personalRank: personalQuery.data?.data || null,
    isLoading: globalQuery.isLoading || personalQuery.isLoading,
    isError: globalQuery.isError || personalQuery.isError,
    error: globalQuery.error || personalQuery.error,
  };
};
