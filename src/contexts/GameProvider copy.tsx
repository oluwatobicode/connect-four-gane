import React, { createContext, useContext, useReducer } from "react";

interface GameState {
  grid: (null | "player1" | "player2")[][];
  currentPlayer: "player1" | "player2";
  winner: undefined | "player1" | "player2" | "draw";
  isGameActive: true | false;
  gameMode: "pvp" | "pvc" | undefined;
  timer: number;
  showMenu: true | false;
  scores: { player1: number; player2: number };
  isDropping: boolean;
  droppingColumn: number | undefined;
  player1: "human";
  player2: "human" | "cpu" | undefined;
}

interface GameActionProps {
  state: GameState;
  startGame: (options: {
    mode: "pvp" | "pvc";
    playerTwo: "cpu" | "human";
  }) => void;
  restartGame: () => void;
  pauseGame: () => void;
  updateTimer: () => void;
  checkWinner: () => void;
  animationComplete: () => void;
  quitGame: () => void;
  showMenu: (option: { show: boolean }) => void;
  dropDisc: (columnId: number) => void;
  playAgain: () => void;
  continueGame: () => void;
}

const initialGameState: GameState = {
  winner: undefined,
  isGameActive: true,
  timer: 15,
  grid: Array(6)
    .fill(null)
    .map(() => Array(7).fill(null)),
  currentPlayer: "player1",
  gameMode: undefined,
  showMenu: false,
  scores: { player1: 0, player2: 0 },
  isDropping: false,
  droppingColumn: undefined,
  player1: "human",
  player2: undefined,
};

// create the actions that will happen in our app
type gameActions =
  | {
      type: "GAME_START";
      payload: { mode: "pvc" | "pvp"; playerTwo: "cpu" | "human" };
    }
  | { type: "DROP_DISC"; payload: { columnId: number } }
  | { type: "ANIMATION_COMPLETE" }
  | { type: "TIME_EXPIRED" }
  | { type: "RESTART_GAME" }
  | { type: "PLAY_AGAIN" }
  | { type: "CONTINUE_GAME" }
  | { type: "SHOW_MENU"; payload: { show: boolean } }
  | { type: "GAME_PAUSE" }
  | { type: "QUIT_GAME" }
  | { type: "TIMER_TICK" }
  | { type: "SWITCH_PLAYER" }
  | { type: "CHECK_WINNER" };

// HELPER FUNCTION

/*
// Your Connect Four grid (6 rows × 7 columns)
grid = [
  [null, null, null, null, null, null, null], // Row 0 (TOP)
  [null, null, null, null, null, null, null], // Row 1
  [null, null, null, null, null, null, null], // Row 2  
  [null, null, null, null, null, null, null], // Row 3
  [null, null, null, null, null, 3, null], // Row 4
  [null, null, null, null, null, 3, null], // Row 5 (BOTTOM)
]
//  ↑     ↑     ↑     ↑     ↑     ↑     ↑
//  Col0  Col1  Col2  Col3  Col4  Col5  Col6


  */

const checkWinCondition = (
  grid: (null | "player1" | "player2")[][],
  row: number,
  col: number,
  player: "player1" | "player2"
): boolean => {
  // 1)check horizontal
  let count = 1; // count the current disc
  // count to the left
  for (let c = col - 1; c >= 0; c--) {
    if (grid[row][c] === player) {
      count++;
    } else {
      break;
    }
  }
  // counts to the right
  for (let c = col + 1; c < 7; c++) {
    if (grid[row][c] === player) {
      count++;
    } else {
      break;
    }
  }

  if (count >= 4) {
    return true;
  }

  // 2)check vertical
  count = 1; // reset count for vertical check
  for (let r = row + 1; r < 6; r++) {
    if (grid[r][col] === player) {
      count++;
    } else {
      break;
    }
  }
  if (count >= 4) {
    return true;
  }

  // 3)check diagonal (bottom-left to top-right)
  count = 1;
  for (let r = row + 1, c = col - 1; r < 6 && c >= 0; r++, c--) {
    if (grid[r][c] === player) {
      count++;
    } else {
      break;
    }
  }
  for (let r = row - 1, c = col + 1; r >= 0 && c < 7; r--, c++) {
    if (grid[r][c] === player) {
      count++;
    } else {
      break;
    }
  }
  if (count >= 4) {
    return true;
  }

  // 4)check diagonal (top-left to bottom-right)
  count = 1;
  for (let r = row - 1, c = col - 1; r >= 0 && c >= 0; r--, c--) {
    if (grid[r][c] === player) {
      count++;
    } else {
      break;
    }
  }
  for (let r = row + 1, c = col + 1; r < 6 && c < 7; r++, c++) {
    if (grid[r][c] === player) {
      count++;
    } else {
      break;
    }
  }
  if (count >= 4) {
    return true;
  }

  return false;
};

const checkLowestRow = (
  grid: (null | "player1" | "player2")[][],
  column: number
): number => {
  // starting from bottom row index 5 to the top
  for (let row = 5; row >= 0; row--) {
    if (grid[row][column] === null) {
      // then we will return the lowest empty row
      return row;
    }
  }

  // if the column is full
  return -1;
};

const checkIsColumnFull = (
  grid: (null | "player1" | "player2")[][],
  column: number
): boolean => {
  return grid[0][column] !== null;
};

// create a reducer with a switch type that contains all of our game logic
const gameReducer = (state: GameState, action: gameActions): GameState => {
  switch (action.type) {
    case "GAME_START":
      return {
        ...state,
        gameMode: action.payload.mode,
        player1: "human",
        player2: action.payload.playerTwo,
      };

    case "DROP_DISC":
      const column = action.payload.columnId;

      // checks if the column is full
      if (checkIsColumnFull(state.grid, column)) {
        // i will pass a toast notification here
        console.log("Column is full!");
        return state;
      }
      // find where the disc should actually land
      const targetRow = checkLowestRow(state.grid, column);
      // placing disk at the bottom, not where the user clicked
      const newGrid = [...state.grid];
      newGrid[targetRow][column] = state.currentPlayer;

      const hasWon = checkWinCondition(
        newGrid,
        targetRow,
        column,
        state.currentPlayer
      );

      if (hasWon) {
        const newScores = { ...state.scores };
        if (state.currentPlayer === "player1") {
          newScores.player1++;
        } else {
          newScores.player2++;
        }

        return {
          ...state,
          grid: newGrid,
          winner: state.currentPlayer,
          scores: newScores,
          isGameActive: false,
        };
      }

      // check for draw
      const isBoardFull = newGrid.every((row) =>
        row.every((cell) => cell !== null)
      );

      if (isBoardFull) {
        return {
          ...state,
          grid: newGrid,
          winner: "draw",
          isGameActive: false,
        };
      }

      return {
        ...state,
        grid: newGrid,
        currentPlayer:
          state.currentPlayer === "player1" ? "player2" : "player1",
        timer: 15,
      };

    case "PLAY_AGAIN":
      return {
        ...state,
        grid: Array(6)
          .fill(null)
          .map(() => Array(7).fill(null)),
        scores: state.scores,
        winner: undefined,
        isGameActive: true,
        timer: 15,
        currentPlayer:
          state.currentPlayer === "player1" ? "player2" : "player1",
      };

    case "RESTART_GAME":
      return {
        ...initialGameState,
        grid: Array(6)
          .fill(null)
          .map(() => Array(7).fill(null)),
      };

    case "CONTINUE_GAME":
      return {
        ...state,
      };

    case "SHOW_MENU":
      return {
        ...state,
        showMenu: action.payload.show,
      };

    case "QUIT_GAME":
      return {
        ...initialGameState,
        grid: Array(6)
          .fill(null)
          .map(() => Array(7).fill(null)),
      };

    default:
      return state;
  }
};

// create your context and pass in the necessary types
const GameContext = createContext<GameActionProps | undefined>(undefined);

// then create a game provider so as we can wrap ur app
export const GameProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // create our dispatch and state function for useReducer
  const [state, dispatch] = useReducer(gameReducer, initialGameState);

  const value: GameActionProps = {
    state,

    startGame: (options) => {
      dispatch({
        type: "GAME_START",
        payload: options,
      });
    },

    restartGame: () => {
      dispatch({ type: "RESTART_GAME" });
    },

    animationComplete: () => {
      dispatch({ type: "ANIMATION_COMPLETE" });
    },

    pauseGame: () => {
      dispatch({ type: "GAME_PAUSE" });
    },

    checkWinner: () => {
      dispatch({ type: "CHECK_WINNER" });
    },

    updateTimer: () => {
      dispatch({ type: "TIME_EXPIRED" });
    },

    playAgain: () => {
      dispatch({ type: "PLAY_AGAIN" });
    },

    quitGame: () => {
      dispatch({ type: "QUIT_GAME" });
    },

    continueGame: () => {
      dispatch({ type: "CONTINUE_GAME" });
    },

    showMenu: (option) => {
      dispatch({ type: "SHOW_MENU", payload: option });
    },

    dropDisc: (column) => {
      dispatch({ type: "DROP_DISC", payload: { columnId: column } });
    },
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};

export const useGameContext = () => {
  const context = useContext(GameContext);
  if (context === undefined)
    throw new Error("useGameContext must be used within a GameProvider");

  return context;
};

export default GameProvider;
