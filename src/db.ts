import mongoose from "mongoose";
import * as dotenv from 'dotenv';
dotenv.config();

const db = mongoose.connect(process.env.MONGO_URI)
.catch((err) => console.log(err.message)
).then(() => {console.log("mongodb connected.");
})

export default db