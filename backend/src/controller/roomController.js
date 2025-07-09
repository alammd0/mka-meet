"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRoomDetail = exports.getAllRooms = exports.joinRoom = exports.createRoom = void 0;
const db_1 = __importDefault(require("../lib/db"));
// 1. create room 
const createRoom = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(req.body);
        const { roomName, description } = req.body;
        console.log(roomName, description);
        if (!roomName) {
            return res.status(400).json({
                success: false,
                message: "Room name is required"
            });
        }
        // create room 
        const roomCreate = yield db_1.default.room.create({
            data: {
                userId: req.user.id,
                roomName: roomName,
                description: description
            }
        });
        if (!roomCreate) {
            return res.status(400).json({
                success: false,
                message: "Room not created"
            });
        }
        return res.status(200).json({
            success: true,
            message: "Room created successfully",
            data: roomCreate
        });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({
            succuss: false,
            message: "Internal server error"
        });
    }
});
exports.createRoom = createRoom;
// 2. Join room
const joinRoom = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { roomId } = req.body;
        if (!roomId) {
            return res.status(400).json({
                success: false,
                message: "Room id is required"
            });
        }
        const userId = req.user.id;
        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User id is required"
            });
        }
        const room = yield db_1.default.room.findUnique({
            where: {
                id: Number(roomId)
            }
        });
        if (!room) {
            return res.status(400).json({
                success: false,
                message: "Room not found"
            });
        }
        const user = yield db_1.default.user.findUnique({
            where: {
                id: userId
            }
        });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User not found"
            });
        }
        // check user is already in room or not
        const roomUser = yield db_1.default.room.findFirst({
            where: {
                userId: userId
            }
        });
        if (!roomUser) {
            return res.status(400).json({
                success: false,
                message: "User is already in room"
            });
        }
        return res.status(200).json({
            success: true,
            message: "User joined room successfully"
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: `Internal server error (${error})`
        });
    }
});
exports.joinRoom = joinRoom;
const getAllRooms = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const allRooms = yield db_1.default.room.findMany({
            select: {
                roomName: true,
                description: true,
            }
        });
        if (!allRooms) {
            return res.status(400).json({
                success: false,
                message: "Rooms not found"
            });
        }
        return res.status(200).json({
            success: true,
            message: "Rooms found successfully",
            data: allRooms
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: `Internal server error (${error})`
        });
    }
});
exports.getAllRooms = getAllRooms;
// 3. Get room detail using Id
const getRoomDetail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { roomId } = req.params;
        if (!roomId) {
            return res.status(400).json({
                success: false,
                message: "Room id is required"
            });
        }
        const room = yield db_1.default.room.findUnique({
            where: {
                id: Number(roomId)
            }
        });
        if (!room) {
            return res.status(400).json({
                success: false,
                message: "Room not found"
            });
        }
        return res.status(200).json({
            success: true,
            message: "Room found successfully",
            data: room
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: `Internal server error (${error})`
        });
    }
});
exports.getRoomDetail = getRoomDetail;
