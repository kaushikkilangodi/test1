import styled from 'styled-components';
import { FaPaperPlane } from 'react-icons/fa';
import CameraAltOutlinedIcon from '@mui/icons-material/CameraAltOutlined';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import KeyboardVoiceOutlinedIcon from '@mui/icons-material/KeyboardVoiceOutlined';
import PanoramaFishEyeOutlinedIcon from '@mui/icons-material/PanoramaFishEyeOutlined';
import Row from '../../components/Row';

const ChatContainer = styled.div`
  width: 100%;
  max-width: 440px;
  padding-left: 10px;
  position: fixed;
  bottom: 0;
  margin-bottom: 10px;
  left: 50%;
  transform: translate(-50%);
  background-color: white;
`;

const InputWrapper = styled.div`
  border-radius: 50px;
  border: 1px solid;
  width: 100%;
  max-width: 85%;
  height: 50px;
  display: flex;
  align-items: center;
  margin-right: 80px;
  /* padding-right: 20px; */
`;

const InputField = styled.input`
  width: 100%;
  max-width: 73%;
  height: 70%;
  padding: 8px;
  margin-left: 17px;
  border: none;
  outline: none;
`;

const IconButton = styled.button`
  background: none;
  border: none;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  color: black;
  font-size: 20px;

  &:focus {
    outline: none;
  }
`;

const SendButton = styled(IconButton)`
  right: 25px;
`;

const MicrophoneButton = styled(IconButton)`
  color: white;
  background-color: #007bff;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  right: 14px;
`;

interface ChatInputProps {
  newMessage: string;
  setNewMessage: (value: string) => void;
  handleKeyPress: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  handleCameraClick: () => void;
  handleAttachmentClick: () => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleMicrophoneClick: () => void;
  showMicrophone: boolean;
  handleSendMessage: () => void;
}

export default function ChatInput({
  newMessage,
  setNewMessage,
  handleKeyPress,
  handleCameraClick,
  handleAttachmentClick,
  fileInputRef,
  handleFileChange,
  handleMicrophoneClick,
  showMicrophone,
  handleSendMessage,
}: ChatInputProps) {
  return (
    <>
      <ChatContainer>
        <Row $contentposition="left">
          <InputWrapper>
            <InputField
              type="text"
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyUp={handleKeyPress}
            />
            <Row style={{ gap: '20px' }}>
              <Row onClick={handleAttachmentClick}>
                <AttachFileIcon fontSize="medium" />
                <input
                  type="file"
                  ref={fileInputRef}
                  style={{ display: 'none' }}
                  onChange={handleFileChange}
                />
              </Row>
              <Row onClick={handleCameraClick} style={{marginRight:20}}>
                <CameraAltOutlinedIcon fontSize="medium" />
              </Row>
            </Row>
          </InputWrapper>

          <MicrophoneButton
            onClick={handleMicrophoneClick}
            style={{ display: newMessage ? 'none' : 'block' }}
          >
            {showMicrophone ? (
              <KeyboardVoiceOutlinedIcon />
            ) : (
              <PanoramaFishEyeOutlinedIcon />
            )}
          </MicrophoneButton>
          <SendButton
            onClick={handleSendMessage}
            style={{ display: newMessage ? 'block' : 'none' }}
          >
            <FaPaperPlane />
          </SendButton>
        </Row>
      </ChatContainer>
    </>
  );
}
