import mongoose from "mongoose";
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      trim: true,
      unique: true,
      minlength: 3,
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
    },

    age: {
      type: Number,
      min: 13,
    },

    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);
export default mongoose.model("User", userSchema);