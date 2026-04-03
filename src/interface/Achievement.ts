export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  isUnlocked?: boolean;
  unlockedAt?: string | null;
}

export interface AchievementResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: Achievement[];
}
