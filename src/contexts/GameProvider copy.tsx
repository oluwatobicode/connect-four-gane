import React, { createContext, useContext, useReducer } from "react";
import toast from "react-hot-toast";

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
  timerTick: () => void;
  checkWinner: () => void;
  animationComplete: () => void;
  quitGame: () => void;
  showMenu: (option: { show: boolean }) => void;
  dropDisc: (columnId: number) => void;
  cpuDropDisc: () => void;
  playAgain: () => void;
  continueGame: () => void;
}

// firstly create an initial state for the game
const initialGameState: GameState = {
  winner: undefined,
  isGameActive: true,
  timer: 30,
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
  | { type: "RESTART_GAME" }
  | { type: "PLAY_AGAIN" }
  | { type: "CONTINUE_GAME" }
  | { type: "SHOW_MENU"; payload: { show: boolean } }
  | { type: "GAME_PAUSE" }
  | { type: "QUIT_GAME" }
  | { type: "TIMER_TICK" }
  | { type: "CPU_DROP_DISC" }
  | { type: "CHECK_WINNER" };

// HELPER FUNCTION

/*
  grid: Array(6)
    .fill(null)
    .map(() => Array(7).fill(null)),
// Your Connect Four grid (6 rows × 7 columns)
grid = [
  [null, null, null, null, null, null, null], // Row 0 (TOP)
  [null, null, null, null, null, null, null], // Row 1
  [null, null, null, null, null, null, null], // Row 2  
  [null, null, null, null, null, null, null], // Row 3
  [null, null, null, null, null, null, null], // Row 4
  [null, null, null, null, null, null, null], // Row 5 (BOTTOM)
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
  count = 1;
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
  for (let row = 5; row >= 0; row--) {
    if (grid[row][column] === null) {
      return row;
    }
  }

  return -1;
};

const checkIsColumnFull = (
  grid: (null | "player1" | "player2")[][],
  column: number
): boolean => {
  return grid[0][column] !== null;
};

// create a reducer function (firstly pass in the Game state which is the initial state and pass in the game actions as the second argument)
// secondly inside it create a switch statement that toggles all of our action.type returning the state and having their own logic
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

      if (checkIsColumnFull(state.grid, column)) {
        // i will pass a toast notification here
        toast.error("Column is full!");
        return state;
      }

      const targetRow = checkLowestRow(state.grid, column);

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
        timer: 30,
      };

    case "CPU_DROP_DISC":
      let randomColumn;

      do {
        randomColumn = Math.floor(Math.random() * 7);
      } while (checkIsColumnFull(state.grid, randomColumn));

      const cpuTargetRow = checkLowestRow(state.grid, randomColumn);

      const newGridCpu = [...state.grid];
      newGridCpu[cpuTargetRow][randomColumn] = state.currentPlayer;

      const hasCpuWon = checkWinCondition(
        newGridCpu,
        cpuTargetRow,
        randomColumn,
        state.currentPlayer
      );

      if (hasCpuWon) {
        const newScores = { ...state.scores };
        if (state.currentPlayer === "player1") {
          newScores.player1++;
        } else {
          newScores.player2++;
        }

        return {
          ...state,
          grid: newGridCpu,
          winner: state.currentPlayer,
          scores: state.scores,
          isGameActive: false,
        };
      }

      const IsBoardFull = newGridCpu.every((row) =>
        row.every((cell) => cell !== null)
      );

      if (IsBoardFull) {
        return {
          ...state,
          grid: newGridCpu,
          winner: "draw",
          isGameActive: false,
        };
      }

      return {
        ...state,
        grid: newGridCpu,
        currentPlayer:
          state.currentPlayer === "player1" ? "player2" : "player1",
        timer: 30,
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
        timer: 30,
        currentPlayer:
          state.currentPlayer === "player1" ? "player2" : "player1",
      };

    case "TIMER_TICK": {
      if (state.timer > 1) {
        return { ...state, timer: state.timer - 1 };
      } else {
        return {
          ...state,
          timer: 30,
          currentPlayer:
            state.currentPlayer === "player1" ? "player2" : "player1",
        };
      }
    }

    case "GAME_PAUSE": {
      return {
        ...state,
        isGameActive: false,
      };
    }

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
        isGameActive: true,
        timer: state.timer - 1,
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

// create a gamecontext with use createContext
const GameContext = createContext<GameActionProps | undefined>(undefined);

// THEN EXPORT OUR GAME PROVIDER
export const GameProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // CREATE A USEREDUCER HOOK WHERE WE PASS IN OUR [STATE, DISPATCH]
  // THEN IN THE USE REDUCER HOOK PASS IN THE GAMEREDUCER AND THE INITIALGAMESTATE
  const [state, dispatch] = useReducer(gameReducer, initialGameState);

  // we will create an array of objects where we can disptach out actions
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

    cpuDropDisc: () => {
      dispatch({ type: "CPU_DROP_DISC" });
    },

    timerTick: () => {
      dispatch({ type: "TIMER_TICK" });
    },
  };

  // then we will pass in the value

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};

// create a custom hook in which we can use the useGameContext tp get our state and usereducer functions
export const useGameContext = () => {
  const context = useContext(GameContext);
  if (context === undefined)
    throw new Error("useGameContext must be used within a GameProvider");

  return context;
};

export default GameProvider;
