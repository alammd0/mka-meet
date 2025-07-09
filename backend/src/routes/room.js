"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const roomController_1 = require("../controller/roomController");
const router = express_1.default.Router();
router.post("/create-room", auth_1.authenticate, roomController_1.createRoom);
router.post("/join-room", auth_1.authenticate, roomController_1.joinRoom);
router.get("/all-rooms", auth_1.authenticate, roomController_1.getAllRooms);
router.get("/get-room-detail/:roomId", auth_1.authenticate, roomController_1.getRoomDetail);
exports.default = router;
