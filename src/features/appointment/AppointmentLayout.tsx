import { useContext, useEffect, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { AnimatePresence } from 'framer-motion';
import styled from 'styled-components';
import Button from '@mui/material/Button';
import Row from '../../components/Row';
import AppointmentAvatar from '../../components/AppointmentAvatar';
import EventAvailableOutlinedIcon from '@mui/icons-material/EventAvailableOutlined';
import SwipeElement from './SwipeElement';
import FixedAddButton from '../../components/FixedAddButton';
import { DateContext } from '../../context/DateContext';
import Modal from '../../components/Modal';
import Calendar from '../../components/Calendar';
import {
  getAppointment,
  updateAppointment,
} from '../../services/realmServices';
import { StyledParagraph } from '../../components/StyledParagraph';

interface AppointmentProps {
  _id: string;
  name: string;
  phone: string;
  token: string;
  slotNo: string;
  date: string;
  updatedAt: string;
}

const StyledDate = styled.div`
  font-size: 15px;
  font-weight: 600;
  color: #000;
  margin-right: 10px;
`;

const Count = styled.div`
  font-size: 12px;
  font-weight: 600;
  color: #fff;
  background-color: #5a9eee;
  border-radius: 50%;
  width: 18px;
  height: 18px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 10px;
`;

export default function AppointmentLayout() {
  const navigate = useNavigate();
  const { selectedDate, setSelectedDate } = useContext(DateContext);
  const [upcomingData, setUpcomingData] = useState<AppointmentProps[]>([]);
  const [pastData, setPastData] = useState<AppointmentProps[]>([]);
  const [showUpcoming, setShowUpcoming] = useState(true);
  const [activeButton, setActiveButton] = useState('upcoming');

  useEffect(() => {
    if (!selectedDate) {
      setSelectedDate(new Date());
    }
  }, [selectedDate, setSelectedDate]);

  useEffect(() => {
    if (activeButton === 'upcoming') {
      handleUpcoming();
    } else {
      handlePast();
    }
  }, [selectedDate, activeButton]);

  const formattedSelectedDate = selectedDate
    ? `${selectedDate.getDate()} ${selectedDate.toLocaleString('default', {
        month: 'short',
      })} ${selectedDate.getFullYear()}`
    : '';

  const handleDelete = async (index: string) => {
    await updateAppointment(index, 'delete');
    console.log(`Item ${index} deleted`);
    if (showUpcoming) {
      setUpcomingData((currentData) =>
        currentData?.filter((item) => item._id !== index)
      );
    } else {
      setPastData((currentData) =>
        currentData?.filter((item) => item._id !== index)
      );
    }
  };

  const handleSave = async (index: string) => {
    await updateAppointment(index, 'complete');
    setUpcomingData((currentData) =>
      currentData?.filter((item) => item._id !== index)
    );
    console.log(`Item ${index} saved`);
  };

  const handleClick = () => {
    navigate({ to: '/contacts' });
  };

  const handleUpcoming = async () => {
    const result = await getAppointment('upcoming');
    if (!selectedDate || result === undefined) return;
    const filteredResult = result.filter(
      (item: AppointmentProps) =>
        new Date(item.date).toDateString() === selectedDate.toDateString()
    );
    // console.log('😍😍', filteredResult);
    setUpcomingData(filteredResult);
    setShowUpcoming(true);
  };

  const handlePast = async () => {
    const result = await getAppointment('past');
    if (!selectedDate || result === undefined) return;
    const filteredResult = result.filter(
      (item: AppointmentProps) =>
        new Date(item.date).toDateString() === selectedDate.toDateString()
    );
    // console.log('🫰🫰🫰', filteredResult);
    setPastData(filteredResult);
    setShowUpcoming(false);
  };
  // console.log(upcomingData.length, pastData.length);

  return (
    <>
      <Row type="vertical" style={{ marginLeft: 10 }}>
        <Row>
          <Row $contentposition="left">
            <Button
              variant="outlined"
              sx={{
                width: '97px',
                borderRadius: '23px',
                height: '40px',
                backgroundColor:
                  activeButton === 'upcoming' ? ' #d9d9d9' : '#5a9eee',
                color:
                  activeButton === 'upcoming' ? 'black' : 'rgba(0, 0, 0, 1)',
                textTransform: 'none',
                boxShadow: '0 4px 4px 0 rgba(0, 0, 0, 0.25)',
                fontSize: '15px',
                alignItems: 'center',
                fontWeight: '400',
                ':hover': {
                  color: 'rgba(0, 0, 0, 1)',
                  backgroundColor: 'rgba(217, 217, 217, 1)',
                },
              }}
              onClick={() => {
                setActiveButton('upcoming');
                handleUpcoming();
              }}
            >
              Upcoming
            </Button>
            <Button
              variant="outlined"
              sx={{
                width: '97px',
                borderRadius: '23px',
                height: '40px',
                backgroundColor:
                  activeButton === 'past' ? ' #d9d9d9' : '#5a9eee',
                boxShadow: '0 4px 4px 0 rgba(0, 0, 0, 0.25)',
                color: activeButton === 'past' ? 'black' : 'rgba(0, 0, 0, 1)',
                textTransform: 'none',
                fontSize: '15px',
                alignItems: 'center',
                fontWeight: '400',
                ':hover': {
                  color: 'rgba(0, 0, 0, 1)',
                  backgroundColor: 'rgba(217, 217, 217, 1)',
                },
              }}
              onClick={() => {
                setActiveButton('past');
                handlePast();
              }}
            >
              Past
            </Button>
          </Row>
          <Modal>
            <Modal.Open opens="calendar">
              <Row $contentposition="right">
                <Button
                  variant="outlined"
                  sx={{
                    color: 'white',
                    backgroundColor: '#5a9eee',
                    borderRadius: '8px',
                    width: '45px',
                    height: '35px',
                    boxShadow: '0 4px 4px 0 rgba(0, 0, 0, 0.25)',
                    ':hover': {
                      color: 'rgba(0, 0, 0, 1)',
                      backgroundColor: 'rgba(217, 217, 217, 1)',
                    },
                  }}
                >
                  <EventAvailableOutlinedIcon />
                </Button>
              </Row>
            </Modal.Open>
            <Modal.Window name="calendar">
              <Calendar />
            </Modal.Window>
          </Modal>
        </Row>
        <Row style={{ marginTop: 20 }}>
          <StyledDate>{formattedSelectedDate}</StyledDate>
          <Row $contentposition="right">
            <Count style={{ boxShadow: '0 4px 4px 0 rgba(0, 0, 0, 0.25)' }}>
              {showUpcoming ? upcomingData?.length || 0 : pastData?.length || 0}
            </Count>
          </Row>
        </Row>

        <Row type="vertical" style={{ background: '', marginRight: 10 }}>
          {showUpcoming ? (
            upcomingData.length === 0 ? (
              <StyledParagraph height="45vh">
                No upcoming appointments found on selected date.
              </StyledParagraph>
            ) : (
              <AnimatePresence>
                {upcomingData &&
                  upcomingData.map((item) => (
                    <SwipeElement
                      key={item._id}
                      additionalContent={
                        <AppointmentAvatar
                          name={item.name}
                          mobile={item.phone}
                          Token={item.token}
                          Slot={item.slotNo}
                          Time={item.updatedAt}
                          onClick={() =>
                            navigate({ to: `/editAppointment/${item._id}` })
                          }
                        />
                      }
                      onDelete={() => handleDelete(item._id)}
                      onSave={() => handleSave(item._id)}
                    />
                  ))}
              </AnimatePresence>
            )
          ) : pastData.length === 0 ? (
            <StyledParagraph height="45vh">
              No past appointments found on selected date.
            </StyledParagraph>
          ) : (
            <Row type="vertical" size="xxLarge" style={{ marginTop: 20 }}>
              {pastData &&
                pastData.map((item) => (
                  <AppointmentAvatar
                    key={item._id}
                    name={item.name}
                    mobile={item.phone}
                    Token={item.token}
                    Slot={item.slotNo}
                    Time={item.updatedAt}
                  />
                ))}
            </Row>
          )}
        </Row>
      </Row>
      <FixedAddButton onClick={handleClick} />
    </>
  );
}
