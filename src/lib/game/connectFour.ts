// src/lib/game/connectFour.ts

export type Player = "X" | "O";
export type Board = (Player | null)[][];

export const ROWS = 6;
export const COLS = 7;

export function createInitialBoard(): Board {
  return Array(ROWS)
    .fill(null)
    .map(() => Array(COLS).fill(null));
}

export function makeMove(board: Board, col: number, player: Player): Board | null {
  if (col < 0 || col >= COLS || board[0][col]) {
    return null; // Invalid move
  }

  const newBoard = board.map((row) => [...row]);
  for (let r = ROWS - 1; r >= 0; r--) {
    if (!newBoard[r][col]) {
      newBoard[r][col] = player;
      return newBoard;
    }
  }

  return null; // Should not happen if column is not full
}

export function checkWinner(board: Board): Player | null {
  // Check horizontal
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c <= COLS - 4; c++) {
      const slice = board[r].slice(c, c + 4);
      if (slice.every((cell) => cell && cell === slice[0])) {
        return slice[0];
      }
    }
  }

  // Check vertical
  for (let c = 0; c < COLS; c++) {
    for (let r = 0; r <= ROWS - 4; r++) {
      const slice = [board[r][c], board[r + 1][c], board[r + 2][c], board[r + 3][c]];
      if (slice.every((cell) => cell && cell === slice[0])) {
        return slice[0];
      }
    }
  }

  // Check diagonal (down-right)
  for (let r = 0; r <= ROWS - 4; r++) {
    for (let c = 0; c <= COLS - 4; c++) {
      const slice = [board[r][c], board[r + 1][c + 1], board[r + 2][c + 2], board[r + 3][c + 3]];
      if (slice.every((cell) => cell && cell === slice[0])) {
        return slice[0];
      }
    }
  }

  // Check diagonal (up-right)
  for (let r = 3; r < ROWS; r++) {
    for (let c = 0; c <= COLS - 4; c++) {
      const slice = [board[r][c], board[r - 1][c + 1], board[r - 2][c + 2], board[r - 3][c + 3]];
      if (slice.every((cell) => cell && cell === slice[0])) {
        return slice[0];
      }
    }
  }

  return null;
}

export function checkDraw(board: Board): boolean {
  return board[0].every((cell) => cell !== null);
}
