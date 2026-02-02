import express from "express";
import userRouter from "./userRouter.js";
import postRouter from "./postRouter.js";
import authRouter from "./authRouter.js";
import { queryString } from "../middleware/queryString.js";
import Post from "../models/post.js";
/* 
import User from "../models/user.js";
*/

const router = express.Router();

router.get("/", (req, res) => {
  res.status(200).json({
    message: `${req.method} - Request made`,
    success: true,
  });
});

router.use("/auth", authRouter);
/* 
  This is no longer in use since it was replaced by auth
  This can be used for an admin panel in future?
router.use("/users", queryString(User, 
  {
    path: "posts",
    select: "title content",
  },
), userRouter);
*/

router.use("/posts", queryString(Post, 
  {
    path: "user",
    select: "username",
  },
), postRouter);

export default router;