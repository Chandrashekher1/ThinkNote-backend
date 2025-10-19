import express from "express"
import { UserModel, validateUser } from "../models/user.model"
import bcrypt from "bcrypt"

const router = express.Router()

// @ts-ignore
router.post('/api/v1/signup', async(req,res) => {
    try{
        const {error} = validateUser(req.body.username, req.body.password)
        if (error){
            return res.status(400).send({message: error.details[0].message})
        }

        let user = await UserModel.findOne({username: req.body.username})
        if(user) return res.status(400).json({success: false, message: "username already exists"})
        
        user = new UserModel({
            username: req.body.username,
            password: req.body.password
        })

        const salt = await bcrypt.genSalt(10)
        user.password = await bcrypt.hash(req.body.password, salt)
        user = await user.save()
        // @ts-ignore
        const token = user.generateAuthToken()
        res.status(200).json({success: true, message: "User created successfully", data: user, token})
    }
    catch(err: any){
        res.status(500).json({success: false, message: "Registration failed", error: err.message})
    }
})

export default router