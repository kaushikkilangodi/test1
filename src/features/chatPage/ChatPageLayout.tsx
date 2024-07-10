import React, { useState, useRef, useEffect, ChangeEvent } from 'react';
import styled from 'styled-components';
import MediaPreview from './MediaPreview';
import Camera from './Camera';
import Messages from './Messages';
import ChatInput from './ChatInput';
import {
  displayChats,
  uploadChats,
  uploadFile,
} from '../../services/realmServices';
import { ITEMS_PER_PAGE } from '../../utils/helper';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams } from '@tanstack/react-router';
import { useUser } from '../../context/userContext';
import { useInfiniteQuery } from 'react-query';
import { useVirtualizer } from '@tanstack/react-virtual';
import Loader from '../../components/Loader';

export interface Message {
  text?: string;
  audioUrl?: string;
  time: string;
  image?: string;
  file?: string;
  videoUrl?: string;
  filetype?: string;
  fileName?: string;
}

const ChatContainer = styled(motion.div)`
  width: 100%;
  background-color: white;
  position: relative;
`;

const ChatMessages = styled.div`
  display: flex;
  flex-direction: column;
  padding: 5px;
  overflow-y: auto;
  max-height: 79vh;
`;

function ChatPageLayout() {
  const { id } = useParams({ strict: false });
  const { user } = useUser();
  const [newMessage, setNewMessage] = useState<string>('');
  const [showMicrophone, setShowMicrophone] = useState<boolean>(true);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [capturedMedia, setCapturedMedia] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<
    'image' | 'video' | 'audio' | null
  >(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const [recording, setRecording] = useState<boolean>(false);
  const [recordingStartTime, setRecordingStartTime] = useState<number | null>(
    null
  );
  const [recordingDuration, setRecordingDuration] = useState<string>('00:00');
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  // const chatMessagesRef = useRef<HTMLDivElement>(null);
  const parentRef = useRef<HTMLDivElement>(null);

  // console.log('messages', messages);
  const fetchMessages = async ({ pageParam = 1 }) => {
    if (id === undefined || user == null) return [];
    const fetchedMessages =
      (await displayChats(ITEMS_PER_PAGE, pageParam, id, user?._id)) ?? [];
    return fetchedMessages.map((msg) => ({
      text: msg.message,
      audioUrl: msg.audio,
      time: msg.createdAt
        ? new Date(msg.createdAt).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })
        : '',
      image: msg.image,
      file: msg.file ? msg.file : undefined,
      filetype: msg.filetype,
      fileName: msg.filename,
    }));
  };

  const {status, data, fetchNextPage, hasNextPage, isFetchingNextPage, refetch } =
    useInfiniteQuery(['messages', id], fetchMessages, {
      getNextPageParam: (lastPage, pages) => {
        if (lastPage.length < ITEMS_PER_PAGE) {
          return undefined;
        }
        return pages.length + 1;
      },
    });

  const messages = data?.pages.flat().reverse() || [];
  console.log('messages', messages);

  const estimateSize = (index: number) => {
    const message = messages[index];
    if (message.filetype === 'txt') {
      return 80;
    } else if (message.filetype === 'png' || message.filetype === 'jpg') {
      return 230;
    } else if (message.filetype === 'jpeg') {
      return 300;
    } else if (message.filetype === 'video') {
      return 300;
    } else if (message.filetype === 'mp3') {
      return 100;
    } else {
      return 80;
    }
  };
const rowVirtualizer = useVirtualizer({
    count: messages.length,
    getScrollElement: () => parentRef.current,
    estimateSize,
    overscan: 10,
  });

  useEffect(() => {
    const parent = parentRef.current;
    if (!parent) return;

    const onScroll = () => {
      if (parent.scrollTop === 0 && hasNextPage && !isFetchingNextPage) {
        const previousScrollHeight = parent.scrollHeight;
        fetchNextPage().then(() => {
          const newScrollHeight = parent.scrollHeight;
          const scrollDifference = newScrollHeight - previousScrollHeight;
          parent.scrollTop = scrollDifference;
        });
      }
    };

    parent.addEventListener('scroll', onScroll);
    return () => parent.removeEventListener('scroll', onScroll);
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  useEffect(() => {
    if (rowVirtualizer) {
      rowVirtualizer.scrollToIndex(messages.length - 1);
    }
  }, [messages.length, rowVirtualizer]);

  useEffect(() => {
    rowVirtualizer.scrollToIndex(messages.length - 1);
  }, [messages.length, rowVirtualizer]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (recording && recordingStartTime) {
      timer = setInterval(() => {
        const now = Date.now();
        const elapsed = Math.floor((now - recordingStartTime) / 1000);
        const minutes = String(Math.floor(elapsed / 60)).padStart(2, '0');
        const seconds = String(elapsed % 60).padStart(2, '0');
        setRecordingDuration(`${minutes}:${seconds}`);
      }, 1000);
    } else {
      setRecordingDuration('00:00');
    }
    return () => clearInterval(timer);
  }, [recording, recordingStartTime]);

  useEffect(() => {
    if (isCameraOpen) {
      (async () => {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode },
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          mediaStreamRef.current = stream;
        }
      })();
    } else {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      }
    }
  }, [isCameraOpen, facingMode]);

  if (id === undefined) return;
  if (user == null) return;

  const handleSendMessage = async () => {
    if (newMessage.trim() !== '') {
      await uploadChats(newMessage, 'text', '', id, user?._id);
      setNewMessage('');
      refetch();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const handleMicrophoneClick = async () => {
    if (showMicrophone) {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      const recorder = new MediaRecorder(stream);
      const audioChunks: BlobPart[] = [];
      recorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };
      recorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/mpeg-3' });
        const date = new Date().toISOString().replace(/[:.-]/g, '');
        const audioFile = new File([audioBlob], `${date}.mp3`, {
          type: 'audio/mpeg-3',
        });
        await uploadFile(audioFile, 'audio', id, user?._id);
        refetch();
      };
      recorder.start();
      setMediaRecorder(recorder);
    } else {
      if (mediaRecorder) {
        mediaRecorder.stop();
        mediaRecorder.stream.getTracks().forEach((track) => track.stop());
      }
    }
    setShowMicrophone(!showMicrophone);
  };

  const handleCameraClick = () => {
    setIsCameraOpen(true);
  };

  const handleSwitchCamera = async () => {
    if (isCameraOpen) {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: facingMode === 'user' ? 'environment' : 'user' },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        mediaStreamRef.current = stream;
        setFacingMode((prevMode) =>
          prevMode === 'user' ? 'environment' : 'user'
        );
      }
    }
  };

  const handleCapturePhoto = async () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg');
        setCapturedMedia(dataUrl);
        setMediaType('image');
        setIsCameraOpen(false);
      }
    }
  };

  const handleStartRecording = async () => {
    if (videoRef.current) {
      const stream = videoRef.current.srcObject as MediaStream;
      const options = { mimeType: 'video/webm; codecs=vp9' };
      const recorder = new MediaRecorder(stream, options);
      const videoChunks: BlobPart[] = [];
      recorder.ondataavailable = (event) => {
        videoChunks.push(event.data);
      };
      recorder.onstop = () => {
        const videoBlob = new Blob(videoChunks, { type: 'video/webm' });
        const videoUrl = URL.createObjectURL(videoBlob);
        setCapturedMedia(videoUrl);
        setMediaType('video');
        setIsCameraOpen(false);
      };
      recorder.start();
      setMediaRecorder(recorder);
      setRecording(true);
      setRecordingStartTime(Date.now());
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setRecording(false);
      setRecordingStartTime(null);
    }
  };

  const handleCloseCamera = () => {
    setIsCameraOpen(false);
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
    }
  };

  const handleAttachmentClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      let type = 'file';

      if (file.type.startsWith('image/')) {
        type = 'image';
      } else if (file.type.startsWith('audio/')) {
        type = 'audio';
      }

      await uploadFile(file, type, id, user?._id);
      refetch();
      // await fetchMessages();
    }
  };

  const handleSendCapturedMedia = async () => {
    if (capturedMedia && mediaType) {
      const base64ToFile = (base64Data: string) => {
        const arr = base64Data.split(',');
        const mime = arr[0]?.match(/:(.*?);/)?.[1];
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) {
          u8arr[n] = bstr.charCodeAt(n);
        }
        if (!mime) {
          throw new Error('Invalid base64 data');
        }
        const fileType = mime.split('/')[1];
        const date = new Date().toISOString().replace(/[:.-]/g, '');

        const filename = `${date}.${fileType}`;

        return new File([u8arr], filename, { type: mime });
      };

      const blobToFile = (blob: Blob, mimeType: string) => {
        const date = new Date().toISOString().replace(/[:.-]/g, '');
        const fileType = mimeType.split('/')[1];
        const filename = `${date}.${fileType}`;

        return new File([blob], filename, { type: mimeType });
      };

      const blobUrlToBase64 = (blobUrl: string): Promise<string> => {
        return fetch(blobUrl)
          .then((response) => response.blob())
          .then((blob) => {
            return new Promise((resolve, reject) => {
              const reader = new FileReader();
              reader.onloadend = () => resolve(reader.result as string);
              reader.onerror = reject;
              reader.readAsDataURL(blob);
            });
          });
      };

      const processMedia = async (media: string | Blob, mediaType: string) => {
        let file;

        if (typeof media === 'string') {
          if (media.startsWith('data:')) {
            // Base64 image string
            file = base64ToFile(media);
          } else {
            // Blob URL (video or audio)
            const base64Data = await blobUrlToBase64(media);
            file = base64ToFile(base64Data);
          }
        } else if (media instanceof Blob) {
          file = blobToFile(media, mediaType);
        } else {
          throw new Error('Unsupported media format');
        }

        await uploadFile(file, mediaType, id, user?._id);
        refetch();
        // await fetchMessages();
        setCapturedMedia(null);
        setMediaType(null);
      };

      await processMedia(
        capturedMedia,
        mediaType === 'video' ? 'file' : mediaType
      );
    }
  };

  const handleCloseCapturedMedia = () => {
    setCapturedMedia(null);
    setMediaType(null);
  };

  if (capturedMedia && mediaType) {
    return (
      <MediaPreview
        media={capturedMedia}
        type={mediaType}
        onSend={handleSendCapturedMedia}
        onClose={handleCloseCapturedMedia}
      />
    );
  }
 if (status === 'loading') {
   return <Loader />;
 }
  const variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } },
    exit: { opacity: 0, transition: { duration: 0.5 } },
  };
  return (
    <ChatContainer
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={variants}
    >
      <ChatMessages ref={parentRef}>
        <div
          style={{
            height: `${rowVirtualizer.getTotalSize()}px`,
            width: '100%',
            position: 'relative',
          }}
        >
          {rowVirtualizer.getVirtualItems().map((virtualRow) => {
            const message = messages[virtualRow.index];
            return (
              <div
                key={virtualRow.index}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  transform: `translateY(${virtualRow.start}px)`,
                }}
              >
                <AnimatePresence initial={false}>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <Messages message={message} />
                  </motion.div>
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </ChatMessages>
      <ChatInput
        newMessage={newMessage}
        setNewMessage={setNewMessage}
        handleKeyPress={handleKeyPress}
        handleCameraClick={handleCameraClick}
        handleAttachmentClick={handleAttachmentClick}
        fileInputRef={fileInputRef}
        handleFileChange={handleFileChange}
        handleMicrophoneClick={handleMicrophoneClick}
        showMicrophone={showMicrophone}
        handleSendMessage={handleSendMessage}
      />
      {isCameraOpen && (
        <Camera
          videoRef={videoRef}
          recording={recording}
          recordingDuration={recordingDuration}
          handleCapturePhoto={handleCapturePhoto}
          handleStartRecording={handleStartRecording}
          handleStopRecording={handleStopRecording}
          handleSwitchCamera={handleSwitchCamera}
          handleCloseCamera={handleCloseCamera}
        />
      )}
    </ChatContainer>
  );
}

export default ChatPageLayout;
