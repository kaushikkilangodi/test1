import { MutatingDots } from 'react-loader-spinner';
import styled from 'styled-components';

const StyledLoader= styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 50vh;
        
`;

function Loader() {
  return (
    <StyledLoader>
      <MutatingDots
        visible={true}
        height="100"
        width="100"
        color="#5a9eee"
        secondaryColor="#5a9eee"
        radius="12.5"
        ariaLabel="mutating-dots-loading"
        wrapperStyle={{}}
        wrapperClass=""
      />
    </StyledLoader>
  );
}

export default Loader;
  
