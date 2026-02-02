import { useState, useEffect } from "react";
import styled from "styled-components";
import Button from "../../components/Button";
import { FiEye, FiEyeOff } from "react-icons/fi";
import {
	MessageBox,
	GlobalSectionSmallest,
	GlobalForm,
	GlobalInput,
	GlobalDivider,
	GlobalEyeToggleInputGroup,
	GlobalEyeToggle,
} from "../../components/GStyles";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const API_URL = import.meta.env.VITE_API_URL;

export default function Register() {
	const navigate = useNavigate();
	const { isAuthenticated, login } = useAuth();
	useEffect(() => {
		if (isAuthenticated) {
			navigate("/", { replace: true });
		}
	}, [isAuthenticated]);
	const [form, setForm] = useState({
		username: "",
		email: "",
		password: "",
		age: "",
	});
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const handleChange = (e) => {
		setForm({ ...form, [e.target.name]: e.target.value });
	};
	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");
		setLoading(true);

		try {
			if (form.age && Number(form.age) < 13) {
				setError("You must be at least 13 years old");
				return;
			}

			const res = await fetch(
				`${API_URL}auth/register`,
				{
					method: "POST",
					headers: { "Content-Type": "application/json" },
					credentials: "include",
					body: JSON.stringify({
						username: form.username,
						email: form.email,
						password: form.password,
						age: Number(form.age),
					}),
				}
			);

			const data = await res.json();
			if (!res.ok) throw new Error(data.error || "Registration failed");
			login({
				token: data.token,
				user: data.user,
			});
			navigate("/", { replace: true });
		} catch (err) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
	};
	return (
		<GlobalSectionSmallest>
			<GlobalForm onSubmit={handleSubmit}>
				<Header>
					<h2>Create account</h2>
					<p>Create a new account to get started.</p>
				</Header>
				{error && <MessageBox type="error">{error}</MessageBox>}
				<Field>
					<label htmlFor="username">Username</label>
					<GlobalInput
						id="username"
						name="username"
						placeholder="Username"
						value={form.username}
						onChange={handleChange}
						autoComplete="username"
						required
					/>
				</Field>
				<Field>
					<label htmlFor="email">Email</label>
					<GlobalInput
						id="email"
						type="email"
						name="email"
						autoComplete="email"
						placeholder="Email Address"
						value={form.email}
						onChange={handleChange}
						required
					/>
				</Field>
				<Field>
					<label htmlFor="password">Password</label>
					<GlobalEyeToggleInputGroup>
						<Input
							type={showPassword ? "text" : "password"}
							id="password"
							name="password"
							autoComplete="new-password"
							placeholder="Password"
							value={form.password}
							onChange={handleChange}
							required
						/>
						<GlobalEyeToggle
							type="button"
							onClick={() => setShowPassword((p) => !p)}
						>
							{showPassword ? <FiEyeOff /> : <FiEye />}
						</GlobalEyeToggle>
					</GlobalEyeToggleInputGroup>
				</Field>
				<Field>
					<label htmlFor="age">Age</label>
					<GlobalInput
						id="age"
						type="number"
						name="age"
						autoComplete="age"
						placeholder="Age"
						value={form.age}
						onChange={handleChange}
					/>
				</Field>
				<Button
					type="submit"
					disabled={loading}
					btnText={loading ? "Creating account…" : "Create account"}
					styles="margin-top:1rem;width:100%;"

				/>
				<GlobalDivider />
				<Footer>
					<span>Already have an account?</span>
					<Link to="/auth/login">Log in</Link>
				</Footer>
			</GlobalForm>
		</GlobalSectionSmallest>
	);
}
/* ---------------- Styled Components ---------------- */
const Header = styled.div`
	margin-bottom: 1rem;
	p {
		color: ${({ theme }) => theme.textSecondary};
	}
`;
const Field = styled.div`
	display: flex;
	flex-direction: column;
	gap: 0.2rem;
	margin-bottom: 0.5rem;
	label {
		font-size: 12px;
		color: ${({ theme }) => theme.textSecondary};
	}
`;
const Footer = styled.div`
	display: flex;
	justify-content: center;
	gap: 0.2rem;
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
const Input = styled.input`
    width:100%;
    padding: 12px 14px;
    border-radius: 4px;
    border: 1px solid ${({ theme }) => theme.border};
    background: ${({ theme }) => theme.card};
    color: ${({ theme }) => theme.text};
    font-size: 1rem;
`;