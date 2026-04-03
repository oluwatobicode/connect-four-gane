import { HiTrendingUp, HiUserCircle } from "react-icons/hi";
import { RankMedal } from "../../ui/RankMedal";
import type { LeaderboardEntry } from "../../interface/LeaderboardEntry";

export const LeaderboardRow = ({
  entry,
  isMe,
}: {
  entry: LeaderboardEntry;
  isMe?: boolean;
}) => {
  return (
    <div
      className={`flex items-center gap-4 p-3 rounded-[20px] border-4 border-black transition-all hover:scale-[1.02] active:scale-[0.98] shadow-[0px_4px_0px_#000000]
        ${isMe ? "bg-[#FFCE67] text-black" : "bg-white text-black"}`}
    >
      <RankMedal rank={entry.rank} />

      <div className="w-10 h-10 rounded-full border-2 border-black overflow-hidden bg-gray-100 flex items-center justify-center shrink-0">
        {entry.avatar ? (
          <img
            src={entry.avatar}
            alt={entry.username}
            className="w-full h-full object-cover"
          />
        ) : (
          <HiUserCircle className="w-8 h-8 text-gray-400" />
        )}
      </div>

      <div className="flex-grow min-w-0">
        <p className="font-black uppercase truncate text-sm">
          {entry.username}
        </p>
        <p className="text-[10px] font-bold opacity-60 leading-none uppercase">
          Player Status
        </p>
      </div>

      <div className="flex items-center gap-1 bg-black/5 px-2 py-1 rounded-lg shrink-0">
        <HiTrendingUp className="text-[#5C2DD5] w-4 h-4" />
        <span className="font-black text-xs">{entry.eloRating}</span>
      </div>
    </div>
  );
};
