import styled from "styled-components";
import { Link } from "react-router-dom";
const NotFound = () => {
    return (
        <Container>
            <h1>404</h1>
            <p>The page you're looking for doesn't exist.</p>
            <Link to="/">← Back to Homepage</Link>
        </Container>
    );
};
export default NotFound;
/* ---------------- Styled Components ---------------- */
const Container = styled.section`
    display: flex;
    max-width:580px;
    justify-content: center;
    flex-direction:column;
    margin: 0 auto;
    padding: 24px;
    height:100%;
    align-items:center;
    text-align:center;
    h1 {
        font-size: 4rem;
        margin-bottom: 12px;
    }
    p {
        color: ${({ theme }) => theme.secondaryText};
        margin-bottom: 24px;
    }
    a {
        color: ${({ theme }) => theme.accent};
        font-weight: 600;
        text-decoration: none;

        &:hover {
        text-decoration: underline;
        }
    }
`;
