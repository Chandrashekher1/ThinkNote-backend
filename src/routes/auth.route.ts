import express from 'express';
import { UserModel } from '../models/user.model';
import bcrypt from "bcrypt";

const router = express.Router()

// @ts-ignore
router.post("/api/v1/signin", async (req, res) => {
    try{
        const {username,password} = req.body

        let user = await UserModel.findOne({username})
        if(!user) return res.status(400).json({success: false, message: "username is not registered"})
        
        const validPassword = await bcrypt.compare(password, user.password)
        if(!validPassword) return res.status(400).json({success: false, message: "invalid password"})
        
        // @ts-ignore    
        const token = user.generateAuthToken()
        res.header('Authorization',token).json({
            success: true,
            message: "Login Successful",
            token,
            data: user
        }).status(200)
    }
    catch(err:any){
        res.status(500).json({success: false, message:err.message, error: err.message})
    }
})



export default router