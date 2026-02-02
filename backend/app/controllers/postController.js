import mongoose from "mongoose";
import Post from "../models/post.js";
import User from "../models/user.js";

// Get user data
// Get the users data and posts to view in homepage
export const getUserPosts = async (req, res, next) => {
	try {
		const userId = req.user.id;
    	const limit = 5;
		const page = parseInt(req.query.page, 10) || 1;
		const skip = (page - 1) * limit;
		const posts = await Post.find({ user: userId })
			.sort({ createdAt: -1 })
			.skip(skip)
			.limit(limit)
			.select("title content hidden anonymous createdAt likes");
		const total = await Post.countDocuments({ user: userId });
		res.status(200).json({
			success: true,
			data: posts,
			pagination: {
				page,
				limit,
				total,
				hasMore: skip + posts.length < total,
			},
		});
	} catch (err) {
		next(err);
	}
};
// Get Random Posts
// Get 10 rnadom posts to display on the homepage/index
export const getRandomPosts = async (req, res, next) => {
    try {
        const userId = req.user?.id;

		const match = userId ? 
			{
				hidden:false,
				user: { $ne: new mongoose.Types.ObjectId(userId) },
			} : { 
				hidden: false,
			};
		
        const posts = await Post.aggregate([
            { $match: match},
            { $sample: { size: 10 } },
            {
                $lookup: {
                    from: "users",
                    localField: "user",
                    foreignField: "_id",
                    as: "user",
                },
            },
            { $unwind: "$user" },
            {
                $project: {
                    title: 1,
                    content: 1,
                    likes: 1,
                    anonymous: 1,
                    createdAt: 1,
                    "user.username": 1,
                    "user._id": 1,
                    likedBy: 1,
                    dislikedBy: 1,
                },
            },
        ]);
       const cleanPosts = posts.map(post => {
            let userLiked = null;
           
            if (userId) {
               if (post.likedBy?.some(u => u.toString() === userId)) {
                    userLiked = "up";
                } else if (post.dislikedBy?.some(u => u.toString() === userId)) {
                    userLiked = "down";
                }
            }
            delete post.likedBy;
            delete post.dislikedBy;
            return {
                ...post,
                user: (post.anonymous ? { _id: null, username: "Anonymous" } : post.user),
                userLiked,
            };
        });
        res.status(200).json({
            success: true,
            count: posts.length,
            data: cleanPosts,
        });
    } catch (err) {
        next(err);
    }
};
// Create a new post
// Verifies the user exists before allowing the post to be created
export const createPost = async (req, res, next) => {
	try {
		const userId = req.user.id;
        const { title, content, hidden = 0, anonymous = 0} = req.body;

		if (!mongoose.Types.ObjectId.isValid(userId)) {
			return res.status(400).json({
				success: false,
				error: "Invalid user ID",
			});
		}
		const userExists = await User.findById(userId);
		if (!userExists) {
			return res.status(401).json({
				success: false,
				error: "User not found",
			});
		}
		const post = await Post.create({
			content: content,
            title: title,
			user: userId,
            anonymous: anonymous,
            hidden: hidden,
		});
		await User.findByIdAndUpdate(
			userId,
			{ $addToSet: { posts: post._id } }
		);

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
        const userId = req.user.id;
        const { postId } = req.params;
        const { hidden, anonymous } = req.body;
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({
                success: false,
                error: "Post not found",
            });
        }
        // Make sure the user owns the posts
        if (post.user.toString() !== userId) {
            return res.status(403).json({
                success: false,
                error: "Not authorized to edit this post",
            });
        }
        // Update only hidden or anonymouse fields
        if (typeof hidden === "boolean") post.hidden = hidden;
        if (typeof anonymous === "boolean") post.anonymous = anonymous;
        await post.save();
        res.status(200).json({
            success: true,
            data: post,
        });
    } catch (err) {
        next(err);
    }
};
// Delete a post by ID
// Removes the post from the database entirely
export const deletePost = async (req, res, next) => {
	try {
		const userId = req.user.id;
		const { postId } = req.params;
		const post = await Post.findById(postId);
		if (!post) {
			return res.status(404).json({
				success: false,
				error: "Post not found",
			});
		}
        // Check to make sure the user owns post
		if (post.user.toString() !== userId) {
			return res.status(403).json({
				success: false,
				error: "Not authorized to delete this post",
			});
		}
		await post.deleteOne();
		res.status(200).json({
			success: true,
			data: { _id: postId },
		});
	} catch (err) {
		next(err);
	}
};

// Like or dislike a post 
// Allows a logged in user to like or dislike a post
export const likePost = async (req, res, next) => {
	try {
		const userId = req.user.id;
		const { postId } = req.params;
		let { userLiked } = req.body;
		if (!["up", "down"].includes(userLiked)) {
			return res.status(400).json({
				success: false,
				error: "Must be 'up' for like or 'down' for dislike",
			});
		}
		if (!mongoose.Types.ObjectId.isValid(postId)) {
			return res.status(400).json({
				success: false,
				error: "Invalid post ID",
			});
		}
		const post = await Post.findById(postId);
		if (!post || post.hidden) {
			return res.status(404).json({
				success: false,
				error: "Post not found",
			});
		}
		const liked = post.likedBy.some(id => id.toString() === userId);
        const disliked = post.dislikedBy.some(id => id.toString() === userId);
		if (liked) {
			post.likedBy.pull(userId);
			post.likes -= 1;
		}
		if (disliked) {
			post.dislikedBy.pull(userId);
			post.likes += 1;
		}
		if (userLiked === "up" && !liked) {
			post.likedBy.push(userId);
			post.likes += 1;
		}
		if (userLiked === "down" && !disliked) {
			post.dislikedBy.push(userId);
			post.likes -= 1;
		}
        const nowLiked = post.likedBy.some(id => id.toString() === userId);
        const nowDisliked = post.dislikedBy.some(id => id.toString() === userId);

        if (!nowLiked && !nowDisliked) {
            userLiked = null;
        }
		await post.save();
		res.status(200).json({
			success: true,
			likes: post.likes,
			liked: userLiked,
		});
	} catch (err) {
		next(err);
	}
};
