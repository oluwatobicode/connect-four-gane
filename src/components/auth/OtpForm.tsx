import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { otpSchema, type OtpFormInputs } from "../../validation/validation";
import { useAuth } from "../../contexts/AuthProvider";
import { sendOtp, verifyOtp } from "../../api/authApi";
import ButtonSpinner from "./ButtonSpinner";

const OtpForm = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { pendingVerificationEmail, setPendingVerificationEmail } = useAuth();
  const [isResending, setIsResending] = useState(false);

  const emailFromRoute =
    searchParams.get("email") ?? pendingVerificationEmail ?? "";
  const hasEmail = Boolean(emailFromRoute);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<OtpFormInputs>({
    resolver: zodResolver(otpSchema),
  });

  useEffect(() => {
    if (emailFromRoute && emailFromRoute !== pendingVerificationEmail) {
      setPendingVerificationEmail(emailFromRoute);
    }
  }, [emailFromRoute, pendingVerificationEmail, setPendingVerificationEmail]);

  const onSubmit = async (data: OtpFormInputs) => {
    if (!emailFromRoute) {
      return;
    }

    await verifyOtp({
      email: emailFromRoute,
      otp: data.otp,
    });
    navigate("/login");
  };

  const handleResendOtp = async () => {
    if (!emailFromRoute) {
      return;
    }

    setIsResending(true);

    try {
      await sendOtp(emailFromRoute);
      setPendingVerificationEmail(emailFromRoute);
    } finally {
      setIsResending(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#5C2DD5] flex flex-row items-center justify-center p-4">
      <div className="md:bg-[#7945FF] bg-none md:rounded-[40px] md:border-4 flex flex-col items-center justify-center md:border-black md:w-[560px] md:py-10 py-6 w-full max-w-[380px] mx-auto md:shadow-[0px_8px_0px_#000000]">
        <h1 className="text-white text-3xl font-bold mb-4 text-center px-4">
          VERIFY OTP
        </h1>
        <p className="text-white font-semibold mb-8 text-center px-6">
          Enter the 6-digit code sent to{" "}
          <span className="text-[#FFCE67] break-all">
            {emailFromRoute || "your email"}
          </span>{" "}
          to finish creating your account.
        </p>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full px-6 flex flex-col items-center"
        >
          <input
            {...register("otp")}
            type="text"
            inputMode="numeric"
            maxLength={6}
            placeholder="000000"
            disabled={isSubmitting || isResending}
            className="w-full md:h-[72px] h-[64px] md:text-[24px] text-[20px] tracking-[0.5em] text-center font-bold bg-[#FFFFFF] text-black p-4 rounded-[20px] border-4 border-black mb-2 outline-none shadow-[0px_6px_0px_#000000] focus:border-[#5C2DD5] transition-colors disabled:cursor-not-allowed disabled:opacity-70"
          />
          {errors.otp && (
            <span className="text-[#FFCE67] font-bold mb-4 w-full text-center">
              {errors.otp.message}
            </span>
          )}

          {!hasEmail && (
            <p className="text-[#FFCE67] font-bold mt-2 text-center">
              Missing email for verification. Go back to{" "}
              <Link to="/signup" className="underline">
                sign up
              </Link>{" "}
              and request a new OTP.
            </p>
          )}

          <button
            type="submit"
            disabled={!hasEmail || isSubmitting || isResending}
            className="w-full md:h-[72px] h-[64px] md:text-[24px] text-[20px] mt-6 font-bold flex items-center justify-center gap-3 cursor-pointer bg-[#FFFFFF] text-black p-3 rounded-[20px] border-4 border-black transition-all duration-200 hover:scale-105 active:scale-95 shadow-[0px_6px_0px_#000000] disabled:cursor-not-allowed disabled:hover:scale-100 disabled:opacity-70"
          >
            {isSubmitting && <ButtonSpinner />}
            <span>{isSubmitting ? "VERIFYING..." : "VERIFY"}</span>
          </button>
        </form>

        <button
          type="button"
          onClick={handleResendOtp}
          disabled={!hasEmail || isSubmitting || isResending}
          className="mt-5 text-[#FFCE67] font-bold hover:underline disabled:cursor-not-allowed disabled:no-underline disabled:opacity-60"
        >
          {isResending ? "Sending another code..." : "Resend OTP"}
        </button>

        <p className="text-white font-semibold mt-6 text-center px-6">
          Already verified?{" "}
          <Link to="/login" className="text-[#FFCE67] hover:underline">
            Login
          </Link>
        </p>
      </div>
    </main>
  );
};

export default OtpForm;
