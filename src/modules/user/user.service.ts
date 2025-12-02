import { pool } from "../../config/db";
import bcrypt from "bcryptjs";

// insert user
const createUser = async (payload: Record<string, unknown>) => {
    const {name, email, password} = payload;

    const hashedPass = await bcrypt.hash(password as string, 10);

    const result = await pool.query(`INSERT INTO users(name, email, password) VALUES($1,$2,$3) RETURNING *`, [name, email, hashedPass]);

    return result;
}
// get all user
const getUser = async() =>{
    const result = await pool.query(`SELECT * FROM users`);

    return result;
}
// get single user
const getSingleUser = async(id: string) =>{
    const result = await pool.query(`SELECT * FROM users WHERE id=$1`, [id]);

    return result;
}
// update single user
const updateUser = async (name:string, email:string, id:string)=>{

    const result = await pool.query(`UPDATE users SET name=$1, email=$2 WHERE id=$3 RETURNING *`, [name,email,id]);

    return result;
}

// user delte
const deleteUser = async(id:string) =>{
    const result = await pool.query(`DELETE FROM users WHERE id=$1`, [id]);

    return result;
}

export const userServices ={
    createUser,
    getUser,
    getSingleUser,
    updateUser,
    deleteUser,
}