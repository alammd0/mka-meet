import express from "express";
import { forgetPassword, getuser, login, signup } from "../controller/authController";
import { authenticate } from "../middleware/auth";

const router: express.Router = express.Router();

router.post("/signup", signup as any);
router.post("/login", login as any);
router.get("/me", authenticate as any, getuser as any);
router.put("/forget-password", forgetPassword as any);

export default router;
