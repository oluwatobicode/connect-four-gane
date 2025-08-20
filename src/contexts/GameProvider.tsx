/*

So we have a start menu that shows 
Play vs player 
Player vs CPU
Game Rules 
When the user clicks on game rules he is taken to a page that shows him the rules of the game. 

When the user clicks on “Play vs Player” he plays with another player 

When the user clicks on “Play vs CPU” he plays with an algorithm for the CPU. 

Now there is a table 
The table is a 6x7 grid with empty holes 
There is a counter for 15 seconds 
If player 1 (me) plays a column a red disc falls into the circle 
If player2 or the cpu plays another column or the same column a yellow disc falls into the column. 
If player 1 or player 2 or the cpu does not play within 15 seconds the next player has a turn 
How are points counted if there is a sucessful 4 disc in a row either vertically or horizontally or diagonally for each disc (blue or red) then a point is gotten, a small donut circle appears inside. If there is not when the whole grid completes then it is a draw. 

So how do I do it ? 
React 
Typescript 
Tailwindcss 
Context API + useReducer 

So there will be a default state 
Interface Game {
gridArray
matchedGridArray: []
Players: [] I am not sure yet
Timer: 15s
Winner: Player 1 | player 2 | cpu 
}

I am thinking that there is going to be an algorithm to check if 
red disc : I am planning on using its ID to check if a row is matchec
Yellow disc: I am planning on using its ID to check if a row is matched

Proper logic for the game 

Have different 
A game state : to track who's turn , board state and the winner
A ui state : to track the timer, animations , menu screens and final scores (maybe)
A player state: Player Type (human vs cpu), scores
- The gird array structure would be built using a 2d array structure  

interface Game {
currPlayer : 'player1' | 'player2' | 'cpu' | null
winner : 'player1' | 'player2' | 'cpu' | null
boardState : UIState
}

interface UI {
timer: 15s
animations : "dropping" | "done"
menuScreens : it is actually a modal that can be done in one of the interfaces
finalScores : it is a small stuff beanthe
}

interface player {
score : 0
currPlayer:currPlayer : 'player1' | 'player2' | 'cpu' | null
}


my best guess the array would look like this 
grid_array = [
  [null, null, null, null, null, null, null], // Row 0 (top)
  [null, null, null, null, null, null, null], // Row 1
  [null, null, null, null, null, null, null], // Row 2
  [null, null, null, null, null, null, null], // Row 3
  [null, null, null, null, null, null, null], // Row 4
  [null, null, null, null, null, null, null], // Row 5 (bottom)
]

- when a player drops a disc, we track the 
1. the lowest available row in that column
2. then place the player's marker there
3. then check win conditions FROM that exact position 

win-checking algorithm logic
- check 4 directions from that player's marker in 4 different directions (horizontal, vertical, diagonal-left, diagonal-right)
- for each direction we count the consecutive pieces of the same player
- if the count >= 4, we have a winner

type GameAction = 
{type: 'START_GAME', payload: 'pvp' | 'pvc'}
{type: 'DROP_DISC', column: number}
{type: 'CHECK_WINNER'}
{type: 'PAUSE_GAME'}
{type: 'RESTART_GAME'}
{type: 'QUIT_GAME'}
{type: 'GAME_WON', payload: player}
{type: 'TIMER_TICK'}
{type: 'TIMER_EXPERIED'}

the timer will useEffect but we will manage it in its own state , 
because timers are side effects and not pure functions
The reducer should only handle the "TIMER_EXPIRED" action. (claude explain this)



since we are dropping the disc in the lowest possible column how do we finf 
1. the lowest available row in that column , my best guess 
if (grid_row[row][col] === null ){
dispatch({type:'DROP_DISC', column:number})
}

// i am thinking of a guard clause that would not allow a player to drop 
a disc if a particular 
if(grid_row[row][col] !== null){
toast.notification('you cant drop it here!')
}

for the CPU we can an algorithm that can either use 
- we could create a basic strategy that blocks the user and 
another that wants to win too (not too hard and not too simple)

my win-detection alogorithm what if we can use numbers for either a player 1 or cpu or player 2

so it does like this 

1 === 1 === 1 (a win)

 */
// the game interface

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
  | { type: "SHOW_MENU"; payload: { show: boolean } }
  | { type: "GAME_PAUSE" }
  | { type: "QUIT_GAME" }
  | { type: "TIMER_TICK" }
  | { type: "SWITCH_PLAYER" }
  | { type: "CHECK_WINNER" };

// HELPER FUNCTION

const checkWinCodition = (
  grid: (null | "player1" | "player2")[][],
  row: number,
  col: number,
  player: "player1" | "player2"
): boolean => {
  return false;
};

const checkLowestRow = (
  grid: (null | "player1" | "player2")[][],
  column: number
): number => {
  // starting from bottom row index 5 to the top
  for (let row = 5; row >= 0; row--) {
    if (grid[column][row] === null) {
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

    case "RESTART_GAME":
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

    quitGame: () => {
      dispatch({ type: "QUIT_GAME" });
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
