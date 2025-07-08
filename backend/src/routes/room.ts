import express from "express";
import { authenticate } from "../middleware/auth";
import { createRoom, getRoomDetail, joinRoom } from "../controller/roomController";

const router: express.Router = express.Router();

router.post("/create-room", authenticate as any, createRoom as any);
router.post("/join-room", authenticate as any, joinRoom as any);
router.get("/get-room-detail/:roomId", authenticate as any, getRoomDetail as any);

export default router;
