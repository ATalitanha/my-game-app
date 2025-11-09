// src/app/game/page.tsx
"use client";

import { useState, useEffect } from "react";
import io from "socket.io-client";
import ClassicBoard from "./ClassicBoard";
import ConnectFourBoard from "./ConnectFourBoard";
import ThreeDBoard from "./ThreeDBoard";

type GameType = "classic" | "4x4" | "5x5" | "connect-four" | "3d";
type GameMode = "offline" | "online";

const socket = io();

export default function GamePage() {
  const [gameType, setGameType] = useState<GameType | null>(null);
  const [gameMode, setGameMode] = useState<GameMode>("offline");
  const [nickname, setNickname] = useState("");
  const [lobbyId, setLobbyId] = useState("");
  const [player, setPlayer] = useState<"X" | "O" | null>(null);
  const [waiting, setWaiting] = useState(false);

  useEffect(() => {
    socket.on("player-joined", (data) => {
      setWaiting(false);
      setPlayer(data.players[socket.id]);
    });

    socket.on("lobby-full", () => {
      alert("Lobby is full");
    });

    return () => {
      socket.off("player-joined");
      socket.off("lobby-full");
    };
  }, []);

  const handleCreateLobby = (gameType: GameType) => {
    const newLobbyId = Math.random().toString(36).substring(2, 8);
    setLobbyId(newLobbyId);
    setPlayer("X");
    setWaiting(true);
    let size;
    switch (gameType) {
      case "classic":
        size = 3;
        break;
      case "4x4":
        size = 4;
        break;
      case "5x5":
        size = 5;
        break;
    }
    socket.emit("create-lobby", { lobbyId: newLobbyId, gameType, size, nickname });
    setGameType(gameType);
  };

  const handleJoinLobby = () => {
    if (lobbyId) {
      setPlayer("O");
      socket.emit("join-lobby", lobbyId);
    }
  };

  const renderGame = () => {
    const onlineProps = { socket, lobbyId, player };
    switch (gameType) {
      case "classic":
        return <ClassicBoard size={3} isOnline={gameMode === 'online'} {...(gameMode === 'online' && onlineProps)} />;
      case "4x4":
        return <ClassicBoard size={4} isOnline={gameMode === 'online'} {...(gameMode === 'online' && onlineProps)} />;
      case "5x5":
        return <ClassicBoard size={5} isOnline={gameMode === 'online'} {...(gameMode === 'online' && onlineProps)} />;
      case "connect-four":
        return <ConnectFourBoard isOnline={gameMode === 'online'} {...(gameMode === 'online' && onlineProps)} />;
      case "3d":
        return <ThreeDBoard isOnline={gameMode === 'online'} {...(gameMode === 'online' && onlineProps)} />;
      default:
        return null;
    }
  };

  if (gameType) {
    if (waiting) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
          <h2 className="text-3xl font-bold mb-4">Waiting for another player...</h2>
          <p>Lobby ID: {lobbyId}</p>
        </div>
      );
    }
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
        {renderGame()}
        <button
          onClick={() => setGameType(null)}
          className="mt-4 px-4 py-2 bg-blue-500 rounded hover:bg-blue-600"
        >
          Back to Menu
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <h1 className="text-4xl font-bold mb-8">Tic Tac Toe</h1>
      <div className="flex gap-4 mb-4">
        <button onClick={() => setGameMode("offline")} className={`px-4 py-2 rounded ${gameMode === 'offline' ? 'bg-blue-500' : 'bg-gray-700'}`}>
          Offline
        </button>
        <button onClick={() => setGameMode("online")} className={`px-4 py-2 rounded ${gameMode === 'online' ? 'bg-blue-500' : 'bg-gray-700'}`}>
          Online
        </button>
      </div>
      <div className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Enter your nickname"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          className="px-4 py-2 rounded bg-gray-800 text-white"
        />
        {gameMode === "online" && (
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Enter Lobby ID"
              value={lobbyId}
              onChange={(e) => setLobbyId(e.target.value)}
              className="px-4 py-2 rounded bg-gray-800 text-white"
            />
            <button onClick={handleJoinLobby} className="px-4 py-2 bg-green-500 rounded hover:bg-green-600">
              Join
            </button>
            <button onClick={handleCreateLobby} className="px-4 py-2 bg-purple-500 rounded hover:bg-purple-600">
              Create
            </button>
          </div>
        )}
        <button onClick={() => gameMode === 'offline' ? setGameType("classic") : handleCreateLobby("classic")} className="px-4 py-2 bg-blue-500 rounded hover:bg-blue-600">
          Classic (3x3)
        </button>
        <button onClick={() => gameMode === 'offline' ? setGameType("4x4") : handleCreateLobby("4x4")} className="px-4 py-2 bg-blue-500 rounded hover:bg-blue-600">
          4x4 Board
        </button>
        <button onClick={() => gameMode === 'offline' ? setGameType("5x5") : handleCreateLobby("5x5")} className="px-4 py-2 bg-blue-500 rounded hover:bg-blue-600">
          5x5 Board
        </button>
        <button onClick={() => gameMode === 'offline' ? setGameType("connect-four") : handleCreateLobby("connect-four")} className="px-4 py-2 bg-blue-500 rounded hover:bg-blue-600">
          Connect Four
        </button>
        <button onClick={() => gameMode === 'offline' ? setGameType("3d") : handleCreateLobby("3d")} className="px-4 py-2 bg-blue-500 rounded hover:bg-blue-600">
          3D Tic Tac Toe
        </button>
      </div>
    </div>
  );
}
