import { useEffect, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useUser } from '../../context/userContext';
import { uploadProfile } from '../../services/realmServices';
import { Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import ViewAgendaOutlinedIcon from '@mui/icons-material/ViewAgendaOutlined';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import CameraAltOutlinedIcon from '@mui/icons-material/CameraAltOutlined';
import Modal from '../../components/Modal';
import Logout from './Logout';
import Row from '../../components/Row';
import Avatar from '@mui/material/Avatar';
import Badge from '@mui/material/Badge';

const SmallAvatar = styled(Avatar)(({ theme }) => ({
  width: 25,
  height: 25,
  border: `2px solid ${theme.palette.background.paper}`,
  backgroundColor: 'white',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const MenuItem = styled('div')(() => ({
  padding: '2px',
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  fontSize: '15px',
}));

function SettingsLayout() {
  const companyname = 'Company name';
  const navigate = useNavigate();
  const { user, setUser, fetchUserProfile } = useUser();
  const [profileLetter, setProfileLetter] = useState<string>('');
  console.log('profileLetter', profileLetter);

  useEffect(() => {
    if(user?.companyName === undefined) return;
    const profile = user?.companyName.charAt(0);
    if (profile === undefined) return;
    setProfileLetter(profile);
  }, [user]);

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file: File | null = event.target.files ? event.target.files[0] : null;

    if (!file) {
      console.log('file does not exist');
      return;
    }
    if (file) {
      console.log('.......................', file);
      if(user === null) return;
      const res = await uploadProfile(user._id,file, 'image');
      if (res) {
        const fetchedUser = await fetchUserProfile();
        if (fetchedUser) {
          setUser(fetchedUser);
        }
      }
    }
  };

  return (
    <>
      <Row style={{ background: 'aliceblue', padding: '20px 120px 20px 30px' }}>
        <Row>
          <Badge
            overlap="circular"
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            badgeContent={
              <SmallAvatar>
                <CameraAltOutlinedIcon
                  fontSize="small"
                  style={{ color: '#000' }}
                />
              </SmallAvatar>
            }
          >
            <div style={{ position: 'relative', display: 'inline-block' }}>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                style={{
                  opacity: 0,
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  left: 0,
                  top: 0,
                  cursor: 'pointer',
                  zIndex: 1,
                }}
              />
              <Avatar
                alt={profileLetter}
                src={user?.profile || ''}
                sx={{
                  width: 100,
                  height: 100,
                }}
              >
                {profileLetter}
              </Avatar>
            </div>
          </Badge>
        </Row>
        <Row
          style={{ cursor: 'pointer' }}
          onClick={() => navigate({ to: '/companyinfo' })}
        >
          <Button
            sx={{
              // paddingTop:'20px',
              alignItems: 'center',
              color: '#000',
              fontStyle: 'Helvetica',
              fontSize: '15px',
              fontWeight: 'bold',
            }}
          >
            <>{user?.companyName === undefined ? companyname : user?.companyName}</>
          </Button>
        </Row>
      </Row>

      <Row
        type="vertical"
        style={{
          marginLeft: 15,
          gap: '30px',
          cursor: 'pointer',
          width: '390px',
        }}
      >
        <Row onClick={() => navigate({ to: '/appointmentinfo' })}>
          <Button sx={{ color: '#000', textTransform: 'none' }}>
            <MenuItem>
              <ViewAgendaOutlinedIcon
                sx={{ fontSize: 20, lineHeight: '23px' }}
              />
              Appointments
            </MenuItem>
          </Button>
        </Row>
        <Row onClick={() => navigate({ to: '/payment' })}>
          <Button sx={{ color: '#000', textTransform: 'none' }}>
            <MenuItem>
              <AccountBalanceWalletOutlinedIcon sx={{ fontSize: 20 }} />
              Payment Info
            </MenuItem>
          </Button>
        </Row>

        <Modal>
          <Modal.Open opens="logout">
            <Row>
              <Button sx={{ color: '#000', textTransform: 'none' }}>
                <MenuItem>
                  <LogoutRoundedIcon sx={{ fontSize: 20 }} />
                  Logout
                </MenuItem>
              </Button>
            </Row>
          </Modal.Open>

          <Modal.Window name="logout">
            <Logout />
          </Modal.Window>
        </Modal>
      </Row>
    </>
  );
}

export default SettingsLayout;
