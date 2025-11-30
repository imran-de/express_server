import express,{Request, Response} from "express";
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

app.get('/', (req: Request, res:Response) => {
  res.send('Hello World! with Imran')
})

app.post('/', (req: Request, res:Response) => {
    console.log(req.body);
    res.status(200).json({
        success: true,
        message: "API is working",
    })
  })
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
