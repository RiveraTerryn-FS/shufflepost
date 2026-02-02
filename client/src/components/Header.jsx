import styled from "styled-components";
import { FaSun, FaMoon } from "react-icons/fa";
import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "@/context/ThemeContext";
import { useAuth } from "@/context/AuthContext.jsx";

const Header = () => {
	const { theme, toggleTheme } = useContext(ThemeContext);
	const navigate = useNavigate();
	const { isAuthenticated, logout } = useAuth();
	return (
		<HeaderContainer>
			<HeaderInner>
				<Brand>
					<h1>SHUFFLEPOST</h1>
					<p>Ten random posts. Every refresh.</p>
				</Brand>
				<RightActions>
					<ThemeToggle
						onClick={toggleTheme}
						aria-label="Toggle theme"
						title="Toggle theme"
					>
						{theme === "dark" ? <FaSun size={18} /> : <FaMoon size={18} />}
					</ThemeToggle>
					{isAuthenticated ? (
						<LoginButton onClick={logout}>
							Logout
						</LoginButton>
					) : (
						<LoginButton onClick={() => navigate("/auth/login")}>
							Login
						</LoginButton>
					)}
				</RightActions>
			</HeaderInner>
		</HeaderContainer>
	);
};
export default Header;
/* ---------------- Styled Components ---------------- */
const HeaderContainer = styled.header`
  border-bottom: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.bg};
`;

const HeaderInner = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 0.75rem 1rem;

  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Brand = styled.div`
  display: flex;
  flex-direction: column;

  h1 {
    font-size: 1.05rem;
    margin: 0;
  }

  span {
    font-size: 0.75rem;
    color: ${({ theme }) => theme.secondaryText};
  }
`;

const RightActions = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const ThemeToggle = styled.button`
  all: unset;
  width: 34px;
  height: 34px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 4px;
  border: 1px solid ${({ theme }) => theme.border};
  cursor: pointer;

  color: ${({ theme }) => theme.accent};

  &:hover {
    background: ${({ theme }) => theme.secondaryBg};
  }

  svg {
    display: block;
    transition: transform 0.25s ease;
  }

&:hover svg {
  transform: rotate(15deg);
}

`;



const LoginButton = styled.button`
  background: ${({ theme }) => theme.accent};
  color: #ffffff;
  padding: 10px 14px;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 500;

  &:hover {
    opacity: 0.9;
  }
`;
