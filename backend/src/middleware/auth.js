"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authenticate = (req, res, next) => {
    var _a, _b, _c;
    try {
        const token = ((_a = req.body) === null || _a === void 0 ? void 0 : _a.token) ||
            ((_b = req.header("Authorization")) === null || _b === void 0 ? void 0 : _b.replace("Bearer ", "")) ||
            ((_c = req.cookies) === null || _c === void 0 ? void 0 : _c.token);
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
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
            // console.log("Decoded token:", decoded);
            req.user = decoded;
            next();
        }
        catch (err) {
            console.log(err);
            return res.status(401).json({
                success: false,
                message: "Invalid or expired token",
            });
        }
    }
    catch (error) {
        console.error(error);
    }
};
exports.authenticate = authenticate;
