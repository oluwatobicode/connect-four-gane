import { apiInstance } from "./api";
import type { ProfileResponse } from "../interface/Profile";

export const fetchProfile = async (): Promise<ProfileResponse> => {
  const { data } = await apiInstance.get<ProfileResponse>("/profile");
  return data;
};

export const updateProfile = async (
  formData: FormData,
): Promise<ProfileResponse> => {
  const { data } = await apiInstance.put<ProfileResponse>("/profile", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return data;
};
