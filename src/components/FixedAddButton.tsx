import React from 'react';
import AddIcon from '@mui/icons-material/Add';
import { Button } from '@mui/material';
import styled from 'styled-components';

const FixedButtonContainer = styled.div`
  position: fixed;
  bottom: 160px;
  right: 30px;
  z-index: 999;
  @media (min-width: 768px) {
    width: 630px;
  }
  @media (max-width: 1200px) {
    max-width: 630px;
  }
`;
const FixedButton = styled(Button)`
  background-color: #5a9eee !important;
  opacity: 1 !important;
`;
interface FixedAddButtonProps {
  onClick: () => void;
}
const FixedAddButton: React.FC<FixedAddButtonProps> = ({ onClick }) => {
  return (
    <>
      <FixedButtonContainer onClick={onClick}>
        <FixedButton
          variant="outlined"
          sx={{
            width: '60px',
            height: '52px',
            backgroundColor: '#5a9eee',
            color: 'white',
            borderRadius: '11px',
          }}
        >
          <AddIcon />
        </FixedButton>
      </FixedButtonContainer>
    </>
  );
};
export default FixedAddButton;
