import mongoose from "mongoose";
const postSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            maxlength: 55,
            trim: true,
        },
        content: {
            type: String,
            required: true,
            maxlength: 500,
            trim: true,
        },
        likes: {
            type: Number,
            default: 0,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        anonymous: {
            type: Boolean,
            default: false,
        },
        hidden: {
            type: Boolean,
            default: false,
        },
        likedBy: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        }],
        dislikedBy: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        }],
    },
    { timestamps: true }
);
export default mongoose.model("Post", postSchema);