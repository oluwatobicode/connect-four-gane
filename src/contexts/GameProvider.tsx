import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import axios from "axios";
import toast from "react-hot-toast";
import socket from "../components/socket/socket";
import { useAuth } from "./useAuth";
import {
  createGame as apiCreateGame,
  getGameState as apiGetGameState,
  makeMove as apiMakeMove,
  joinGame as apiJoinGame,
  leaveGame as apiLeaveGame,
  type ServerGameState,
  type MoveMadeEvent,
  type PlayerEvent,
  type ChatMessageEvent,
  type ForfeitEvent,
} from "../api/gameApi";

// ----------------------------------------------------------------
// Types
// ----------------------------------------------------------------

interface GameState {
  // The raw server state (source of truth)
  serverState: ServerGameState | null;

  // Derived for UI rendering (6 rows × 7 cols)
  grid: (null | "player1" | "player2")[][];

  // Local session scores (persist across rematches, reset on quit)
  scores: { player1: number; player2: number };

  // UI flags
  isLoading: boolean;
  isMyTurn: boolean;
  gameMode: "PVC" | "PVP" | null;
  showMenu: boolean;
  isGameActive: boolean;
  winner: "player1" | "player2" | "cpu" | "draw" | null;
}

interface GameActions {
  state: GameState;
  createGame: (mode: "PVC" | "PVP") => Promise<void>;
  joinGame: (roomCode: string) => Promise<void>;
  dropDisc: (column: number) => Promise<void>;
  leaveCurrentGame: () => Promise<void>;
  refreshGameState: () => Promise<void>;
  playAgain: () => Promise<void>;
  sendMessage: (message: string) => void;
  toggleMenu: () => void;
}

// ----------------------------------------------------------------
// Board conversion: server → UI
// ----------------------------------------------------------------
// Server:  boardState[column][row]  →  7 arrays of 6 (column-major, numbers)
// UI:      grid[row][column]        →  6 arrays of 7 (row-major, strings)

const serverBoardToGrid = (
  boardState: number[][],
): (null | "player1" | "player2")[][] => {
  const grid: (null | "player1" | "player2")[][] = Array(6)
    .fill(null)
    .map(() => Array(7).fill(null));

  for (let col = 0; col < 7; col++) {
    for (let row = 0; row < 6; row++) {
      const value = boardState[col]?.[row];
      if (value === 1) grid[5 - row][col] = "player1";
      else if (value === 2) grid[5 - row][col] = "player2";
    }
  }

  return grid;
};

// ----------------------------------------------------------------
// Initial state
// ----------------------------------------------------------------

const emptyGrid: (null | "player1" | "player2")[][] = Array(6)
  .fill(null)
  .map(() => Array(7).fill(null));

const initialState: GameState = {
  serverState: null,
  grid: emptyGrid,
  scores: { player1: 0, player2: 0 },
  isLoading: false,
  isMyTurn: false,
  gameMode: null,
  showMenu: false,
  isGameActive: false,
  winner: null,
};

// ----------------------------------------------------------------
// Helper: determine winner label from server state
// ----------------------------------------------------------------

const resolveWinner = (
  server: ServerGameState,
  myUserId: string,
): "player1" | "player2" | "cpu" | "draw" | null => {
  if (
    server.status !== "COMPLETED" &&
    server.status !== "DRAW" &&
    server.status !== "FORFEITED" &&
    server.status !== "ABANDONED"
  ) {
    return null;
  }

  if (!server.winnerId) return "draw";
  if (server.winnerId === "CPU") return "cpu";
  if (server.winnerId === myUserId) return "player1"; // "player1" = YOU in the UI
  return "player2"; // opponent won
};

// ----------------------------------------------------------------
// Context
// ----------------------------------------------------------------

const GameContext = createContext<GameActions | undefined>(undefined);

// ----------------------------------------------------------------
// Provider
// ----------------------------------------------------------------

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user } = useAuth();
  const myUserId = user?.id ?? "";

  const [state, setState] = useState<GameState>(initialState);

  // Keep a ref to the current game ID so socket handlers can read it
  // without needing state in their closure (avoids stale closure bugs)
  const gameIdRef = useRef<string | null>(null);

  // ------------------------------------------------------------------
  // Helper: apply server data to state
  // ------------------------------------------------------------------

  const applyServerState = useCallback(
    (server: ServerGameState) => {
      const isActive =
        server.status === "IN_PROGRESS" || server.status === "WAITING";
      const myTurn = server.currentTurn === myUserId;
      const winner = resolveWinner(server, myUserId);

      gameIdRef.current = server.id;

      setState((prev) => ({
        ...prev,
        serverState: server,
        grid: serverBoardToGrid(server.boardState),
        isLoading: false,
        isMyTurn: myTurn,
        gameMode: server.gameMode,
        isGameActive: isActive,
        winner,
      }));
    },
    [myUserId],
  );

  // Helper: apply a board update from a socket `move_made` event
  const applyMoveEvent = useCallback(
    (event: MoveMadeEvent) => {
      setState((prev) => {
        if (!prev.serverState) return prev;

        const isGameOver =
          event.newStatus === "COMPLETED" ||
          event.newStatus === "DRAW" ||
          event.newStatus === "FORFEITED" ||
          event.newStatus === "ABANDONED";

        // Determine who played this move for the grid
        const newGrid = serverBoardToGrid(event.board);

        // Determine winner from the event
        let winner: GameState["winner"] = null;
        const newScores = { ...prev.scores };
        if (event.isWin) {
          if (event.playerId === "CPU") {
            winner = "cpu";
            newScores.player2++;
          } else if (event.playerId === myUserId) {
            winner = "player1";
            newScores.player1++;
          } else {
            winner = "player2";
            newScores.player2++;
          }
        } else if (event.newStatus === "DRAW") {
          winner = "draw";
        }

        // In PVC, after CPU moves it's MY turn. After I move it's CPU's turn.
        const nextIsMyTurn = isGameOver
          ? false
          : event.playerId === "CPU" || event.playerId !== myUserId;

        return {
          ...prev,
          grid: newGrid,
          scores: newScores,
          isLoading: false,
          isMyTurn: nextIsMyTurn,
          isGameActive: !isGameOver,
          winner,
          serverState: {
            ...prev.serverState,
            boardState: event.board,
            status: event.newStatus as ServerGameState["status"],
            totalMoves: prev.serverState.totalMoves + 1,
          },
        };
      });
    },
    [myUserId],
  );

  // ------------------------------------------------------------------
  // Socket event listeners
  // ------------------------------------------------------------------

  useEffect(() => {
    // -- move_made: a move was made (human or CPU) --
    const onMoveMade = (data: MoveMadeEvent) => {
      console.log("[socket] move_made:", data);
      applyMoveEvent(data);

      if (data.isWin) {
        if (data.playerId === "CPU") {
          toast.error("CPU wins! 😤");
        } else if (data.playerId === myUserId) {
          toast.success("You win! 🎉");
        } else {
          toast.error("Opponent wins!");
        }
      } else if (data.newStatus === "DRAW") {
        toast("It's a draw! 🤝");
      }
    };

    // -- game_forfeited: a player ran out of time --
    const onForfeited = (data: ForfeitEvent) => {
      console.log("[socket] game_forfeited:", data);
      const iLost = data.loserId === myUserId;
      setState((prev) => {
        const newScores = { ...prev.scores };
        if (iLost) newScores.player2++;
        else newScores.player1++;
        return {
          ...prev,
          scores: newScores,
          isGameActive: false,
          isMyTurn: false,
          winner: iLost ? "player2" : "player1",
        };
      });
      toast(iLost ? "You ran out of time! 😬" : "Opponent forfeited! 🎉");
    };

    // -- game_abandoned: a player disconnected too long --
    const onAbandoned = (data: ForfeitEvent) => {
      console.log("[socket] game_abandoned:", data);
      const iLost = data.loserId === myUserId;
      setState((prev) => {
        const newScores = { ...prev.scores };
        if (iLost) newScores.player2++;
        else newScores.player1++;
        return {
          ...prev,
          scores: newScores,
          isGameActive: false,
          isMyTurn: false,
          winner: iLost ? "player2" : "player1",
        };
      });
      toast(
        iLost ? "You were disconnected too long 😬" : "Opponent abandoned! 🎉",
      );
    };

    // -- player_joined: someone joined the game room --
    const onPlayerJoined = (data: PlayerEvent) => {
      console.log("[socket] player_joined:", data);
      setState((prev) => {
        if (!prev.serverState) return prev;
        return {
          ...prev,
          serverState: {
            ...prev.serverState,
            player2Id: data.userId,
            status: "IN_PROGRESS",
          },
          isGameActive: true,
          isMyTurn: prev.serverState.currentTurn === myUserId,
        };
      });
      toast.success("Opponent joined! Game on! 🎮");
    };

    // -- player_left: someone left the game room --
    const onPlayerLeft = (data: PlayerEvent) => {
      console.log("[socket] player_left:", data);
      if (data.userId !== myUserId) {
        toast.error("Opponent left the game 😔");
      }
    };

    // -- receive_message: a chat message arrived --
    const onReceiveMessage = (data: ChatMessageEvent) => {
      console.log("[socket] receive_message:", data);
      // Only show messages from the opponent
      if (data.userId !== myUserId) {
        toast(data.message, {
          icon: "💬",
          style: {
            background: "#7945FF",
            color: "#fff",
            fontWeight: "800",
            fontSize: "16px",
            border: "3px solid #000",
            borderRadius: "16px",
          },
          duration: 3000,
        });
      }
    };

    // -- connection events --
    const onConnect = () => {
      console.log("[socket] Connected to server");
    };

    const onDisconnect = (reason: string) => {
      console.log("[socket] Disconnected:", reason);
      if (gameIdRef.current) {
        toast.error("Connection lost. Reconnecting...");
      }
    };

    const onConnectError = (err: Error) => {
      console.error("[socket] Connection error:", err.message);
    };

    // Register all listeners
    socket.on("move_made", onMoveMade);
    socket.on("game_forfeited", onForfeited);
    socket.on("game_abandoned", onAbandoned);
    socket.on("player_joined", onPlayerJoined);
    socket.on("player_left", onPlayerLeft);
    socket.on("receive_message", onReceiveMessage);
    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("connect_error", onConnectError);

    return () => {
      socket.off("move_made", onMoveMade);
      socket.off("game_forfeited", onForfeited);
      socket.off("game_abandoned", onAbandoned);
      socket.off("player_joined", onPlayerJoined);
      socket.off("player_left", onPlayerLeft);
      socket.off("receive_message", onReceiveMessage);
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("connect_error", onConnectError);
    };
  }, [myUserId, applyMoveEvent]);

  // ------------------------------------------------------------------
  // Actions
  // ------------------------------------------------------------------

  /** Create a new game and join the socket room */
  const createGame = useCallback(
    async (mode: "PVC" | "PVP") => {
      setState((prev) => ({ ...prev, isLoading: true }));

      try {
        const response = await apiCreateGame(mode);

        if (response.success) {
          applyServerState(response.data);

          // Connect socket if not already connected
          if (!socket.connected) {
            socket.connect();
          }

          // Join the game room on the socket
          socket.emit("join_game", response.data.id);

          toast.success(
            mode === "PVP"
              ? "Room created! Waiting for opponent..."
              : "Game created! Your turn.",
          );
        } else {
          toast.error(response.message || "Failed to create game");
          setState((prev) => ({ ...prev, isLoading: false }));
        }
      } catch (err: unknown) {
        const msg = axios.isAxiosError(err)
          ? (err.response?.data?.message ?? "Failed to create game")
          : "Failed to create game";
        toast.error(msg);
        setState((prev) => ({ ...prev, isLoading: false }));
      }
    },
    [applyServerState],
  );

  /** Join an existing game room by code (Player 2) */
  const joinGame = useCallback(
    async (roomCode: string) => {
      setState((prev) => ({ ...prev, isLoading: true }));

      try {
        const response = await apiJoinGame(roomCode);

        if (response.success) {
          applyServerState(response.data);

          // Connect socket if not already connected
          if (!socket.connected) {
            socket.connect();
          }

          // Join the socket room
          socket.emit("join_game", response.data.id);

          toast.success("Joined game! Let's play! 🎮");
        } else {
          toast.error(response.message || "Failed to join game");
          setState((prev) => ({ ...prev, isLoading: false }));
        }
      } catch (err: unknown) {
        const msg = axios.isAxiosError(err)
          ? (err.response?.data?.message ?? "Failed to join game")
          : "Failed to join game";
        toast.error(msg);
        setState((prev) => ({ ...prev, isLoading: false }));
      }
    },
    [applyServerState],
  );

  /** Drop a disc into a column (make a move via API) */
  const dropDisc = useCallback(
    async (column: number) => {
      const gameId = state.serverState?.id;
      if (!gameId) {
        toast.error("No active game");
        return;
      }

      if (!state.isGameActive) {
        toast.error("Game is not in progress");
        return;
      }

      if (!state.isMyTurn) {
        return; // silently ignore — it's CPU/opponent's turn
      }

      setState((prev) => ({ ...prev, isLoading: true, isMyTurn: false }));

      try {
        const response = await apiMakeMove(gameId, column);

        if (response.success) {
          // Apply MY move from the REST response immediately
          applyServerState(response.data);

          // CPU's move will arrive via socket "move_made" event
          // No polling needed!
        } else {
          toast.error(response.message || "Move failed");
          setState((prev) => ({ ...prev, isLoading: false, isMyTurn: true }));
        }
      } catch (err: unknown) {
        const msg = axios.isAxiosError(err)
          ? (err.response?.data?.message ?? "Move failed")
          : "Move failed";
        toast.error(msg);
        setState((prev) => ({ ...prev, isLoading: false, isMyTurn: true }));
      }
    },
    [
      state.serverState?.id,
      state.isGameActive,
      state.isMyTurn,
      applyServerState,
    ],
  );

  /** Leave the current game */
  const leaveCurrentGame = useCallback(async () => {
    const gameId = state.serverState?.id;

    if (gameId) {
      try {
        socket.emit("leave_game", gameId);

        // Only call leave if game is still in progress
        if (state.serverState?.status === "IN_PROGRESS") {
          await apiLeaveGame(gameId);
        }
      } catch (err) {
        console.error("Failed to leave game:", err);
      }
    }

    if (socket.connected) {
      socket.disconnect();
    }

    gameIdRef.current = null;
    setState(initialState);
  }, [state.serverState?.id, state.serverState?.status]);

  /** Refresh game state from server (resync fallback) */
  const refreshGameState = useCallback(async () => {
    const gameId = state.serverState?.id;
    if (!gameId) return;

    try {
      const response = await apiGetGameState(gameId);
      if (response.success) {
        applyServerState(response.data);
      }
    } catch (err) {
      console.error("Failed to refresh game state:", err);
    }
  }, [state.serverState?.id, applyServerState]);

  /** Toggle the pause menu */
  const toggleMenu = useCallback(() => {
    setState((prev) => ({ ...prev, showMenu: !prev.showMenu }));
  }, []);

  /** Send a quick message to the opponent via socket */
  const sendMessage = useCallback(
    (message: string) => {
      const gameId = state.serverState?.id;
      if (!gameId || state.gameMode !== "PVP") return;

      socket.emit("send_message", { gameId, message });

      // Show locally too so the sender sees their own message
      toast(message, {
        icon: "📤",
        style: {
          background: "#FFCE67",
          color: "#000",
          fontWeight: "800",
          fontSize: "16px",
          border: "3px solid #000",
          borderRadius: "16px",
        },
        duration: 2000,
      });
    },
    [state.serverState?.id, state.gameMode],
  );

  /** Play again: keep scores, leave old game, create a fresh one */
  const playAgain = useCallback(async () => {
    const mode = state.gameMode;
    const savedScores = { ...state.scores };

    // Leave old game (resets state)
    await leaveCurrentGame();

    if (mode) {
      await createGame(mode);

      // Restore scores after the new game is created
      setState((prev) => ({ ...prev, scores: savedScores }));
    }
  }, [state.gameMode, state.scores, leaveCurrentGame, createGame]);

  // ------------------------------------------------------------------
  // Provide context
  // ------------------------------------------------------------------

  return (
    <GameContext.Provider
      value={{
        state,
        createGame,
        joinGame,
        dropDisc,
        leaveCurrentGame,
        refreshGameState,
        playAgain,
        sendMessage,
        toggleMenu,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGameContext = () => {
  const context = useContext(GameContext);
  if (context === undefined)
    throw new Error("useGameContext must be used within a GameProvider");
  return context;
};

export default GameProvider;
