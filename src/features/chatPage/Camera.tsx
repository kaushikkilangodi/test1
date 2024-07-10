import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useSpring, animated } from 'react-spring';
import { useDrag } from 'react-use-gesture';
import CloseIcon from '@mui/icons-material/Close';
import CameraswitchOutlinedIcon from '@mui/icons-material/CameraswitchOutlined';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import CameraAltOutlinedIcon from '@mui/icons-material/CameraAltOutlined';

const SwitchCameraButton = styled.button`
  position: absolute;
  top: 20px;
  left: 20px;
  border: none;
  background: none;
  cursor: pointer;
  color: black;

  @media (max-width: 768px) {
    top: 10px;
  }

  @media (max-width: 480px) {
    top: 5px;
  }
`;

const StyledCapture = styled.div`
  position: absolute;
  bottom: 50px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: 100%;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  border: none;
  background: none;
  cursor: pointer;
  color: white;

  @media (max-width: 768px) {
    top: 10px;
    right: 10px;
  }

  @media (max-width: 480px) {
    top: 5px;
    right: 5px;
  }
`;

const TimerDisplay = styled.div`
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  color: white;
  font-size: 20px;
  background-color: black;
  padding: 10px;
  border-radius: 5px;

  @media (max-width: 768px) {
    font-size: 16px;
    top: 10px;
  }

  @media (max-width: 480px) {
    font-size: 14px;
    top: 5px;
  }
`;

const CameraOverlay = styled.div`
  position: fixed;
  top: 0;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 445px;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const VideoContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: 420px;
  margin-top: 10px;
  height: 100%;
`;

const IconTextContainer = styled(animated.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
`;

const StyledRow = styled.div`
  display: flex;
  justify-content: space-around;
  width: 100%;
  position: relative;
`;

interface CameraProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  recording: boolean;
  recordingDuration: string;
  handleCapturePhoto: () => void;
  handleStartRecording: () => void;
  handleStopRecording: () => void;
  handleSwitchCamera: () => void;
  handleCloseCamera: () => void;
}

export default function Camera({
  videoRef,
  recording,
  recordingDuration,
  handleCapturePhoto,
  handleStartRecording,
  handleStopRecording,
  handleSwitchCamera,
  handleCloseCamera,
}: CameraProps) {
  const [isVideoMode, setIsVideoMode] = useState(false);

  const [{ x }, set] = useSpring(() => ({ x: 0 }));

  const bind = useDrag(
    ({ down, movement: [mx], direction: [xDir], distance, cancel }) => {
      if (down && distance > 100) {
        cancel();
        setIsVideoMode(xDir > 0 ? true : false);
      }
      set({ x: down ? mx : 0 });
    }
  );

  useEffect(() => {
    set({ x: isVideoMode ? -50 : 50 });
  }, [isVideoMode, set]);

  const iconOpacity = (mode: boolean) => (isVideoMode === mode ? 1 : 0.3);

  return (
    <CameraOverlay>
      <VideoContainer>
        <video
          ref={videoRef}
          autoPlay
          playsInline
          style={{ width: '100%', height: '90%', objectFit: 'cover' }}
        ></video>
        {!recording && (
          <StyledCapture>
            <StyledRow {...bind()}>
              <IconTextContainer
                style={{
                  opacity: iconOpacity(false),
                  transform: x.to(
                    (x) => `translateX(${x + (isVideoMode ? 50 : 150)}%)`
                  ),
                }}
                onClick={() => setIsVideoMode(false)}
              >
                <CameraAltOutlinedIcon
                  style={{
                    color: 'black',
                    fontSize: '40px',
                    marginBottom: '10px',
                    
                  }}
                  onClick={!isVideoMode ? handleCapturePhoto : undefined}
                />
                <span style={{ color: 'white' }}>Photo</span>
              </IconTextContainer>
              <IconTextContainer
                style={{
                  opacity: iconOpacity(true),
                  transform: x.to(
                    (x) => `translateX(${x + (isVideoMode ? -150 : -50)}%)`
                  ),
                }}
                onClick={() => setIsVideoMode(true)}
              >
                <RadioButtonUncheckedIcon
                  style={{
                    color: 'black',
                    fontSize: '40px',
                    marginBottom: '10px',
                  }}
                  onClick={isVideoMode ? handleStartRecording : undefined}
                />
                <span style={{ color: 'white' }}>Video</span>
              </IconTextContainer>
            </StyledRow>
          </StyledCapture>
        )}
        {recording && (
          <StyledRow onClick={handleStopRecording}>
            <RadioButtonCheckedIcon
              style={{
                color: 'red',
                fontSize: '60px',
              }}
            />
          </StyledRow>
        )}
        <SwitchCameraButton onClick={handleSwitchCamera}>
          <CameraswitchOutlinedIcon
            style={{ color: 'black', fontSize: '40px' }}
          />
        </SwitchCameraButton>
        <CloseButton onClick={handleCloseCamera}>
          <CloseIcon style={{ color: 'black', fontSize: '40px' }} />
        </CloseButton>
        {recording && <TimerDisplay>{recordingDuration}</TimerDisplay>}
      </VideoContainer>
    </CameraOverlay>
  );
}
