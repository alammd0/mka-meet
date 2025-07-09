"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
require("dotenv/config");
const cors_1 = __importDefault(require("cors"));
const auth_1 = __importDefault(require("./routes/auth"));
const room_1 = __importDefault(require("./routes/room"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use("/api/v1/auth", auth_1.default);
app.use("/api/v1/room", room_1.default);
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
