import { HiCheckCircle, HiLockClosed } from "react-icons/hi";
import type { Achievement } from "../../interface/Achievement";

export const AchievementCard = ({
  achievement,
  isUnlocked,
}: {
  achievement: Achievement;
  isUnlocked: boolean;
}) => {
  return (
    <div
      className={`relative group border-4 border-black rounded-[24px] p-4 flex flex-col gap-3 transition-all duration-300 shadow-[0px_4px_0px_#000000] hover:scale-105 active:scale-95
        ${
          isUnlocked
            ? "bg-[#FFCE67] text-black"
            : "bg-gray-200 text-gray-500 grayscale opacity-80 shadow-none hover:grayscale-0"
        }`}
    >
      {!isUnlocked && (
        <div className="absolute top-2 right-2 bg-black text-white p-1.5 rounded-full border-2 border-white shadow-sm z-10">
          <HiLockClosed className="w-3 h-3" />
        </div>
      )}

      <div className="flex items-center gap-4">
        <div
          className={`w-14 h-14 flex items-center justify-center text-3xl rounded-2xl border-4 border-black bg-white shadow-[0px_3px_0px_#000000] shrink-0
          ${isUnlocked ? "ring-2 ring-white/50" : "grayscale opacity-50"}`}
        >
          {achievement.icon}
        </div>
        <div className="flex flex-col min-w-0">
          <h4 className="font-black uppercase tracking-tight truncate leading-tight text-sm sm:text-base">
            {achievement.name}
          </h4>
          <p className="text-[10px] font-black uppercase opacity-70 leading-none mt-0.5">
            {isUnlocked ? "Unlocked" : "Locked Challenge"}
          </p>
        </div>
      </div>

      <p className="text-xs font-bold leading-snug line-clamp-2">
        {achievement.description}
      </p>

      {isUnlocked && (
        <div className="absolute -bottom-1 -right-1">
          <HiCheckCircle className="w-7 h-7 text-[#5C2DD5] bg-white rounded-full border-2 border-black" />
        </div>
      )}
    </div>
  );
};
