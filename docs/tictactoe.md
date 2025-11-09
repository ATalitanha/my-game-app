# Tic Tac Toe Game Documentation

This document provides a comprehensive overview of the Tic Tac Toe game system, including its file structure, setup instructions, and guidelines for future development.

## File and Folder Structure

The project is organized into the following key directories:

-   **/src/app/game**: Contains the main game page and all the UI components for the different game boards.
-   **/src/lib/game**: Houses the core game logic for each of the Tic Tac Toe variants and Connect Four.
-   **/src/app/api/game**: Includes the server-side logic for the online multiplayer mode, powered by Socket.IO.
-   **/docs**: Contains this documentation file.

## How to Run Locally

To run the game on your local machine, follow these steps:

1.  **Install Dependencies:** Open a terminal and run `pnpm install` to install all the necessary packages.
2.  **Start the Server:** Run `pnpm dev` to start the Next.js development server.
3.  **Access the Game:** Open your browser and navigate to `http://localhost:3000/game` to play the game.

## How to Test Offline and Online Modes

### Offline Mode

1.  **Select "Offline"** on the game selection screen.
2.  **Choose a Game Type:** Select any of the available game variants.
3.  **Play the Game:** Two players can now play on the same device by taking turns.

### Online Mode

1.  **Select "Online"** on the game selection screen.
2.  **Create a Lobby:** Click the "Create" button to generate a new lobby ID.
3.  **Share the Lobby ID:** Send the lobby ID to another player.
4.  **Join the Lobby:** The second player should enter the lobby ID and click "Join."
5.  **Play the Game:** The game will now be synchronized between both players in real-time.

## How to Add a New Variant in the Future

To add a new game variant, you'll need to follow these steps:

1.  **Create the Game Logic:** Add a new file in `/src/lib/game` with the logic for the new variant.
2.  **Create the UI Component:** Add a new component in `/src/app/game` for the game board.
3.  **Integrate with the Main Page:** Add the new game type to the game selection screen in `/src/app/game/page.tsx`.
