import express from "express";
import "dotenv/config";
import cors from "cors";
import authRoutes from "./routes/auth";
import roomRoutes from "./routes/room";
import http from "http";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.use(express.json());
app.use(cors());

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/room", roomRoutes);

const userMaps: { [userId: string]: string } = {}; // userId -> socketId
const roomMaps: { [roomId: string]: string[] } = {}; // roomId -> userId[]

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  let currentRoomId: string | null = null;
  let currentUserId: string | null = null;

  socket.on("join-room", ({ roomId, userId }) => {
    currentRoomId = roomId;
    currentUserId = userId;

    userMaps[userId] = socket.id;

    if (!roomMaps[roomId]) roomMaps[roomId] = [];
    const otherUsers = roomMaps[roomId].filter((id) => id !== userId);
    socket.emit("existing-users", otherUsers);

    roomMaps[roomId].push(userId);
    socket.join(roomId);
    socket.to(roomId).emit("user-connected", userId);

    console.log(`User ${userId} joined room ${roomId}`);
  });

  socket.on("toggle-audio", ({roomId, userId, toggle}) => {
    socket.to(roomId).emit("toggle-audio", {userId, toggle});
  })

  socket.on("offer", ({ to, offer }) => {
    const toSocket = userMaps[to];
    if (toSocket)
      socket.to(toSocket).emit("offer", { from: currentUserId, offer });
  });

  socket.on("answer", ({ to, answer }) => {
    const toSocket = userMaps[to];
    if (toSocket)
      socket.to(toSocket).emit("answer", { from: currentUserId, answer });
  });

  socket.on("ice-candidate", ({ to, candidate }) => {
    const toSocket = userMaps[to];
    if (toSocket)
      socket
        .to(toSocket)
        .emit("ice-candidate", { from: currentUserId, candidate });
  });

  socket.on("disconnect", () => {
    if (currentUserId && currentRoomId) {
      roomMaps[currentRoomId] = roomMaps[currentRoomId].filter(
        (id) => id !== currentUserId
      );
      delete userMaps[currentUserId];
      socket.to(currentRoomId).emit("user-disconnected", currentUserId);
      console.log(`User ${currentUserId} left room ${currentRoomId}`);
    }
  });
});

const PORT = process.env.PORT;
app.get("/", (req, res) => {
  res.send(`<h1>hello our project..</h1>`);
});

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
