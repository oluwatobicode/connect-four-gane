import { Link, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  resetPasswordLinkSchema,
  type ResetPasswordLinkFormInputs,
} from "../../validation/validation";
import { useAuth } from "../../contexts/AuthProvider";
import { sendResetLink } from "../../api/authApi";
import ButtonSpinner from "./ButtonSpinner";

const ForgotPasswordForm = () => {
  const navigate = useNavigate();
  useAuth(); // keeps access token interceptor alive
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordLinkFormInputs>({
    resolver: zodResolver(resetPasswordLinkSchema),
  });

  const onSubmit = async (data: ResetPasswordLinkFormInputs) => {
    await sendResetLink(data.email);
    navigate("/login");
  };

  return (
    <div className="md:bg-[#7945FF] bg-none md:rounded-[40px] md:border-4 flex flex-col items-center justify-center md:border-black md:w-[560px] md:py-10 py-6 w-full max-w-[450px] mx-auto md:shadow-[0px_8px_0px_#000000]">
      <h1 className="text-white text-3xl font-bold mb-4 text-center">
        RESET PASSWORD
      </h1>
      <p className="text-white font-semibold mb-8 text-center px-6">
        Enter your email and we&apos;ll send you a reset link.
      </p>

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

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full md:h-[72px] h-[64px] md:text-[24px] text-[20px] mt-6 font-bold flex items-center justify-center gap-3 cursor-pointer bg-[#FFCE67] text-black p-3 rounded-[20px] border-4 border-black transition-all duration-200 hover:scale-105 active:scale-95 shadow-[0px_6px_0px_#000000] disabled:cursor-not-allowed disabled:hover:scale-100 disabled:opacity-70"
        >
          {isSubmitting && <ButtonSpinner />}
          <span>{isSubmitting ? "SENDING..." : "SEND RESET LINK"}</span>
        </button>
      </form>

      <p className="text-white font-semibold mt-8 text-center">
        Remember your password?{" "}
        <Link to="/login" className="text-[#FFCE67] hover:underline">
          Login
        </Link>
      </p>
    </div>
  );
};

export default ForgotPasswordForm;
