// src/lib/game/threeD.ts

export type Player = "X" | "O";
export type Board = (Player | null)[][];

export const SIZE = 3;
export const LAYERS = 3;

export function createInitialBoard(): Board {
  return Array(LAYERS)
    .fill(null)
    .map(() => Array(SIZE * SIZE).fill(null));
}

export function makeMove(board: Board, layer: number, index: number, player: Player): Board | null {
  if (board[layer][index]) {
    return null; // Invalid move
  }
  const newBoard = board.map((l) => [...l]);
  newBoard[layer][index] = player;
  return newBoard;
}

export function checkWinner(board: Board): Player | null {
  // Check each layer for a win
  for (let l = 0; l < LAYERS; l++) {
    const winner = checkLayerWinner(board[l]);
    if (winner) return winner;
  }

  // Check vertical columns through layers
  for (let i = 0; i < SIZE * SIZE; i++) {
    if (board[0][i] && board[0][i] === board[1][i] && board[0][i] === board[2][i]) {
      return board[0][i];
    }
  }

  // Check diagonals through layers
  if (board[0][0] && board[0][0] === board[1][4] && board[0][0] === board[2][8]) return board[0][0];
  if (board[0][2] && board[0][2] === board[1][4] && board[0][2] === board[2][6]) return board[0][2];
  if (board[0][6] && board[0][6] === board[1][4] && board[0][6] === board[2][2]) return board[0][6];
  if (board[0][8] && board[0][8] === board[1][4] && board[0][8] === board[2][0]) return board[0][8];

  return null;
}

function checkLayerWinner(layer: (Player | null)[]): Player | null {
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
    if (layer[a] && layer[a] === layer[b] && layer[a] === layer[c]) {
      return layer[a];
    }
  }

  return null;
}

export function checkDraw(board: Board): boolean {
  return board.every((layer) => layer.every((cell) => cell !== null));
}
