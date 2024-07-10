import { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import Input from '../../components/Input';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import Button from '@mui/material/Button';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import Row from '../../components/Row';
import Modal, { ModalContext } from '../../components/Modal';
import ConfirmationDialog from '../../components/ConfirmationDialog';
import { useUser } from '../../context/userContext';
import toast from 'react-hot-toast';
import { updateDoctor } from '../../services/realmServices';

interface Data {
  upiId: string;
}

const PaymentInfoContainer = styled.div`
  margin: 1rem 0;
  padding: 1rem;
  border-radius: 4px;
`;

const UpiIdContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
  justify-content: start;
  margin-left: 0rem;
`;

const NewUpiIdContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: start;
  margin-top: 0.05;
  margin-left: 2rem;
`;

const SaveDeleteContainer = styled.div`
  padding: 10px;
  font-size: 25px;
  display: flex;
`;

const IconContainer = styled.span`
  padding: 5px;
  font-size: 35px;
  cursor: pointer;
`;

const InputContainer = styled.div`
  flex-grow: 0;
  display: flex;
  justify-content: center;
`;

const PaymentInfo = () => {
  const { user, setUser } = useUser();
  const [upiIds, setUpiIds] = useState<Data[]>(
    user ? user.upiId.map((id) => ({ upiId: id })) : []
  );
  const [newUpiId, setNewUpiId] = useState('');
  const [showInput, setShowInput] = useState(false);
  const { closeModal } = useContext(ModalContext);

 useEffect(() => {
   // Apply the same mapping in useEffect
   if (user) {
     setUpiIds(user.upiId.map((id) => ({ upiId: id })));
   }
 }, [user]);

  const handleAddClick = () => {
    setShowInput(true);
  };

   const handleSaveUpiId = async () => {
     if (newUpiId.trim() !== '') {
       try {
        if(user === null) return;
         await updateDoctor(user._id, newUpiId, 'update');
         const updatedUser = {
           ...user,
           // Ensure newUpiId is added as a Data object
           upiId: [...user.upiId, newUpiId],
         };
         setUser(updatedUser);
         // Update upiIds state to include the new Data object
         setUpiIds((prev) => [...prev, { upiId: newUpiId }]);
         setNewUpiId('');
         toast.success('UPI ID added successfully');
         setShowInput(false);
       } catch (error) {
         toast.error('Failed to add UPI ID');
       }
     }
   };

  const handleDeleteUpiId = async (upi:string) => {
    try {
      if (user === null) return;
      await updateDoctor(user._id, upi, 'delete');
      const updatedUser = {
        ...user,
        upiId: user.upiId.filter((id) => id !== upi),
      };
      setUser(updatedUser);
      closeModal();
      toast.success('UPI ID deleted successfully');
      
    } catch (error) {
      toast.error('Failed to delete UPI ID');
    }
  };

  const handleCancel = () => {
    setNewUpiId('');
    setShowInput(false);
  };
console.log(upiIds);

  return (
    <PaymentInfoContainer>
      {upiIds.map((upiId, index) => (
        <Row $contentposition="center" key={upiId.upiId}>
          <UpiIdContainer>
            <InputContainer>
              <Input
                width="240px"
                type="text"
                label={`UPI ID ${index + 1}`}
                value={upiId.upiId}
                readOnly
              />
            </InputContainer>
            <Modal>
              <Modal.Open opens="Delete-UPI">
                <IconContainer>
                  <DeleteOutlineOutlinedIcon fontSize="large" />
                </IconContainer>
              </Modal.Open>
              <Modal.Window name="Delete-UPI">
                <ConfirmationDialog
                  title="Confirm Delete"
                  confirmText="Yes"
                  cancelText="No"
                  onConfirm={() => handleDeleteUpiId(upiId.upiId)}
                  closeModal={closeModal}
                >
                  <p>Are you sure you want to delete the UPI ID?</p>
                </ConfirmationDialog>
              </Modal.Window>
            </Modal>
          </UpiIdContainer>
        </Row>
      ))}
      {showInput ? (
        <Row $contentposition="center">
          <NewUpiIdContainer>
            <InputContainer>
              <Input
                type="text"
                label={`UPI ID ${upiIds.length + 1}`}
                width="210px"
                value={newUpiId}
                onChange={(e) => setNewUpiId(e.target.value)}
                placeholder="Enter your UPI id"
              />
            </InputContainer>
            <SaveDeleteContainer>
              <IconContainer onClick={handleSaveUpiId}>
                <SaveOutlinedIcon fontSize="large" />
              </IconContainer>
              <IconContainer onClick={handleCancel}>
                <DeleteOutlineOutlinedIcon fontSize="large" />
              </IconContainer>
            </SaveDeleteContainer>
          </NewUpiIdContainer>
        </Row>
      ) : (
        <Row $contentposition="center">
          <Button
            variant="outlined"
            sx={{
              color: 'white',
              backgroundColor: '#5A9EEE',
              textTransform: 'none',
              width: '126px',
              height: '45px',
              fontSize: '20px',
              fontWeight: '400',
              boxShadow: '0 4px 4px 0 rgba(0, 0, 0, 0.25)',
              alignItems: 'center',
              borderRadius: '11px',
              ':hover': { backgroundColor: '#5A9EEE', color: 'white' },
            }}
            onClick={handleAddClick}
          >
            <AddOutlinedIcon />
            Add Id
          </Button>
        </Row>
      )}
    </PaymentInfoContainer>
  );
};

export default PaymentInfo;
