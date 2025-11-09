// server.js
const { createServer } = require("http");
const next = require("next");
const { Server } = require("socket.io");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

const lobbies = {};

app.prepare().then(() => {
  const httpServer = createServer((req, res) => {
    handle(req, res);
  });

  const io = new Server(httpServer);

  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on("create-lobby", (data) => {
      const { lobbyId, gameType, size } = data;
      socket.join(lobbyId);
      lobbies[lobbyId] = {
        players: { [socket.id]: "X" },
        board: null, // Will be initialized on game start
        currentPlayer: "X",
        gameType,
        size,
      };
      console.log(`Lobby created: ${lobbyId}`);
    });

    socket.on("join-lobby", (lobbyId) => {
      const lobby = lobbies[lobbyId];
      if (lobby && Object.keys(lobby.players).length < 2) {
        socket.join(lobbyId);
        lobby.players[socket.id] = "O";
        io.to(lobbyId).emit("player-joined", {
          players: lobby.players,
          currentPlayer: lobby.currentPlayer,
        });
        console.log(`User ${socket.id} joined lobby: ${lobbyId}`);
      } else {
        socket.emit("lobby-full");
      }
    });

    socket.on("make-move", (data) => {
      const { lobbyId, move } = data;
      const lobby = lobbies[lobbyId];
      const player = lobby.players[socket.id];

      if (lobby && player === lobby.currentPlayer) {
        // Here you would add the full validation logic for each game type
        // For simplicity, we'll just update the state for now
        lobby.board = move.newBoard;
        lobby.currentPlayer = move.nextPlayer;
        socket.to(lobbyId).emit("move-made", move);
      }
    });

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);
      for (const lobbyId in lobbies) {
        if (lobbies[lobbyId].players[socket.id]) {
          delete lobbies[lobbyId].players[socket.id];
          if (Object.keys(lobbies[lobbyId].players).length === 0) {
            delete lobbies[lobbyId];
          }
        }
      }
    });
  });

  httpServer.listen(3000, () => {
    console.log("> Ready on http://localhost:3000");
  });
});
