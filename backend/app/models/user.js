import mongoose from "mongoose";
const userSchema = new mongoose.Schema(
	{
		username: {
			type: String,
			required: true,
			unique: true,
			trim: true,
		},
		password: {
			type: String,
			required: true,
			select: false,
		},
		age: {
			type: Number,
			default: 0,
		},
		role: {
			type: String,
			default: "user",
		},
		email: {
			type: String,
			required: true,
			unique: true,
		},
		active: {
			type: Boolean,
			default: true,
		},
		posts: [{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Post",
		}],
		refreshTokens: [{
			jti: { type: String, required: true },
			createdAt: { type: Date, default: Date.now },
		}],
	},
	{ timestamps: true }
);
export default mongoose.model("User", userSchema);