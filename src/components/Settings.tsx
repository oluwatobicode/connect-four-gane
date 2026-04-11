import { useState } from "react";
import { useNavigate } from "react-router";
import { useGameContext } from "../contexts/GameProvider";
import { HiUserCircle, HiPlay, HiArrowLeft } from "react-icons/hi";
import { GoTrophy } from "react-icons/go";

const Settings = () => {
  const navigate = useNavigate();
  const { createGame } = useGameContext();
  const [showGameModes, setShowGameModes] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const handlePlayCpu = async () => {
    setIsCreating(true);
    try {
      await createGame("PVC");
      navigate("/game");
    } catch {
      // error toast is shown by the provider
    } finally {
      setIsCreating(false);
    }
  };

  const handleShowRules = () => {
    navigate("/rules");
  };

  const handleShowProfile = () => {
    navigate("/profile");
  };

  const handleShowLeaderboard = () => {
    navigate("/leaderboard");
  };

  const handlePlayOnline = () => {
    navigate("/lobby");
  };

  return (
    <div className="md:bg-[#7945FF] bg-none md:rounded-[40px] md:border-4 flex flex-col items-center justify-center md:border-black md:w-[480px] md:h-[620px] w-[335px] h-auto py-8 mx-auto md:shadow-[0px_8px_0px_#000000] transition-all duration-300">
      <div className="mb-8">
        <img
          src="/images/logo.svg"
          alt="Connect Four Logo"
          className="w-16 h-16 md:w-20 md:h-20"
        />
      </div>

      {!showGameModes ? (
        <>
          {/* Main Menu View */}
          <button
            onClick={() => setShowGameModes(true)}
            className="md:w-[400px] md:h-[80px] md:text-[28px] w-[335px] h-[72px] font-black flex items-center justify-between cursor-pointer bg-[#FD6687] text-white p-4 rounded-[24px] border-4 border-black mb-6 transition-all duration-200 hover:scale-105 active:scale-95 shadow-[0px_8px_0px_#000000]"
          >
            <span className="italic uppercase tracking-tighter">
              Start Game
            </span>
            <HiPlay className="w-10 h-10" />
          </button>

          <div className="flex flex-col gap-4">
            <button
              onClick={handleShowLeaderboard}
              className="md:w-[400px] md:h-[72px] md:text-[22px] w-[335px] h-[72px] font-bold flex items-center justify-between cursor-pointer bg-[#FFCE67] text-black p-3 rounded-[20px] border-4 border-black transition-all duration-200 hover:scale-105 active:scale-95 shadow-[0px_6px_0px_#000000]"
            >
              <span className="uppercase tracking-tight">Leaderboard</span>
              <GoTrophy className="w-8 h-8 text-[#5C2DD5]" />
            </button>

            <button
              onClick={handleShowProfile}
              className="md:w-[400px] md:h-[72px] md:text-[22px] w-[335px] h-[72px] font-bold flex items-center justify-between cursor-pointer bg-[#7945FF] text-white p-3 rounded-[20px] border-4 border-black transition-all duration-200 hover:scale-105 active:scale-95 shadow-[0px_6px_0px_#000000]"
            >
              <span className="uppercase tracking-tight">Player Profile</span>
              <HiUserCircle className="w-9 h-9 text-[#FFCE67]" />
            </button>

            <button
              onClick={handleShowRules}
              className="md:w-[400px] md:h-[72px] md:text-[22px] w-[335px] h-[72px] font-bold flex items-center justify-center cursor-pointer bg-white text-black p-3 rounded-[20px] border-4 border-black transition-all duration-200 hover:scale-105 active:scale-95 shadow-[0px_6px_0px_#000000]"
            >
              <span className="uppercase tracking-tight">Game Rules</span>
            </button>
          </div>
        </>
      ) : (
        <>
          {/* Game Selection View */}
          <div className="flex flex-col gap-5">
            <h2 className="text-white text-center font-black uppercase text-xl italic tracking-widest mb-2">
              Select Game Mode
            </h2>

            <button
              onClick={handlePlayCpu}
              disabled={isCreating}
              className="md:w-[400px] md:h-[72px] md:text-[24px] w-[335px] h-[72px] font-bold flex items-center justify-between cursor-pointer bg-[#FD6687] text-[#ffff] p-3 rounded-[20px] border-4 border-black transition-all duration-200 hover:scale-105 active:scale-95 shadow-[0px_6px_0px_#000000] hover:shadow-[0px_6px_0px_#5C2DD5] hover:border-[#5C2DD5] disabled:opacity-50"
            >
              <span>{isCreating ? "CREATING..." : "PLAY VS CPU (AI)"}</span>
              <img src="/images/player-vs-cpu.svg" alt="player vs cpu" />
            </button>

            <button
              onClick={handlePlayOnline}
              className="md:w-[400px] md:h-[72px] md:text-[24px] w-[335px] h-[72px] font-bold flex items-center justify-between cursor-pointer bg-[#FFFFFF] text-[#000] p-3 rounded-[20px] border-4 border-black transition-all duration-200 hover:scale-105 active:scale-95 shadow-[0px_6px_0px_#000000]"
            >
              <span>PLAY ONLINE</span>
              <img
                src="/images/player-vs-player.svg"
                alt="play online"
                className="grayscale"
              />
            </button>

            <button
              onClick={() => setShowGameModes(false)}
              className="md:w-[400px] md:h-[60px] md:text-[18px] w-[335px] h-[60px] font-black flex items-center justify-center gap-3 cursor-pointer bg-black text-white p-3 rounded-[20px] border-2 border-white/20 mt-4 transition-all duration-200 hover:bg-zinc-900 active:scale-95 shadow-[0px_4px_0px_rgba(255,255,255,0.1)]"
            >
              <HiArrowLeft className="w-5 h-5" />
              <span className="uppercase tracking-widest text-sm">
                Back to Menu
              </span>
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Settings;
