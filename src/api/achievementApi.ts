import { apiInstance } from "./api";
import type { AchievementResponse } from "../interface/Achievement";

export const fetchAllAchievements = async (): Promise<AchievementResponse> => {
  const { data } = await apiInstance.get<AchievementResponse>("/achievements");
  return data;
};

export const fetchMyAchievements = async (): Promise<AchievementResponse> => {
  const { data } = await apiInstance.get<AchievementResponse>("/achievements/me");
  return data;
};
