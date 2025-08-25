# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      ...tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      ...tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      ...tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from "eslint-plugin-react-x";
import reactDom from "eslint-plugin-react-dom";

export default tseslint.config([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs["recommended-typescript"],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```

<!-- GAME LOGIC BREAKDOWN MY THOUGHT PROCESS -->
<!-- /*

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
// the game interface -->

<!--
// Your Connect Four grid (6 rows × 7 columns)
grid = [
[null, null, null, null, null, null, null], // Row 0 (TOP)
[null, null, null, null, null, null, null], // Row 1
[null, null, null, null, null, null, null], // Row 2
 [null, null, null, null, null, null, null], // Row 3
[null, null, null, null, null, 3, null], // Row 4
[null, null, null, null, null, 3, null], // Row 5 (BOTTOM)
]
// ↑ ↑ ↑ ↑ ↑ ↑ ↑
// Col0 Col1 Col2 Col3 Col4 Col5 Col6

 -->
