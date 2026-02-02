import { useAuth } from "@/context/AuthContext";
import LoadingScreen from "./LoadingScreen";

export function AuthLoading({ children }) {
	const { loading } = useAuth();

	if (loading) {
		return <LoadingScreen />;
	}

	return children;
}