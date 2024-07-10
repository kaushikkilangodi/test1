import React, { useState } from 'react';
import { IoArrowUp, IoArrowDown } from 'react-icons/io5';
import AppBar from '@mui/material/AppBar';
import InputBase from '@mui/material/InputBase';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import Modal from './Modal';
import Calendar from './Calendar';
import KeyboardBackspaceOutlinedIcon from '@mui/icons-material/KeyboardBackspaceOutlined';

const CustomAppBar = styled(AppBar)({
  boxShadow: 'none',
  width: '100%',
  maxWidth: '400px',
  height: '80px',
  position: 'fixed',
  marginTop: '20px',
  left: '50%',
  transform: 'translate(-50%)',
  padding: '0px 10px',
  transition: 'all 0.5s',
});
const Search = styled('div')(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  height: '40px',
  backgroundColor: '#D9D9D9',
  display: 'flex',

  // marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(0),
  },
}));

const StyledInputBase = styled(InputBase)<{ isDisabled: boolean }>`
  color: '#000';
  width: 100%;
  height: 100%;
  padding: 10px 10px 10px 10px;
  ${({ isDisabled }) => isDisabled && `background-color: #ddd;`}
`;

interface HeaderProps {
  isSearchDisabled: boolean;
  setIsVisible: (isVisible: boolean) => void;
}

const Header = ({ isSearchDisabled, setIsVisible }: HeaderProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [scrollTop, setScrollTop] = useState(0);
  //  const [isSearchFocused, setIsSearchFocused] = useState(false);
   // Other state variables...

   const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
     setSearchQuery(event.target.value);
   };

  //  // Handlers for focus and blur
  //  const handleSearchFocus = () => setIsSearchFocused(true);
  //  const handleSearchBlur = () => setIsSearchFocused(false);

  const handleScrollUp = () => {
    setScrollTop(scrollTop - 100);
    console.log('scrolling down');
  };

  const handleScrollDown = () => {
    setScrollTop(scrollTop + 100);
    console.log('scrolling up');
  };

  return (
    <CustomAppBar position="fixed" color="transparent">
      <Search>
        <IconButton>
          <KeyboardBackspaceOutlinedIcon onClick={() => setIsVisible(true)} />
        </IconButton>
        <StyledInputBase
          placeholder="Search chat..."
          value={searchQuery}
          onChange={handleSearchChange}
          inputProps={{ 'aria-label': 'search' }}
          fullWidth
          isDisabled={isSearchDisabled}
        />
        <Modal>
          <Modal.Open opens="calendar">
            <IconButton aria-label="calendar">
              <CalendarTodayIcon fontSize="inherit" />
            </IconButton>
          </Modal.Open>
          <Modal.Window name="calendar">
            <Calendar />
          </Modal.Window>
        </Modal>
        <IconButton aria-label="up" onClick={handleScrollUp}>
          <IoArrowUp />
        </IconButton>
        <IconButton aria-label="down" onClick={handleScrollDown}>
          <IoArrowDown />
        </IconButton>
      </Search>
    </CustomAppBar>
  );
};

export default Header;
