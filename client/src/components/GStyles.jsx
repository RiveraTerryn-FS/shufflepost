// GStyles.jsx
import { createGlobalStyle, styled} from "styled-components";

export const MessageBox = styled.div`
  padding: 12px 16px;
  border-radius: 4px;
  margin-bottom: 14px;
  font-size: 0.9rem;
  font-weight: 500;
  background: ${({ theme }) => theme.secondaryBg};
  border: 1px solid ${({ theme }) => theme.border};
  color: ${({ theme }) => theme.text};
  ${({ $type }) =>
    $type === "error" &&
    `
    background: rgba(255, 60, 60, 0.15);
    border: 1px solid #ff3c3c;
    color: #ff3c3c;
  `}
  ${({ $type }) =>
    $type === "success" &&
    `
    background: rgba(0, 200, 120, 0.18);
    border: 1px solid #00c878;
    color: #00c878;
  `}
  ${({ $type }) =>
    $type === "warning" &&
    `
    background: rgba(255, 180, 0, 0.15);
    border: 1px solid #ffb400;
    color: #ffb400;
  `}
  ${({ $type }) =>
    $type === "info" &&
    `
    background: rgba(70, 140, 255, 0.15);
    border: 1px solid #468cff;
    color: #468cff;
  `}
`;
export const GlobalEyeToggle = styled.button`
	display: flex;
	align-items: center;
	justify-content: center;

	background: ${({ theme }) => theme.inputBg};
	border: none;
	border-left: 1px solid ${({ theme }) => theme.border};
	border-radius: 0;
	color: ${({ theme }) => theme.textSecondary};
	cursor: pointer;
	svg {
		width: 28px;
		height: 28px;
	}
`;
export const GlobalEyeToggleInputGroup = styled.div`
	display: flex;
	width: 100%;
	border: 1px solid ${({ theme }) => theme.border};
	border-radius: 4px;
	background: ${({ theme }) => theme.inputBg};
	overflow: hidden;
	input {
		border: none;
		border-radius: 0;
	}
`;
export const GlobalCard = styled.div`
    background: ${({ theme }) => theme.card};
    border: 1px solid ${({ theme }) => theme.border};
    padding: 20px;
    border-radius: 4px;
    margin: 24px 0;
    h2 {
        margin-bottom:16px;
    }
    width: 100%;
    max-width: 520px;
`;
export const GlobalForm = styled.form`
    width: 100%;
    max-width: 520px;
    background: ${({ theme }) => theme.card};
    border: 1px solid ${({ theme }) => theme.border};
    padding: 24px;
    border-radius: 4px;
    margin: 24px 0;
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
`
export const GlobalInput = styled.input`
    width:100%;
    padding: 12px 14px;
    border-radius: 4px;
    border: 1px solid ${({ theme }) => theme.border};
    background: ${({ theme }) => theme.card};
    color: ${({ theme }) => theme.text};
    font-size: 1rem;
    gap:0.5rem;
`;
export const GlobalSpacer = styled.div`
  height: 8px;
`;
export const GlobalDivider = styled.div`
	margin: 1rem 0 0.75rem;
	height: 1px;
	background: ${({ theme }) => theme.border};
	opacity: 0.5;
`;

export const GlobalSectionSmallest = styled.section`
    display: flex;
    max-width:580px;
    justify-content: center;
    margin: 0 auto;
    height:100%;
    align-items:center;
    padding: 24px;
`;
export const GlobalWrapperSmallest = styled.div`
  max-width: 580px;
  width: 100%;
  margin: 0 auto;
  padding: 24px;
`;
export const GlobalWrapper = styled.div`
  max-width: 1280px;
  width:100%;
  padding: 24px;
  margin: 0 auto;
`;
export const GlobalWrapperSmall = styled.div`
  max-width: 900px;
  width:100%;
  padding: 24px;
  margin: 0 auto;
`;
const GStyles = createGlobalStyle`
  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    transition: 
      background-color 0.25s ease-in-out, 
      color 0.25s ease-in-out,
      transform .30s ease, 
      box-shadow .30s ease,
      border-color 0.20s ease-in-out;
  }
  html, body {
    height: 100%;
    font-family: system-ui, Avenir, Helvetica, Arial, sans-serif;

    background-color: ${({ theme }) => theme.bodyBg};
    color: ${({ theme }) => theme.text};
  }
  #root {
    height: 100%;
    display: flex;
    flex-direction: column;
    background-color: ${({ theme }) => theme.bg};
    color: ${({ theme }) => theme.text};

  }
  h1, h2, h3, h4, h5, h6 {
    color: ${({ theme }) => theme.text};
    font-weight: 600;
    margin-bottom: 8px;
  }
  p {
    margin-bottom: 8px;
    color: ${({ theme }) => theme.secondaryText};
    line-height: 1.5;
  }
  a {
    text-decoration: none;
    color: ${({ theme }) => theme.text};
  }
button {
  border: none;
  cursor: pointer;
  background: ${({ theme }) => theme.accent};
  color: #ffffff;
  border-radius: 4px;
  padding: 10px 16px;
  font-weight: 500;
}

button:hover {
  background: ${({ theme }) => theme.accent};
  opacity: 0.9;
}
  input, select {
    padding: 12px 16px;
    font-size: 16px;
    background: ${({ theme }) => theme.searchBg};
    border: 1px solid ${({ theme }) => theme.border};
    border-radius: 4px;
    color: ${({ theme }) => theme.text};
  }
`;

export default GStyles;
