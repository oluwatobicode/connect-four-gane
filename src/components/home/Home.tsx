import { useNavigate } from "react-router";
import GoogleSignInButton from "../auth/GoogleSignInButton";

const Home = () => {
  const navigate = useNavigate();

  const signup = () => {
    navigate("/signup");
  };

  return (
    <div className="md:bg-[#7945FF] bg-none md:rounded-[40px] md:border-4 flex flex-col items-center justify-center md:border-black md:w-[480px] md:h-[537px] w-[335px] h-[407px] mx-auto md:shadow-[0px_8px_0px_#000000]">
      <div className="mb-5">
        <img src="/images/logo.svg" />
      </div>

      <button
        type="button"
        onClick={signup}
        className="md:w-[400px] md:h-[72px] md:text-[24px] w-[335px] h-[72px] font-bold flex items-center justify-center cursor-pointer bg-[#FD6687] text-[#ffff] p-3 rounded-[20px] border-4 border-black mb-4 transition-all duration-200 hover:scale-105 active:scale-95 shadow-[0px_6px_0px_#000000] hover:shadow-[0px_6px_0px_#5C2DD5] hover:border-[#5C2DD5] hover:border-4"
      >
        <span>Create an account</span>
      </button>

      <GoogleSignInButton />

      <button
        type="button"
        onClick={() => navigate("/login")}
        className="mt-6 text-white font-semibold hover:text-[#FFCE67] transition-colors"
      >
        Have an account? Login
      </button>
    </div>
  );
};

export default Home;
