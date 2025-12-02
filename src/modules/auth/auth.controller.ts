import { Request, Response } from "express";
import { authServices } from "./auth.service";

const logginUser = async(req: Request, res: Response)=>{

    const {email, password} = req.body;
    try{
        const result = await authServices.logginUser(email, password);
        res.status(200).json({
            success: true,
            message: "Loggin successfully",
            data: result,
        })

    }catch(err: any){
        res.status(500).json({
            success: false,
            message: err.message,
            details: err
        })
    }
}

export const authController ={
    logginUser,
}