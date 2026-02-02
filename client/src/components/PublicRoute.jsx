// PublicRoute.jsx
// ------------------------------------------------------
// Prevents logged in users from seeing the login page.
// ------------------------------------------------------
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export default function PublicRoute({ children }) {
	const { isAuthenticated, loading } = useAuth();
	if (loading) return null;
	if (isAuthenticated) {
		return <Navigate to="/" replace />;
	}
	return children;
}