export interface ProfileData {
  id: string;
  email: string;
  username: string;
  avatar: string | null;
  eloRating: number;
  createdAt: string;
  _count: {
    gamesAsPlayer1: number;
    gamesAsPlayer2: number;
    achievements: number;
  };
}

export interface ProfileResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: ProfileData;
}
