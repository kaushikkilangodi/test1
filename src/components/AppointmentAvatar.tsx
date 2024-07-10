import styled from 'styled-components';
import Row from './Row';
import { Avatar } from '@mui/material';
// import { useNavigate } from '@tanstack/react-router';

const Content = styled.div`
  font-size: 14px;
  font-weight: 400;
  color: #000;
  line-height: 16.1px;

  @media (max-width: 380px) {
    font-size: 12px;
  }
`;

const Content1 = styled.div`
  font-size: 18px;
  font-weight: 400;
  color: #000;
  line-height: 30px;

  @media (max-width: 380px) {
    font-size: 16px;
  }
`;

interface UserAvatarProps {
  name: string;
  mobile: string;
  Token: string;
  Slot: string;
  Time: string;
  onClick: () => void;
}

export default function AppointmentAvatar({
  name,
  mobile,
  Token,
  Slot,
  Time,
  onClick,
}: UserAvatarProps) {
  // const navigate = useNavigate();
  const dateObject = new Date(Time);
  const profileLetter = name.charAt(0);
  const addLeadingZero = (number: number) =>
    number < 10 ? `0${number}` : number;

  const hours = addLeadingZero(dateObject.getHours()) as number;
  const minutes = addLeadingZero(dateObject.getMinutes());
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const formattedHours = hours % 12 || 12;
  const formattedTimeString = `${addLeadingZero(formattedHours)}:${minutes} ${ampm}`;
  // console.log('formattedTimeString',formattedTimeString);
  // console.log('Time',Time);

  return (
    <Row
      type="horizontal"
      $contentposition="spaceBetween"
      style={{ background: '', width: '100%' }}
      onClick={onClick}
    >
      <Avatar
        sx={{
          bgcolor: '#fff',
          color: 'black',
          border: '1px solid #D9D9D9',
          width: '52px',
          height: '52px',
          padding: '10px',
        }}
      >
        {profileLetter}
      </Avatar>
      <Row type="vertical" $contentposition="spaceBetween" size="xsmall">
        <Row>
          <Content1>{name}</Content1>
        </Row>
        <Row>
          <Content> {mobile}</Content>
        </Row>
      </Row>
      <Row $contentposition="center">
        <Row type="vertical" size="small" style={{ fontSize: 12 }}>
          <Row>Token No: {Token}</Row>
          <Row>Slot No: {Slot}</Row>
        </Row>
      </Row>
      <Row type="vertical" style={{ marginTop: -50, fontSize: 14 }}>
        {formattedTimeString}
      </Row>
    </Row>
  );
}

AppointmentAvatar.defaultProps = {
  onClick: undefined,
};
