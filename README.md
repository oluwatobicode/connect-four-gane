# Connect Four Game 🎮

A modern implementation of the classic Connect Four game built with React and TypeScript, featuring both Player vs Player and Player vs CPU modes.

## 🌟 Features

- Player vs Player mode
- Player vs CPU mode with intelligent AI (MinMax algorithm with Alpha Beta pruning)
- Responsive design for both desktop and mobile
- Interactive game board with animations
- Score tracking
- Modern and clean UI

## 🛠️ Built With

- [React](https://reactjs.org/) - Frontend library
- [TypeScript](https://www.typescriptlang.org/) - Programming language
- [Vite](https://vitejs.dev/) - Build tool and development server
- [useReducer + Context API](https://reactjs.org/docs/context.html) - State management
- [TailwindCSS](https://tailwindcss.com/docs/guides/vite) - Styling

## 🧠 Technical Implementation

### AI Strategy

The CPU player implements a strategic approach that:

1. Checks for immediate winning moves
2. Blocks opponent's potential wins
3. Prioritizes center column control
4. Includes randomization for varied gameplay

### Key Technical Learnings

Throughout this project, I gained experience in:

- Handling and manipulating 2D arrays 🧩
- Implementing the MinMax algorithm with Alpha Beta pruning
- Reinforcing knowledge of Context API + useReducer for state management
- Creating responsive and interactive UI components

## 🎯 Game Logic Highlights

The CPU's decision making process follows a priority based strategy:
1️⃣ Checks for obvious wins
2️⃣ Blocks the player's winning moves
3️⃣ Prioritizes center wins for strategic advantage
4️⃣ Incorporates randomization for unpredictable gameplay

## 🤖 Couple of things I plan to advance it with

1. A multi player game room with voice chat features
2. Ability to join a room
3. Ability to create a game room with you and your friends
4. Ability to view a room
5. Dropping disc animation
6. Ability to set the game difficulty

## 🚀 Getting Started

1. Clone the repository

```bash
git clone https://github.com/oluwatobicode/connect-four-gane.git
```

2. Install dependencies

```bash
npm install
```

3. Run the development server

```bash
npm run dev
```

## 🎮 How to Play

1. Choose game mode (Player vs Player or Player vs CPU)
2. Take turns dropping tokens into the grid
3. Connect four tokens vertically, horizontally, or diagonally to win
4. Keep track of your score and play again!

## 📱 Responsive Design

The game is fully responsive and works great on:

- Desktop browsers
- Tablets
- Mobile devices

## 🤝 Contributing

Feel free to fork the project and submit pull requests for any improvements you'd like to add!

## 📝 License

This project is open source and available under the [MIT License](LICENSE).
