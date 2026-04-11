import { HiStar } from "react-icons/hi";

import { useAchievements } from "../../hooks/useAchievements";
import ButtonSpinner from "../auth/ButtonSpinner";
import { AchievementCard } from "./AchievementCard";

const AchievementsList = () => {
  const { allAchievements, myAchievements, isLoading, isError } =
    useAchievements();

  if (isLoading) {
    return (
      <div className="w-full py-10 flex flex-col items-center gap-4 text-white">
        <ButtonSpinner />
        <p className="font-black uppercase tracking-widest text-lg animate-pulse text-[#FFCE67]">
          Loading Challenges...
        </p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="w-full p-8 bg-[#FD6687] border-4 border-black rounded-[32px] text-white text-center shadow-[0px_8px_0px_#000000]">
        <p className="font-bold text-xl uppercase italic">
          ⚠️ Error fetching challenges
        </p>
      </div>
    );
  }

  // Create a set of unlocked IDs for efficient lookup
  const unlockedIds = new Set(myAchievements.map((a) => a.id));

  return (
    <div className="w-full space-y-6">
      <div className="flex md:flex-row flex-col gap-[20px] items-center justify-between">
        <div className="flex flex-col">
          <h3 className="text-3xl font-black text-white uppercase tracking-tighter italic leading-none">
            Player Challenges
          </h3>
          <p className="text-[10px] font-black text-[#FFCE67] uppercase tracking-widest mt-1">
            Unlock badges as you play
          </p>
        </div>
        <div className="bg-[#FFCE67] border-4 border-black px-4 py-1.5 rounded-xl font-black text-black shadow-[0px_4px_0px_#000000] rotate-2 flex items-center gap-2">
          <span className="text-sm">PROGRESS</span>
          <span className="text-xl">
            {unlockedIds.size} / {allAchievements.length}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {allAchievements.map((achievement) => (
          <AchievementCard
            key={achievement.id}
            achievement={achievement}
            isUnlocked={unlockedIds.has(achievement.id)}
          />
        ))}
      </div>

      {allAchievements.length === 0 && (
        <div className="w-full py-16 border-4 border-dashed border-white/20 rounded-[32px] flex flex-col items-center justify-center text-white/40">
          <HiStar className="w-16 h-16 mb-2 opacity-10 animate-spin-slow" />
          <p className="font-bold uppercase tracking-widest text-sm">
            Challenges are coming soon!
          </p>
        </div>
      )}
    </div>
  );
};

export default AchievementsList;
