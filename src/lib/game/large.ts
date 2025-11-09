// src/lib/game/large.ts

export type Player = "X" | "O";
export type Board = (Player | null)[];

export function createInitialBoard(size: number): Board {
  return Array(size * size).fill(null);
}

export function checkWinner(board: Board, size: number): Player | null {
  const lines = [];

  // Rows
  for (let i = 0; i < size; i++) {
    const row = [];
    for (let j = 0; j < size; j++) {
      row.push(i * size + j);
    }
    lines.push(row);
  }

  // Columns
  for (let i = 0; i < size; i++) {
    const col = [];
    for (let j = 0; j < size; j++) {
      col.push(j * size + i);
    }
    lines.push(col);
  }

  // Diagonals
  const diag1 = [];
  const diag2 = [];
  for (let i = 0; i < size; i++) {
    diag1.push(i * (size + 1));
    diag2.push((i + 1) * (size - 1));
  }
  lines.push(diag1, diag2);

  for (const line of lines) {
    const [first, ...rest] = line;
    if (board[first] && rest.every((index) => board[index] === board[first])) {
      return board[first];
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
