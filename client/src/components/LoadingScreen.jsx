// LoadingScreen.jsx
// ------------------------------------------------------
// Simple loading component
// ------------------------------------------------------
import styled from "styled-components";

export default function LoadingScreen() {
  return (
    <Container>
      <div></div>
      <p>Now Loading...</p>
    </Container>
  );
}
/* ---------------- Styled Components ---------------- */
const Container = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.text};
  div {
    width: 80px;
    height: 80px;
    border: 4px solid ${({ theme }) => theme.secondaryBg};
    border-top-color: ${({ theme }) => theme.accent};
    border-radius: 50%;
    animation: spin 1s linear infinite;
    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }
  }
`;