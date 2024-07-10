import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from '@tanstack/react-router';
import styled from 'styled-components';
import UserAvatar from './UserAvatar';
import Row from './Row';
import { Button } from '@mui/material';
import { searchUser } from '../services/realmServices';
import { User } from '../services/types';
import Loader from './Loader';
import { searchRoute } from '../routes';
import { usePreviousPath } from '../context/PreviousPath';

export type SearchParams = {
  query: string;
};

const Container = styled.div`
  padding: 15px;
`;

const NoResults = styled.div`
  text-align: center;
  color: #555;
  margin-top: 20px;
  font-size: 15px;
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 10px;
  position: absolute;
  bottom: 80px;
  left: 50%;
  transform: translateX(-50%);

  @media (max-width: 600px) {
    & > button {
      width: 110%;
    }
  }
  @media (max-width: 360px) {
    & > button {
      width: 110%;
    }
  }
`;

export interface Item {
  id: number;
  text: {
    Token: string;
    Slot: string | JSX.Element;
  };
}

const SearchResults = () => {
  const [results, setResults] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { query } = searchRoute.useSearch();
  const { from: previous, setFrom } = usePreviousPath();

  console.log('previous', previous);

  const handleNewContact = () => {
    navigate({ to: '/newContacts' });
  };

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    const data = await searchUser(query);
    setResults(data || []);
    setIsLoading(false);
  }, [query]);

  useEffect(() => {
    if (query) {
      fetchData();
    } else {
      setResults([]);
    }
  }, [query, fetchData]);

  const handleResultClick = (result: User) => {
    if (
      previous === '/contacts' ||
      previous === '/appointments' ||
      previous === '/'
    ) {
      navigate({ to: `/createAppointment/${result._id}` });

      setFrom(previous);
    } else if (previous === '/notes') {
      navigate({ to: `/chatpage/${result._id}` });
      setFrom(previous);
    }
  };

  return (
    <Container>
      {isLoading ? (
        <Loader />
      ) : results.length > 0 ? (
        results.map((result) => (
          <Row
            $contentposition="left"
            key={result._id}
            style={{ marginBottom: 20 }}
            onClick={() => handleResultClick(result)} 
          >
            <UserAvatar name={result.name} mobile={result.phone} />
          </Row>
        ))
      ) : (
        <Row type="vertical">
          <Row $contentposition="center">
            <NoResults>No search results found for {query}</NoResults>
          </Row>
          <Row type="vertical" $contentposition="center">
            <Row onClick={handleNewContact}>
              <ButtonContainer>
                <Button
                  variant="outlined"
                  sx={{
                    color: 'black',
                    maxWidth: '308px',
                    width: '100%',
                    height: '44px',
                    padding: '14px, 8px, 14px, 8px',
                    gap: '10px',
                    borderRadius: '12px',
                    border: '1px solid rgba(90, 158, 238, 1)',
                  }}
                  onClick={handleNewContact}
                >
                  New Contact name as "{query}"
                </Button>
                <Button
                  variant="outlined"
                  sx={{
                    color: 'black',
                    maxWidth: '308px',
                    width: '100%',
                    height: '44px',
                    padding: '14px, 8px, 14px, 8px',
                    gap: '10px',
                    borderRadius: '12px',
                    border: '1px solid rgba(90, 158, 238, 1)',
                  }}
                  onClick={handleNewContact}
                >
                  New Contact phone as "+91 9736372721"
                </Button>
                <Button
                  variant="outlined"
                  sx={{
                    backgroundColor: 'rgba(90, 158, 238, 1)',
                    color: 'white',
                    maxWidth: '308px',
                    width: '100%',
                    height: '45px',
                    borderRadius: '12px',
                    font: 'Helvetica',
                    fontWeight: '700',
                    textAlign: 'center',
                    lineHeight: '16.1px',
                    ':hover': {
                      color: 'rgba(90, 158, 238, 1)',
                    },
                  }}
                  onClick={handleNewContact}
                >
                  New Contact
                </Button>
              </ButtonContainer>
            </Row>
          </Row>
        </Row>
      )}
    </Container>
  );
};

export default SearchResults;
