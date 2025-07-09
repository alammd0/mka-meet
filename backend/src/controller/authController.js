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
exports.forgetPassword = exports.getuser = exports.login = exports.signup = void 0;
const db_1 = __importDefault(require("../lib/db"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// 1. signup
const signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(req.body);
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }
        // check if user exists or not
        const user = yield db_1.default.user.findUnique({
            where: { email },
        });
        if (user) {
            return res.status(400).json({
                success: false,
                message: "User already exists",
            });
        }
        // //  check password match or not
        // if (password !== confirmPassword) {
        //   return res.status(400).json({
        //     success: false,
        //     message: "Password and confirm password do not match",
        //   });
        // }
        // hashed the password using bcrypt js
        const passwordHash = yield bcryptjs_1.default.hash(password, 10);
        // create user
        const newUser = yield db_1.default.user.create({
            data: {
                email: email,
                name: name,
                password: passwordHash,
            },
        });
        return res.status(200).json({
            success: true,
            message: "User created successfully",
            data: newUser,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
});
exports.signup = signup;
// 2. login
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }
        const user = yield db_1.default.user.findUnique({
            where: {
                email: email,
            },
        });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User not found",
            });
        }
        const isMatch = yield bcryptjs_1.default.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Invalid credentials",
            });
        }
        // then generate token with
        const payload = {
            id: user.id,
            name: user.name,
            email: user.email,
        };
        const token = jsonwebtoken_1.default.sign(payload, process.env.JWT_SECRET, {
            expiresIn: "1d",
        });
        return res.status(200).json({
            success: true,
            message: "User logged in successfully",
            data: {
                user: user,
            },
            token: token,
        });
    }
    catch (err) {
        console.error(err);
        return res.status(502).json({
            success: false,
            message: "Internal server error.",
        });
    }
});
exports.login = login;
// 3. get user
const getuser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // console.log(req.user);
        const user = yield db_1.default.user.findUnique({
            where: {
                id: req.user.id,
            },
        });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User not found",
            });
        }
        return res.status(200).json({
            success: true,
            message: "User found",
            data: user,
        });
    }
    catch (err) {
        console.error(err);
        return res.status(502).json({
            success: false,
            message: "Internal server error.",
        });
    }
});
exports.getuser = getuser;
// 4. forget password
const forgetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () { });
exports.forgetPassword = forgetPassword;
