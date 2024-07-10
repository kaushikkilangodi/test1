import { useCallback, useContext, useEffect, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import styled from 'styled-components';
import Row from '../../components/Row';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import { DateContext } from '../../context/DateContext';
import { Button, IconButton } from '@mui/material';
import { IoClose, IoSaveOutline } from 'react-icons/io5';
import {
  LastSlot,
  copyFromLastWeek,
  insert_Slot_Copy_LastWeek,
  sendSlots,
} from '../../services/realmServices';
import { toast } from 'react-hot-toast';

interface ResultType {
  [formattedDate: string]: LastSlot[];
}

const Week = styled.div`
  width: 60px;
  height: 56px;
  border-radius: 4px;
  background-color: #5a9eee;
  color: white;
  font-size: 12px;
  font-weight: 400;
`;

const WeekDays = styled.div`
  width: 220px;
  height: 56px;
  border-radius: 4px;
  border: 2px solid #4e8ad1;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  cursor: pointer;
  @media (max-width: 380px) {
    width: 150px;
  }
`;

const SlotRemaining = styled.div`
  display: flex;
  justify-content: center;
  width: 57px;
  height: 25px;
  border-radius: 4px;
  border: 2px solid #4e8ad1;
  font-size: 12px;
  align-items: center;
`;

const PendingSlot = styled.div`
  display: flex;
  justify-content: center;
  font-weight: 400;
  line-height: 13.8px;
  font-style: Helvetica;
  align-items: center;
  width: 57px;
  height: 25px;
  border-radius: 4px;
  border: 2px solid #4e8ad1;
  margin-top: 2px;
  font-size: 12px;
`;

const DayContainer = styled.div`
  width: 220px;
  height: 54px;
  margin-left: 5px;
  margin-right: 5px;
  cursor: pointer;
  position: relative;
  display: flex;
`;

const Day = styled.div<{ startMinute: number; endMinute: number }>`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #4e8ad1;
  height: 100%;
  position: absolute;
  left: ${(props) => (props.startMinute / 1440) * 100}%;
  width: ${(props) => ((props.endMinute - props.startMinute) / 1440) * 100}%;
`;

const NavigationContainer = styled.div`
  background: #5a9eee3d;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ButtonContainer = styled.div`
  display: flex;
  align-items: center;
  margin-right: 15px;
`;

const responsiveButtonStyle = {
  fontSize: '12px',
  marginLeft: '2px',
  fontWeight: 600,
  minWidth: '120px',
  width: 'auto',
  maxWidth: '100%',
  borderRadius: '23px',
  height: '27px',
  backgroundColor: '#5a9eee',
  color: 'white',
  textTransform: 'none',
  ':hover': {
    color: 'white',
    backgroundColor: '#5a9eee',
  },
};

const AppointmentInfo = () => {
  const navigate = useNavigate();
  const { selectedDate, setSelectedDate } = useContext(DateContext);
  const [showButtons, setShowButtons] = useState(false);
  const [result, setResult] = useState<ResultType>({});
  const [copiedSlots, setCopiedSlots] = useState<ResultType>({});
  const [saveTrigger, setSaveTrigger] = useState(0);
  // console.log('cpiedSlots', copiedSlots);

  const handlePreviousWeek = useCallback(() => {
    if (selectedDate) {
      const prevWeek = new Date(selectedDate);
      prevWeek.setDate(prevWeek.getDate() - 7);
      setSelectedDate(prevWeek);
    }
  }, [selectedDate, setSelectedDate]);

  const handleNextWeek = useCallback(() => {
    if (selectedDate) {
      const nextWeek = new Date(selectedDate);
      nextWeek.setDate(nextWeek.getDate() + 7);
      setSelectedDate(nextWeek);
    }
  }, [selectedDate, setSelectedDate]);

  const handleClick = useCallback(
    (date: string) => {
      localStorage.setItem('selectedDate', date);
      navigate({ to: '/slots' });
    },
    [navigate]
  );

  const startOfWeek = new Date(selectedDate || new Date());
  startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay() + 1);
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);

  const daysOfWeek = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + i);
    return {
      day: new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(date),
      date: new Intl.DateTimeFormat('en-GB', {
        day: 'numeric',
        month: 'short',
      }).format(date),
      year: date.getFullYear(),
    };
  });

  const yearOfFirstDay = daysOfWeek[0].year;

  const dateRange = `${new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(startOfWeek)} - ${new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(endOfWeek)}`;

  useEffect(() => {
    const [start, end] = dateRange.split(' - ');
    console.log('start', start, 'end', end);
    
    sendSlots(start, end)
      .then((result) => setResult(result))
      .catch((error) => console.error(error));
  }, [dateRange, saveTrigger]);

  const buttonStyle = {
    ...responsiveButtonStyle,
    ...(showButtons
      ? {
          backgroundColor: '#FFFFFF',
          color: '#000000',
          border: '1px solid #D9D9D9',
          fontSize: '12px',
          lineHeight: '14.52px',
          fontStyle: 'Inter',
        }
      : {}),
  };

  const timeToMinutes = (time: string) => {
    const [timePart, period] = time.split(' ');
    const [hours, minutes] = timePart.split(':');
    let hoursInt = parseInt(hours);
    const minutesInt = parseInt(minutes);

    if (period === 'PM' && hoursInt !== 12) {
      hoursInt += 12;
    } else if (period === 'AM' && hoursInt === 12) {
      hoursInt = 0; // Midnight edge case
    }

    return hoursInt * 60 + minutesInt;
  };

  const formatDate = (day: string, month: string, year: number) => {
    const date = new Date(`${day} ${month} ${year}`);
    const monthString = (date.getMonth() + 1).toString().padStart(2, '0');
    const dayString = date.getDate().toString().padStart(2, '0');
    return `${date.getFullYear()}-${monthString}-${dayString}`;
  };

  const getSlotRanges = (day: string) => {
    const [dayOfMonth, month] = day.split(' ');
    const formattedDate = formatDate(dayOfMonth, month, yearOfFirstDay);

    const slots =
      copiedSlots[formattedDate] && copiedSlots[formattedDate].length > 0
        ? copiedSlots[formattedDate]
        : result[formattedDate];

    return slots
      ? slots.map((slot: { slotTime: string }) => {
          const [start, end] = slot.slotTime.split(' - ');
          const startMinute = timeToMinutes(start);
          const endMinute = timeToMinutes(end);

          return {
            startMinute,
            endMinute,
          };
        })
      : [];
  };
  const handleCopyFromLastWeek = async () => {
    const copiedData = await copyFromLastWeek(startOfWeek);
    if (!copiedData) return;
    setCopiedSlots(copiedData);
    setShowButtons(true);
  };

  const handleSave = useCallback(async () => {
    if (selectedDate === null) return;
    await insert_Slot_Copy_LastWeek(copiedSlots);
    setSaveTrigger((current) => current + 1);
    toast.success('Slots saved successfully');
    setCopiedSlots({});
    setShowButtons(false);
  }, [copiedSlots, selectedDate, setSaveTrigger]);

  const handleCancel = useCallback(() => {
    setCopiedSlots({});
    setShowButtons(false);
  }, []);

  return (
    <>
      <NavigationContainer>
        <IoIosArrowBack
          onClick={handlePreviousWeek}
          style={{ cursor: 'pointer' }}
        />
        <h4
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {dateRange}
        </h4>
        <IoIosArrowForward
          onClick={handleNextWeek}
          style={{ cursor: 'pointer' }}
        />
      </NavigationContainer>
      <Row type="vertical">
        <Row $contentposition={showButtons ? 'spaceBetween' : 'center'}>
          <Row
            $contentposition={showButtons ? 'left' : 'center'}
            style={{ marginLeft: 10 }}
          >
            {result && Object.keys(result).length === 0 && (
              <Button
                variant="outlined"
                sx={buttonStyle}
                onClick={handleCopyFromLastWeek}
              >
                Copy from last week
              </Button>
            )}
          </Row>
          {showButtons && (
            <ButtonContainer>
              <IconButton
                aria-label="save"
                size="large"
                sx={{
                  color: 'black',
                  ':hover': {
                    background: 'none',
                  },
                }}
                onClick={handleSave}
              >
                <IoSaveOutline />
              </IconButton>
              <IconButton
                aria-label="close"
                size="large"
                sx={{
                  color: 'black',
                  ':hover': {
                    background: 'none',
                  },
                }}
                onClick={handleCancel}
              >
                <IoClose />
              </IconButton>
            </ButtonContainer>
          )}
        </Row>
        {daysOfWeek.map((day, dayIndex) => {
          const slotRanges = getSlotRanges(day.date);

          return (
            <Row key={dayIndex} $contentposition="center">
              <Week>
                <Row $contentposition="center" style={{ marginTop: 10 }}>
                  {day.day}
                </Row>
                <Row $contentposition="center">{day.date}</Row>
              </Week>
              <WeekDays onClick={() => handleClick(day.date)}>
                <DayContainer>
                  {slotRanges.map(
                    (
                      range: { startMinute: number; endMinute: number },
                      index: number
                    ) => (
                      <Day
                        key={index}
                        startMinute={range.startMinute}
                        endMinute={range.endMinute}
                      />
                    )
                  )}
                </DayContainer>
              </WeekDays>
              <Row type="vertical" size="small">
                <SlotRemaining>S {slotRanges.length}</SlotRemaining>
                <PendingSlot>P</PendingSlot>
              </Row>
            </Row>
          );
        })}
      </Row>
    </>
  );
};

export default AppointmentInfo;
