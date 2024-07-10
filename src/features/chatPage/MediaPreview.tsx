import styled from 'styled-components';

const MediaPreviewContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: white;
`;

const MediaPreviewImage = styled.img`
  max-width: 420px;
  max-height: 100%;
  margin-bottom: 20px;
  border-radius: 10px;
`;

const MediaPreviewVideo = styled.video`
  max-width: 90%;
  max-height: 70%;
  margin-bottom: 20px;
  border-radius: 10px;
`;

const SendButton = styled.button`
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 10px 20px;
  cursor: pointer;
  margin: 5px;
`;

const MediaPreview = ({
  media,
  type,
  onSend,
  onClose,
}: {
  media: string;
  type: string | null;
  onSend: () => void;
  onClose?: () => void;
}) => {
  return (
    <MediaPreviewContainer>
      {type === 'image' && <MediaPreviewImage src={media} alt="Preview" />}
      {type === 'video' && (
        <MediaPreviewVideo controls>
          <source src={media} type="video/webm" />
          Your browser does not support the video tag.
        </MediaPreviewVideo>
      )}
      {type === 'file' && <p>File selected: {media}</p>}
      <SendButton onClick={onSend}>Send</SendButton>
      {onClose && <SendButton onClick={onClose}>Close</SendButton>}
    </MediaPreviewContainer>
  );
};

export default MediaPreview;
