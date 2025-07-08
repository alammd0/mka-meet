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

io.on("connection", (socket) => {
  console.log("a user connected", socket.id);
  
  // join-room
  socket.on("join-room", (data) => {
    console.log(data);
    socket.join(data.roomId);
    socket.to(data.roomId).emit("join-room", data.userId);
  });

  // offer
  socket.on("offer", (data) => {
    socket.to(data.roomId).emit("offer", data);
  });

  // answer
  socket.on("answer", (data) => {
    socket.to(data.roomId).emit("answer", data);
  });

  // icecandidate
  socket.on("icecandidate", (data) => {
    socket.to(data.roomId).emit("icecandidate", data);
  });

  // disconnect
  socket.on("disconnect", () => {
    console.log("a user disconnected", socket.id);
  });
});

const PORT = process.env.PORT;
app.get("/", (req, res) => {
  res.send(`<h1>hello our project..</h1>`);
});

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
