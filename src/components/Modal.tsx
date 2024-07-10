import {
  cloneElement,
  createContext,
  useContext,
  useState,
  ReactNode,
  RefObject,
  ReactElement,
} from 'react';
import { createPortal } from 'react-dom';
import { useOutsideClick } from '../hooks/useOutsideClick';
import styled, { keyframes } from 'styled-components';

const popIn = keyframes`
  0% { transform: scale(0.7); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
`;

const StyledModal = styled.div`
  position: fixed;
  /* background-color: var(--color-primary-50); */
  background-color: white;
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-lg);
  animation: ${popIn} 0.2s ease;
  padding: 2rem 2rem;
  transition: all 0.5s;
`;

const Overlay = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background-color: var(--backdrop-color);
  backdrop-filter: blur(4px);
  z-index: 1000;
  transition: all 0.5s;
`;

interface ModalContextProps {
  openModalName: string;
  closeModal: () => void;
  openModal: (name: string) => void;
}

export const ModalContext = createContext<ModalContextProps>({
  openModalName: '',
  closeModal: () => {},
  openModal: () => {},
});

interface ModalProps {
  children: ReactNode;
}

function Modal({ children }: ModalProps) {
  const [openModalName, setOpenModalName] = useState('');

  const closeModal = () => setOpenModalName('');

  const openModal = (name: string) => setOpenModalName(name);

  return (
    <ModalContext.Provider value={{ openModalName, closeModal, openModal }}>
      {children}
    </ModalContext.Provider>
  );
}

interface OpenProps {
  opens: string;
  children: ReactElement;
}

function Open({ opens, children }: OpenProps) {
  const { openModal } = useContext(ModalContext);
  return cloneElement(children, {
    onClick: () => openModal(opens),
  });
}

interface WindowProps {
  name: string;
  children: ReactElement<{ closeModal: () => void }>;
}

function Window({ name, children }: WindowProps) {
  const { openModalName, closeModal } = useContext(ModalContext);

  const ref = useOutsideClick(closeModal);

  if (name !== openModalName) return null;

  return createPortal(
    <Overlay>
      <StyledModal ref={ref as RefObject<HTMLDivElement>}>
        <div>
          {cloneElement(children, {
            closeModal: closeModal,
          })}
        </div>
      </StyledModal>
    </Overlay>,
    document.body
  );
}

Modal.Open = Open;
Modal.Window = Window;

export default Modal;
