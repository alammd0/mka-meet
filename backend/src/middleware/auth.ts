import { Request, Response, NextFunction } from "express";
import { JsonWebTokenError } from "jsonwebtoken";
import jwt from "jsonwebtoken";

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token =
      req.body?.token ||
      req.header("Authorization")?.replace("Bearer ", "") ||
      req.cookies?.token;

    // console.log("Token inside user - ", token);

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    if (!process.env.JWT_SECRET) {
      return res.status(401).json({
        success: false,
        message: "JWT_SECRET is not defined",
      });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      // console.log("Decoded token:", decoded);
      (req as any).user = decoded;
      next();
    } catch (err) {
      console.log(err);
      return res.status(401).json({
        success: false,
        message: "Invalid or expired token",
      });
    }
  } catch (error) {
    console.error(error);
  }
};
