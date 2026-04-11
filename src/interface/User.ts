export type AuthUser = {
  id: string;
  email: string;
  username: string;
  avatar: string;
  authProvider: string;
  googleId: string;
  isVerified: boolean;
};
