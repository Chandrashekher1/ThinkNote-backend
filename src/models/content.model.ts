import mongoose from "mongoose";

const contentSchema = new mongoose.Schema({
    type: {
        type:String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
    },
    link:{
        type: String,
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const ContentModel = mongoose.model("Content", contentSchema);

export { ContentModel };