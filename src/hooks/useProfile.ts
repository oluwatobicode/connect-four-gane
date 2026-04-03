import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchProfile, updateProfile } from "../api/profileApi";
import toast from "react-hot-toast";

export const useProfile = () => {
  return useQuery({
    queryKey: ["profile"],
    queryFn: fetchProfile,
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProfile,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      toast.success(data.message || "Profile updated successfully!");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Failed to update profile";
      toast.error(message);
    },
  });
};
