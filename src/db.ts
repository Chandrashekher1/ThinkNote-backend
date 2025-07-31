import mongoose, {model, Schema} from "mongoose";
import * as dotenv from 'dotenv';
dotenv.config();

mongoose.connect(process.env.MONGO_URI)
.catch((err) => console.log(err.message)
).then(() => {console.log("mongodb connected.");
})

const UserSchema = new Schema({
    username: {type: String, unique: true},
    password: String
})

export const UserModel = model("User", UserSchema);

const TagSchema = new Schema({
  name: { type: String, required: true, unique: true },
  userId: { type: mongoose.Types.ObjectId, ref: 'User', required: true }
});
export const TagModel = model("Tag", TagSchema);

const ContentSchema = new Schema({
    title: String,
    link: String,
    tags: [{type: mongoose.Types.ObjectId, ref: 'Tag',required:true}],
    content: {type:String},
    type: String,
    userId: {type: mongoose.Types.ObjectId, ref: 'User', required: true },
})

const LinkSchema = new Schema({
    hash: String,
    userId: {type: mongoose.Types.ObjectId, ref: 'User', required: true, unique: true },
})

export const LinkModel = model("Links", LinkSchema);
export const ContentModel = model("Content", ContentSchema);