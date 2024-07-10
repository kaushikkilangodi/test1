import { IoSaveOutline } from 'react-icons/io5';
import { AiOutlineDelete } from 'react-icons/ai';
import Row from '../../components/Row';
import Modal, { ModalContext } from '../../components/Modal';
import ConfirmationDialog from '../../components/ConfirmationDialog';
import styled from 'styled-components';
import { useContext, useState, useEffect } from 'react';
import { IconButton } from '@mui/material';
import { TimePicker } from 'antd';
import moment from 'moment';
import dayjs, { Dayjs } from 'dayjs';

interface Slot {
  id: number;
  ObjectID: string;
  time: string; // Assuming this is a string in format "HH:mm - HH:mm"
  isDirty: boolean;
  people: number;
  date: string;
}

interface SlotCardProps {
  slot: Slot;
  slots: Slot[];
  handleTimeChange: (id: number, value: string) => void;
  handlePeopleChange: (id: number, value: number) => void;
  saveSlot: (id: number) => void;
  handleDeleteSlot: (id: string) => void;
}

const SlotCard1 = styled.div`
  padding: 15px;
  margin-bottom: 20px;
  border: 1px solid #ddd;
  border-radius: 10px;
  box-shadow: 0 2px rgba(0, 0, 0, 0.1);
`;

const SlotLabel = styled.label`
  display: block;
  margin-bottom: 6px;
  font-size: 14px;
  line-height: 30px;
`;

const SlotInput = styled.input`
  padding: 10px;
  font-size: 12px;
  border: 1px solid #ccc;
  border-radius: 10px;
  width: 100%;

  &:focus {
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  }
`;

const IconContainer = styled.div`
  display: flex;
  justify-content: end;
  gap: 2px;
  font-size: large;
`;

export default function SlotCard({
  slot,
  slots,
  handleTimeChange,
  handlePeopleChange,
  saveSlot,
  handleDeleteSlot,
}: SlotCardProps) {
  const { closeModal } = useContext(ModalContext);
  const { RangePicker } = TimePicker;
  const [value, setValue] = useState<[Dayjs | null, Dayjs | null]>([
    null,
    null,
  ]);

  useEffect(() => {
    if (slot.time) {
      const [start, end] = slot.time
        .split(' - ')
        .map((t) => dayjs(moment(t, 'hh:mm A').toISOString()));
      setValue([start, end]);
    }
  }, [slot.time]);

  const onChange = (dates: [Dayjs | null, Dayjs | null] | null) => {
    if (dates) {
      setValue(dates);
      const formattedTime = `${dates[0]?.format('hh:mm A')} - ${dates[1]?.format('hh:mm A')}`;
      handleTimeChange(slot.id, formattedTime);
    }
  };

  return (
    <SlotCard1 key={slot.id}>
      <Row>
        <Row style={{ color: '#5a9eee' }}>Slot {slot.id}</Row>
        <IconContainer>
          {slot.isDirty && (
            <IconButton
              aria-label="edit"
              size="large"
              sx={{
                color: 'black',
                ':hover': {
                  background: 'none',
                },
              }}
              onClick={() => saveSlot(slot.id)}
            >
              <IoSaveOutline />
            </IconButton>
          )}
          {slots && (
            <Modal>
              <Modal.Open opens="Delete-slot">
                <IconButton
                  aria-label="delete"
                  size="large"
                  sx={{
                    color: 'black',
                    ':hover': {
                      background: 'none',
                    },
                  }}
                >
                  <AiOutlineDelete />
                </IconButton>
              </Modal.Open>
              <Modal.Window name="Delete-slot">
                <ConfirmationDialog
                  title="Confirm Delete"
                  cancelText="No"
                  confirmText="Yes"
                  onConfirm={() => handleDeleteSlot(slot.ObjectID)}
                  closeModal={closeModal}
                >
                  <p>Are you sure you want to delete the slot?</p>
                </ConfirmationDialog>
              </Modal.Window>
            </Modal>
          )}
        </IconContainer>
      </Row>

      <Row type="vertical" size="small">
        <Row>
          <SlotLabel htmlFor={`time-${slot.id}`}>Schedule:</SlotLabel>
        </Row>
        <Row>
            <RangePicker
            id={`time-${slot.id}`}
            placeholder={['Start Time', 'End Time']}
            style={{ width: '100%', borderRadius: '10px', color: '#000' }}
            format="hh:mm A"
            onChange={onChange}
            value={value}
            disabled={!slot.isDirty}
            use12Hours
          />
        </Row>

        <Row style={{ marginTop: 10 }}>
          <SlotLabel htmlFor={`people-${slot.id}`}>People per slot:</SlotLabel>
        </Row>
        <Row>
          <SlotInput
            type="number"
            id={`people-${slot.id}`}
            value={slot.people}
            onChange={(e) =>
              handlePeopleChange(slot.id, parseInt(e.target.value))
            }
          />
        </Row>
      </Row>
    </SlotCard1>
  );
}
