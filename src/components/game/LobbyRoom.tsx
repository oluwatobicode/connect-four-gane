import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import {
  HiArrowLeft,
  HiPlus,
  HiUserGroup,
  HiClipboardCopy,
} from "react-icons/hi";
import toast from "react-hot-toast";
import { useGameContext } from "../../contexts/GameProvider";

const LobbyRoom = () => {
  const navigate = useNavigate();
  const { createGame, joinGame, state, leaveCurrentGame } = useGameContext();
  const [activeTab, setActiveTab] = useState<"create" | "join">("create");
  const [joinCode, setJoinCode] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [isJoining, setIsJoining] = useState(false);

  // The room code comes from the server after creation
  const roomCode = state.serverState?.roomCode ?? null;
  const isWaitingForOpponent =
    roomCode !== null &&
    state.serverState?.gameMode === "PVP" &&
    !state.serverState?.player2Id;

  // Auto-navigate to game when opponent joins (player_joined event fires)
  useEffect(() => {
    if (
      state.serverState?.gameMode === "PVP" &&
      state.serverState?.player2Id &&
      state.isGameActive
    ) {
      navigate("/game");
    }
  }, [state.serverState?.player2Id, state.isGameActive, state.serverState?.gameMode, navigate]);

  const handleCreateRoom = async () => {
    setIsCreating(true);
    try {
      await createGame("PVP");
      // Room code will appear from state.serverState.roomCode
    } catch {
      // Error toast is shown by the provider
    } finally {
      setIsCreating(false);
    }
  };

  const handleCopyCode = () => {
    if (roomCode) {
      navigator.clipboard.writeText(roomCode);
      toast.success("Code copied to clipboard!");
    }
  };

  const handleJoinRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinCode.trim()) {
      toast.error("Please enter a room code");
      return;
    }

    setIsJoining(true);
    try {
      await joinGame(joinCode.trim());
      // After joining, navigate to the game
      navigate("/game");
    } catch {
      // Error toast is shown by the provider
    } finally {
      setIsJoining(false);
    }
  };

  const handleGoBack = async () => {
    // If we created a room, leave it before going back
    if (state.serverState?.id) {
      await leaveCurrentGame();
    }
    navigate("/start");
  };

  return (
    <main className="min-h-screen bg-[#5C2DD5] flex items-center justify-center p-4">
      <div className="w-full max-w-[480px]">
        {/* Header Navigation */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={handleGoBack}
            className="bg-black text-white p-3 rounded-full border-2 border-white/20 hover:bg-zinc-900 transition-all active:scale-90"
          >
            <HiArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-white text-3xl font-black uppercase italic tracking-tighter">
            Multiplayer Lobby
          </h1>
        </div>

        {/* Main Card */}
        <div className="md:bg-[#7945FF] bg-[#7945FF] rounded-[40px] border-4 border-black p-8 shadow-[0px_8px_0px_#000000] text-white">
          {/* Tabs — only show if not waiting for opponent */}
          {!isWaitingForOpponent && (
            <div className="flex bg-black/20 p-2 rounded-[24px] mb-8 border-2 border-black/10">
              <button
                onClick={() => setActiveTab("create")}
                className={`flex-1 py-3 rounded-[18px] font-black uppercase text-sm tracking-widest transition-all duration-300 flex items-center justify-center gap-2
                  ${activeTab === "create" ? "bg-[#FFCE67] text-black shadow-[0px_4px_0px_#000000]" : "text-white/60 hover:text-white"}`}
              >
                <HiPlus className="w-5 h-5" />
                Create
              </button>
              <button
                onClick={() => setActiveTab("join")}
                className={`flex-1 py-3 rounded-[18px] font-black uppercase text-sm tracking-widest transition-all duration-300 flex items-center justify-center gap-2
                  ${activeTab === "join" ? "bg-[#FFCE67] text-black shadow-[0px_4px_0px_#000000]" : "text-white/60 hover:text-white"}`}
              >
                <HiUserGroup className="w-5 h-5" />
                Join
              </button>
            </div>
          )}

          {/* Content Area */}
          <div className="min-h-[280px] flex flex-col items-center justify-center transition-all duration-500">
            {isWaitingForOpponent ? (
              /* ---- WAITING FOR OPPONENT STATE ---- */
              <div className="w-full text-center space-y-6">
                <div className="space-y-2">
                  <p className="text-sm font-black uppercase tracking-widest text-[#FFCE67] italic">
                    Room Code
                  </p>
                  <div className="bg-black/30 p-6 rounded-[24px] border-2 border-black/20 flex flex-col items-center gap-2">
                    <span className="text-4xl font-black tracking-[0.3em] text-white">
                      {roomCode}
                    </span>
                    <button
                      onClick={handleCopyCode}
                      className="flex items-center gap-2 text-xs font-bold text-white/60 hover:text-white transition-colors uppercase tracking-widest mt-1"
                    >
                      <HiClipboardCopy className="w-4 h-4" />
                      Copy to Clipboard
                    </button>
                  </div>
                </div>

                {/* Waiting animation */}
                <div className="flex flex-col items-center gap-3">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#FFCE67] animate-bounce [animation-delay:0ms]" />
                    <div className="w-3 h-3 rounded-full bg-[#FFCE67] animate-bounce [animation-delay:150ms]" />
                    <div className="w-3 h-3 rounded-full bg-[#FFCE67] animate-bounce [animation-delay:300ms]" />
                  </div>
                  <p className="text-white/80 font-bold text-lg">
                    Waiting for opponent to join...
                  </p>
                </div>

                <p className="text-white/60 font-bold text-sm px-4 leading-snug">
                  Share this code with your friend so they can join your game!
                </p>
              </div>
            ) : activeTab === "create" ? (
              /* ---- CREATE TAB ---- */
              <div className="w-full text-center space-y-6">
                <div className="space-y-4">
                  <p className="text-white/80 font-bold text-lg leading-snug">
                    Host a new game and invite your friend to play remotely.
                  </p>
                  <button
                    onClick={handleCreateRoom}
                    disabled={isCreating}
                    className="w-full h-16 bg-[#FD6687] text-white font-black text-2xl rounded-[20px] border-4 border-black shadow-[0px_6px_0px_#000000] hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-3"
                  >
                    {isCreating ? "Creating Room..." : "CREATE ROOM"}
                  </button>
                </div>
              </div>
            ) : (
              /* ---- JOIN TAB ---- */
              <form
                onSubmit={handleJoinRoom}
                className="w-full text-center space-y-6"
              >
                <div className="space-y-4">
                  <p className="text-white/80 font-bold text-lg leading-snug">
                    Enter your friend's room code to join their game session.
                  </p>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="ENTER ROOM CODE"
                      value={joinCode}
                      onChange={(e) =>
                        setJoinCode(e.target.value.toUpperCase())
                      }
                      className="w-full h-16 bg-white text-black font-black text-xl px-6 rounded-[20px] border-4 border-black shadow-[0px_6px_0px_rgba(0,0,0,0.2)] focus:outline-none focus:border-[#FFCE67] placeholder:text-zinc-400 placeholder:text-sm placeholder:font-bold tracking-widest text-center"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isJoining}
                    className="w-full h-16 bg-[#FFCE67] text-black font-black text-2xl rounded-[20px] border-4 border-black shadow-[0px_6px_0px_#000000] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                  >
                    {isJoining ? "Joining..." : "JOIN ROOM"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default LobbyRoom;
