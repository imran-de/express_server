import express,{NextFunction, request, Request, response, Response} from "express";
import {Pool} from "pg"; //! fpr connecting postGres
import dotenv from "dotenv";
import path from 'path';

dotenv.config({path: path.join(process.cwd(), ".env")}) //! env connect

const app = express();
const port = 5000;

//parser addd
app.use(express.json());
app.use(express.urlencoded()); //! for from data use

// * DB
const pool = new Pool({
    connectionString: `${process.env.CONNECTION_STR}`,
});

const initDB = async () => {
    try {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          name VARCHAR(100) NOT NULL,
          email VARCHAR(150) UNIQUE NOT NULL,
          age INT,
          phone VARCHAR(15),
          address TEXT,
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
        )
      `);

      await pool.query(`
        CREATE TABLE IF NOT EXISTS todos(
        id SERIAL PRIMARY KEY,
        user_id INT REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(200) NOT NULL,
        description TEXT,
        completed BOOLEAN DEFAULT FALSE,
        due_date DATE,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
        )
        `)
      console.log("Users table created");
    } catch (err) {
      console.error("Error creating table", err);
    }
  };

initDB();

// ! logger middleware
const logger =(req: Request, res: Response, next: NextFunction) =>{

    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}\n`)

    next();
}

app.get('/', logger, (req: Request, res:Response) => {
  res.send('Hello World! with Imran')
})

//  users CRUD
app.post('/users', async(req: Request, res:Response) => {
    const {name, email} = req.body;

    try{
        const result = await pool.query(`INSERT INTO users(name, email) VALUES($1,$2) RETURNING *`, [name, email]);

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
  })

// users get

app.get("/users", async(req: Request, res: Response)=>{
    try{
        const result = await pool.query(`SELECT * FROM users`);
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
})
// single users data fetch
app.get("/users/:id", async(req: Request, res: Response)=>{
    try{
        const id = req.params.id;
        const result = await pool.query(`SELECT * FROM users WHERE id=$1`, [id]);
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
})

// single users data update
app.put("/users/:id", async(req: Request, res: Response)=>{
    const {name, email} = req.body;
    const id = req.params.id;

    try{
        const result = await pool.query(`UPDATE users SET name=$1, email=$2 WHERE id=$3 RETURNING *`, [name,email,id]);
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
})

// single users data delete
app.delete("/users/:id", async(req: Request, res: Response)=>{
    
    const id = req.params.id;

    try{
        const result = await pool.query(`DELETE FROM users WHERE id=$1`, [id]);
        console.log(result);
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
})

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
