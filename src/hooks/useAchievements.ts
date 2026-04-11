import { useQuery } from "@tanstack/react-query";
import { fetchAllAchievements, fetchMyAchievements } from "../api/achievementApi";

export const useAchievements = () => {
  const allAchievementsQuery = useQuery({
    queryKey: ["achievements", "all"],
    queryFn: fetchAllAchievements,
  });

  const myAchievementsQuery = useQuery({
    queryKey: ["achievements", "me"],
    queryFn: fetchMyAchievements,
  });

  return {
    allAchievements: allAchievementsQuery.data?.data || [],
    myAchievements: myAchievementsQuery.data?.data || [],
    isLoading: allAchievementsQuery.isLoading || myAchievementsQuery.isLoading,
    isError: allAchievementsQuery.isError || myAchievementsQuery.isError,
    error: allAchievementsQuery.error || myAchievementsQuery.error,
  };
};
