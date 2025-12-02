import dotenv from "dotenv";
import path from 'path';

dotenv.config({path: path.join(process.cwd(), ".env")}) //! env connect

const config ={
    connection_str: process.env.CONNECTION_STR,
    PORT: process.env.PORT,
    JWT_SECRET: process.env.JWT_SECRET,
}

export default config;