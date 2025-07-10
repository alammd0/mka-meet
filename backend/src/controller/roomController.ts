import { Request, Response } from "express";
import { v4 } from "uuid";
import prisma from "../lib/db";

interface RequestWithUser extends Request {
  user: { id: number };
}

// 1. create room 
export const createRoom = async (req: RequestWithUser, res: Response) => {
    try{

        console.log(req.body);
        const {roomName, description } = req.body ;
        console.log(roomName, description);
        
        if(!roomName){
            return res.status(400).json({
                success : false,
                message : "Room name is required"
            })
        }

        // create room 
        const roomCreate = await prisma.room.create({
            data : {
                userId : req.user.id,
                roomName : roomName,
                description : description
            }
        })

        if(!roomCreate){
            return res.status(400).json({
                success : false,
                message : "Room not created"
            })
        }

        return res.status(200).json({
            success : true,
            message : "Room created successfully",
            data : roomCreate
        });
    }
    catch(err){
        console.log(err);
        return res.status(500).json({
            succuss : false,
            message : "Internal server error"
        })
    }
}

// 2. Join room
export const joinRoom = async (req: RequestWithUser, res: Response) => {
    try{
        const { roomId } = req.body;
        if(!roomId){
            return res.status(400).json({
                success : false,
                message : "Room id is required"
            })
        }

        const userId = req.user.id;
        if(!userId){
            return res.status(400).json({
                success : false,
                message : "User id is required"
            })
        }   

        const room = await prisma.room.findUnique({
            where : {
                id : Number(roomId)
            }
        })

        if(!room){
            return res.status(400).json({
                success: false,
                message : "Room not found"
            })
        }

        const user = await prisma.user.findUnique({
            where : {
                id : userId
            }
        })

        if(!user){
            return res.status(400).json({
                success : false,
                message : "User not found"
            })
        }

        // check user is already in room or not
        const roomUser = await prisma.room.findFirst({
            where : {
                userId : userId
            }
        })

        if(!roomUser){
            return res.status(400).json({
                success : false,
                message : "User is already in room"
            })
        }

        return res.status(200).json({
            success : true,
            message : "User joined room successfully"
            
        })
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success : false,
            message : `Internal server error (${error})`
        })
    }
}

export const getAllRooms = async (req : Request, res : Response) => {
    try{
        const allRooms = await prisma.room.findMany({
            select : {
                id : true,
                roomName : true,
                description : true,
            }
        });

        if(!allRooms){
            return res.status(400).json({
                success : false,
                message : "Rooms not found"
            })
        }

        return res.status(200).json({
            success : true,
            message : "Rooms found successfully",
            data : allRooms
        })
    }
    catch(error){
        console.error(error);
        return res.status(500).json({
            success : false,
            message : `Internal server error (${error})`
        })
    }
}

// 3. Get room detail using Id
export const getRoomDetail = async (req: RequestWithUser, res: Response) => {
    try{
        const { roomId } = req.params;

        if(!roomId){
            return res.status(400).json({
                success : false,
                message : "Room id is required"
            })
        }

        const room = await prisma.room.findUnique({
            where : {
                id : Number(roomId)
            }
        })

        if(!room){
            return res.status(400).json({
                success : false,
                message : "Room not found"
            })
        }

        return res.status(200).json({
            success : true,
            message : "Room found successfully",
            data : room
        })

    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success : false,
            message : `Internal server error (${error})`
        })
    }
}