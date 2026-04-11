import type { AuthUser } from "./User";

export interface LoginData {
  email: string;
  password: string;
}

export interface LogInResult {
  user: AuthUser;
  message: string;
  accessToken: string;
  refreshToken: string;
}
