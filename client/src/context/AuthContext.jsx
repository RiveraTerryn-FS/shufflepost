import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api/v1/";

export function AuthProvider({ children }) {
	const [token, setToken] = useState(null);
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);
	useEffect(() => {
		const initAuth = async () => {
			try {
				const res = await fetch(`${API_URL}auth/refresh`, {
					method: "POST",
					credentials: "include",
				});
				if (!res.ok) throw new Error("Session Error");
				const data = await res.json();
				setToken(data.token);
				if (data.user) {
					setUser(data.user);
				}
			} catch {
				setToken(null);
				setUser(null);
			} finally {
				setLoading(false);
			}
		};
		initAuth();
	}, []);
	const login = ({ token, user }) => {
		setToken(token);
		setUser(user);
	};
	const logout = async () => {
		try {
			await fetch(`${API_URL}auth/logout`, {
				method: "POST",
				credentials: "include",
			});
		} finally {
			setToken(null);
			setUser(null);
		}
	};
	return (
		<AuthContext.Provider
			value={{
				token,
				user,
				loading,
				login,
				logout,
				isAuthenticated: !!token,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
}
export const useAuth = () => useContext(AuthContext);