import { useContext } from 'react';
import ConfirmationDialog from '../../components/ConfirmationDialog';
import Modal, { ModalContext } from '../../components/Modal';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import { IconButton } from '@mui/material';
import { deleteAppoitment } from '../../services/realmServices';
import { useNavigate } from '@tanstack/react-router';

type Prop = {
  id: string | undefined;
};
function DeleteAppointment({ id }: Prop) {
  const { closeModal } = useContext(ModalContext);
  const navigate = useNavigate();
  const handleDeleteSlot = async () => {
    if (id === undefined) return;
    await deleteAppoitment(id);
    closeModal();
    navigate({ to: '/' });
    console.log('deleted');
  };
  return (
    <Modal>
      <Modal.Open opens="Delete-slot">
        <IconButton
          aria-label="edit"
          size="large"
          sx={{
            color: 'black',
            ':hover': {
              background: 'none',
            },
          }}
        >
          <DeleteOutlineOutlinedIcon fontSize="inherit" />
        </IconButton>
      </Modal.Open>
      <Modal.Window name="Delete-slot">
        <ConfirmationDialog
          title="Confirm Delete"
          confirmText="Yes"
          cancelText="No"
          onConfirm={() => handleDeleteSlot()}
          closeModal={closeModal}
        >
          <p>Are you sure you want to delete this Appointement?</p>
        </ConfirmationDialog>
      </Modal.Window>
    </Modal>
  );
}

export default DeleteAppointment;
