import jwt from "jsonwebtoken";

export function authenticateToken(req, res, next) {
	const authHeader = req.headers.authorization;
	const token = authHeader && authHeader.split(" ")[1];
	if (!token) {
		return res.status(401).json({
			success: false,
			error: "Token missing",
		});
	}
	jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
		if (err) {
			return res.status(403).json({
				success: false,
				error: "Invalid or expired token",
			});
		}
		req.user = {
			id: decoded.id,
			email: decoded.email,
		};
		next();
	});
}
//  Optional authentication
//  This allows us to use the user ID if logged in to check things
//  such as if the user has liked a post
export function optAuthenticateToken(req, res, next) {
	const authHeader = req.headers.authorization;
	const token = authHeader && authHeader.split(" ")[1];
	if (!token) {
		req.user = null;
		return next();
	}
	jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
		if (err) {
			req.user = null;
			return next();
		}
		req.user = decoded;
		next();
	});
}