import mongoose from "mongoose";
import Joi from "joi"
import jwt from "jsonwebtoken"

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true,
        minlength:6,
        maxlength: 64,
    }
})

userSchema.methods.generateAuthToken = function(){
    const jwtPrivatekey = process.env.jwtPrivatekey
    if(!jwtPrivatekey){
        throw new Error("JWT Private Key is not defined")
    }
    const token = jwt.sign({_id:this._id}, jwtPrivatekey)
    return token
}
function validateUser(username:string, password:string){
        const schema = Joi.object({
            username: Joi.string().min(3).max(30).required(),
            password: Joi.string().min(6).max(64).required(),
        });
        return schema.validate({username, password})    
}

const UserModel = mongoose.model("User", userSchema)

export {UserModel, validateUser}