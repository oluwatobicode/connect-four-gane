import { apiInstance } from "./api";

// ----------------------------------------------------------------
// Types — match the exact shape the server returns
// ----------------------------------------------------------------

export interface ServerPlayer {
  id: string;
  username: string;
  avatar: string | null;
}

export interface ServerGameState {
  id: string;
  roomCode: string;
  player1Id: string;
  player2Id: string | null;
  boardState: number[][]; // 7 columns × 6 rows, values: 0, 1, 2
  currentTurn: string; // player UUID or "CPU"
  totalMoves: number;
  gameMode: "PVC" | "PVP";
  status: "IN_PROGRESS" | "COMPLETED" | "WAITING" | "DRAW" | "FORFEITED" | "ABANDONED";
  winnerId: string | null; // player UUID, "CPU", or null
  player1Elo: number;
  player2Elo: number;
  createdAt: string;
  updatedAt: string;
  lastActiveAt: string;
  player1?: ServerPlayer | null;
  player2?: ServerPlayer | null;
}

export interface ApiResponse<T> {
  statusCode: number;
  success: boolean;
  message: string;
  data: T;
}

// Socket event payloads

export interface MoveMadeEvent {
  playerId: string; // userId or "CPU"
  column: number;
  row: number;
  board: number[][];
  isWin: boolean;
  newStatus: "IN_PROGRESS" | "COMPLETED" | "DRAW" | "FORFEITED" | "ABANDONED";
}

export interface PlayerEvent {
  userId: string;
}

export interface ChatMessageEvent {
  userId: string;
  message: string;
  timeStamp: string;
}

export interface ForfeitEvent {
  loserId: string;
}

// ----------------------------------------------------------------
// API functions
// ----------------------------------------------------------------

/** Create a new game room */
export const createGame = async (gameMode: "PVC" | "PVP") => {
  const { data } = await apiInstance.post<ApiResponse<ServerGameState>>(
    "/game/create",
    { gameMode },
  );
  return data;
};

/** Get current game state */
export const getGameState = async (gameId: string) => {
  const { data } = await apiInstance.get<ApiResponse<ServerGameState>>(
    `/game/${gameId}`,
  );
  return data;
};

/** Make a move (drop disc into a column) */
export const makeMove = async (gameId: string, column: number) => {
  const { data } = await apiInstance.post<ApiResponse<ServerGameState>>(
    `/game/${gameId}/move`,
    { column },
  );
  return data;
};

/** Join an existing room by code */
export const joinGame = async (roomCode: string) => {
  const { data } = await apiInstance.post<ApiResponse<ServerGameState>>(
    "/game/join",
    { roomCode },
  );
  return data;
};

/** Leave a game */
export const leaveGame = async (gameId: string) => {
  const { data } = await apiInstance.post(`/game/${gameId}/leave`);
  return data;
};
