import styled from 'styled-components';
import Row from './Row';
import { Avatar } from '@mui/material';

interface UserAvatarProps {
  name: string;
  mobile: string;
}

const Content = styled.div`
  font-size: 12px;
  font-weight: 400;
  color: #000;
  text-transform: none;
  line-height: 16.1px;

  @media (max-width: 768px) {
    font-size: 14px;
  }

  @media (max-width: 480px) {
    font-size: 12px;
  }
`;

const Content1 = styled.div`
  font-size: 15px;
  font-weight: 400;
  color: #000;
  text-transform: none;
  line-height: 30px;
  margin-top: -15px;
  @media (max-width: 768px) {
    font-size: 18px;
  }

  @media (max-width: 480px) {
    font-size: 16px;
  }
`;

const UserAvatar: React.FC<UserAvatarProps> = ({ name, mobile }) => {
  const profileLetter = name.charAt(0);
  return (
    <Row type="horizontal" $contentposition="center">
      <Avatar
        sx={{
          bgcolor: '#fff',
          color: 'black',
          border: '1px solid #D9D9D9',
          width: '52px',
          height: '52px',
        }}
      >
        {profileLetter}
      </Avatar>
      <Row type="vertical" $contentposition="spaceBetween" size="xsmall">
        <Row>
          <Content1>{name ? name : ''}</Content1>
        </Row>
        <Row>
          <Content> {mobile}</Content>
        </Row>
      </Row>
    </Row>
  );
};

export default UserAvatar;
