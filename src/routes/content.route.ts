import express from "express"
import { ContentModel } from "../models/content.model";
import  {auth}  from "../middleware";

const router = express.Router()
// @ts-ignore
router.get('/api/v1/content',auth, async(req,res) => {
    try{
        const userId = req.userId;
        console.log("Fetching content for user:", userId);
        const content = await ContentModel.find({
            author: userId
        }).populate("author", "username")
        res.json({success: true, data: content})
    } catch (error : any) {
        console.error("Error fetching content:", error);
        res.status(500).json({ success: false, message: "Internal server error" , error: error.message});
    }
})

// @ts-ignore
router.post('/api/v1/content',auth, async(req,res) => {
    try{
        const {link, type, title, content} = req.body;
        const userId = req.userId;
        await ContentModel.create({
            link,
            type,
            title,
            content,
            author : userId
        })
        res.status(200).json({success: true, message: "Content created successfully"})
    } catch (error: any) {
        console.error("Error creating content:", error);
        res.status(500).json({ success: false, message: "Internal server error", error: error.message });
    }
})

// @ts-ignore
router.patch("/api/v1/content/:id", auth, async (req, res) => {
    try {
        const {updateData } = req.body;
        const contentId = req.params.id

        const content = await ContentModel.findOneAndUpdate(
        // @ts-ignore
            { _id: contentId, author: req.userId },     
            updateData,
            { new: true } 
        );
        if (!content) {
            return res.status(404).json({message:"Content not found or not authorized" });
        }
        res.json({ content });
    } catch (err:any) {
        console.error(err);
        res.status(500).json({ error: err.message , message: "Something went wrong" });
    }
});

// @ts-ignore
router.delete("/api/v1/content/:id", auth, async (req, res) => {
  const contentId = req.params.id
  if (!contentId) {
    return res.status(400).json({ message: "Content ID is required" });
  }
  try {
    const deletedContent = await ContentModel.findOneAndDelete({
      _id: contentId,
      // @ts-ignore
      author: req.userId
    });

    if (!deletedContent) {
      return res.status(404).json({ message: "Content not found or unauthorized" });
    }

    res.json({ message: "Deleted content successfully" });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ message: "Server error while deleting content" });
  }
});

export default router;