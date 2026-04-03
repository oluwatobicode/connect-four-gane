export interface GetRefreshToken {
  refreshToken: string;
}

export interface RefreshTokenResult {
  success: boolean;
  message: string;
  data: {
    accessToken: string;
  };
}
