import {
  GoogleLogin,
  type CredentialResponse,
} from "@react-oauth/google";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import { useAuth } from "../../contexts/AuthProvider";

export default function GoogleSignInButton() {
  const navigate = useNavigate();
  const { loginWithGoogle } = useAuth();

  const handleGoogleSuccess = async (
    credentialResponse: CredentialResponse,
  ) => {
    const googleToken = credentialResponse.credential;

    if (!googleToken) {
      return;
    }

    await loginWithGoogle({ googleToken });
    navigate("/start");
  };

  return (
    <GoogleLogin
      theme="outline"
      text="continue_with"
      size="large"
      shape="rectangular"
      logo_alignment="center"
      useOneTap
      width={335}
      containerProps={{
        className:
          "md:w-[400px] w-[335px] flex items-center justify-center cursor-pointer bg-[#FFFFFF] p-3 rounded-[20px] transition-all duration-200 hover:scale-105 active:scale-95 shadow-[0px_6px_0px_#000000] [&>div]:scale-110 [&>div]:origin-center md:[&>div]:scale-[1.12]",
        style: {
          height: 84,
        },
      }}
      onSuccess={handleGoogleSuccess}
      onError={() => toast.error("Google login failed")}
    />
  );
}
