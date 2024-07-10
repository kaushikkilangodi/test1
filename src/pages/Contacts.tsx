import { useEffect, useRef } from 'react';
import { useInfiniteQuery } from 'react-query';
import { Link, useNavigate } from '@tanstack/react-router';
import { useVirtualizer } from '@tanstack/react-virtual';
import styled from 'styled-components';
import { Button, IconButton, Stack } from '@mui/material';
import { useMediaQuery } from '@mui/material';
import { BiEditAlt } from 'react-icons/bi';
import { StyledParagraph } from '../components/StyledParagraph';
import { displayContacts } from '../services/realmServices';
import { ITEMS_PER_PAGE } from '../utils/helper';
import Loader from '../components/Loader';
import UserAvatar from '../components/UserAvatar';
import Row from '../components/Row';

const Icon = styled.div`
  cursor: pointer;
  margin-right: 10px;
  width: 37px;
  height: 32px;
  border-radius: 10px;
  background-color: #d9d9d9;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: background-color 0.3s;
  user-select: none;

  &:hover {
    background-color: #5a9eee;
  }
`;

export default function Contacts() {
  const navigate = useNavigate();
  const isSmallScreen = useMediaQuery('(max-width: 350px)');
  const parentRef = useRef<HTMLDivElement | null>(null);

  const {
    status,
    data,
    error,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery(
    'contacts',
    ({ pageParam = 1 }) => displayContacts(ITEMS_PER_PAGE, pageParam),
    {
      getNextPageParam: (lastPage, allPages) =>
        lastPage.length === ITEMS_PER_PAGE ? allPages.length + 1 : undefined,
    }
  );

  const allRows = data ? data.pages.flatMap((d) => d) : [];

  const rowVirtualizer = useVirtualizer({
    count: hasNextPage ? allRows.length + 1 : allRows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 80, 
    overscan: 5,
  });

  useEffect(() => {
    const [lastItem] = [...rowVirtualizer.getVirtualItems()].reverse();

    if (
      lastItem &&
      lastItem.index >= allRows.length - 1 &&
      hasNextPage &&
      !isFetchingNextPage
    ) {
      fetchNextPage();
    }
  }, [
    hasNextPage,
    fetchNextPage,
    allRows.length,
    isFetchingNextPage,
    rowVirtualizer.getVirtualItems(),
  ]);

  if (status === 'loading') {
    return <Loader />;
  }

  if (status === 'error') {
    return (
      <StyledParagraph height="50vh">
        Error: {(error as Error).message}
      </StyledParagraph>
    );
  }

  return (
    <>
      <Stack
        direction={isSmallScreen ? 'column' : 'row'}
        justifyContent={'center'}
      >
        <Row $contentposition="center">
          <Link to={'/newContacts'}>
            <Button
              variant="outlined"
              color="primary"
              sx={{
                marginLeft: '-10px',
                width: isSmallScreen ? '240px' : '333px',
                height: '54px',
                backgroundColor: '#5a9eee',
                color: 'white',
                borderRadius: '15px',
                boxShadow: ' 0 4px 4px 0 rgba(0, 0, 0, 0.25)',
                fontWeight: '400',
                fontSize: '20px',
                alignItems: 'center',
                textTransform: 'none',
                ':hover': {
                  color: 'white',
                  backgroundColor: '#5a9eee',
                },
              }}
            >
              Create New Contact
            </Button>
          </Link>
        </Row>
      </Stack>

      <div
        ref={parentRef}
        style={{ height: `66vh`, width: `100%`, overflow: 'auto' }}
      >
        <div
          style={{
            height: `${rowVirtualizer.getTotalSize()}px`,
            width: '100%',
            position: 'relative',
          }}
        >
          {rowVirtualizer.getVirtualItems().map((virtualRow) => {
            const isLoaderRow = virtualRow.index > allRows.length - 1;
            const contact = allRows[virtualRow.index];

            return (
              <div
                key={virtualRow.index}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: `${virtualRow.size}px`,
                  transform: `translateY(${virtualRow.start}px)`,
                }}
              >
                {isLoaderRow ? (
                  hasNextPage ? (
                    'Loading more...'
                  ) : (
                    'Nothing more to load'
                  )
                ) : (
                  <Row style={{ marginLeft: 5, marginRight: 5 }}>
                    {' '}
                    {/* Decreased the margin */}
                    <UserAvatar name={contact.name} mobile={contact.phone} />
                    <Row $contentposition="right">
                      <IconButton
                        aria-label="edit"
                        size="large"
                        sx={{
                          ':hover': {
                            background: 'none',
                          },
                        }}
                        onClick={() =>
                          navigate({ to: `/editcontact/${contact._id}` })
                        }
                      >
                        <Icon>
                          <BiEditAlt />
                        </Icon>
                      </IconButton>
                    </Row>
                  </Row>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
