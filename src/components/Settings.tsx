import { useNavigate } from "react-router";
import { useGameContext } from "../contexts/GameProvider";
import { HiUserCircle } from "react-icons/hi";
import { GoTrophy } from "react-icons/go";

const Settings = () => {
  const navigate = useNavigate();
  const { state, startGame } = useGameContext();

  const handlePlayCpu = () => {
    navigate("/levels");
    startGame({ mode: "pvc", playerTwo: "cpu" });
    console.log(`The state for playing with a human: ${state}`);
  };

  const handlePlayHuman = () => {
    navigate("/game");
    startGame({ mode: "pvp", playerTwo: "human" });
    console.log(`The state for playing with a cpu: ${state}`);
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

  return (
    <div className="md:bg-[#7945FF] bg-none md:rounded-[40px] md:border-4 flex flex-col items-center justify-center md:border-black md:w-[480px] md:h-[620px] w-[335px] h-auto py-8 mx-auto md:shadow-[0px_8px_0px_#000000]">
      <div className="mb-6">
        <img src="/images/logo.svg" alt="Connect Four Logo" />
      </div>

      <button
        onClick={handlePlayCpu}
        className="md:w-[400px] md:h-[72px] md:text-[24px] w-[335px] h-[72px] font-bold flex items-center justify-between cursor-pointer bg-[#FD6687] text-[#ffff] p-3 rounded-[20px] border-4 border-black mb-4 transition-all duration-200 hover:scale-105 active:scale-95 shadow-[0px_6px_0px_#000000] hover:shadow-[0px_6px_0px_#5C2DD5] hover:border-[#5C2DD5] hover:border-4"
      >
        <span>PLAY VS CPU (AI)</span>
        <img src="/images/player-vs-cpu.svg" alt="player vs cpu" />
      </button>

      <button
        onClick={handlePlayHuman}
        className="md:w-[400px] md:h-[72px] md:text-[24px] w-[335px] h-[72px] font-bold flex items-center justify-between cursor-pointer bg-[#FFCE67] text-[#000] p-3 rounded-[20px] border-4 border-black mb-4 transition-all duration-200 hover:scale-105 active:scale-95 shadow-[0px_6px_0px_#000000]"
      >
        <span>PLAY VS PLAYER</span>
        <img src="/images/player-vs-player.svg" alt="player vs player" />
      </button>

      <button
        onClick={handleShowRules}
        className="md:w-[400px] md:h-[72px] md:text-[24px] w-[335px] h-[72px] font-bold flex items-center justify-between cursor-pointer bg-[#FFFFFF] text-black p-3 rounded-[20px] border-4 border-black mb-4 transition-all duration-200 hover:scale-105 active:scale-95 shadow-[0px_6px_0px_#000000]"
      >
        GAME RULES
      </button>

      <button
        onClick={handleShowLeaderboard}
        className="md:w-[400px] md:h-[72px] md:text-[24px] w-[335px] h-[72px] font-bold flex items-center justify-between cursor-pointer bg-[#FFCE67] text-black p-3 rounded-[20px] border-4 border-black mb-4 transition-all duration-200 hover:scale-105 active:scale-95 shadow-[0px_6px_0px_#000000]"
      >
        <span>LEADERBOARD</span>
        <GoTrophy className="w-9 h-9 text-[#5C2DD5]" />
      </button>

      <button
        onClick={handleShowProfile}
        className="md:w-[400px] md:h-[72px] md:text-[24px] w-[335px] h-[72px] font-bold flex items-center justify-between cursor-pointer bg-[#7945FF] text-white p-3 rounded-[20px] border-4 border-black transition-all duration-200 hover:scale-105 active:scale-95 shadow-[0px_6px_0px_#000000]"
      >
        <span>PROFILE</span>
        <HiUserCircle className="w-10 h-10 text-[#FFCE67]" />
      </button>
    </div>
  );
};

export default Settings;
