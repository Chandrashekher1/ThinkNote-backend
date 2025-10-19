import express from "express";
import cors from "cors";
import db from "./db";
import startup from "./startup/route";
import * as dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(cors({
    origin: '*', 
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"], 
    allowedHeaders: ["Content-Type", "Authorization"], 
    exposedHeaders: ["Authorization"],
    credentials: true 
}))

startup(app)

db
app.listen(process.env.PORT,  () => {
    console.log(`Server is running on port ${process.env.PORT}`)
});