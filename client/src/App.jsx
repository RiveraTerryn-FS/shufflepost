import { Routes, Route } from "react-router-dom";
import styled from "styled-components";

import GStyles from "./components/GStyles";
import Header from "./components/Header";
import Footer from "./components/Footer";
import PublicRoute from "./components/PublicRoute";
import LoadingScreen from "./components/LoadingScreen";

import { useAuth } from "./context/AuthContext";

import Home from "./pages/Home";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import NotFound from "./pages/NotFound";

function App() {
	const { loading } = useAuth();
	if (loading) {
		return <LoadingScreen />;
	}
	return (
		<AppContainer>
			<GStyles />
			<Header />
			<MainContainer>
				<Routes>
					<Route
						path="/"
						element={<Home />}
					/>
					<Route
						path="/auth/login"
						element={
							<PublicRoute>
								<Login />
							</PublicRoute>
						}
					/>
					<Route
						path="/auth/register"
						element={
							<PublicRoute>
								<Register />
							</PublicRoute>
						}
					/>
					<Route path="*" element={<NotFound />} />
				</Routes>
			</MainContainer>
			<Footer />
		</AppContainer>
	);
}
export default App;


/* ---------------- Styled Components ---------------- */

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
`;

const MainContainer = styled.main`
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  background: ${({ theme }) => theme.bg};
  color: ${({ theme }) => theme.text};
`;
