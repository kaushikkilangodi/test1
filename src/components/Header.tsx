import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from '@tanstack/react-router';
import { styled as muiStyled } from '@mui/material/styles';
import styled from 'styled-components';
import RouteTitle from './RouteTitle';
import { IoArrowBack, IoChatbubbleEllipsesOutline } from 'react-icons/io5';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import { useMoveBack } from '../hooks/useMoveBack';
import QrCodeRoundedIcon from '@mui/icons-material/QrCodeRounded';
import { IconButton } from '@mui/material';
import ChatHeader from './ChatHeader';
import Row from './Row';
import { CiSearch } from 'react-icons/ci';
import { hideQrButton, showBackButton, hideSearchBar } from '../utils/helper';
import DeleteAppointment from '../features/appointment/DeleteAppointment';
import { usePreviousPath } from '../context/PreviousPath';
import debounce from 'lodash/debounce';
import {
  fetchContactById,
  getUpcomingAppById,
} from '../services/realmServices';

const TitleContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Form = styled.form`
  display: flex;
  align-items: center;
  width: 100%;
`;

const Title = styled.h1`
  margin: 0;
  line-height: 23px;
  font-size: 20px;
  font-weight: 400;
  font-style: Helvetica;
  color: #5a9eee;
`;

const QrButton = styled.button`
  border: none;
  background: none;
  color: black;
  cursor: pointer;
  font-size: 24px;
  display: flex;
  align-items: center;

  &:hover {
    color: #555;
  }
`;

async function formatRouteTitle(pathname: string) {
  if (pathname === '/') {
    return 'Appointments';
  }

  const parts = pathname.split('/').filter(Boolean);

  if (parts.includes('chatpage')) {
    const contactId = parts[parts.length - 1];
    try {
      const data = await fetchContactById(contactId);
      // console.log('data', data);
      return data.name;
    } catch (error) {
      console.error('Failed to fetch contact by ID:', error);
      return 'Chat';
    }
  } else if (parts.length > 1) {
    return (
      parts[parts.length - 2].charAt(0).toUpperCase() +
      parts[parts.length - 2].slice(1)
    );
  } else {
    return parts[0].charAt(0).toUpperCase() + parts[0].slice(1);
  }
}

const HeaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-top: 10px;
`;

const BottomRow = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  margin-top: 20px;
  margin-bottom: 20px;
`;

const CustomAppBar = muiStyled(AppBar)({
  boxShadow: 'none',
});

const Search = muiStyled('div')(({ theme }) => ({
  position: 'relative',
  height: '44px',
  borderRadius: '12px',
  backgroundColor: 'rgba(217, 217, 217, 0.33)',
  '&:hover': {
    backgroundColor: 'rgba(217, 217, 217, 0.33)',
  },
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(0),
    width: '100%',
  },
}));

const SearchIconWrapper = muiStyled('div')(({ theme }) => ({
  color: 'black',
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  zIndex: 1,
}));

const StyledInputBase = muiStyled(InputBase)(({ theme }) => ({
  color: '#000',
  height: '100%',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '100ch',
    },
  },
}));

function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const moveBack = useMoveBack();
  const [routeName, setRouteName] = useState('');
  const [isVisible, setIsVisible] = useState(true);
  const [isSearchDisabled, setIsSearchDisabled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  // const [search, setSearch] = useState(false);
  const [data, setData] = useState();
  const { from, setFrom } = usePreviousPath();
  const { id } = useParams({ strict: false });
  // console.log('data',data);

  const isSearchPage = location.pathname === '/search';
  useEffect(() => {
    async function getRouteTitle() {
      const title = await formatRouteTitle(location.pathname);
      setRouteName(title);
      if (!isSearchPage) setSearchQuery('');
      // console.log('title', title);
    }
    getRouteTitle();
  }, [location.pathname, isSearchPage]);

  useEffect(() => {
    async function fetchById() {
      if (id === undefined) return;
      const data = await getUpcomingAppById(id);
      setData(data.contactId);
    }
    if (location.pathname.startsWith('/editAppointment')) {
      fetchById();
    }
  }, [id, location.pathname]);

  const handleSearch = () => {
    setIsVisible(false);
    setIsSearchDisabled(true);
  };

  const handleMoveBack = () => {
    if (from) {
      console.log('from', from);
      navigate({ to: from });
    } else {
      navigate({ to: '/' });
    }
    setSearchQuery('');
  };

  const debouncedSearch = debounce((query: string) => {
    if (location.pathname !== '/search') {
      setFrom(location.pathname);
    }

    navigate({
      to: '/search',
      search: { query },
    });
  }, 1000);

  const shouldHideSearchBar = hideSearchBar.some((route) =>
    typeof route === 'string'
      ? route === location.pathname
      : route(location.pathname)
  );
  const shouldHideQRBar = hideQrButton.some((route) =>
    typeof route === 'string'
      ? route === location.pathname
      : route(location.pathname)
  );

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setSearchQuery(value);
    debouncedSearch(value);
  };

  return (
    <CustomAppBar position="static" color="transparent">
      <Toolbar>
        <HeaderContainer>
          {!isSearchPage && (
            <Row>
              {!isVisible && (
                <ChatHeader
                  isSearchDisabled={isSearchDisabled}
                  setIsVisible={setIsVisible}
                />
              )}
              <TitleContainer>
                {isVisible && !showBackButton.includes(location.pathname) && (
                  <IconButton
                    aria-label="edit"
                    size="small"
                    sx={{
                      fontSize: '20px',
                      color: 'black',
                      ':hover': {
                        background: 'none',
                      },
                    }}
                    onClick={moveBack}
                  >
                    <IoArrowBack />
                  </IconButton>
                )}
                {isVisible && (
                  <Title>
                    {routeName && location.pathname.startsWith('/chatpage') ? (
                      <div style={{ color: '#000' }}>{routeName}</div>
                    ) : (
                      routeName || 'Appointments'
                    )}
                  </Title>
                )}
              </TitleContainer>
              {isVisible && (
                <Row $contentposition="right" size="xLarge">
                  {routeName && location.pathname.startsWith('/chatpage') && (
                    <Row>
                      {isVisible ? (
                        <CiSearch onClick={handleSearch} />
                      ) : (
                        <ChatHeader
                          isSearchDisabled={isSearchDisabled}
                          setIsVisible={setIsVisible}
                        />
                      )}
                    </Row>
                  )}
                  {routeName === 'EditAppointment' && (
                    <Row>
                      <DeleteAppointment id={id || undefined} />

                      <IconButton
                        aria-label="edit"
                        size="large"
                        sx={{
                          color: 'black',
                          ':hover': {
                            background: 'none',
                          },
                        }}
                        onClick={() => navigate({ to: `/chatpage/${data}` })}
                      >
                        <IoChatbubbleEllipsesOutline />
                      </IconButton>
                    </Row>
                  )}
                  {!shouldHideQRBar && (
                    <IconButton
                      aria-label="edit"
                      size="small"
                      sx={{
                        color: 'black',
                        ':hover': {
                          background: 'none',
                        },
                      }}
                      onClick={() => navigate({ to: '/qrscanner' })}
                    >
                      <QrButton>
                        <QrCodeRoundedIcon fontSize="inherit" />
                      </QrButton>
                    </IconButton>
                  )}
                </Row>
              )}
            </Row>
          )}

          {!shouldHideSearchBar && (
            <BottomRow>
              <Form>
                <Search>
                  <SearchIconWrapper
                    onClick={isSearchPage ? handleMoveBack : undefined}
                  >
                    {isSearchPage ? <IoArrowBack /> : <SearchIcon />}
                  </SearchIconWrapper>
                  <StyledInputBase
                    placeholder="Search…"
                    value={searchQuery}
                    onChange={handleChange} // Use handleChange to trigger search on every keystroke
                    inputProps={{ 'aria-label': 'search' }}
                  />
                </Search>
              </Form>
            </BottomRow>
          )}
        </HeaderContainer>
        <RouteTitle />
      </Toolbar>
    </CustomAppBar>
  );
}

export default Header;
