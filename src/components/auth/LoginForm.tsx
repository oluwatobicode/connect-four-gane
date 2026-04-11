import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginFormInputs } from "../../validation/validation";
import { useAuth } from "../../contexts/AuthProvider";
import ButtonSpinner from "./ButtonSpinner";

const LoginForm = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormInputs) => {
    await login(data);
    navigate("/start");
  };

  return (
    <div className="md:bg-[#7945FF] bg-none md:rounded-[40px] md:border-4 flex flex-col items-center justify-center md:border-black md:w-[560px] md:py-10 py-6 w-full max-w-[450px] mx-auto md:shadow-[0px_8px_0px_#000000]">
      <h1 className="text-white text-3xl font-bold mb-8">LOGIN</h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full px-6 flex flex-col items-center"
      >
        <input
          {...register("email")}
          type="email"
          placeholder="Email Address"
          disabled={isSubmitting}
          className="w-full md:h-[72px] h-[64px] md:text-[20px] text-[16px] font-bold bg-[#FFFFFF] text-black p-4 rounded-[20px] border-4 border-black mb-2 outline-none shadow-[0px_6px_0px_#000000] focus:border-[#5C2DD5] transition-colors disabled:cursor-not-allowed disabled:opacity-70"
        />
        {errors.email && (
          <span className="text-[#FFCE67] font-bold mb-4 w-full text-left">
            {errors.email.message}
          </span>
        )}

        <div className="w-full relative mt-4 mb-2">
          <input
            {...register("password")}
            type={showPassword ? "text" : "password"}
            placeholder="Password"
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
        {errors.password && (
          <span className="text-[#FFCE67] font-bold mb-4 w-full text-left">
            {errors.password.message}
          </span>
        )}

        <Link
          to="/forgot-password"
          className="w-full text-right text-white font-semibold mt-2 hover:text-[#FFCE67] transition-colors"
        >
          Forgot password?
        </Link>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full md:h-[72px] h-[64px] md:text-[24px] text-[20px] mt-6 font-bold flex items-center justify-center gap-3 cursor-pointer bg-[#FD6687] text-[#ffff] p-3 rounded-[20px] border-4 border-black transition-all duration-200 hover:scale-105 active:scale-95 shadow-[0px_6px_0px_#000000] hover:shadow-[0px_6px_0px_#5C2DD5] hover:border-[#5C2DD5] hover:border-4 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:opacity-70"
        >
          {isSubmitting && <ButtonSpinner />}
          <span>{isSubmitting ? "LOGGING IN..." : "LOGIN"}</span>
        </button>
      </form>

      <p className="text-white font-semibold mt-8 text-center">
        New?{" "}
        <Link to="/signup" className="text-[#FFCE67] hover:underline">
          Create an account
        </Link>
      </p>
    </div>
  );
};

export default LoginForm;
