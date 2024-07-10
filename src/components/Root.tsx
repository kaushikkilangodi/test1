import { Outlet, useLocation } from '@tanstack/react-router';
// import { TanStackRouterDevtools } from '@tanstack/router-devtools';
import styled from 'styled-components';
import Footer from './Footer';
import Header from './Header';
import InstallPage from '../pages/InstallPage';

const StyledAppLayout = styled.div`
  width: 449px;
  height: 100vh;
  margin: 0 auto;
  border: 2px solid black;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;

  @media (max-width: 1024px) {
    /* iPad Pro and below */
    max-width: 100%;
  }

  @media (max-width: 768px) {
    /* iPad and below */
    max-width: 100%;
  }

  @media (max-width: 425px) {
    /* Large mobile devices */
    max-width: 100%;
  }

  @media (max-width: 375px) {
    /* Medium mobile devices */
    max-width: 100%;
  }

  @media (max-width: 320px) {
    /* Small mobile devices */
    max-width: 100%;
  }
`;

const Main = styled.main`
  width: 100%;
  height: 100%;
  padding: 1rem;
  overflow: auto;
`;

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 3.2rem;
`;
export const Root = () => {
  const Auth = localStorage.getItem('userid');
  const location = useLocation();

  const showHeaderFooter = [
    '/appointments',
    '/notes',
    '/settings',

    '/',
  ].includes(location.pathname);
  // const hideHeader = location.pathname === '/chatpage';
  return (
    <StyledAppLayout>
      {Auth && <Header />}
      <Main>
        <Container>{!Auth ? <InstallPage /> : <Outlet />}</Container>
      </Main>
      {Auth && showHeaderFooter && <Footer />}
      {/* <TanStackRouterDevtools position="top-right" /> */}
    </StyledAppLayout>
  );
};
