import axios from "axios";
import toast from "react-hot-toast";
import { apiInstance } from "./api";
import type { resetPasswordData } from "../interface/PasswordChange";

type MessageResponse = { message: string };

const getErrorMessage = (error: unknown, fallback: string) => {
  if (axios.isAxiosError(error)) {
    return (
      error.response?.data?.message ??
      error.response?.data?.error ??
      error.message ??
      fallback
    );
  }
  return error instanceof Error ? error.message : fallback;
};

export const sendOtp = async (email: string): Promise<MessageResponse> => {
  try {
    const { data } = await apiInstance.post<MessageResponse>("/auth/otp", {
      email,
    });
    toast.success(data.message || "Verification code sent");
    return data;
  } catch (error) {
    toast.error(getErrorMessage(error, "Unable to send OTP"));
    throw error;
  }
};

export const verifyOtp = async (payload: {
  email: string;
  otp: string;
}): Promise<MessageResponse> => {
  try {
    const { data } = await apiInstance.post<MessageResponse>(
      "/auth/otp/verify",
      payload,
    );
    toast.success(data.message || "Email verified successfully");
    return data;
  } catch (error) {
    toast.error(getErrorMessage(error, "Unable to verify OTP"));
    throw error;
  }
};

export const sendResetLink = async (
  email: string,
): Promise<MessageResponse> => {
  try {
    const { data } = await apiInstance.post<MessageResponse>(
      "/auth/password/reset-link",
      { email },
    );
    toast.success(data.message || "Password reset link sent");
    return data;
  } catch (error) {
    toast.error(getErrorMessage(error, "Unable to send reset link"));
    throw error;
  }
};

export const changePassword = async (
  payload: resetPasswordData,
): Promise<MessageResponse> => {
  try {
    const { data } = await apiInstance.post<MessageResponse>(
      "/auth/password/change",
      payload,
    );
    toast.success(data.message || "Password updated successfully");
    return data;
  } catch (error) {
    toast.error(getErrorMessage(error, "Unable to update password"));
    throw error;
  }
};
