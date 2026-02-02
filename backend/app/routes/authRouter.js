import express from "express";
import {
	login,
	register,
	refresh,
	logout,
} from "../controllers/authController.js";

const router = express.Router();
router.post("/refresh", refresh);
router.post("/logout", logout);
router.post("/login", login);
router.post("/register", register);

export default router;