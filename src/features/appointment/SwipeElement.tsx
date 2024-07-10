import { useState } from 'react';
import { useOutsideClick } from '../../hooks/useOutsideClick';
import { motion, useAnimation } from 'framer-motion';
import styled from 'styled-components';
import Row from '../../components/Row';
import { Button } from '@mui/material';

const Item = styled(motion.div)`
  width: 100%;
  padding: 20px 0;
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  z-index: 2;
  position: relative;
  overflow: hidden;
`;

const DragBound = styled(motion.div)`
  width: 100%;
  position: relative;
  overflow: hidden;
`;

const DeleteContainer = {
  position: 'absolute',
  top: 0,
  right: 0,
  width: '100%',
  color: '#f22222',
  zIndex: 1,
  height: '100%',
  display: 'flex',
  justifyContent: 'flex-end',
  alignItems: 'center',
  padding: '0 -10px 0 0',
};
const SaveContainer = {
  position: 'absolute',
  top: 0,
  right: 0,
  width: '100%',
  color: '#368B29',
  zIndex: 1,
  height: '100%',
  display: 'flex',
  justifyContent: 'flex-start',
  alignItems: 'center',
  padding: '0 -10px 0 0',
};

const DeleteText = styled.span`
  font-size: 12px;
  letter-spacing: 1px;
  font-weight: 600;
  color: #f22222;
  text-transform: uppercase;
`;

const SaveText = styled.span`
  font-size: 12px;
  letter-spacing: 1px;
  font-weight: 600;
  color: #368b29;
  text-transform: uppercase;
`;

const swipeAnim = {
  reset: { x: 0, transition: { duration: 0.5 } },
  remove: {
    x: -300,
    opacity: 0,
    transition: { duration: 0.2 },
  },
  save: {
    x: 300,
    opacity: 0,
    transition: { duration: 0.2 },
  },
};

interface SwipeElementProps {
  onDelete: () => void;
  onSave: () => void;
  additionalContent: React.ReactNode;
}

const SwipeElement: React.FC<SwipeElementProps> = ({
  onDelete,
  onSave,
  additionalContent,
}) => {
  const containerControls = useAnimation();
  const contentControls = useAnimation();
  // const ref = useRef<HTMLDivElement>(null);

  const [willRemove, setWillRemove] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [showSave, setShowSave] = useState(false);

  const ref = useOutsideClick(async () => {
    await contentControls.start(swipeAnim.reset);
    setShowDelete(false);
    setShowSave(false);
  });

  const removeAnimation = async () => {
    setWillRemove(true);
    await contentControls.start(swipeAnim.remove);
    await containerControls.start({
      opacity: 0,
      transition: { duration: 0.2 },
    });
    onDelete();
  };

  const saveAnimation = async () => {
    setWillRemove(true);
    await contentControls.start(swipeAnim.save);
    await containerControls.start({
      opacity: 0,
      transition: { duration: 0.2 },
    });
    onSave();
  };

  const handleDragEnd = async (
    _: MouseEvent,
    dragInfo: { offset: { x: number }; velocity: { x: number } }
  ) => {
    const { offset, velocity } = dragInfo;
    if (offset.x < -700) {
      await removeAnimation();
      onDelete();
      return;
    }
    if (offset.x > 700) {
      await saveAnimation();
      onSave();
      return;
    }
    if (
      (offset.x < 0 && velocity.x > -5) ||
      (offset.x < 0 && offset.x > -80) ||
      (offset.x > 0 && offset.x < 80)
    ) {
      await contentControls.start(swipeAnim.reset);
      setShowDelete(false);
      setShowSave(false);
    }
  };

  const handleDrag = (_: MouseEvent, info: { offset: { x: number } }) => {
    if (info.offset.x > 50) {
      setShowSave(true);
      setShowDelete(false);
    } else if (info.offset.x < -50) {
      setShowDelete(true);
      setShowSave(false);
    }
  };

  return (
    <DragBound
      animate={containerControls}
      layout={willRemove ? 'position' : undefined}
      ref={ref as React.RefObject<HTMLDivElement>}
    >
      <Item
        drag="x"
        dragElastic={{ right: 0, left: 0.6 }}
        dragConstraints={{ right: 100, left: -80 }}
        onDragEnd={handleDragEnd}
        onDrag={handleDrag}
        whileTap={{ cursor: 'grabbing' }}
        style={{ cursor: 'grab' }}
        animate={contentControls}
        layout={willRemove ? 'position' : 'size'}
      >
        {additionalContent}
      </Item>
      {showDelete && (
        <Button
          color="secondary"
          onClick={async () => {
            await removeAnimation();
          }}
          sx={DeleteContainer}
        >
          <DeleteText>Delete</DeleteText>
        </Button>
      )}
      {showSave && (
        <Button
          color="success"
          onClick={async () => {
            await saveAnimation();
          }}
          sx={SaveContainer}
        >
          <SaveText>
            <Row type="vertical" size="small">
              <Row>Mark As</Row>
              <Row>Complete</Row>
            </Row>
          </SaveText>
        </Button>
      )}
    </DragBound>
  );
};

export default SwipeElement;
