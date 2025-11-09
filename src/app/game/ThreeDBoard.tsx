// src/app/game/ThreeDBoard.tsx
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { checkWinner, checkDraw, createInitialBoard, makeMove, Player, Board, LAYERS } from "@/lib/game/threeD";
import { Socket } from "socket.io-client";

interface ThreeDBoardProps {
  isOnline?: boolean;
  socket?: Socket;
  lobbyId?: string;
  player?: "X" | "O";
}

export default function ThreeDBoard({ isOnline, socket, lobbyId, player }: ThreeDBoardProps) {
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

  const handleCellClick = (layer: number, index: number) => {
    if (winner || board[layer][index] || (isOnline && currentPlayer !== player)) return;

    const newBoard = makeMove(board, layer, index, currentPlayer);
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
      <div className="flex gap-8">
        {Array.from({ length: LAYERS }).map((_, layer) => (
          <div key={layer} className="flex flex-col items-center">
            <h3 className="text-xl mb-2">Layer {layer + 1}</h3>
            <div className="grid grid-cols-3 gap-2">
              {board[layer].map((_, index) => (
                <motion.div
                  key={index}
                  className="w-20 h-20 bg-gray-800 flex items-center justify-center text-3xl font-bold cursor-pointer"
                  onClick={() => handleCellClick(layer, index)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {board[layer][index]}
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>
      {(winner || draw) && (
        <button onClick={resetGame} className="mt-4 px-4 py-2 bg-blue-500 rounded hover:bg-blue-600">
          Restart Game
        </button>
      )}
    </div>
  );
}
