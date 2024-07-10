// import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion'; // Import motion from framer-motion
import { Message } from './ChatPageLayout';

const MessageContainer = styled(motion.div)`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 15px;
`;

const MessageText = styled.div`
  padding: 1% 2% 1% 3%;
  border-radius: 10px;
  max-width: 85%;
  font-size: 16px;
  background-color: red;
  color: black;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  overflow: hidden;
`;

const ImageMessage = styled.img`
  max-width: 100%;
  border-radius: 10px;
  margin-top: 3px;
  margin-right: 2px;
`;

const VideoMessage = styled.video`
  max-width: 100%;
  border-radius: 10px;
  margin-top: 3px;
  margin-right: 2px;
`;

const AudioMessage = styled.audio`
  max-width: 100%;
  padding: 3px;
`;

const Timestamp = styled.div`
  font-size: 12px;
  color: #888;
`;

export interface MessageProps {
  message: Message;
}

const Messages = ({ message }: MessageProps) => {
  const variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, transition: { duration: 0.3 } },
  };

  return (
    <MessageContainer
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={variants}
    >
      <MessageText>
        {message.text && <span>{message.text}</span>}
        {message.audioUrl && <AudioMessage controls src={message.audioUrl} />}
        {message.image && <ImageMessage src={message.image} alt="Image" />}
        {message.filetype === 'video' && (
          <VideoMessage controls src={message.file?.toString()} />
        )}
        {message.filetype === 'file' && (
          <div>
            <a
              href={message.file?.toString()}
              target="_blank"
              rel="noopener noreferrer"
            >
              {message.fileName}
            </a>
          </div>
        )}
        <Timestamp>{message.time}</Timestamp>
      </MessageText>
    </MessageContainer>
  );
};

export default Messages;
