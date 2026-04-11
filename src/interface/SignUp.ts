export interface SignUpData {
  email: string;
  username: string;
  password: string;
}

export interface SignUpResult {
  message: string;
  accessToken: string;
  refreshToken: string;
}
