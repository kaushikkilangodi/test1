import { useContext } from 'react';
import ConfirmationDialog from '../../components/ConfirmationDialog';
import { ModalContext } from '../../components/Modal';
import { useNavigate } from '@tanstack/react-router';


const Logout = () => {
  const { closeModal } = useContext(ModalContext);
  const navigate = useNavigate();
  const handleLogout = async () => {
    // await logout(); // Perform the logout operation
    localStorage.clear();
    navigate({ to: '/install' });
    closeModal();
    console.log('Logged out');
    // Close the modal after logging out
  };

  return (
    <ConfirmationDialog
      title="Confirm Logout"
      confirmText="Logout"
      cancelText="Cancel"
      onConfirm={handleLogout}
      closeModal={closeModal}
    >
      <p>Are you sure you want to logout?</p>
    </ConfirmationDialog>
  );
};

export default Logout;
