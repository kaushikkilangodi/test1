import { useEffect, useState } from 'react';
import styled from 'styled-components';
import Input from '../../components/Input';
import { Button, IconButton } from '@mui/material';
import Row from '../../components/Row';
import {
  createAppointment,
  // updateAppointmen,
  displaySlots,
  edit_App_Slot_No,
  fetchContactById,
  // fetchContactById,
  getUpcomingAppById,
} from '../../services/realmServices';
import UserAvatar from '../../components/UserAvatar';
import { FiEdit } from 'react-icons/fi';
import { useParams, useNavigate, useLocation } from '@tanstack/react-router';

interface Slot {
  _id: string;
  slotNo: number;
  slotTime: string;
}

const Container = styled.div`
  width: 100%;
  height: 100%;
  padding: 10px;
  margin: 0 auto;
`;

const FlexContainer = styled.div`
  width: 100%;
`;

const SlotContainer = styled.div`
  width: 100%;
  height: 100%;
  margin: 10px 50px 20px 20px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;

  @media (max-width: 1200px) {
    margin: 10px 30px 20px 10px;
    gap: 15px;
  }

  @media (max-width: 768px) {
    margin: 10px 20px 20px 10px;
    gap: 10px;
  }

  @media (max-width: 480px) {
    margin: 10px 10px 20px 5px;
    gap: 2px;
  }
`;

const SlotItem = styled.div<{ $isSelected: boolean }>`
  width: 100%;
  max-width: 160px;
  height: 90%;
  border: 1px solid rgba(217, 217, 217, 1);
  border-radius: 12px;
  background-color: ${({ $isSelected }) => ($isSelected ? '#5A9EEE' : 'white')};
  cursor: pointer;
  padding: 7px 10px 10px 10px;
  position: relative;
  color: ${({ $isSelected }) => ($isSelected ? 'black' : '#5A9EEE')};
`;

const Circle = styled.div`
  width: 9px;
  height: 9px;
  background-color: white;
  border-radius: 50%;
  position: absolute;
  top: 5px;
  right: 5px;
`;

const TextArea = styled.textarea`
  width: 95%;
  height: 124px;
  padding: 10px;
  border-radius: 12px;
  border: 1px solid #d9d9d9;
`;
const Comments = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 10px;
  margin-bottom: 20px;
`;
const StyledError = styled.div`
  background-color: #fde2e2;
  height: 50px;
  border-radius: 12px;
  color: red;
  font-size: 16px;
  margin-top: 10px;
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
  align-items: center;
`;
interface Data {
  _id:string;
  name: string;
  phone: string;
  date: string;
  slotNo: number;
  comments: string;
  contactId: string;
}

const CreateAppointment = () => {
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | undefined>();
  const [comments, setComments] = useState('');
  const [formattedDate, setFormattedDate] = useState('');
  const [slots, setSlots] = useState<Slot[]>([]);
  const [userData, setUserData] = useState<Data | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams({ strict: false });
  const isEditAppointment =
    location.pathname.split('/')[1] === 'editAppointment';

  useEffect(() => {
    const getSlots = async () => {
      if (!selectedDate) return;
      const date = new Date(selectedDate);
      const formatDate = `${date.getDate()} ${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;
      setFormattedDate(formatDate);
      const fetchedSlots = await displaySlots(formatDate);
      console.log(fetchedSlots);

      setSlots(fetchedSlots);
    };

    getSlots();
  }, [selectedDate]);

  useEffect(() => {
    const fetchData = async () => {
      if (isEditAppointment) {
        if (id === undefined) return;
        const data = await getUpcomingAppById(id);
        if (data === undefined) return;
        console.log('hello', data);

        setUserData(data);

        if (isEditAppointment && data) {
          setSelectedDate(data.date);
          setComments(data.comment);
          setSelectedSlot(data.slotNo);
        }
      } else {
        if (id === undefined) return;
        const data = await fetchContactById(id);
        setUserData(data); 
        console.log('user',data);
         
        console.log('user');
        
      }
    };

    fetchData();
  }, [id, isEditAppointment]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSlot || !formattedDate) return;
    if (id === undefined) return;
    if (isEditAppointment) {
      console.log('selected', selectedSlot);
      console.log('🔥🔥🔥', id);

      const data = await edit_App_Slot_No(id, selectedSlot,comments);
      if (data) {
        navigate({ to: '/appointments' });
      }
    } else {
      await createAppointment(selectedSlot, formattedDate, id, comments);
      navigate({ to: '/appointments' });
    }
  };

  const isSaveEnabled = selectedSlot !== null && selectedDate !== undefined;

  if (userData === null) return null;
  // console.log(userData);

  return (
    <Container>
      <Row
        style={{
          marginLeft: 15,
          marginBottom: 30,
          marginTop: 20,
          color: '#000',
        }}
      >
        <UserAvatar name={userData.name} mobile={userData.phone} />
        <Row $contentposition="right">
          <IconButton
            aria-label="edit"
            size="large"
            sx={{
              color: '#000',
              ':hover': {
                background: 'none',
              },
            }}
            onClick={() =>
              navigate({ to: `/editcontact/${userData.contactId === undefined ? userData._id : userData.contactId}` })
            }
          >
            <FiEdit />
          </IconButton>
        </Row>
      </Row>
      <FlexContainer>
        <Input
          label=""
          type="date"
          id="appointmentDate"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          style={{ width: '100%' }}
          disabled={isEditAppointment}
        />
      </FlexContainer>
      {slots.length > 0 ? (
        <SlotContainer>
          {slots.map((slot) => (
            <SlotItem
              key={slot._id}
              $isSelected={selectedSlot === slot.slotNo}
              onClick={() => setSelectedSlot(slot.slotNo)}
            >
              <Circle />
              <div style={{ fontSize: '18.5px', fontWeight: 'bold' }}>
                <p>Slot {slot.slotNo}</p>
              </div>
              <div style={{ fontSize: '14px', color: 'black' }}>
                <p>(10/10)</p>
              </div>
              <div style={{ fontSize: '14px', color: 'black' }}>
                <p>{slot.slotTime}</p>
              </div>
            </SlotItem>
          ))}
        </SlotContainer>
      ) : (
        <StyledError>No slots available for the selected date.</StyledError>
      )}
      <Comments>
        <TextArea
          placeholder="Comments"
          value={comments}
          onChange={(e) => setComments(e.target.value)}
        />
      </Comments>
      <Row $contentposition="center">
        <Button
          type="submit"
          variant="outlined"
          sx={{
            color: 'white',
            backgroundColor: '#5A9EEE',
            fontWeight: '700',
            font: 'Helvetica',
            fontSize: '15px',
            borderRadius: '12px',
            width: '125px',
            height: '45px',
            ':hover': { backgroundColor: '#5A9EEE', color: 'white' },
          }}
          disabled={!isSaveEnabled}
          onClick={handleSubmit}
        >
          {isEditAppointment ? 'Update' : 'Save'}
        </Button>
      </Row>
    </Container>
  );
};

export default CreateAppointment;
