import express,{NextFunction, request, Request, response, Response} from "express";
import {Pool} from "pg"; //! fpr connecting postGres
import config from "./config";
import initDB, { pool } from "./config/db";
import logger from "./middleware/logger";
import { userRoutes } from "./modules/user/user.routes";
import { authRoutes } from "./modules/auth/auth.routes";


const app = express();
const port = config.PORT;

//parser addd
app.use(express.json());
app.use(express.urlencoded()); //! for from data use

// * initializing DB
initDB();

// ! logger middleware
// chack logger middleware

app.get('/', logger, (req: Request, res:Response) => {
  res.send('Hello World! with Imran')
})

//  users CRUD
app.use("/users", userRoutes);


// auth routes
app.use("/auth", authRoutes);

// ! todos CRUD
app.post("/todos", async(req:Request, res: Response)=>{
    const {user_id, title} = req.body;

    try {
        const result = await pool.query(`INSERT INTO todos(user_id, title) VALUES($1,$2) RETURNING *`, [user_id, title])

        res.status(201).json({
            success: true,
            message: "Todos created successfully",
            data: result.rows[0],
        })
        
    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message,
            err: err
        })
    }
})

// users get

app.get("/todos", async(req: Request, res: Response)=>{
    try{
        const result = await pool.query(`SELECT * FROM todos`);
        res.status(200).json({
            success: true,
            message: "Todos fetched successfully",
            data: result.rows,
        })

    }catch(err: any){
        res.status(500).json({
            success: false,
            message: err.message,
            details: err
        })
    }
})


// ! not found route
app.use((req: Request, res: Response)=>{
    res.status(404).json({
        success: false,
        message: "Page not Found",
        path: req.path,
    })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
