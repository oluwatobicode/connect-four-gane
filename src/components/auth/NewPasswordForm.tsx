import { useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  newPasswordSchema,
  type NewPasswordFormInputs,
} from "../../validation/validation";
import { useAuth } from "../../contexts/AuthProvider";
import { changePassword } from "../../api/authApi";
import ButtonSpinner from "./ButtonSpinner";

const NewPasswordForm = () => {
  const navigate = useNavigate();
  const { token: tokenParam } = useParams<{ token?: string }>();
  const [searchParams] = useSearchParams();
  useAuth(); // keeps access token interceptor alive
  const [showPassword, setShowPassword] = useState(false);

  const tokenFromRoute = tokenParam ?? searchParams.get("token") ?? "";
  const hasResetToken = Boolean(tokenFromRoute);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<NewPasswordFormInputs>({
    resolver: zodResolver(newPasswordSchema),
    defaultValues: {
      newPassword: "",
    },
  });

  const onSubmit = async (data: NewPasswordFormInputs) => {
    if (!tokenFromRoute) {
      return;
    }

    await changePassword({
      token: tokenFromRoute,
      newPassword: data.newPassword,
    });
    navigate("/login");
  };

  return (
    <main className="min-h-screen bg-[#5C2DD5] flex flex-row items-center justify-center p-4">
      <div className="md:bg-[#7945FF] bg-none md:rounded-[40px] md:border-4 flex flex-col items-center justify-center md:border-black md:w-[560px] md:py-10 py-6 w-full max-w-[380px] mx-auto md:shadow-[0px_8px_0px_#000000]">
        <h1 className="text-white text-3xl font-bold mb-4 text-center px-4">
          NEW PASSWORD
        </h1>
        <p className="text-white font-semibold mb-8 text-center px-6">
          Set your new password to finish resetting your account.
        </p>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full px-6 flex flex-col items-center"
        >
          <div className="w-full relative mb-2">
            <input
              {...register("newPassword")}
              type={showPassword ? "text" : "password"}
              placeholder="Enter New Password"
              disabled={isSubmitting}
              className="w-full md:h-[72px] h-[64px] md:text-[20px] text-[16px] font-bold bg-[#FFFFFF] text-black p-4 pr-16 rounded-[20px] border-4 border-black outline-none shadow-[0px_6px_0px_#000000] focus:border-[#5C2DD5] transition-colors disabled:cursor-not-allowed disabled:opacity-70"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-5 top-1/2 -translate-y-1/2 text-black hover:text-[#5C2DD5] transition-colors cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
              aria-label={showPassword ? "Hide password" : "Show password"}
              disabled={isSubmitting}
            >
              {showPassword ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                  <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                  <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                  <line x1="2" x2="22" y1="2" y2="22" />
                </svg>
              )}
            </button>
          </div>
          {errors.newPassword && (
            <span className="text-[#FFCE67] font-bold mb-4 w-full text-left">
              {errors.newPassword.message}
            </span>
          )}

          {!hasResetToken && (
            <p className="text-[#FFCE67] font-bold mt-2 text-center">
              This reset link is missing its token. Request a new one{" "}
              <Link to="/forgot-password" className="underline">
                here
              </Link>
              .
            </p>
          )}

          <button
            type="submit"
            disabled={!hasResetToken || isSubmitting}
            className="w-full md:h-[72px] h-[64px] md:text-[24px] text-[20px] mt-6 font-bold flex items-center justify-center gap-3 cursor-pointer bg-[#FD6687] text-[#ffff] p-3 rounded-[20px] border-4 border-black transition-all duration-200 hover:scale-105 active:scale-95 shadow-[0px_6px_0px_#000000] hover:shadow-[0px_6px_0px_#5C2DD5] hover:border-[#5C2DD5] hover:border-4 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:opacity-70"
          >
            {isSubmitting && <ButtonSpinner />}
            <span>{isSubmitting ? "UPDATING..." : "UPDATE PASSWORD"}</span>
          </button>
        </form>

        <p className="text-white font-semibold mt-8 text-center">
          Back to{" "}
          <Link to="/login" className="text-[#FFCE67] hover:underline">
            Login
          </Link>
        </p>
      </div>
    </main>
  );
};

export default NewPasswordForm;
