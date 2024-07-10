import { useEffect, useState } from 'react';
import styled from 'styled-components';
import QRCode from 'qrcode';
import Input from '../components/Input';
import { useUser } from '../context/userContext';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import Row from '../components/Row';

const QRCodeContainer = styled.div`
  width: 100%;
  height: 27vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 30px 0;
`;

const VideoWrapper = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 70%;
  height: 27.8vh;
  border: 1px solid #ddd;
  border-radius: 10px;
  overflow: hidden;
  &::before,
  &::after {
    content: '';
    position: absolute;
    width: 25px;
    height: 25px;
    border: 3px solid black;
  }
  &::before {
    top: 0;
    left: 0;
    border-width: 2px 0 0 2px;
  }
  &::after {
    bottom: 0;
    right: 0;
    border-width: 0 2px 2px 0;
  }
  @media (max-width: 360px) {
    width: 70%;
    height: 26.2vh;
  }
  @media (max-width: 340px) {
    width: 70%;
    height: 24.5vh;
  }
`;

const Placeholder = styled.h4`
  position: absolute;
  color: black;
  background: rgba(255, 255, 255, 0.7);
  padding: 10px;
  border-radius: 5px;
`;

const QRCodeScanner = () => {
  const [showPlaceholder] = useState(true);
  const [amount, setAmount] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const { user } = useUser();
  const [selectedUPI, setSelectedUPI] = useState('');

  useEffect(() => {
    const generateQRCode = () => {
      const upiString = `upi://pay?pa=${selectedUPI}&am=${amount}`;
      QRCode.toDataURL(upiString, (err, url) => {
        if (err) {
          console.error('Error generating QR code', err);
        } else {
          setQrCodeUrl(url);
        }
      });
    };

    const timeout = setTimeout(() => {
      if (selectedUPI && amount) {
        generateQRCode();
      } else {
        setQrCodeUrl('');
      }
    }, 2000);

    return () => clearTimeout(timeout);
  }, [selectedUPI, amount]);

  return (
    <Row type="vertical">
      <Row $contentposition="center">
        <FormControl
          sx={{
            width: '300px',
          }}
          color="secondary"
          required
        >
          <InputLabel
            id="upi-select-label"
            sx={{
              background: '#fff',
              padding: '0 5px',
              fontSize: '14px',
              color: '#000',
            }}
          >
            Select UPI Id
          </InputLabel>
          <Select
            labelId="upi-select-label"
            id="upi-select"
            value={selectedUPI}
            label="Select UPI Id"
            onChange={(e) => setSelectedUPI(e.target.value)}
            sx={{ color: '#000' }}
          >
            {user &&
              user.upiId.map((upiId) => (
                <MenuItem key={upiId} value={upiId}>
                  {upiId}
                </MenuItem>
              ))}
          </Select>
        </FormControl>
      </Row>
      <QRCodeContainer>
        {qrCodeUrl ? (
          <img src={qrCodeUrl} alt="UPI QR Code" style={{ width: '60%' }} />
        ) : (
          <VideoWrapper>
            {showPlaceholder && <Placeholder>QR Code</Placeholder>}
          </VideoWrapper>
        )}
      </QRCodeContainer>

      <Input
        type="number"
        label="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Enter amount here"
      />
    </Row>
  );
};

export default QRCodeScanner;
