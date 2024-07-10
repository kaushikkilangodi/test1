import React, { ReactNode } from 'react';
import styled from 'styled-components';
import Row from './Row';
import { Button } from '@mui/material';
import Stack from '@mui/material/Stack';

interface ConfirmationDialogProps {
  title: string;
  children: ReactNode;
  onConfirm: () => void;
  confirmText: string;
  confirmDisabled?: boolean;
  closeModal: () => void;
  isLoading?: boolean;
  cancelText: string;
}

const StyledConfirmDialog = styled(Row)`
  min-width: 20rem;
  max-width: 90dvw;
  max-height: 80dvh;
  align-items: center;
  padding: 0rem 0rem;
  font-weight: bold;
  overflow-y: auto;

  & p {
    margin-bottom: 1.2rem;
    text-align: center;
  }
`;

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  // title,
  children,
  onConfirm,
  confirmText,
  cancelText,
  confirmDisabled = false,
  closeModal,
  isLoading = false,
}) => {
  return (
    <StyledConfirmDialog type="vertical">
      {/* <span>{title}</span> */}
      <Row size="xLarge" type="vertical">
        {children}

        <Row $contentposition="center" size="xLarge" style={{height:'49px'}}>
          <Stack spacing={3} direction="row">
            <Button
              onClick={onConfirm}
              variant="outlined"
              sx={{
                color: 'black',
                backgroundColor: 'rgba(217, 217, 217, 1)',
                borderRadius: '12px',
                boxShadow: ' 0 4px 4px 0 rgba(0, 0, 0, 0.25)',
                border:'none',
                fontSize: '20px',
                width: '112px',
                height: '40px',
                alignItems: 'center',
                textTransform: 'none',
              }}
              size="large"
              disabled={isLoading || confirmDisabled}
            >
              {isLoading ? '' : confirmText}
            </Button>

            <Button
              onClick={closeModal}
              variant="outlined"
              sx={{
                color: 'white',
                backgroundColor: '#5A9EEE',
                borderRadius: '12px',
                fontSize: '20px',
                width: '112px',
                height: '40px',
                boxShadow: ' 0 4px 4px 0 rgba(0, 0, 0, 0.25)',
                alignItems: 'center',
                textTransform: 'none',

                ':hover': { backgroundColor: '#5A9EEE', color: 'white' },
              }}
            >
              {isLoading ? '' : cancelText}
            </Button>
          </Stack>
        </Row>
      </Row>
    </StyledConfirmDialog>
  );
};

export default ConfirmationDialog;
