import express from "express";
import { optAuthenticateToken, authenticateToken } from "../middleware/authenticate.js";
import {
    createPost,
    editPost,
    deletePost,
    getRandomPosts,
    likePost,
    getUserPosts,
} from "../controllers/postController.js";

const router = express.Router();

router.get("/random", optAuthenticateToken, getRandomPosts);
router.post("/", authenticateToken, createPost);
router.get("/user", 
    authenticateToken,
    getUserPosts
);
router.put("/:postId", authenticateToken, editPost);
router.delete("/:postId", authenticateToken, deletePost);
router.post("/:postId/like", authenticateToken, likePost);

export default router;
