import styled from 'styled-components';

const Main = styled.div`
  width: 425px;
  height: 100vh;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 50px;

  @media (max-width: 1024px) {
    width: 100%;
    height: 100vh;
    align-items: center;
    justify-content: center;
    display: flex;
  }

  @media (max-width: 768px) {
    width: 100%;
    height: 100vh;
    align-items: center;
    justify-content: center;
    display: flex;
  }
`;

const PageNotFound = () => {
  return (
    <Main>
      <img src="src\assets\pagenotfound.svg" alt="404 Error" />
      <h1> Not Found</h1>
    </Main>
  );
};

export default PageNotFound;
