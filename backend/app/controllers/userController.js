import User from "../models/user.js";
// Get all users
// This is used to return every user in the database
export const getAllUsers = async (req, res, next) => {
    try {
        res.status(200).json(res.results);
    } catch (err) {
        next(err);
    }
};
// Get a single user by ID
// Uses the ID passed in through the route parameters
export const getUser = async (req, res, next) => {
    try {
        const { userId } = req.params;
        const user = await User.findById(userId)
            .select("-password -__v")
            .populate("posts", "title content");
        // If no user is found, return a 404
        if (!user) {
            return res.status(404).json({
                success: false,
                error: "User not found"
            });
        }
        res.status(200).json({
            success: true,
            data: user
        });
    } catch (err) {
        next(err);
    }
};
// Update an existing user
// Finds the user by ID and applies the updates from the request body
export const editUser = async (req, res, next) => {
    try {
        const { userId } = req.params;
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            req.body,
            {
                new: true, // return the updated document
                runValidators: true // make sure schema validation still runs
            }
        );
        if (!updatedUser) {
            return res.status(404).json({
                success: false,
                error: "User not found"
            });
        }
        res.status(200).json({
            success: true,
            data: updatedUser
        });
    } catch (err) {
        next(err);
    }
};
// Delete a user by ID
// Removes the user document from the database
export const deleteUser = async (req, res, next) => {
    try {
        const { userId } = req.params;
        const deletedUser = await User.findByIdAndDelete(userId);
        if (!deletedUser) {
            return res.status(404).json({
                success: false,
                error: "User not found"
            });
        }
        res.status(200).json({
            success: true,
            message: "User deleted successfully",
            data: deletedUser
        });
    } catch (err) {
        next(err);
    }
};