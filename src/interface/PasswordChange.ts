export interface resetPasswordLinkData {
  email: string;
}

export interface resetPasswordLinkResult {
  message: string;
}

export interface resetPasswordData {
  token: string;
  newPassword: string;
}

export interface resetPasswordResult {
  message: string;
}
