import express from "express"
import { LinkModel } from "../models/link.model";
import { ContentModel } from "../models/content.model";
import { UserModel } from "../models/user.model";
import { auth } from "../middleware";

const router = express.Router()

// @ts-ignore
router.get("/api/v1/brain/:shareLink", auth, async (req, res) => {
    const hash = req.params.shareLink;
    const link = await LinkModel.findOne({
        hash
    });

    if (!link) {
        res.status(411).json({
            message: "Sorry incorrect input"
        })
        return;
    }
    // userId
    const content = await ContentModel.find({
        userId: link.userId
    })

    const user = await UserModel.findOne({
        _id: link.userId
    })
    if (!user) {
        res.status(411).json({
            message: "user not found"
        })
        return;
    }
    res.json({
        username: user.username,
        content: content
    })

})

// @ts-ignore
router.post("/api/v1/brain/share", auth, async (req, res) => {
  try {
    const { share } = req.body;

    if (typeof share === "boolean") {
        // @ts-ignore
      const existingLink = await LinkModel.findOne({ userId: req.userId });

      if (share && existingLink) {
        return res.json({ hash: existingLink.hash });
      }

      if (share) {
        // @ts-ignore
        const hash = random(10);
        // @ts-ignore
        await LinkModel.create({ userId: req.userId, hash }); 
        return res.json({ hash });
      }

      // @ts-ignore
      await LinkModel.deleteOne({ userId: req.userId });
      return res.json({ message: "Removed link" });
    }

    return res.status(400).json({ message: "Invalid share flag" });
  } catch (err) {
    console.error("Share error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
