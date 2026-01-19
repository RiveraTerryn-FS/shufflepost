import mongoose from "mongoose";
import Post from "../models/post.js";
import User from "../models/user.js";
// Get all posts
// Populates the user field so we can see the username instead of just the ID
export const getAllPosts = async (req, res, next) => {
    try {
        const posts = await Post.find().populate("user", "username");

        res.status(200).json({
            success: true,
            data: posts,
        });
    } catch (err) {
        next(err);
    }
};
// Get a single post by ID
// Uses the ID passed through the route params
export const getPost = async (req, res, next) => {
    try {
        const { postId } = req.params;
        const post = await Post.findById(postId).populate("user", "username");
        // If the post doesn't exist, return a 404
        if (!post) {
            return res.status(404).json({
                success: false,
                error: "Post not found",
            });
        }
        res.status(200).json({
            success: true,
            data: post,
        });
    } catch (err) {
        next(err);
    }
};
// Create a new post
// Verifies the user exists before allowing the post to be created
export const createPost = async (req, res, next) => {
    try {
        const { user } = req.body;
        // Make sure a user ID was provided
        if (!user) {
            return res.status(400).json({
                success: false,
                error: "User field is required",
            });
        }
        // Check that the user ID is a valid MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(user)) {
            return res.status(400).json({
                success: false,
                error: "Invalid user ID format",
            });
        }
        // Confirm the user exists in the database
        const userExists = await User.findById(user);
        if (!userExists) {
            return res.status(400).json({
                success: false,
                error: "User does not exist",
            });
        }
        const post = await Post.create(req.body);
        res.status(201).json({
            success: true,
            data: post,
        });
    } catch (err) {
        next(err);
    }
};
// Update an existing post
// Applies updates using the post ID from the route params
export const editPost = async (req, res, next) => {
    try {
        const { postId } = req.params;
        const updatedPost = await Post.findByIdAndUpdate(
            postId,
            req.body,
            {
                new: true, // return the updated document
                runValidators: true // enforce schema validation
            }
        );
        if (!updatedPost) {
            return res.status(404).json({
                success: false,
                error: "Post not found",
            });
        }
        res.status(200).json({
            success: true,
            data: updatedPost,
        });
    } catch (err) {
        next(err);
    }
};
// Delete a post by ID
// Removes the post from the database entirely
export const deletePost = async (req, res, next) => {
    try {
        const { postId } = req.params;
        const deletedPost = await Post.findByIdAndDelete(postId);
        if (!deletedPost) {
            return res.status(404).json({
                success: false,
                error: "Post not found",
            });
        }
        res.status(200).json({
            success: true,
            message: "Post deleted successfully",
            data: deletedPost,
        });
    } catch (err) {
        next(err);
    }
};