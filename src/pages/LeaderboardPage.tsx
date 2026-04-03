import { useNavigate } from "react-router";
import { HiArrowLeft } from "react-icons/hi";
import Leaderboard from "../components/leaderboard/Leaderboard";

const LeaderboardPage = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/start");
  };

  return (
    <main className="min-h-screen bg-[#5C2DD5] flex flex-col items-center py-10 px-4">
      {/* Back Button Container */}
      <div className="w-full max-w-[560px] mb-8 flex items-start">
        <button
          onClick={handleBack}
          className="bg-white border-4 border-black rounded-[20px] p-4 flex items-center justify-center shadow-[0px_4px_0px_#000000] hover:scale-110 active:scale-95 transition-all text-black cursor-pointer group"
          title="Back to Start"
        >
          <HiArrowLeft className="w-8 h-8 group-hover:-translate-x-1 transition-transform" />
        </button>
      </div>

      <div className="w-full max-w-[560px] flex flex-col items-center gap-8 pb-20">
        <div className="text-center space-y-2">
          <h1 className="text-5xl font-black text-white uppercase tracking-tighter italic drop-shadow-[0_4px_0_rgba(0,0,0,0.4)]">
            Hall of Fame
          </h1>
          <p className="text-[#FFCE67] font-black uppercase tracking-widest text-xs">
            The World's Best Connect Four Players
          </p>
        </div>

        <Leaderboard />
      </div>
    </main>
  );
};

export default LeaderboardPage;
