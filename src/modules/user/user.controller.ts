import { Request, Response } from "express";
import { pool } from "../../config/db";
import { userServices } from "./user.service";

const createUser = async(req: Request, res:Response) => {
    const {name, email, password} = req.body;

    try{
        const result = await userServices.createUser(req.body);

        // console.log(result.rows[0]);

        res.status(201).json({success: true,message: "Data inserted successfully", data: result.rows[0]})
    }catch(err: any){
        res.status(500).json({
            success: false,
            message: err.message
        })
    }

    // console.log(req.body);
    // res.status(200).json({
    //     success: true,
    //     message: "API is working",
    // })
  }

//   get user
  const getUser = async (req: Request, res: Response)=>{
    try{
        const result = await userServices.getUser();
        res.status(200).json({
            success: true,
            message: "Users fetched successfully",
            data: result.rows,
        })

    }catch(err: any){
        res.status(500).json({
            success: false,
            message: err.message,
            details: err
        })
    }
}

// single user get
const getSingleUser = async(req: Request, res: Response)=>{
    try{
        const id = req.params.id;
        const result = await userServices.getSingleUser(id as string);
        if(result.rows.length === 0){
            res.status(404).json({
                success: false,
                message: "Users not found",
                })
        }else{
        res.status(200).json({
            success: true,
            message: "Users fetched successfully",
            data: result.rows[0],
        })
    }

    }catch(err: any){
        res.status(500).json({
            success: false,
            message: err.message,
            details: err
        })
    }
}

// update single user
const updateUser = async(req: Request, res: Response)=>{
    const {name, email} = req.body;
    const id = req.params.id;

    try{
        const result = await userServices.updateUser(name, email, id as string);
        if(result.rows.length === 0){
            res.status(404).json({
                success: false,
                message: "Users not found",
                })
        }else{
        res.status(200).json({
            success: true,
            message: "Users updated successfully",
            data: result.rows[0],
        })
    }

    }catch(err: any){
        res.status(500).json({
            success: false,
            message: err.message,
            details: err
        })
    }
}

// delete user
const deleteUser = async(req: Request, res: Response)=>{
    
    const id = req.params.id;

    try{
        const result = await userServices.deleteUser(id!);
        // console.log(result);
        if(result.rowCount === 0){
            res.status(404).json({
                success: false,
                message: "Users not found",
                })
        }else{
        res.status(200).json({
            success: true,
            message: "Users deleted successfully",
            data: null,
        })
    }

    }catch(err: any){
        res.status(500).json({
            success: false,
            message: err.message,
            details: err
        })
    }
}

  export const userControllers ={
    createUser,
    getUser,
    getSingleUser,
    updateUser,
    deleteUser,
  }