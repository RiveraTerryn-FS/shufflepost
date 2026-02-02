import { useState, useEffect } from "react";
import styled from "styled-components";
import Button from "/src/components/Button";
import { useNavigate, Link } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";
import {
	MessageBox,
	GlobalSectionSmallest,
	GlobalCard,
	GlobalInput,
	GlobalDivider,
	GlobalEyeToggleInputGroup,
	GlobalEyeToggle,
} from "/src/components/GStyles";
import { useAuth } from "/src/context/AuthContext";

function Login() {
	const API_URL = import.meta.env.VITE_API_URL;
	const navigate = useNavigate();
	const { login, isAuthenticated } = useAuth();
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [error, setErrorMsg] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	// Redirect if already logged in
	useEffect(() => {
		if (isAuthenticated) {
			navigate("/", { replace: true });
		}
	}, [isAuthenticated, navigate]);

	const handleLogin = async (e) => {
		e.preventDefault();
		setErrorMsg("");
		try {
			const res = await fetch(`${API_URL}auth/login`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				credentials: "include",
				body: JSON.stringify({ username, password }),
			});
			if (!res.ok) {
				const msg = await res.text();
				throw new Error(msg || "Login failed");
			}
			const data = await res.json();
			login({
				token: data.token,
				user: data.user,
			});
			navigate("/", { replace: true });
		} catch (err) {
			console.error(err);
			setErrorMsg("The username or password is incorrect");
		}
	};
	return (
		<GlobalSectionSmallest>
			<GlobalCard>
				<Header>
					<h2>Login</h2>
					<p>Sign in to your account.</p>
				</Header>
				<form onSubmit={handleLogin}>
					{error && <MessageBox $type="error">{error}</MessageBox>}
					<Field>
						<label htmlFor="username">Username</label>
						<GlobalInput
							type="text"
							id="username"
							name="username"
							placeholder="Username"
							autoComplete="username"
							value={username}
							onChange={(e) => setUsername(e.target.value)}
							required
						/>
					</Field>
					<Field>
						<label htmlFor="password">Password</label>
						<GlobalEyeToggleInputGroup>
							<GlobalInput
								type={showPassword ? "text" : "password"}
								id="password"
								name="password"
								placeholder="Password"
								autoComplete="current-password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								required
							/>
							<GlobalEyeToggle
								type="button"
								onClick={() => setShowPassword((prev) => !prev)}
								aria-label={showPassword ? "Hide password" : "Show password"}
							>
								{showPassword ? <FiEyeOff /> : <FiEye />}
							</GlobalEyeToggle>
						</GlobalEyeToggleInputGroup>
					</Field>
					<Button
						type="submit"
						btnText="Login"
						styles="margin-top:1rem;width:100%;"
					/>
				</form>
				<GlobalDivider />
				<Footer>
					<span>Don't have an account?</span>
					<Link to="/auth/register">Register</Link>
				</Footer>
			</GlobalCard>
		</GlobalSectionSmallest>
	);
}
export default Login;
const Header = styled.div`
	margin-bottom: 1rem;
	p {
		color: ${({ theme }) => theme.textSecondary};
	}
`;
const Field = styled.div`
	display: flex;
	flex-direction: column;
	gap: 0.5rem;
	margin-bottom: 0.5rem;
	label {
		color: ${({ theme }) => theme.textSecondary};
		font-size:14px;
	}
`;
const Footer = styled.div`
	display: flex;
	justify-content: center;
	gap: 0.5rem;
	font-size: 12px;
	color: ${({ theme }) => theme.textSecondary};
	a {
		color: ${({ theme }) => theme.primary};
		font-weight: 500;
		text-decoration: none;
		&:hover {
			text-decoration: underline;
		}
	}
`;
