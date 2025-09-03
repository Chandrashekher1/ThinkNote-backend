import express from "express";
import jwt from "jsonwebtoken";
import { ContentModel, LinkModel, UserModel, TagModel } from "./db";
import cors from "cors";
import { JWT_PASSWORD } from "./config";
import { userMiddleware } from "./middleware"
import { random } from "./utils";
import cron from 'node-cron';


const app = express();
app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    res.send('Cron schedule active');
});

// @ts-ignore
app.post("/api/v1/signup", async (req, res) => {
    const { username, password } = req.body;
    try {
        const existingUser = await UserModel.findOne({ username });

        if (existingUser) {
        return res.status(411).json({ message: "User already exists" });
        }

        await UserModel.create({ username, password });

        res.json({success: true, message: "User signed up" });
    } catch (e) {
        //@ts-ignore
        console.error("Signup error:", e.message);
        res.status(500).json({ message: "Something went wrong" });
    }

});


app.post("/api/v1/signin", async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    const existingUser = await UserModel.findOne({
        username,
        password
    })
    if (existingUser) {
        const token = jwt.sign({
            id: existingUser._id
        }, JWT_PASSWORD)

        res.json({
            token
        })
    } else {
        res.status(403).json({
            message: "Incorrrect credentials"
        })
    }
})



app.post("/api/v1/content", userMiddleware, async (req, res) => {
  const { link, type, title, content, tags = [] } = req.body;
  // @ts-ignore
  const userId = req.userId;

  try {
    const tagObjectIds = [];
    for (const tagName of tags) {
      let tag = await TagModel.findOne({ name: tagName, userId });

      if (!tag) {
        tag = await TagModel.create({ name: tagName, userId });
      }
      tagObjectIds.push(tag._id);
    }
    

    await ContentModel.create({
      link,
      type,
      title,
      content,
      userId,
      tags: tagObjectIds
    });

    res.json({ message: "Content added" });

  } catch (error) {
    console.error("Error adding content:", error);
    res.status(500).json({ error: "Failed to add content" });
  }
});

app.get("/api/v1/tags", userMiddleware, async (req, res) => {
    // @ts-ignore
    const userId = req.userId;
    try {
        const tags = await TagModel.find({ userId });
        res.json({ tags });
    } catch (error) {
        console.error("Error fetching tags:", error);
        res.status(500).json({ error: "Failed to fetch tags" });
    }
});

app.get("/api/v1/content", userMiddleware, async (req, res) => {
    // @ts-ignore
    const userId = req.userId;
    const content = await ContentModel.find({
        userId: userId
    }).populate("userId", "username")
    res.json({
        content
    })
})

// @ts-ignore
app.patch("/api/v1/content", userMiddleware, async (req, res) => {
    try {
        const { contentId, updateData } = req.body;

        const content = await ContentModel.findOneAndUpdate(
        // @ts-ignore
            { _id: contentId, userId: req.userId },     
            updateData,
            { new: true } 
        );

        if (!content) {
            return res.status(404).json({ error: "Content not found or not authorized" });
        }

        res.json({ content });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Something went wrong" });
    }
});

// @ts-ignore
app.delete("/api/v1/content", userMiddleware, async (req, res) => {
  const contentId = req.body.contentId;

  if (!contentId) {
    return res.status(400).json({ message: "Content ID is required" });
  }

  try {
    const deletedContent = await ContentModel.findOneAndDelete({
      _id: contentId,
      // @ts-ignore
      userId: req.userId
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

// @ts-ignore
app.post("/api/v1/brain/share", userMiddleware, async (req, res) => {
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
        await LinkModel.create({ userId: req.userId, hash }); // @ts-ignore
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

// @ts-ignore
app.get("/api/v1/brain/:shareLink", async (req, res) => {
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

app.listen(process.env.PORT,  () => {
    console.log(`Server is running on port ${process.env.PORT}`)
});