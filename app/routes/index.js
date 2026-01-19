import express from "express";
import userRouter from "./userRouter.js";
import postRouter from "./postRouter.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.status(200).json({
    message: `${req.method} - Request made`,
    success: true,
  });
});

router.use("/users", userRouter);
router.use("/posts", postRouter);

export default router;