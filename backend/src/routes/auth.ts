import express, { Request, Response } from "express";
import { forgetPassword, login, signup } from "../controller/authController";

const router: express.Router = express.Router();

router.post("/signup", signup as any);
router.post("/login", login as any);
router.put("/forget-password", forgetPassword as any);

export default router;
