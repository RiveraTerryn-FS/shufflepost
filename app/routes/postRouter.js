import express from "express";
import {
    getAllPosts,
    getPost,
    createPost,
    editPost,
    deletePost,
} from "../controllers/postController.js";

const router = express.Router();

router.get("/", getAllPosts);
router.post("/", createPost);
router.get("/:postId", getPost);
router.put("/:postId", editPost);
router.delete("/:postId", deletePost);

export default router;
