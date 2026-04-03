import type { AuthUser } from "./User";

export interface LoginWithGoogleData {
  googleToken: string;
}

export interface LoginWithGoogleResult {
  message: string;
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
}
