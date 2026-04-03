export const RankMedal = ({ rank }: { rank: number }) => {
  if (rank === 1) return <div className="bg-[#FFCE67] border-2 border-black rounded-full w-8 h-8 flex items-center justify-center font-black animate-bounce shadow-[0px_2px_0px_#000000]">1st</div>;
  if (rank === 2) return <div className="bg-gray-300 border-2 border-black rounded-full w-8 h-8 flex items-center justify-center font-black shadow-[0px_2px_0px_#000000]">2nd</div>;
  if (rank === 3) return <div className="bg-[#CD7F32] border-2 border-black rounded-full w-8 h-8 flex items-center justify-center font-black text-white shadow-[0px_2px_0px_#000000]">3rd</div>;
  return <div className="bg-white border-2 border-black rounded-full w-8 h-8 flex items-center justify-center font-bold text-xs">{rank}</div>;
};