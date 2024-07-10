import { useState } from 'react';
import { IoClose, IoSaveOutline } from 'react-icons/io5';
import Row from '../../components/Row';
import { Button, IconButton } from '@mui/material';
import styled from 'styled-components';
import {
  copyFromYesterday,
  copyOneFromLastWeek,
  newInsert,
} from '../../services/realmServices';
import { CopiedSlot } from './Slots';

type ButtonName = 'yesterday' | 'lastWeek' | '';
type Prop = {
  date: string;
  fetch: (date: string) => void;
  onCopy: (slots: CopiedSlot[]) => void;
  onClear: () => void;
  save:[object]
};

const ButtonContainer = styled.div`
  display: flex;
  align-items: center;
  margin-right: 10px;
`;

const responsiveButtonStyle = {
  fontSize: '12px',
  marginLeft: '2px',
  fontWeight: 600,
  minWidth: '120px',
  width: 'auto',
  maxWidth: '100%',
  borderRadius: '23px',
  height: '27px',
  backgroundColor: '#5a9eee',
  color: 'white',
  textTransform: 'none',
  ':hover': {
    color: 'white',
    backgroundColor: '#5a9eee',
  },
  '@media (max-width: 420px)': {
    fontSize: '10px',
    minWidth: '100px',
    padding: '5px',
  },
};

export default function CopySlots({ date, fetch, onCopy, onClear,save }: Prop) {
  const [activeButton, setActiveButton] = useState<ButtonName>('');
console.log('save',save);

  const handleButtonClick = async (buttonName: ButtonName) => {
    setActiveButton(buttonName);
    if (buttonName === 'yesterday') {
      const copiedData = await copyFromYesterday(date);
      console.log('cc',copiedData);
      
      onCopy(copiedData ?? []); 
    } else if (buttonName === 'lastWeek') {
      const copiedData = await copyOneFromLastWeek(date);
      console.log(copiedData);
      
      onCopy(copiedData ?? []);
      
    }
  };

  const handleSave = async () => {
    if (activeButton === 'yesterday') {
      console.log('save.........................',save);
      
      await newInsert(date,save);
      fetch(date);
    } else if (activeButton === 'lastWeek') {
      await newInsert(date, save);
      fetch(date);
    }
    setActiveButton('');
    onClear();
  };

  const handleCancel = () => {
    setActiveButton('');
    onClear();
  };

  const buttonStyle =
    activeButton === 'lastWeek' || activeButton === 'yesterday'
      ? {
          ...responsiveButtonStyle,
          backgroundColor: '#FFFFFF',
          color: '#000000',
          fontWeight: 600,
          fontSize: '12px',
          lineHeight: '14.52px',
          border: '1px solid #D9D9D9',
          fontStyle: 'Inter',
          padding: '5px',
        }
      : responsiveButtonStyle;

  return (
    <>
      <Row
        $contentposition={
          activeButton === 'yesterday' || activeButton === 'lastWeek'
            ? 'spaceBetween'
            : 'center'
        }
        style={{ marginBottom: 10, marginTop: 10 }}
      >
        <Row>
          {(activeButton === '' || activeButton === 'yesterday') && (
            <Button
              variant="outlined"
              sx={buttonStyle}
              onClick={() => handleButtonClick('yesterday')}
            >
              Copy from Yesterday
            </Button>
          )}
          {(activeButton === '' || activeButton === 'lastWeek') && (
            <Button
              variant="outlined"
              sx={buttonStyle}
              onClick={() => handleButtonClick('lastWeek')}
            >
              Copy from Last Week
            </Button>
          )}
        </Row>
        {activeButton !== '' && (
          <ButtonContainer>
            <IconButton
              aria-label="edit"
              size="large"
              sx={{
                color: 'black',
                ':hover': {
                  background: 'none',
                },
              }}
              onClick={handleSave}
            >
              <IoSaveOutline />
            </IconButton>
            <IconButton
              aria-label="edit"
              size="large"
              sx={{
                color: 'black',
                ':hover': {
                  background: 'none',
                },
              }}
              onClick={handleCancel}
            >
              <IoClose />
            </IconButton>
          </ButtonContainer>
        )}
      </Row>
    </>
  );
}
