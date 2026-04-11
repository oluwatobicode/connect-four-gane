export interface sendOtpData {
  email: string;
}

export interface verifyOtpData {
  email: string;
  otp: string;
}

export interface OtpResult {
  message: string;
}
