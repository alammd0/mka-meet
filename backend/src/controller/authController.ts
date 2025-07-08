import prisma from "../lib/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Response } from "express";

interface Request {
  body: {
    name: string;
    email: string;
    password: string;
  };
}

interface RequestWithUser extends Request {
  user: { id:number };
}

// 1. signup
export const signup = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // check if user exists or not
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (user) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    // hashed the password using bcrypt js
    const passwordHash = await bcrypt.hash(password, 10);

    // create user
    const newUser = await prisma.user.create({
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
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// 2. login
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const user = await prisma.user.findUnique({
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

    const isMatch = await bcrypt.compare(password, user.password);

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

    const token = jwt.sign(payload, process.env.JWT_SECRET as string, {
      expiresIn: "1d",
    });

    return res.status(200).json({
      success: true,
      message: "User logged in successfully",
      data: {
        token: token,
      },
    });

  } catch (err) {
    console.error(err);
    return res.status(502).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

// 3. get user
export const getuser = async (req: RequestWithUser, res: Response) => {
    try{
        // console.log(req.user);
        const user = await prisma.user.findUnique({
            where:{
                id: req.user.id
            }
        })

        if(!user){
            return res.status(400).json({
                success: false,
                message: "User not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "User found",
            data: user
        })
    }catch(err){
        console.error(err);
        return res.status(502).json({
            success: false,
            message: "Internal server error.",
        });
    }
}


// 4. forget password
export const forgetPassword = async (req: Request, res: Response) => {}
