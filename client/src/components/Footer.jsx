import styled from "styled-components";

export default function Footer() {
  return (
    <FooterContainer>
      <FooterInner>
        <span>© {new Date().getFullYear()} SHUFFLEPOST</span>
				<p>Ten random posts. Every refresh.</p>
      </FooterInner>
    </FooterContainer>
  );
}
/* ---------------- Styled Components ---------------- */
const FooterContainer = styled.footer`
  border-top: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.bg};
`;
const FooterInner = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0.6rem 1rem;

  display: flex;
  justify-content: space-between;
  font-size: 0.75rem;
  color: ${({ theme }) => theme.textMuted};
`;