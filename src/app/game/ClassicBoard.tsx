// src/app/game/ClassicBoard.tsx
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { checkWinner, checkDraw, createInitialBoard, makeMove, Player, Board } from "@/lib/game/large";
import { Socket } from "socket.io-client";

interface ClassicBoardProps {
  size: number;
  isOnline?: boolean;
  socket?: Socket;
  lobbyId?: string;
  player?: "X" | "O";
}

export default function ClassicBoard({ size, isOnline, socket, lobbyId, player }: ClassicBoardProps) {
  const [board, setBoard] = useState<Board>(createInitialBoard(size));
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
    const newWinner = checkWinner(board, size);
    if (newWinner) {
      setWinner(newWinner);
    } else if (checkDraw(board)) {
      setDraw(true);
    }
  }, [board, size]);

  const handleCellClick = (index: number) => {
    if (winner || board[index] || (isOnline && currentPlayer !== player)) return;

    const newBoard = makeMove(board, index, currentPlayer);
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
    setBoard(createInitialBoard(size));
    setCurrentPlayer("X");
    setWinner(null);
    setDraw(false);
  };

  const renderCell = (index: number) => {
    return (
      <motion.div
        key={index}
        className="w-24 h-24 bg-gray-800 flex items-center justify-center text-4xl font-bold cursor-pointer"
        onClick={() => handleCellClick(index)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {board[index]}
      </motion.div>
    );
  };

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-3xl font-bold mb-4">
        {winner ? `Winner: ${winner}` : draw ? "Draw!" : `Current Player: ${currentPlayer}`}
      </h2>
      <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${size}, 1fr)` }}>
        {board.map((_, index) => renderCell(index))}
      </div>
      {(winner || draw) && (
        <button onClick={resetGame} className="mt-4 px-4 py-2 bg-blue-500 rounded hover:bg-blue-600">
          Restart Game
        </button>
      )}
    </div>
  );
}
