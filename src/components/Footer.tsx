import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from '@tanstack/react-router';
import { BottomNavigation, BottomNavigationAction, Paper } from '@mui/material';
import { PiCalendarPlus, PiNotePencil } from 'react-icons/pi';
import { styled } from '@mui/material/styles';
import { AiOutlineSetting } from 'react-icons/ai';

const StyledBottomNav = styled(BottomNavigation)(() => ({
  width: '100%',
  maxWidth: '440px',
  height: '80px',
  position: 'fixed',
  bottom: 0,
  left: '50%',
  transform: 'translate(-50%)',
  boxShadow: '0 -2px rgba(98, 27, 27, 0.1)',
  zIndex: 1000, // Ensure the footer is always on top
}));

const StyledPaper = styled(Paper)(() => ({
  display: 'flex',
  justifyContent: 'space-around',
  padding: '5px',
  paddingBottom: '74px',
}));

const IconWrapper = styled('div')<{ isActive: boolean }>(({ isActive }) => ({
  background: isActive
    ? 'linear-gradient(90deg, transparent, LightSkyBlue, LightSkyBlue)'
    : 'transparent',
  backgroundSize: '200% 300%',
  backgroundPosition: isActive ? '100% 0' : '0 0',
  borderRadius: '10px',
  color: '#000000',
  padding: '10px 15px',
  transition: 'background-position 0.6s ease-in',
}));

const StyledBottomNavigationAction = styled(BottomNavigationAction)(
  ({ theme }) => ({
    '& .MuiBottomNavigationAction-label': {
      fontSize: '1rem',
      marginTop: theme.spacing(2),
      fontWeight: 'bold',
      color: '#000000',
      padding: '1px',
    },
    '& .MuiBottomNavigationAction-icon': {
      marginBottom: theme.spacing(2),
      borderRadius: '10px',
      color: '#000000',
      padding: '0px',
    },
  })
);

export default function Footer() {
  const location = useLocation();
  const navigate = useNavigate();
  const [value, setValue] = useState(location.pathname);

  useEffect(() => {
    setValue(location.pathname);
  }, [location.pathname]);

  const handleChange = (newValue: string) => {
    setValue(newValue);
    navigate({ to: newValue });
  };

  return (
    <StyledPaper elevation={3}>
      <StyledBottomNav
        value={value}
        onChange={(_: React.SyntheticEvent, newValue: string) =>
          handleChange(newValue)
        }
        showLabels
      >
        <StyledBottomNavigationAction
          label="Appointments"
          value="/appointments"
          icon={
            <IconWrapper isActive={value === '/appointments'}>
              <PiCalendarPlus />
            </IconWrapper>
          }
        />
        <StyledBottomNavigationAction
          label="Notes"
          value="/notes"
          icon={
            <IconWrapper isActive={value === '/notes'}>
              <PiNotePencil />
            </IconWrapper>
          }
        />
        <StyledBottomNavigationAction
          label="Settings"
          value="/settings"
          icon={
            <IconWrapper isActive={value === '/settings'}>
              <AiOutlineSetting />
            </IconWrapper>
          }
        />
      </StyledBottomNav>
    </StyledPaper>
  );
}
