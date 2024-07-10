import { useContext } from 'react';
import styled from 'styled-components';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Button } from '@mui/material';
import { ModalContext } from './Modal';
import { DateContext } from '../context/DateContext';

const Container = styled.div`
  width: 320px;
  margin: auto;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  background-color: white;
  color: black;
`;

const HeaderText = styled.div`
  font-size: 20px;
  font-weight: bold;
`;

const DatePickerWrapper = styled.div`
  .react-datepicker {
    width: 100%;
    border: none;
    background-color: #5a9eee;
    display: flex;
    flex-direction: column;
  }

  .react-datepicker__header {
    border-bottom: none;
    background-color: white;
  }

  .react-datepicker__day-name,
  .react-datepicker__day {
    width: 2.5rem;
    height: 2.5rem;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    background-color: white;
  }
  .react-datepicker__week {
    background-color: white;
  }
  .react-datepicker__day--today {
    background-color: white;
  }

  .react-datepicker__day--selected {
    background-color: #5a9eee;
    color: white;
  }

  .react-datepicker__day--keyboard-selected {
    background-color: #5a9eee;
    color: white;
  }

  .react-datepicker__navigation--previous {
    border-right-color: white;
  }

  .react-datepicker__navigation--next {
    border-left-color: white;
  }
`;

const Footer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
`;

function Calendar() {
  const { selectedDate, setSelectedDate } = useContext(DateContext);
  console.log(selectedDate);

  const { closeModal } = useContext(ModalContext);

  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'short',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    };
    const dateString = date.toLocaleDateString('en-US', options);
    return dateString.replace(/, /g, ' ');
  };

  return (
    <Container>
      <Header>
        <HeaderText>
          {selectedDate ? formatDate(selectedDate) : 'Select Date'}
        </HeaderText>
      </Header>
      <DatePickerWrapper>
        <DatePicker
          selected={selectedDate}
          onChange={(date: Date) => setSelectedDate(date)}
          inline
          renderCustomHeader={({
            date,
            decreaseMonth,
            increaseMonth,
            decreaseYear,
            increaseYear,
          }) => (
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '12px',
                backgroundColor: ' #5A9EEE',
                color: 'white',
              }}
            >
              <button
                onClick={decreaseYear}
                style={{ background: 'none', border: 'none', color: 'white' }}
              >
                {'<<'}
              </button>
              <button
                onClick={decreaseMonth}
                style={{ background: 'none', border: 'none', color: 'white' }}
              >
                {'<'}
              </button>
              <span>
                {date.toLocaleDateString('en-US', {
                  month: 'long',
                  year: 'numeric',
                })}
              </span>
              <button
                onClick={increaseMonth}
                style={{ background: 'none', border: 'none', color: 'white' }}
              >
                {'>'}
              </button>
              <button
                onClick={increaseYear}
                style={{ background: 'none', border: 'none', color: 'white' }}
              >
                {'>>'}
              </button>
            </div>
          )}
        />
      </DatePickerWrapper>
      <Footer>
        <Button onClick={closeModal}>Cancel</Button>
        <Button onClick={closeModal}>OK</Button>
      </Footer>
    </Container>
  );
}

export default Calendar;
