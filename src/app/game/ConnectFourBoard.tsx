// src/app/game/ConnectFourBoard.tsx
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  checkWinner,
  checkDraw,
  createInitialBoard,
  makeMove,
  Player,
  Board,
  ROWS,
  COLS,
} from "@/lib/game/connectFour";
import { Socket } from "socket.io-client";

interface ConnectFourBoardProps {
  isOnline?: boolean;
  socket?: Socket;
  lobbyId?: string;
  player?: "X" | "O";
}

export default function ConnectFourBoard({ isOnline, socket, lobbyId, player }: ConnectFourBoardProps) {
  const [board, setBoard] = useState<Board>(createInitialBoard());
  const [currentPlayer, setCurrentPlayer] = useState<Player>("X");
  const [winner, setWinner] = useState<Player | null>(null);
  const [draw, setDraw] = useState(false);

  useEffect(() => {
    if (isOnline && socket) {
      socket.on("move-made", (move) => {
        setBoard(move.newBoard);
        setCurrentPlayer(move.nextPlayer);
      });
    }

    return () => {
      if (isOnline && socket) {
        socket.off("move-made");
      }
    };
  }, [isOnline, socket]);

  useEffect(() => {
    const newWinner = checkWinner(board);
    if (newWinner) {
      setWinner(newWinner);
    } else if (checkDraw(board)) {
      setDraw(true);
    }
  }, [board]);

  const handleColumnClick = (col: number) => {
    if (winner || board[0][col] || (isOnline && currentPlayer !== player)) return;

    const newBoard = makeMove(board, col, currentPlayer);
    if (newBoard) {
      setBoard(newBoard);
      const nextPlayer = currentPlayer === "X" ? "O" : "X";
      setCurrentPlayer(nextPlayer);

      if (isOnline && socket) {
        socket.emit("make-move", { lobbyId, move: { newBoard, nextPlayer } });
      }
    }
  };

  const resetGame = () => {
    setBoard(createInitialBoard());
    setCurrentPlayer("X");
    setWinner(null);
    setDraw(false);
  };

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-3xl font-bold mb-4">
        {winner ? `Winner: ${winner}` : draw ? "Draw!" : `Current Player: ${currentPlayer}`}
      </h2>
      <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${COLS}, 1fr)` }}>
        {board.map((row, r) =>
          row.map((cell, c) => (
            <motion.div
              key={`${r}-${c}`}
              className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center text-2xl font-bold"
              onClick={() => handleColumnClick(c)}
              whileHover={{ scale: 1.05 }}
            >
              {cell && (
                <motion.div
                  className={`w-12 h-12 rounded-full ${cell === "X" ? "bg-red-500" : "bg-yellow-500"}`}
                  initial={{ y: -100, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                />
              )}
            </motion.div>
          ))
        )}
      </div>
      {(winner || draw) && (
        <button onClick={resetGame} className="mt-4 px-4 py-2 bg-blue-500 rounded hover:bg-blue-600">
          Restart Game
        </button>
      )}
    </div>
  );
}
