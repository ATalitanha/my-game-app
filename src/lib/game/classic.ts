// src/lib/game/classic.ts

export type Player = "X" | "O";
export type Board = (Player | null)[];

export const initialBoard = Array(9).fill(null);

export function checkWinner(board: Board): Player | null {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (const line of lines) {
    const [a, b, c] = line;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }

  return null;
}

export function checkDraw(board: Board): boolean {
  return board.every((cell) => cell !== null);
}

export function makeMove(board: Board, index: number, player: Player): Board | null {
  if (board[index]) {
    return null; // Invalid move
  }
  const newBoard = [...board];
  newBoard[index] = player;
  return newBoard;
}
