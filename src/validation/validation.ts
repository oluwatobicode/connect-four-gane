import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

export const signupSchema = z.object({
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

export const otpSchema = z.object({
  otp: z
    .string()
    .length(6, { message: "OTP must be exactly 6 digits" })
    .regex(/^\d+$/, { message: "OTP must contain only numbers" }),
});

export const otpVerificationSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  otp: otpSchema.shape.otp,
});

export const resetPasswordLinkSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
});

export const newPasswordSchema = z.object({
  newPassword: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

// Types based on the schemas
export type LoginFormInputs = z.infer<typeof loginSchema>;
export type SignupFormInputs = z.infer<typeof signupSchema>;
export type OtpFormInputs = z.infer<typeof otpSchema>;
export type OtpVerificationFormInputs = z.infer<typeof otpVerificationSchema>;
export type ResetPasswordLinkFormInputs = z.infer<
  typeof resetPasswordLinkSchema
>;
export type NewPasswordFormInputs = z.infer<typeof newPasswordSchema>;
