import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.js";
import {
	signAccessToken,
	signRefreshToken,
	newJti,
	refreshCookieOptions,
} from "../utils/authToken.js";

// REGISTER
export const register = async (req, res, next) => {
	try {
		const { username, password, email, age = 0 } = req.body;
		// Username, Password, and Email must be set
		if (!username || !password || !email) {
			return res.status(400).json({
				success: false,
				error: "Username, email address, and password required",
			});
		}
		// Check if username or email exists
		const exists = await User.findOne({
			$or: [{ username }, { email }],
		});
		if (exists) {
			return res.status(409).json({
				success: false,
				error: "Username or email already exists",
			});
		}
		// Hash password
		const hashed = await bcrypt.hash(password, 12);
		// Create user
		const user = await User.create({
			username,
			email,
			password: hashed,
			age,
		});

		const accessToken = signAccessToken(user);

		const jti = newJti();
		const refreshToken = signRefreshToken(user, jti);

		user.refreshTokens.push({ jti });
		await user.save();
		// Refresh cookie
		res.cookie("refreshToken", refreshToken, refreshCookieOptions);

		return res.status(201).json({
			success: true,
			token: accessToken,
			user: {
				id: user._id,
				username: user.username,
				email: user.email,
				role: user.role,
			},
		});
	} catch (err) {
		next(err);
	}
};


// LOGIN
export const login = async (req, res, next) => {
	try {
		const { username, password } = req.body;

		const user = await User.findOne({ username }).select("+password");
		if (!user) return res.status(401).json({ success: false, error: "Incorrect username or password" });
		const match = await bcrypt.compare(password, user.password);
		if (!match) return res.status(401).json({ success: false, error: "Incorrect username or password" });

		const accessToken = signAccessToken(user);

		const jti = newJti();
		const refreshToken = signRefreshToken(user, jti);

		user.refreshTokens.push({ jti });
		await user.save();

		res.cookie("refreshToken", refreshToken, refreshCookieOptions);

		return res.status(200).json({
		success: true,
		token: accessToken,
		user: { id: user._id, username: user.username, role: user.role },
		});
	} catch (err) {
		next(err);
	}
};
// REFRESH TOKEN
export const refresh = async (req, res) => {
	const token = req.cookies?.refreshToken;
	if (!token) return res.status(401).json({ success: false, error: "No refresh token" });
	try {
		const decoded = jwt.verify(token, process.env.REFRESH_SECRET);
		const { id, jti } = decoded;

		const user = await User.findById(id);
		// check if user exit
		if (!user) return res.status(401).json({ success: false, error: "Invalid session" });

		// check token exists
		const exists = user.refreshTokens.some((t) => t.jti === jti);
		if (!exists) return res.status(401).json({ success: false, error: "Session revoked" });
		// remove old jti
		user.refreshTokens = user.refreshTokens.filter((t) => t.jti !== jti);
		const newTokenId = newJti();
		user.refreshTokens.push({ jti: newTokenId });
		await user.save();

		const newRefreshToken = signRefreshToken(user, newTokenId);
		res.cookie("refreshToken", newRefreshToken, refreshCookieOptions);

		const newAccessToken = signAccessToken(user);

		return res.status(200).json({ success: true, token: newAccessToken });
	} catch (e) {
		return res.status(401).json({ success: false, error: "Invalid or expired refresh token" });
	}
};
// LOGOUT
export const logout = async (req, res) => {
	const token = req.cookies?.refreshToken;

	// Clear the cookie
	res.clearCookie("refreshToken", { ...refreshCookieOptions, path: "/api/v1/auth/refresh" });
	if (!token) return res.status(200).json({ success: true });
	try {
		const decoded = jwt.verify(token, process.env.REFRESH_SECRET);
		const user = await User.findById(decoded.id);
		if (user) {
		user.refreshTokens = user.refreshTokens.filter((t) => t.jti !== decoded.jti);
		await user.save();
		}
	} catch { }
	return res.status(200).json({ success: true });
};
