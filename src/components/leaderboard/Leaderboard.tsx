import { HiStar, HiTrendingUp } from "react-icons/hi";
import { useLeaderboard } from "../../hooks/useLeaderboard";
import ButtonSpinner from "../auth/ButtonSpinner";
import { LeaderboardRow } from "./LeaderboardRow";

const Leaderboard = () => {
  const { globalLeaderboard, personalRank, isLoading, isError } =
    useLeaderboard();

  if (isLoading) {
    return (
      <div className="md:bg-[#7945FF] bg-[#7945FF] rounded-[40px] border-4 border-black w-full max-w-[400px] py-12 flex flex-col items-center justify-center gap-4 shadow-[0px_8px_0px_#000000] text-white">
        <ButtonSpinner />
        <p className="font-black uppercase tracking-widest text-sm animate-pulse">
          Syncing Rankings...
        </p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="md:bg-[#7945FF] bg-none md:rounded-[40px] md:border-4 border-black w-full max-w-[400px] p-6 text-white text-center shadow-[0px_8px_0px_#000000]">
        <p className="font-black uppercase text-[#FD6687]">Connection Lost!</p>
        <p className="text-xs font-bold opacity-70">
          Check your signal and try again.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 w-full max-w-[440px]">
      {/* Personal Rank Section */}
      {personalRank && (
        <div className="bg-[#FD6687] border-4 border-black rounded-[32px] p-4 flex items-center justify-between shadow-[0px_6px_0px_#000000] text-white transition-all hover:rotate-1">
          <div className="flex items-center gap-4">
            <div className="bg-white p-2 rounded-2xl border-2 border-black shadow-[0px_2px_0px_#000000]">
              <HiStar className="text-[#FFCE67] w-8 h-8" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase tracking-widest opacity-80 leading-none">
                Your Standing
              </span>
              <span className="text-2xl font-black italic uppercase leading-tight">
                Rank #{personalRank.rank}
              </span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-black uppercase opacity-80 leading-none">
              ELO
            </p>
            <p className="text-xl font-black">{personalRank.eloRating}</p>
          </div>
        </div>
      )}

      {/* Global List Section */}
      <div className="md:bg-[#7945FF] bg-[#7945FF] rounded-[40px] border-4 border-black p-6 flex flex-col gap-4 shadow-[0px_8px_0px_#000000] text-white h-[450px]">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-2xl font-black uppercase tracking-tighter italic">
            World Rankings
          </h3>
          <div className="bg-black text-white px-3 py-1 rounded-full text-[10px] font-black uppercase">
            LIVE Updates
          </div>
        </div>

        <div className="flex flex-col gap-3 overflow-y-auto pr-2 custom-scrollbar">
          {globalLeaderboard.map((player) => (
            <LeaderboardRow
              key={player.id}
              entry={player}
              isMe={player.id === personalRank?.id}
            />
          ))}

          {globalLeaderboard.length === 0 && (
            <div className="flex flex-col items-center justify-center py-10 opacity-30 italic">
              <HiTrendingUp className="w-12 h-12 mb-2" />
              <p className="font-bold">Waiting for competitors...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
