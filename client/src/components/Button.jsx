import styled from "styled-components";

const Button = ({ onClick, btnDisabled, btnText, styles, type }) => {
	return (
		<ButtonStyle
            type={type}
			onClick={onClick}
			disabled={btnDisabled}
			$styles={styles}
		>
			{btnText}
		</ButtonStyle>
	);
};
export default Button;
/* ---------------- Styled Components ---------------- */
const ButtonStyle = styled.button`
	${({ $styles }) => $styles || ""};
	padding: 12px 16px;
	border-radius: 4px;
	background: ${({ theme }) => theme.accent};
	border: none;
	color: #fff;
	cursor: pointer;
	font-weight: 600;
	&:hover {
		opacity: 0.9;
		transform: translateY(-1px);
	}
	&:active {
		background-color: ${({ theme }) => theme.accent};
	}
	&:disabled {
		background-color: #555;
		color: #aaa;
		cursor: not-allowed;
		opacity: 0.8;
	}
`;
