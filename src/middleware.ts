import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import * as dotenv from "dotenv"
dotenv.config();

export function auth(req: Request, res: Response, next: NextFunction) {
    const token = req.header('Authorization') // for authorization
    if(!token) return res.status(401).send("Access denied. No token provided.")
    try{
        const jwtPrivateKey = process.env.jwtPrivateKey;
        if (!jwtPrivateKey) {
            return res.status(500).send('JWT private key is not configured');
        }
        const decoded = jwt.verify(token, jwtPrivateKey)
        // @ts-ignore
        req.userId = decoded._id
        next()
    }
    catch(err){
        res.status(400).send('Invalid token.')
    }
}