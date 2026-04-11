import { useState } from "react";
import { useGameContext } from "../../contexts/GameProvider";

const QUICK_MESSAGES = [
  { emoji: "👋", text: "Hello!" },
  { emoji: "🔥", text: "Nice move!" },
  { emoji: "😎", text: "Good game!" },
  { emoji: "💪", text: "Let's go!" },
  { emoji: "🎯", text: "Well played!" },
  { emoji: "😤", text: "Come on!" },
  { emoji: "😂", text: "Oops!" },
  { emoji: "🤔", text: "Hmm..." },
  { emoji: "😈", text: "Too easy!" },
  { emoji: "⏰", text: "Hurry up!" },
];

const QuickMessages = () => {
  const { sendMessage, state } = useGameContext();
  const [isOpen, setIsOpen] = useState(false);
  const [cooldown, setCooldown] = useState(false);

  // Only show in PVP games
  if (state.gameMode !== "PVP") return null;

  const handleSend = (emoji: string, text: string) => {
    if (cooldown) return;

    sendMessage(`${emoji} ${text}`);
    setIsOpen(false);

    // 3 second cooldown to prevent spam
    setCooldown(true);
    setTimeout(() => setCooldown(false), 3000);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Message picker popup */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Messages grid */}
          <div className="absolute bottom-20 right-0 z-50 bg-[#7945FF] border-4 border-black rounded-[24px] shadow-[0px_8px_0px_#000000] p-4 w-[280px] animate-in fade-in slide-in-from-bottom-4 duration-200">
            <p className="text-[#FFCE67] font-black text-xs uppercase tracking-widest mb-3 text-center">
              Quick Messages
            </p>
            <div className="grid grid-cols-2 gap-2">
              {QUICK_MESSAGES.map(({ emoji, text }) => (
                <button
                  key={text}
                  onClick={() => handleSend(emoji, text)}
                  disabled={cooldown}
                  className="flex items-center gap-2 bg-white/10 hover:bg-white/20 active:scale-95 text-white font-bold text-sm px-3 py-2.5 rounded-[14px] transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed border border-white/10 hover:border-white/30"
                >
                  <span className="text-lg">{emoji}</span>
                  <span className="text-xs truncate">{text}</span>
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Floating action button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={cooldown}
        className={`w-14 h-14 rounded-full border-4 border-black shadow-[0px_4px_0px_#000000] flex items-center justify-center text-2xl transition-all duration-200 hover:scale-110 active:scale-90 disabled:opacity-60 ${
          isOpen
            ? "bg-[#FD6687] rotate-45"
            : cooldown
              ? "bg-gray-400"
              : "bg-[#FFCE67] hover:bg-[#FFD880]"
        }`}
      >
        {cooldown ? "⏳" : isOpen ? "✕" : "💬"}
      </button>
    </div>
  );
};

export default QuickMessages;
